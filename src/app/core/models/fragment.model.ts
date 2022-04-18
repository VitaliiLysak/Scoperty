import { MapsEventListener } from '@agm/core/services/google-maps-types';

import {
  statusToBackEnd,
  statusToFrontEndOriginal,
  propTypeToBackEnd,
  propTypeToFrontEnd
} from '../../shared/utils/deserializator.util';
import { isEmptyString } from '../../shared/utils/empty-string.util';
import { PropertyStatus, GroupedMarkerWithoutAddressData } from '../../core/models/properties-repository.model';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';
import {
  MarkersDto,
  InitialPropertyDto,
  PropertyType,
} from './properties-repository.model';
import { MarkerHTMLOverlayOffset } from '../../shared/utils/marker-html-overlay';

import { Point } from './location.model';
import { AbstractGoogleOverlay } from './abstract-google-overlay';

const FRAGMENTS_URL: string = `../../assets/images/fragments`;

enum WithoutAddressIconUrls {
  ForSale = '../../assets/images/clusters/cluster_for_sale_standard.svg',
  ForSaleHover = '../../assets/images/clusters/cluster_for_sale_hover.svg',
  MakeMeMove = '../../assets/images/clusters/cluster_ofo_standard.svg',
  MakeMeMoveHover = '../../assets/images/clusters/cluster_ofo_hover.svg'
}

export class FragmentModel extends AbstractGoogleOverlay {
  icon: google.maps.Icon = null;
  mapMarker: google.maps.Marker = null;
  listeners: Map<string, MapsEventListener> = new Map<string, MapsEventListener>();
  Latitude: number = 0;
  Longitude: number = 0;
  PropertyId: string = '';
  PropertyType: PropertyType;
  matchedProperty: string = null;
  SellingStatus: PropertyStatus;
  isActive: boolean = false;
  isHovered: boolean = false;
  isHidden: boolean = true;
  isScraped: boolean;
  isScrapedWithoutAddress: boolean;
  scrapedWithoutAddressGroupedQuantity: number;
  markerWithoutAddress: GroupedMarkerWithoutAddressData;

  private pinSize = new google.maps.Size(32, 42);
  private pinAnchor = new google.maps.Point(16, 42);
  private iconHTMLElement: HTMLImageElement;
  private readonly offset: MarkerHTMLOverlayOffset = { x: -20, y: -20 };

  get id(): string {
    if (this.PropertyId && this.PropertyId !== `${void 0}`) return this.PropertyId;
    return '';
  }

  get type(): string {
    if (this.PropertyType && this.PropertyType !== `${void 0}`) return this.PropertyType;
    return '';
  }

  get position(): Point {
    return {
      lat: this.Latitude,
      lng: this.Longitude
    };
  }

  get positionAsLatLng(): google.maps.LatLng {
    return {
      lat: () => this.Latitude,
      lng: () => this.Longitude
    } as google.maps.LatLng;
  }

  get sellingStatus(): string {
    if (['Idle', 'MakeMeMove', 'ForSale', 'Active', 'NotActiveYet'].includes(this.SellingStatus)) {
      return this.SellingStatus;
    } else {
      return 'active';
    }
  }

  get isPropertyOfTypeETW(): boolean {
    return this.PropertyType === 'ETW';
  }


  get isRendered(): boolean {
    return this.mapMarker != null;
  }

  get isPropertyOfTypeEFH(): boolean {
    return this.PropertyType === 'EFH';
  }

  get isPropertyOfTypeMFH(): boolean {
    return this.PropertyType === 'MFH';
  }

  get quantityCaption(): string {
    if (isNullOrUndefined(this.scrapedWithoutAddressGroupedQuantity)) {
      return '1';
    } else {
      return this.scrapedWithoutAddressGroupedQuantity >= 99 ? '99+' : this.scrapedWithoutAddressGroupedQuantity.toString();
    }
  }

  private get isStatusForSale(): boolean {
    return statusToBackEnd(this.SellingStatus) === 'for_sale';
  }

  private get isStatusMakeMeMove(): boolean {
    return statusToBackEnd(this.SellingStatus) === 'make_me_move';
  }

