import { Observable } from 'rxjs';

import {
  Address,
  Place,
  PlaceType,
  Point,
} from '../../core/models/location.model';
import { ZOOM_CONSTANTS } from '../../main/main.constants';

import { isNullOrUndefined } from './null-or-undefined.util';

export interface TmsCoordinates {
  x: number;
  y: number;
}

export class GmapsUtils {
  static findCityName(addressComponents: google.maps.GeocoderAddressComponent[]): string {
    if (isNullOrUndefined(addressComponents)) {
      return null;
    }

    const addressComponentForCity: google.maps.GeocoderAddressComponent = addressComponents
      .find(({ types }: google.maps.GeocoderAddressComponent) => {
        return types.includes('locality');
      });
    if (isNullOrUndefined(addressComponentForCity)) {
      return null;
    }

    return addressComponentForCity.long_name;
  }

  static convertPlaceGeometryToPoint(geometry: google.maps.places.PlaceGeometry): Point {
    return {
      lat: geometry.location.lat(),
      lng: geometry.location.lng(),
    };
  }

  static convertPlaceResultToPlace(googleObject: google.maps.places.PlaceResult): Place {
    if (
      isNullOrUndefined(googleObject) ||
      isNullOrUndefined(googleObject.geometry) ||
      isNullOrUndefined(googleObject.types.length)
    ) {
      return null;
    }

    const placePoint = GmapsUtils.convertPlaceGeometryToPoint(googleObject.geometry);
    return {
      placeType: googleObject.types[0] as PlaceType,
      point: placePoint,
    };
  }

  static observableFromEvent(map: google.maps.Map, eventName: string): Observable<void> {
    return Observable.create($obs => {
      const listener = map.addListener(eventName, (...args) => $obs.next(...args));

      return () => listener.remove();
    });
  }

  static getZoomLevelForPlace(placeInfo: Place | string): number {
    const placeType = typeof placeInfo !== 'string'
      ? placeInfo.placeType
      : placeInfo;

    switch (placeType) {
      case PlaceType.Floor:             return ZOOM_CONSTANTS.MAXIMUM_ZOOM.value;
      case PlaceType.Food:              return ZOOM_CONSTANTS.MAXIMUM_ZOOM.value;
      case PlaceType.GeneralContractor: return ZOOM_CONSTANTS.MAXIMUM_ZOOM.value;
      case PlaceType.Health:            return ZOOM_CONSTANTS.MAXIMUM_ZOOM.value;
      case PlaceType.Intersection:      return ZOOM_CONSTANTS.MAXIMUM_ZOOM.value;
      case PlaceType.Locality:          return ZOOM_CONSTANTS.NEIGHBOURHOOD.value;
      case PlaceType.NaturalFeature:    return ZOOM_CONSTANTS.NEIGHBOURHOOD.value;
      case PlaceType.Neighborhood:      return ZOOM_CONSTANTS.NEIGHBOURHOOD.value;
      case PlaceType.PlaceOfWorship:    return ZOOM_CONSTANTS.MAXIMUM_ZOOM.value;
      case PlaceType.PointOfInterest:   return ZOOM_CONSTANTS.MAXIMUM_ZOOM.value;
      case PlaceType.PostBox:           return ZOOM_CONSTANTS.MAXIMUM_ZOOM.value;
      case PlaceType.PostalCode:        return ZOOM_CONSTANTS.MAXIMUM_ZOOM.value;
      case PlaceType.PostalCodeSuffix:  return ZOOM_CONSTANTS.MAXIMUM_ZOOM.value;
      case PlaceType.PostalTown:        return ZOOM_CONSTANTS.TOWN.value;
      case PlaceType.Premise:           return ZOOM_CONSTANTS.MAXIMUM_ZOOM.value;
      case PlaceType.Room:              return ZOOM_CONSTANTS.MAXIMUM_ZOOM.value;
      case PlaceType.Route:             return ZOOM_CONSTANTS.MAXIMUM_ZOOM.value;
      case PlaceType.StreetAddress:     return ZOOM_CONSTANTS.MAXIMUM_ZOOM.value;
      case PlaceType.StreetNumber:      return ZOOM_CONSTANTS.MAXIMUM_ZOOM.value;
      case PlaceType.Sublocality:       return ZOOM_CONSTANTS.NEIGHBOURHOOD.value;
      case PlaceType.SublocalityLevel1: return ZOOM_CONSTANTS.NEIGHBOURHOOD.value;
      case PlaceType.SublocalityLevel2: return ZOOM_CONSTANTS.NEIGHBOURHOOD.value;
      case PlaceType.SublocalityLevel3: return ZOOM_CONSTANTS.NEIGHBOURHOOD.value;
      case PlaceType.SublocalityLevel4: return ZOOM_CONSTANTS.NEIGHBOURHOOD.value;
      case PlaceType.SublocalityLevel5: return ZOOM_CONSTANTS.NEIGHBOURHOOD.value;
      case PlaceType.Subpremise:        return ZOOM_CONSTANTS.MAXIMUM_ZOOM.value;
      default:                          return ZOOM_CONSTANTS.MINIMUM_ZOOM.value;
    }
  }

  static getAddressFromComponents(addressComponents: Array<google.maps.GeocoderAddressComponent>): Address {
    let street: string;
    let locality: string;
    let streetNumber: string;

    for (const addressComponent of addressComponents) {
      if (addressComponent.types.includes('locality')) {
        locality = addressComponent.long_name;
      }
      if (addressComponent.types.includes('route')) {
        street = addressComponent.long_name;
      }
      if (addressComponent.types.includes('street_number')) {
        streetNumber = addressComponent.long_name;
      }
    }

    const address: Address = {
      street,
      locality,
      streetNumber,
    };

    return isNullOrUndefined(address) &&
           isNullOrUndefined(address.street) &&
           isNullOrUndefined(address.locality) &&
           isNullOrUndefined(address.streetNumber)
      ? null
      : address;
  }

  // Convert GMaps coordinates into the TMS coordinates: https://www.maptiler.com/google-maps-coordinates-tile-bounds-projection
  static convertPointToTmsCoordinates(coordinate: google.maps.Point, zoom: number): TmsCoordinates {
    return {
      x: coordinate.x,
      y: Math.pow(2, zoom) - coordinate.y - 1,
    };
  }


}
