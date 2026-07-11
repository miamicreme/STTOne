import { randomUUID } from "node:crypto";
import type { AuditEvent, TelemetryMeasurement, TenantContext } from "../../spine/contracts/domain";
import type { DriveItemSnapshot, DriveReadOnlyConnector } from "../google-drive-connector/contracts";
import type {
  CanonicalFileRecord,
  FileInventoryRepository,
  InventoryRunSummary,
} from "./contracts";

export interface AuditSink {
  write(event: AuditEvent): Promise<void>;
}

export interface TelemetrySink {
  record(measurement: TelemetryMeasurement): Promise<void>;
}

export interface Clock {
  now(): Date;
}

const systemClock: Clock = { now: () => new Date() };

export class FileInventoryService {
  constructor(
    private readonly connector: DriveReadOnlyConnector,
    private readonly repository: FileInventoryRepository,
    private readonly audit: AuditSink,
    private readonly telemetry: TelemetrySink,
    private readonly clock: Clock = systemClock,
  ) {}

  async run(context: TenantContext): Promise<InventoryRunSummary> {
    const startedAt = this.clock.now();
    let pageToken: string | undefined;
    let discovered = 0;
    let indexed = 0;
    let skipped = 0;
    let failed = 0;

    await this.connector.verifyReadOnlyAccess(context);

    do {
      const page = await this.connector.listItems({ context, pageToken });
      discovered += page.items.length;

      for (const item of page.items) {
        try {
          if (item.trashed) {
            skipped += 1;
            continue;
          }

          await this.repository.upsert(this.toCanonicalRecord(context, item));
          indexed += 1;
        } catch (error) {
          failed += 1;
          await this.audit.write({
            id: randomUUID(),
            organizationId: context.organizationId,
            actorId: context.actorId,
            action: "file.inventory.index",
            resourceType: "drive_item",
            resourceId: item.sourceId,
            outcome: "failure",
            correlationId: context.correlationId,
            occurredAt: this.clock.now().toISOString(),
            metadata: {
              error: error instanceof Error ? error.message : "Unknown inventory error",
            },
          });
        }
      }

      pageToken = page.nextPageToken;
    } while (pageToken);

    const completedAt = this.clock.now();
    const durationMs = completedAt.getTime() - startedAt.getTime();

    await Promise.all([
      this.telemetry.record({
        name: "file_inventory.duration",
        value: durationMs,
        unit: "milliseconds",
        organizationId: context.organizationId,
        correlationId: context.correlationId,
        module: "file-inventory",
        recordedAt: completedAt.toISOString(),
      }),
      this.telemetry.record({
        name: "file_inventory.discovered",
        value: discovered,
        unit: "count",
        organizationId: context.organizationId,
        correlationId: context.correlationId,
        module: "file-inventory",
        recordedAt: completedAt.toISOString(),
      }),
      this.audit.write({
        id: randomUUID(),
        organizationId: context.organizationId,
        actorId: context.actorId,
        action: "file.inventory.run",
        resourceType: "source_connection",
        resourceId: this.connector.connectionId,
        outcome: failed > 0 ? "failure" : "success",
        correlationId: context.correlationId,
        occurredAt: completedAt.toISOString(),
        metadata: { discovered, indexed, skipped, failed, durationMs },
      }),
    ]);

    return {
      discovered,
      indexed,
      skipped,
      failed,
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
    };
  }

  private toCanonicalRecord(
    context: TenantContext,
    item: DriveItemSnapshot,
  ): CanonicalFileRecord {
    const observedAt = this.clock.now().toISOString();
    const external = item.permissions.some(
      (permission) => permission.type === "domain" || permission.type === "anyone",
    );
    const publicAccess = item.permissions.some(
      (permission) => permission.type === "anyone",
    );

    return {
      id: randomUUID(),
      organizationId: context.organizationId,
      sourceConnectionId: this.connector.connectionId,
      sourceSystem: "google_drive",
      sourceId: item.sourceId,
      parentSourceIds: item.parentSourceIds,
      name: item.name,
      mimeType: item.mimeType,
      itemKind: item.kind,
      webUrl: item.webViewLink,
      ownerEmailAddresses: item.ownerEmailAddresses,
      permissionPrincipalCount: item.permissions.length,
      isExternallyShared: external,
      isPubliclyAccessible: publicAccess,
      createdAt: item.createdAt,
      modifiedAt: item.modifiedAt,
      sizeBytes: item.sizeBytes,
      contentHash: item.md5Checksum,
      sourceVersion: item.version,
      trashed: item.trashed,
      firstDiscoveredAt: observedAt,
      lastObservedAt: observedAt,
    };
  }
}
