import { MapsEventListener } from '@agm/core/services/google-maps-types';

import { isEmptyString } from '../../shared/utils/empty-string.util';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';
import { MarkerHtmlOverlay, createHTMLMapMarker } from '../../shared/utils/marker-html-overlay';

import {
  PropertyDetailData,
  GroupedMarkerWithoutAddressData,
  CoordinatesTuple,
} from './properties-repository.model';
import { Point } from './location.model';

export class MarkerModelWithoutAddress {
  coordinates: CoordinatesTuple;
  propertyDetailData: PropertyDetailData[];
  mapMarker: MarkerHtmlOverlay = null;
  listeners: Map<string, MapsEventListener> = new Map<string, MapsEventListener>();
  isActive: boolean = false;
  isHovered: boolean = false;
  isHidden: boolean = true;
  isScraped: boolean;

  get id(): string {
    if (!isEmptyString(this.propertyDetailData[0].uuid)) {
      return this.propertyDetailData[0].uuid;
    }

    return '';
  }

  get latitude(): number {
    return this.coordinates[1];
  }

  get longitude(): number {
    return this.coordinates[0];
  }

  get zipCode(): string {
    return this.propertyDetailData[0].zipCode;
  }

  get positionAsLatLng(): google.maps.LatLng {
    return {
      lat: () => this.latitude,
      lng: () => this.longitude
    } as google.maps.LatLng;
  }

  get position(): Point {
    return {
      lat: this.latitude,
      lng: this.longitude
    };
  }

  constructor(
    data: GroupedMarkerWithoutAddressData = null
  ) {
    if (!isNullOrUndefined(data)) {
      this.deserialize(data);
    }
  }

  deserialize (inputData: GroupedMarkerWithoutAddressData): GroupedMarkerWithoutAddressData {
    return Object.assign(this, inputData);
  }

  renderIfNeed(map: google.maps.Map): void {
    if (isNullOrUndefined(this.mapMarker)) {
      this.renderMarker(map);
      this.isHidden = false;
    }
  }

  renderMarker(map: google.maps.Map): void {
    this.mapMarker = createHTMLMapMarker({
      latlng: this.positionAsLatLng,
      map: map,
      markerElement: this.buildMarkerElement(),
      offset: { x: 0, y: 0 },
      classList: ['marker--status-active']
    });
  }

  hide(): void {
    if (!isNullOrUndefined(this.mapMarker)) {
      this.mapMarker.setMap(null);
      this.isHidden = true;
    }

    this.deactivate();
  }

  show(): void {
    if (!this.isHidden) return;
    if (!isNullOrUndefined(this.mapMarker)) {
      this.isHidden = false;
    }
  }

  deactivate(): void {
    this.isActive = false;
    this.isHovered = false;
    this.updateStyles();
  }

  updateStyles(): void {
    if (isNullOrUndefined(this.mapMarker) || !('addClass' in this.mapMarker)) {
      return;
    }
    if (this.isActive || this.isHovered) {
      (this.mapMarker as MarkerHtmlOverlay).addClass('marker--hover-active');
    } else {
      (this.mapMarker as MarkerHtmlOverlay).removeClass('marker--hover-active');
    }
  }

  activate(): void {
    this.isActive = true;
    this.updateStyles();
  }

  subscribe(
    eventName: string,
    callback: (...args) => void,
    uniqKey: string = `${Date.now()}${Math.random()}`
  ): void {
    const listenerName = `${eventName}|${uniqKey}`;
    if (
      !isNullOrUndefined(this.mapMarker) &&
      !this.listeners.has(`mapMarker|${listenerName}`)
    ) {
      this.listeners.set(
        `mapMarker|${listenerName}`,
        this.mapMarker.addListener(eventName, (...args) => callback(...args, 'marker'))
      );
    }
  }

  unsubscribe(map: typeof google.maps): void {
    if (!isNullOrUndefined(this.mapMarker)) {
      return map.event.clearInstanceListeners(this.mapMarker);
    }
  }

  private buildMarkerElement(): HTMLElement {
    const marker: HTMLElement = document.createElement('div');
    marker.classList.add('marker-without-address');
    marker.innerText = this.buildMarkerText();
    return marker;
  }

  private buildMarkerText(): string {
    if (this.propertyDetailData.length === 1) {
      return `${this.propertyDetailData[0].salePrice.toLocaleString('de-DE')} €`;
    } else {
      return `${this.propertyDetailData.length} Objekte in PLZ ${this.zipCode}`;
    }
  }
}
