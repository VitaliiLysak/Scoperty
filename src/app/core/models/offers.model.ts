interface Property {
  uuid:         string;
  city:         string;
  zipCode:      string;
  streetName:   string;
  streetNumber: string;
  sellingStatus?: 'inactive'|'active'|'make_me_move'|'for_sale';
}

export class Offer {
  OfferFormatedDate?: string;

  uuid:      string;
  user:      string;
  property:  Property;
  price:     number;
  status:    'new'|'declined'|'accepted';
  createdAt: string;
  preferredTotalArea: number;

  public get isPropertyStatusInactive(): boolean {
    return this.property.sellingStatus === 'inactive';
  }
}
