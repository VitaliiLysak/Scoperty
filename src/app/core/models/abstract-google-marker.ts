import { AbstractMarker } from '../../core/models/abstract-marker';

export abstract class AbstractGoogleMarker extends AbstractMarker {
  zoomLevel: number;
  identifier: string;

  protected abstract zIndex: number;

  protected abstract readonly pinClickRestrictionShape: google.maps.MarkerShape;

  protected position: google.maps.LatLng;

  protected marker: google.maps.Marker;

  get markerPosition(): google.maps.LatLng {
    return this.position;
  }

  protected constructor() {
    super();
  }

  protected abstract createIcon(isHovered: boolean): google.maps.Icon;

  setMap(map: google.maps.Map): void {
    this.marker.setMap(map);
  }

  setOnClickHandler(callback: (...args) => void): void {
    this.marker.addListener('click', callback);
  }

  show(): void {
    this.marker.setVisible(true);
  }

  hide(): void {
    this.marker.setVisible(false);
  }

  remove(): void {
    this.marker.setMap(null);
  }

  protected createMarker(): void {
    this.marker = new google.maps.Marker({
      position: this.position,
      icon: this.createIcon(false),
      optimized: false,
      shape: this.pinClickRestrictionShape,
      visible: false,
      zIndex: this.zIndex,
    });
    this.initMarkerHover();
  }

  protected initMarkerHover(): void {
    this.marker.addListener('mouseover', () => this.marker.setIcon(this.createIcon(true)));
    this.marker.addListener('mouseout', () => this.marker.setIcon(this.createIcon(false)));
  }
}
