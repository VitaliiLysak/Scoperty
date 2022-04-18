import { AbstractGoogleOverlay } from '../../core/models/abstract-google-overlay';
import { MarkerHTMLOverlayOffset } from '../../shared/utils/marker-html-overlay';

import { ClustersData } from '../services/properties-repository.service';
import { PropertyStatusDto } from './properties-repository.model';

enum IconUrls {
  ForSale = '../../assets/images/clusters/cluster_for_sale_standard.svg',
  ForSaleHover = '../../assets/images/clusters/cluster_for_sale_hover.svg',
  MakeMeMove = '../../assets/images/clusters/cluster_ofo_standard.svg',
  MakeMeMoveHover = '../../assets/images/clusters/cluster_ofo_hover.svg'
}

const COORDINATES_PRECISION = 10;

export class ClusterModel extends AbstractGoogleOverlay {
  private readonly offset: MarkerHTMLOverlayOffset = { x: -20, y: -20 };

  get quantityCaption(): string {
    return this.quantity >= 99 ? '99+' : this.quantity.toString();
  }

  private quantity: number;
  private forSaleApartmentQuantity: number;
  private forSaleQuantity: number;
  private forSaleSFHQuantity: number;
  private makeMeMoveApartmentQuantity: number;
  private makeMeMoveQuantity: number;
  private makeMeMoveSFHQuantity: number;
  private propertyStatus: PropertyStatusDto;

  private iconHTMLElement: HTMLImageElement;

  static createIdentifier(feature: ClustersData.Feature): string {
    const { zoom_level, count } = feature.properties;
    const [ lng, lat ] = feature.geometry.coordinates;
    const property_type = feature.properties.meta.property_type;
    return `${zoom_level}${lat.toFixed(COORDINATES_PRECISION)}${lng.toFixed(COORDINATES_PRECISION)}${property_type}${count}`;
  }

  private get isStatusForSale(): boolean {
    return this.propertyStatus === PropertyStatusDto.ForSale;
  }

  constructor(feature: ClustersData.Feature) {
    super();
    this.deserialize(feature);
    this.createMarker(this.offset);
  }

  private deserialize(feature: ClustersData.Feature): void {
    const properties = feature.properties;
    const meta = properties.meta;
    const [ lng, lat ] = feature.geometry.coordinates;

    this.quantity = properties.count;
    this.zoomLevel = properties.zoom_level;

    this.forSaleQuantity = meta.for_sale_count;
    this.forSaleSFHQuantity = meta.for_sale_sfh_count;
    this.forSaleApartmentQuantity = meta.for_sale_apartment_count;
    this.makeMeMoveQuantity = meta.make_me_move_count;
    this.makeMeMoveSFHQuantity = meta.make_me_move_sfh_count;
    this.makeMeMoveApartmentQuantity = meta.for_sale_apartment_count;
    this.propertyStatus = meta.property_type;

    this._markerPosition = new google.maps.LatLng(lat, lng);

    this.identifier = ClusterModel.createIdentifier(feature);
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

  private updateMarkerZIndex(isHovered: boolean): void {
    this.markerHTMLElement.style.zIndex = isHovered ? '3' : '1';
  }

  private createImageElement(): HTMLImageElement {
    const iconHTMLElement = document.createElement('img');

    this.setClusterIconStyle(iconHTMLElement);
    iconHTMLElement.src = this.getIconUrl(false);

    return iconHTMLElement;
  }

  private createCaptionElement(): HTMLElement {
    const element = document.createElement('div');

    element.style.zIndex = '2';
    element.innerText = this.quantityCaption;

    return element;
  }

  private getIconUrl(isHovered: boolean): IconUrls {
    if (isHovered) {
      return this.isStatusForSale
        ? IconUrls.ForSaleHover
        : IconUrls.MakeMeMoveHover;
    } else {
      return this.isStatusForSale
        ? IconUrls.ForSale
        : IconUrls.MakeMeMove;
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
