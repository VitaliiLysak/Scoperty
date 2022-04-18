import { ScopertyPlus } from '../services/properties-repository.service';
import { AbstractGoogleMarker } from '../../core/models/abstract-google-marker';

export const SCOPERTY_PLUS_OFFSET = {
  x: 16,
  y: 40,
};

export function calculateCoordinateShift(zoom: number) {
  switch (zoom) {
    case 14: return 0.0112;
    case 15: return 0.0080;
    case 16: return 0.0028;
    case 17: return 0.0018;
  }
}

enum IconUrls {
  ScopertyPlus = '../../assets/images/scoperty_plus/pin_plus_standard.svg',
  ScopertyPlusHover = '../../assets/images/scoperty_plus/pin_plus_hover.svg',
}

export class ScopertyPlusMarkerModel extends AbstractGoogleMarker {
  private readonly pinSize = new google.maps.Size(32, 42);
  private readonly pinAnchor = new google.maps.Point(16 - SCOPERTY_PLUS_OFFSET.x, 42 + SCOPERTY_PLUS_OFFSET.y);
  protected readonly pinClickRestrictionShape: google.maps.MarkerShape = {
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

  zipCode: string;
  identifier: string;
  zoomLevel: number;
  zIndex = 100000;

  constructor(feature: ScopertyPlus.Feature, zoom: number) {
    super();
    this.deserialize(feature, zoom);
    this.createMarker();
  }

  private deserialize(feature: ScopertyPlus.Feature, zoom: number): void {
    const [ lng, lat ] = feature.geometry.coordinates;

    this.zipCode = feature.properties.zip_code;
    this.position = new google.maps.LatLng(lat, lng);
    this.zoomLevel = zoom;

    this.identifier = ScopertyPlusMarkerModel.createIdentifier(feature, this.zoomLevel);
  }

  protected createIcon(isHovered: boolean): google.maps.Icon {
    return {
      url: this.getIconUrl(isHovered),
      size: this.pinSize,
      scaledSize: this.pinSize,
      anchor: this.pinAnchor,
    };
  }

  protected getIconUrl(isHovered: boolean): IconUrls {
    return isHovered ? IconUrls.ScopertyPlusHover : IconUrls.ScopertyPlus;
  }
}

export namespace ScopertyPlusMarkerModel {
  export function createIdentifier(feature: ScopertyPlus.Feature, zoomLevel: number) {
    return `${feature.properties.zip_code}_${zoomLevel}_scop-plus-pin`;
  }
}
