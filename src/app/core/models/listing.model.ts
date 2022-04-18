import { Feature } from '@agm/core/services/google-maps-types';

import {
  CoordinatesTuple,
  InitialPropertyDto,
  PropertyGeometry,
  PropertyStatus,
  PropertyType,
} from '../../core/models/properties-repository.model';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';
import { isEmptyString } from '../../shared/utils/empty-string.util';

export class ListingModel {
  public isScraped: boolean;

  constructor(
    private uuid: string,
    public images: Array<string>,
    public title: string,
    public description: string,
    public url: string,
    public providerId: string,
    public matchedProperty: string,
    public country: string,
    public state: string,
    public county: string,
    public city: string,
    public zipCode: string,
    public streetName: string,
    public streetNumber: string,
    public constructionYear: Date,
    public renovationYear: Date,
    public numberOfRooms: number,
    public numberOfUnits: number,
    public livingArea: number,
    public estimatedPrice: number,
    public estimatedPriceM2: number,
    public salePrice: number,
    public showAddress: boolean,
    public coordinates: CoordinatesTuple,
    public sellingStatus: PropertyStatus,
    public propertyType: PropertyType,
  ) {
    this.isScraped = !isEmptyString(this.url);
  }

  public get id(): string {
    return this.uuid;
  }

  public get latitude(): number {
    return this.coordinates[1];
  }

  public get longitude(): number {
    return this.coordinates[0];
  }

  public get isStatusForSale(): boolean {
    return this.sellingStatus === PropertyStatus.ForSale;
  }

  public get isStatusMakeMeMove(): boolean {
    return this.sellingStatus === PropertyStatus.MakeMeMove;
  }

  public get isStatusIdle(): boolean {
    return this.sellingStatus === PropertyStatus.Idle;
  }

  public get isPropertyOfTypeMFH(): boolean {
    return this.propertyType === PropertyType.MFH;
  }

  public get isStatusActive(): boolean {
    return this.sellingStatus === PropertyStatus.Active;
  }

  public get isStatusNotActiveYet(): boolean {
    return this.sellingStatus === PropertyStatus.NotActiveYet;
  }

  public get getAddressAsString(): string {
    const addressArr = [];

    if (this.streetName) addressArr.push(this.streetName);
    if (this.streetNumber) addressArr.push(this.streetNumber);
    if (this.zipCode) addressArr.push(this.zipCode);
    if (this.city) addressArr.push(this.city);

    if (addressArr.length) return addressArr.join('   ');
    else return '';
  }

  public get hasUrl(): boolean {
    return !isNullOrUndefined(this.url) && !isEmptyString(this.url);
  }
}

export interface ListingModelDto extends Feature {
  type: string;
  geometry: PropertyGeometry;
  properties: InitialPropertyDto;
}
