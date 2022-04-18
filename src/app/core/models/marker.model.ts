import { MapsEventListener } from '@agm/core/services/google-maps-types';
import {} from 'googlemaps';

import { toNumber } from '../../shared/utils/to-number.util';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';
import {
  PropertyType,
  PropertyStatus,
  MarkersDto,
  MarkersPropertiesDto,
  InitialPropertyObject,
  ListingDetails,
} from '../../core/models/properties-repository.model';
import { ListingModel } from '../../core/models/listing.model';
import { ExtendedMarkerModel } from '../../core/models/extended-marker.model';
import {
  statusToBackEnd,
  statusToFrontEnd,
  propTypeToBackEnd,
  propTypeToFrontEnd,
} from '../../shared/utils/deserializator.util';
import { isEmptyString } from '../../shared/utils/empty-string.util';
import {
  createHTMLMapMarker,
  MarkerHtmlOverlay,
} from '../../shared/utils/marker-html-overlay';

import { Point } from './location.model';

export interface IHistogram {
  average: number;
  minimum: number;
  maximum: number;
  histogram: Array<{
    count: number,
    intervalLowerLimit: number,
    intervalUpperLimit: number,
  }>;
}

export interface IMarker {
  id: string;
  position: Point;
  isRendered: boolean;
  render: (mapModule: any, map: any) => void;
  hide: () => void;
  show: () => void;
  subscribe: (eventName: string, callback: (data?: any) => void) => void;
}

export class MarkerModel implements IMarker {
  public _mapMarker: MarkerHtmlOverlay | google.maps.Marker = null;
  public _listeners: Map<string, MapsEventListener> = new Map<string, MapsEventListener>();

  public hasPolygonArea: boolean;

  public building: MarkerModel = null;
  public ApartmentsPropertyIds: Array<string>;
  public LivingUnits: number = 0;
  public Price: number = 0;
  public PriceM2: number = 0;
  public PriceMin: number = 0;
  public PriceMax: number = 0;
  public SalePrice: number = 0;
  public SalePriceM2: number = 0;
  public Latitude: number = 0;
  public Longitude: number = 0;
  matchedProperty: string = null;
  isScraped: boolean;
  public PropertyId: string = '';
  public PropertyType: PropertyType = null;
  public PropertySubType: string = '';
  public SellingStatus: PropertyStatus;
  public Street: string = '';
  public HouseNumber: string = '';
  public PostalCode: string = '';
  public Locality: string = '';
  public isActive: boolean = false;
  public isHovered: boolean = false;
  public _isHidden: boolean = true;

  public get id(): string {
    if (!isEmptyString(this.PropertyId)) {
      return this.PropertyId;
    }

    return '';
  }

  public get type(): PropertyType {
    if (!isNullOrUndefined(this.PropertyType)) {
      return this.PropertyType;
    }

    return null;
  }

  public get position(): Point {
    return {
      lat: this.Latitude,
      lng: this.Longitude
    };
  }

  public get positionAsLatLng(): google.maps.LatLng {
    return {
      lat: () => this.Latitude,
      lng: () => this.Longitude
    } as google.maps.LatLng;
  }

  public get price(): number {
    return this.Price || 0;
  }

  public get priceMin(): number {
    return this.PriceMin || 0;
  }

  public get priceMax(): number {
    return this.PriceMax || 0;
  }

  public get sellingStatus(): string {
    if (['Idle', 'MakeMeMove', 'ForSale', 'Active', 'NotActiveYet'].includes(this.SellingStatus)) {
      return this.SellingStatus;
    } else {
      return 'active';
    }
  }

  public get isRendered(): boolean {
    return this._mapMarker != null;
  }

  public get isPropertyOfTypeEFH(): boolean {
    return this.PropertyType === 'EFH';
  }

  public get isPropertyOfTypeMFH(): boolean {
    return this.PropertyType === 'MFH';
  }

  public get isPropertyOfTypeETW(): boolean {
    return this.PropertyType === 'ETW';
  }

  public get buildingType(): string {
    return this.isPropertyOfTypeEFH ? 'Haus' : 'Wohnung';
  }

  private get statusStyle(): string {
    if (this.isStatusForSale) {
      return 'marker--status-for-sale';
    }
    if (this.isStatusMakeMeMove) {
      return 'marker--status-ofo';
    }
    return 'marker--status-active';
  }

  private get activeStyle(): string {
    if (this.isStatusForSale) {
      return 'marker--hover-for-sale';
    }
    if (this.isStatusMakeMeMove) {
      return 'marker--hover-ofo';
    }
    return 'marker--hover-active';
  }

  private buildMarkerText(): string {
    if (this.isStatusIdle) {
      return 'Inactive';
    }

    let price: string = this.isPropertyOfTypeMFH ? 'ab ' : '';
    if (this.isStatusForSale && this.SalePrice) {
      price += `${this.SalePrice.toLocaleString('de-DE')} €`;
    } else {
      price += `${this.Price.toLocaleString('de-DE')} €`;
    }
    return price;
  }

  private buildMarkerElement(): HTMLElement {
    const marker: HTMLElement = document.createElement('div');
    marker.classList.add('marker');
    marker.innerText = this.buildMarkerText();
    return marker;
  }

  public updateStyles(): void {
    if (isNullOrUndefined(this._mapMarker) || !('addClass' in this._mapMarker)) {
      return;
    }
    if (this.isActive || this.isHovered) {
      (this._mapMarker as MarkerHtmlOverlay).addClass(this.activeStyle);
    } else {
      (this._mapMarker as MarkerHtmlOverlay).removeClass(this.activeStyle);
    }
  }

