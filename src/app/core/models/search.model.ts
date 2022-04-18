import { Point, Place, Address } from './location.model';

export interface SearchPointData {
  placePoint: Point;
  address: Address;
  placeObject: Place;
}
