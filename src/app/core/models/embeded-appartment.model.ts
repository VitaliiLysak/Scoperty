import { statusToFrontEnd } from '../../shared/utils/deserializator.util';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';
import { toNumber } from '../../shared/utils/to-number.util';
import { isEmptyString } from '../../shared/utils/empty-string.util';

import { IImage } from './image.model';

export class EmbededAppartment {
  Price:                number;
  EstimatedPrice:       number;
  EstimatedPricePerM2:  number;
  Floor:                number;
  FloorLocation:        string;
  images:               IImage[];
  IsRented:             boolean;
  SellingStatus:        string;
  id:                   string;
  SalePrice:            number;
  RoomsNumber:          number;
  LivingSurface:        number;
  Favourite:            boolean;
  Locality:             string;
  Street:               string;
  HouseNumber:          string;
  PostalCode:           string;
  BuildingPropertyId:   string;
  PropertyType:         string;
  isOwner:              boolean;
  isRealtor:            boolean;
  hasOwner:             boolean;
  hasRealtor:           boolean;
  Features:             string[];
  Title:                string;
  Listing:              boolean;
  Url:                  string;

  get hasFloor(): boolean {
    return !isNullOrUndefined(this.Floor);
  }

  get hasUrl(): boolean {
    return !isEmptyString(this.Url);
  }

  get source(): string {
    if (this.Url) {
      const source = this.Url.replace('http://', '')
        .replace('https://', '')
        .replace('www.', '')
        .split('.')[0];
      return `${source.charAt(0).toUpperCase()}${source.slice(1)}`;
    } else {
      return '';
    }
  }

  get type(): string {
    if (this.PropertyType && this.PropertyType !== `${void 0}`) return this.PropertyType;
    return '';
  }

  get sellingStatus(): string {
    if (['Idle', 'MakeMeMove', 'ForSale', 'Active', 'NotActiveYet'].includes(this.SellingStatus)) {
      return this.SellingStatus;
    } else {
      return 'active';
    }
  }

  get isStatusForSale(): boolean {
    return this.SellingStatus === 'ForSale';
  }

  get isStatusMakeMeMove(): boolean {
    return this.SellingStatus === 'MakeMeMove';
  }

  get isStatusIdle(): boolean {
    return this.SellingStatus === 'Idle';
  }

  get isStatusActive(): boolean {
    return this.SellingStatus === 'Active';
  }

  get isStatusNotActiveYet(): boolean {
    return this.SellingStatus === 'NotActiveYet';
  }

  get isStatusForHide(): boolean {
    return this.SellingStatus === 'NotActiveYet' || this.SellingStatus === 'Active';
  }

  get hasImage(): boolean {
    return this.images.length > 0;
  }

  get firstImage(): string {
    return this.hasImage ? this.images[0].src : null;
  }

  get features(): string[] {
    return this.Features.slice(0, 1);
  }

  get apartmentPrice(): number {
    return !isNullOrUndefined(this.SalePrice) && this.SalePrice > 0
      ? this.SalePrice
      : this.Price;
  }

  constructor(data: any) {
    this.deserializeApartments(data);
  }

  deserializeApartments(data: any) {
    this.Price                    = toNumber(data.estimatedPrice, 0);
    this.EstimatedPrice           = toNumber(data.estimatedPrice, 0);
    this.EstimatedPricePerM2      = toNumber(data.estimatedPriceM2, 0);
    this.Floor                    = data.floor;
    this.FloorLocation            = data.floorLocation;
    this.images                   = (data.images || []).map( img => ({id: img.uuid, src: img.image} as IImage));
    this.IsRented                 = data.isRented;
    this.SellingStatus            = statusToFrontEnd(data);
    this.id                       = data.uuid;
    this.SalePrice                = toNumber(data.salePrice, 0);
    this.RoomsNumber              = data.numberOfRooms;
    this.LivingSurface            = data.livingArea;
    this.Favourite                = data.isFavorite;
    this.Locality                 = data.city;                // required string (City) [ 1 .. 255 ] characters
    this.Street                   = data.streetName;          // string (Street name) <= 255 characters
    this.HouseNumber              = data.streetNumber;        // string (Street number) <= 50 characters
    this.PostalCode               = data.zipCode;
    this.PropertyType             = 'ETW';
    this.isOwner                  = data.isOwner;
    this.isRealtor                = data.isRealtor;
    this.hasOwner                 = data.hasOwner;
    this.hasRealtor               = data.hasRealtor;
    this.Features                 = data.features;
    this.Title                    = data.title;
    this.Listing                  = data.hasListing;
    this.Url                      = data.url;
  }
}