  constructor(
    data:
      MarkersDto |
      MarkersPropertiesDto |
      ListingModel |
      ListingDetails |
      InitialPropertyObject |
      ExtendedMarkerModel |
      MarkerModel = null,
  ) {
    if (!isNullOrUndefined(data)) {
      this.deserialize(data);
    }
    if (data instanceof ListingModel) {
      this.isScraped = data.isScraped;
    }
  }

  public serialize(): any {
    const data: any = {};

    data.apartments = this.ApartmentsPropertyIds || [];
    data.numberOfFlats = this.LivingUnits;
    data.estimatedPrice = this.Price;
    data.estimatedPriceM2 = this.PriceM2;
    data.salePrice = this.SalePrice;
    data.salePriceM2 = this.SalePriceM2;
    data.coordinates = [this.Longitude, this.Latitude];
    data.uuid = this.PropertyId ;
    data.propertyType = propTypeToBackEnd(this.PropertyType);
    data.propertySubType = this.PropertySubType;
    data.sellingStatus = statusToBackEnd(this.SellingStatus);
    data.streetName = this.Street;
    data.streetNumber = this.HouseNumber;
    data.city = this.Locality;
    data.zipCode = this.PostalCode;

    return data;
  }

  public deserialize(data: any): void {
    this.ApartmentsPropertyIds = data.apartments || [];
    this.LivingUnits = toNumber(data.numberOfFlats, 1);
    this.Price = toNumber(data.estimatedPrice, 0);
    this.PriceM2 = toNumber(data.estimatedPriceM2, 0);
    this.SalePrice = toNumber(data.salePrice, null);
    this.SalePriceM2 = toNumber(data.salePriceM2, null);
    this.PriceMin = toNumber(data.PriceMin, this.Price);
    this.PriceMax = toNumber(data.PriceMax, this.Price);
    this.Longitude = (data.coordinates && data.coordinates.coordinates) ? data.coordinates.coordinates[0] : 0;
    this.Latitude = (data.coordinates && data.coordinates.coordinates) ? data.coordinates.coordinates[1] : 0;
    this.isScraped = data.hasOwnProperty('url') && !isEmptyString(data.url);
    this.matchedProperty = isNullOrUndefined(data.matchedProperty) ? null : data.matchedProperty;
    this.PropertyId = data.uuid;
    this.PropertyType = propTypeToFrontEnd(data.propertyType);
    this.PropertySubType = data.propertySubType;
    this.SellingStatus = statusToFrontEnd(data);
    this.Street = data.streetName;
    this.HouseNumber = data.streetNumber;
    this.Locality = data.city;
    this.PostalCode = data.zipCode;
  }

  public activate(): void {
    this.isActive = true;
    this.updateStyles();
  }

  public deactivate(): void {
    this.isActive = false;
    this.isHovered = false;
    this.updateStyles();
  }

  public render(map: google.maps.Map, defaultIcon?: boolean): void {
    if (defaultIcon) this.renderMarkerDefault(map);
    else this.renderMarker(map);

    this._isHidden = false;
  }

  public renderIfNeed(map: google.maps.Map): void {
    if (this._mapMarker == null) this.renderMarker(map);
  }

  public renderMarker(map: google.maps.Map): void {
    this._mapMarker = createHTMLMapMarker({
      latlng: this.positionAsLatLng,
      map: map,
      markerElement: this.buildMarkerElement(),
      offset: { x: -57, y: -26 },
      classList: [this.statusStyle]
    });
    if (!this.hasPolygonArea) {
      this.subscribe('mouseover', this.mouseOverHandler.bind(this));
      this.subscribe('mouseout', this.mouseOutHandler.bind(this));
    }
    this._isHidden = false;
  }

  private mouseOverHandler(): void {
    this.isHovered = true;
    this.updateStyles();
  }

  private mouseOutHandler(): void {
    this.isHovered = false;
    this.updateStyles();
  }

  public renderMarkerDefault(map: google.maps.Map): void {
    this._mapMarker = new google.maps.Marker({
      map: map,
      position: this.position,
      optimized: false,
    });
    this._isHidden = false;
  }

  public hide(): void {
    if (this._mapMarker != null) {
      this._mapMarker.setMap(null);
      this._isHidden = true;
    }

    this.deactivate();
  }

  public show(): void {
    if (!this._isHidden) return;
    if (this._mapMarker != null) {
      this._isHidden = false;
    }
  }

  public subscribe(
    eventName: string,
    callback: (...args) => void,
    uniqKey: string = `${Date.now()}${Math.random()}`
  ): void {
    const listenerName = `${eventName}|${uniqKey}`;
    if (
      !isNullOrUndefined(this._mapMarker) &&
      !this._listeners.has(`_mapMarker|${listenerName}`)
    ) {
      this._listeners.set(
        `_mapMarker|${listenerName}`,
        this._mapMarker.addListener(eventName, (...args) => callback(...args, 'marker'))
      );
    }
  }

  public unsubscribe(map: any): void {
    if (this._mapMarker != null) map.event.clearInstanceListeners(this._mapMarker);
  }

  public clearMap(): void {
    if (this._mapMarker != null) this._mapMarker.setMap(null);
  }

  public get isStatusForSale(): boolean {
    return this.SellingStatus === 'ForSale';
  }

  public get isStatusMakeMeMove(): boolean {
    return this.SellingStatus === 'MakeMeMove';
  }

  public get isStatusIdle(): boolean {
    return this.SellingStatus === 'Idle';
  }

  public isEqual(marker: MarkerModel): boolean {
    return JSON.stringify(marker) === JSON.stringify(this);
  }
}