  private get pinClickRestrictionShape(): google.maps.MarkerShape {
    return {
      coords: [
        16, 0,
        24, 10,
        32, 21,
        24, 30,
        16, 42,
        8, 30,
        0, 21,
        8, 10,
        16, 0
      ],
      type: 'poly'
    };
  }

  private get markerZIndex(): number {
    if (this.isStatusMakeMeMove) {
      return 3;
    }

    if (this.isStatusForSale) {
      return 4;
    }

    return 2;
  }

  constructor(data: MarkersDto) {
    super();
    this.deserialize(data);
    this.createMarker(this.offset);
  }

  protected createHTMLElement(): HTMLElement {
    this.iconHTMLElement = this.createImageElement();

    const markerElement: HTMLElement = document.createElement('div');

    this.setClusterMarkerStyle(markerElement);
    markerElement.appendChild(this.createCaptionElement());
    markerElement.appendChild(this.iconHTMLElement);

    return markerElement;
  }

  protected updateStyle (isHovered: boolean): void {
    this.iconHTMLElement.src = this.getIconUrl(isHovered);
    this.updateMarkerZIndex(isHovered);
  }

  serialize(): InitialPropertyDto {
    const data: InitialPropertyDto = {} as InitialPropertyDto;

    data.coordinates = [this.Longitude, this.Latitude];
    data.uuid = this.PropertyId ;
    data.propertyType = propTypeToBackEnd(this.PropertyType);
    data.sellingStatus = statusToBackEnd(this.SellingStatus);

    return data;
  }

  deserialize(data: MarkersDto): void {
    this.Longitude = (data.geometry && data.geometry.coordinates) ? data.geometry.coordinates[0] : 0;
    this.Latitude = (data.geometry && data.geometry.coordinates) ? data.geometry.coordinates[1] : 0;
    this._markerPosition = new google.maps.LatLng(this.Latitude, this.Longitude);

    this.PropertyId = data.properties.uuid;
    this.PropertyType = propTypeToFrontEnd(data.properties.propertyType);
    this.SellingStatus = statusToFrontEndOriginal(data.properties.sellingStatus);
    this.isScraped = data.properties.hasOwnProperty('url') && !isEmptyString(data.properties.url);
    this.isScrapedWithoutAddress = !isNullOrUndefined(data.properties.isScrapedWithoutAddress)
      ? data.properties.isScrapedWithoutAddress
      : false;
    this.scrapedWithoutAddressGroupedQuantity = !isNullOrUndefined(data.properties.scrapedWithoutAddressGroupedQuantity)
      ? data.properties.scrapedWithoutAddressGroupedQuantity
      : null;
    this.matchedProperty = isNullOrUndefined(data.properties.matchedProperty) ? null : data.properties.matchedProperty;
    this.markerWithoutAddress = !isNullOrUndefined(data.markerWithoutAddress) ? data.markerWithoutAddress : null;
  }

  activate(): void {
    this.isActive = true;
    this.updateIcon();
  }

  deactivate(): void {
    this.isActive = false;
    this.updateIcon();
  }

  private over(): void {
    this.isHovered = true;
    this.updateIcon();
  }

  private out(): void {
    this.isHovered = false;
    this.updateIcon();
  }

  renderMarker(map: google.maps.Map): void {
    if (this.isScrapedWithoutAddress) {
      this.setMap(map);
    } else {
      const opts: google.maps.MarkerOptions = {
        map: map,
        position: this.position,
        icon: this.getIcon(),
        optimized: false,
        zIndex: this.markerZIndex
      };

      if (this.isStatusMakeMeMove || this.isStatusForSale) {
        opts.shape = this.pinClickRestrictionShape;
      }

      this.mapMarker = new google.maps.Marker(opts);

      if (this.isStatusMakeMeMove || this.isStatusForSale) {
        this.subscribe('mouseover', () => this.over(), 'mapComponent::mouseOverMarker');
        this.subscribe('mouseout', () => this.out(), 'mapComponent::mouseOutMarker');
      }

      this.isHidden = false;
    }
  }

