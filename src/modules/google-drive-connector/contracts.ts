import type { ISODateTime, TenantContext, UUID } from "../../spine/contracts/domain";

export const GOOGLE_DRIVE_READ_ONLY_SCOPES = [
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
] as const;

export type DriveItemKind = "file" | "folder" | "shortcut";

export interface DrivePermissionSnapshot {
  id: string;
  type: "user" | "group" | "domain" | "anyone";
  role: "owner" | "organizer" | "fileOrganizer" | "writer" | "commenter" | "reader";
  emailAddress?: string;
  domain?: string;
  allowFileDiscovery?: boolean;
  deleted?: boolean;
}

export interface DriveItemSnapshot {
  sourceId: string;
  driveId?: string;
  parentSourceIds: string[];
  name: string;
  mimeType: string;
  kind: DriveItemKind;
  webViewLink?: string;
  ownerEmailAddresses: string[];
  permissions: DrivePermissionSnapshot[];
  createdAt?: ISODateTime;
  modifiedAt?: ISODateTime;
  sizeBytes?: number;
  md5Checksum?: string;
  version?: string;
  trashed: boolean;
}

export interface DrivePage {
  items: DriveItemSnapshot[];
  nextPageToken?: string;
}

export interface DriveReadOnlyConnector {
  readonly connectionId: UUID;
  verifyReadOnlyAccess(context: TenantContext): Promise<void>;
  listItems(input: {
    context: TenantContext;
    pageToken?: string;
    changedAfter?: ISODateTime;
  }): Promise<DrivePage>;
}
