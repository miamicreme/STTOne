import assert from "node:assert/strict";
import test from "node:test";
import type { AuditEvent, TelemetryMeasurement, TenantContext } from "../spine/contracts/domain";
import type { DriveReadOnlyConnector } from "../modules/google-drive-connector/contracts";
import type { CanonicalFileRecord } from "../modules/file-inventory/contracts";
import { FileInventoryService } from "../modules/file-inventory/service";

const context: TenantContext = {
  organizationId: "org-stt",
  actorId: "user-kohron",
  correlationId: "scan-001",
};

test("indexes accessible Drive items and records audit and telemetry", async () => {
  const records: CanonicalFileRecord[] = [];
  const audits: AuditEvent[] = [];
  const measurements: TelemetryMeasurement[] = [];
  let verified = false;

  const connector: DriveReadOnlyConnector = {
    connectionId: "connection-1",
    async verifyReadOnlyAccess() {
      verified = true;
    },
    async listItems() {
      return {
        items: [
          {
            sourceId: "file-1",
            parentSourceIds: ["folder-1"],
            name: "Operations SOP",
            mimeType: "application/vnd.google-apps.document",
            kind: "file",
            ownerEmailAddresses: ["owner@stt.example"],
            permissions: [
              { id: "p1", type: "user", role: "owner", emailAddress: "owner@stt.example" },
            ],
            trashed: false,
          },
          {
            sourceId: "file-2",
            parentSourceIds: [],
            name: "Old Draft",
            mimeType: "application/pdf",
            kind: "file",
            ownerEmailAddresses: [],
            permissions: [],
            trashed: true,
          },
        ],
      };
    },
  };

  const service = new FileInventoryService(
    connector,
    { async upsert(record) { records.push(record); } },
    { async write(event) { audits.push(event); } },
    { async record(measurement) { measurements.push(measurement); } },
    { now: () => new Date("2026-07-10T12:00:00.000Z") },
  );

  const summary = await service.run(context);

  assert.equal(verified, true);
  assert.equal(summary.discovered, 2);
  assert.equal(summary.indexed, 1);
  assert.equal(summary.skipped, 1);
  assert.equal(summary.failed, 0);
  assert.equal(records.length, 1);
  assert.equal(records[0].sourceId, "file-1");
  assert.equal(records[0].organizationId, "org-stt");
  assert.equal(audits.at(-1)?.action, "file.inventory.run");
  assert.equal(audits.at(-1)?.outcome, "success");
  assert.deepEqual(
    measurements.map((measurement) => measurement.name).sort(),
    ["file_inventory.discovered", "file_inventory.duration"],
  );
});