  renderIfNeed(map: google.maps.Map): void {
    if (this.mapMarker == null) {
      this.renderMarker(map);
    }
  }

  hide(): void {
    if (this.isScrapedWithoutAddress) {
      super.hide();
      this.isActive = false;
    } else {
      if (this.mapMarker != null) {
        this.mapMarker.setMap(null);
        this.mapMarker.setVisible(false);
        this.isHidden = true;
      }

      this.deactivate();
    }
  }

  show(): void {
    if (!this.isHidden) {
      return;
    }

    if (this.isScrapedWithoutAddress) {
      super.show();
      this.isHidden = false;
    } else {
      if (this.mapMarker != null) {
        this.mapMarker.setVisible(true);
        this.isHidden = false;
      }
    }
  }

  subscribe(eventName: string, callback: (...args) => void, uniqKey: string = `${Date.now()}${Math.random()}`): void {
    const listenerName = `${eventName}|${uniqKey}`;

    if (this.isScrapedWithoutAddress) {
      this.setOnClickHandler(event => callback(event, this));
    }

    if (this.mapMarker != null && !this.listeners.has(`mapMarker|${listenerName}`)) {
      this.listeners.set(
        `mapMarker|${listenerName}`,
        this.mapMarker.addListener(eventName, (...args) => callback(...args, 'marker'))
      );
    }
  }

  unsubscribe(map): void {
    if (this.mapMarker != null) {
      map.event.clearInstanceListeners(this.mapMarker);
    }
  }

  private getIcon(): google.maps.Icon {
    this.icon = this.createIcon();
    return this.icon;
  }

  private createIcon(): google.maps.Icon {
    const FRAGMENTS_URL_DEFAULT = `${FRAGMENTS_URL}/${statusToBackEnd(this.SellingStatus)}.svg`;
    const FRAGMENTS_URL_HOVER = `${FRAGMENTS_URL}/${statusToBackEnd(this.SellingStatus)}(hover).svg`;

    if (this.isStatusMakeMeMove || this.isStatusForSale) {
      return {
        url: this.isHovered ? FRAGMENTS_URL_HOVER : FRAGMENTS_URL_DEFAULT,
        size: this.pinSize,
        scaledSize: this.pinSize,
        anchor: this.pinAnchor,
      };
    }
  }

  private async updateIcon(): Promise<void> {
    this.icon = null;
    if (this.mapMarker == null) return;
    this.mapMarker.setIcon(this.getIcon());
  }

  private updateMarkerZIndex(isHovered: boolean): void {
    this.markerHTMLElement.style.zIndex = isHovered ? '3' : '1';
  }

  private createCaptionElement(): HTMLElement {
    const element = document.createElement('div');

    element.style.zIndex = '2';
    element.innerText = this.quantityCaption;

    return element;
  }

  private createImageElement(): HTMLImageElement {
    const iconHTMLElement = document.createElement('img');

    this.setClusterIconStyle(iconHTMLElement);
    iconHTMLElement.src = this.getIconUrl(false);

    return iconHTMLElement;
  }

  private getIconUrl(isHovered: boolean): WithoutAddressIconUrls {
    if (isHovered) {
      return this.isStatusForSale
        ? WithoutAddressIconUrls.ForSaleHover
        : WithoutAddressIconUrls.MakeMeMoveHover;
    } else {
      return this.isStatusForSale
        ? WithoutAddressIconUrls.ForSale
        : WithoutAddressIconUrls.MakeMeMove;
    }
  }

  private setClusterIconStyle(iconElement: HTMLElement): void {
    iconElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;

      width: 40px;
      height: 40px;
      border-radius: 50%;
    `;
  }

  private setClusterMarkerStyle(markerElement: HTMLElement): void {
    markerElement.style.cssText = `
      position: relative;
      z-index: 1;

      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;

      border-radius: 50%;

      width: 40px;
      height: 40px;

      color: #fff;
      font-family: 'Nunito Sans', sans-serif;
      font-size: 14px;
      font-weight: bold;

      cursor: pointer;
    `;
  }
}
