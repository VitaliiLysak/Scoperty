import { AbstractMarker } from '../../core/models/abstract-marker';
import {
  createHTMLMapMarker,
  MarkerHtmlOverlay,
  MarkerHTMLOverlayOffset
} from '../../shared/utils/marker-html-overlay';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';

export abstract class AbstractGoogleOverlay extends AbstractMarker {
  zoomLevel: number;
  identifier: string;

  protected _markerPosition: google.maps.LatLng;
  protected marker: MarkerHtmlOverlay;
  protected markerHTMLElement: HTMLElement;

  private defaultDisplayValue: string;

  get markerPosition(): google.maps.LatLng {
    return this._markerPosition;
  }

  protected constructor() {
    super();
  }

  protected abstract updateStyle(isHovered: boolean): void;

  protected abstract createHTMLElement(): HTMLElement;

  setMap(map: google.maps.Map): void {
    this.marker.setMap(map);
  }

  setOnClickHandler(callback: (...args) => void): void {
    this.marker.addListener('click', callback);
  }

  show(): void {
    this.markerHTMLElement.style.display = this.defaultDisplayValue;
  }

  hide(): void {
    this.markerHTMLElement.style.display = 'none';
  }

  remove(): void {
    this.marker.setMap(null);
  }

  protected createMarker(offset: MarkerHTMLOverlayOffset): void {
    this.markerHTMLElement = this.createHTMLElement();

    if (isNullOrUndefined(this.defaultDisplayValue)) {
      this.defaultDisplayValue = this.markerHTMLElement.style.display;
    }

    this.marker = createHTMLMapMarker({
      latlng: this._markerPosition,
      markerElement: this.markerHTMLElement,
      offset: offset,
    });
    this.initMarkerHover();
  }

  protected initMarkerHover(): void {
    this.marker.addListener('mouseover', () => this.updateStyle(true));
    this.marker.addListener('mouseout', () => this.updateStyle(false));
  }
}
