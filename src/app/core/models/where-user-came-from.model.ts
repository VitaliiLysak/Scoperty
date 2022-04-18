export interface WhereUserCameFromMetadata {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}

export enum WhereUserCameFromKind {
  UserRegistered = 'user_registered',
}

export interface WhereUserCameFrom {
  sub: string;
  kind: WhereUserCameFromKind;
  metadata: WhereUserCameFromMetadata;
}
