export type UUID = string;
export type ISODateTime = string;

export type JobStatus =
  | "queued"
  | "running"
  | "completed"
  | "completed_with_warnings"
  | "failed"
  | "cancelled";

export interface TenantContext {
  organizationId: UUID;
  actorId: UUID;
  correlationId: UUID;
}

export interface ProcessingJob {
  id: UUID;
  organizationId: UUID;
  module: string;
  operation: string;
  status: JobStatus;
  sourceConnectionId?: UUID;
  correlationId: UUID;
  startedAt?: ISODateTime;
  completedAt?: ISODateTime;
  createdAt: ISODateTime;
  counters: {
    discovered: number;
    processed: number;
    skipped: number;
    failed: number;
  };
}

export interface DomainEvent<TPayload = unknown> {
  id: UUID;
  type: string;
  schemaVersion: number;
  organizationId: UUID;
  correlationId: UUID;
  causationId?: UUID;
  producer: string;
  occurredAt: ISODateTime;
  payload: TPayload;
}

export interface AuditEvent {
  id: UUID;
  organizationId: UUID;
  actorId: UUID;
  action: string;
  resourceType: string;
  resourceId: string;
  outcome: "success" | "denied" | "failure";
  correlationId: UUID;
  occurredAt: ISODateTime;
  metadata?: Record<string, unknown>;
}

export interface TelemetryMeasurement {
  name: string;
  value: number;
  unit: "count" | "milliseconds" | "bytes" | "tokens" | "currency_usd";
  organizationId: UUID;
  correlationId: UUID;
  module: string;
  recordedAt: ISODateTime;
  attributes?: Record<string, string | number | boolean>;
}
