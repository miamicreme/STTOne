import type { ISODateTime, UUID } from "../../spine/contracts/domain";

export interface CanonicalFileRecord {
  id: UUID;
  organizationId: UUID;
  sourceConnectionId: UUID;
  sourceSystem: "google_drive";
  sourceId: string;
  parentSourceIds: string[];
  name: string;
  mimeType: string;
  itemKind: "file" | "folder" | "shortcut";
  webUrl?: string;
  ownerEmailAddresses: string[];
  permissionPrincipalCount: number;
  isExternallyShared: boolean;
  isPubliclyAccessible: boolean;
  createdAt?: ISODateTime;
  modifiedAt?: ISODateTime;
  sizeBytes?: number;
  contentHash?: string;
  sourceVersion?: string;
  trashed: boolean;
  firstDiscoveredAt: ISODateTime;
  lastObservedAt: ISODateTime;
}

export interface FileInventoryRepository {
  upsert(record: CanonicalFileRecord): Promise<void>;
}

export interface InventoryRunSummary {
  discovered: number;
  indexed: number;
  skipped: number;
  failed: number;
  startedAt: ISODateTime;
  completedAt: ISODateTime;
}
