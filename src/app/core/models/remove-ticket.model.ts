export interface RemoveTicket {
  reporterSub: string;
  isOwner: boolean;
  property: string;
  remove: boolean;
  floor?: string;
}

export interface RemoveTicketResponse {
  id: string;
  reporterSub: string;
  isOwner: boolean;
  property: string;
  remove: boolean;
}
