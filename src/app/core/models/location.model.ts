export interface Point {
  lat: number;
  lng: number;
}

export enum PlaceType {
  AdministrativeAreaLevel1 = 'administrative_area_level_1',
  AdministrativeAreaLevel2 = 'administrative_area_level_2',
  AdministrativeAreaLevel3 = 'administrative_area_level_3',
  AdministrativeAreaLevel4 = 'administrative_area_level_4',
  AdministrativeAreaLevel5 = 'administrative_area_level_5',
  ColloquialArea = 'colloquial_area',
  Country =  'country',
  Establishment = 'establishment',
  Finance = 'Finance',
  Floor = 'floor',
  Food = 'food',
  GeneralContractor = 'general_contractor',
  Geocode = 'geocode',
  Health = 'health',
  Intersection = 'intersection',
  Locality = 'locality',
  NaturalFeature = 'natural_feature',
  Neighborhood = 'neighborhood',
  PlaceOfWorship = 'place_of_worship',
  Political = 'political',
  PointOfInterest = 'point_of_interest',
  PostBox = 'post_box',
  PostalCode = 'postal_code',
  PostalCodePrefix = 'postal_code_prefix',
  PostalCodeSuffix = 'postal_code_suffix',
  PostalTown = 'postal_town',
  Premise = 'premise',
  Room = 'room',
  Route = 'route',
  StreetAddress = 'street_address',
  StreetNumber = 'street_number',
  Sublocality = 'sublocality',
  SublocalityLevel1 = 'sublocality_level_1',
  SublocalityLevel3 = 'sublocality_level_3',
  SublocalityLevel4 = 'sublocality_level_4',
  SublocalityLevel2 = 'sublocality_level_2',
  SublocalityLevel5 = 'sublocality_level_5',
  Subpremise = 'subpremise',
  Cities = '(cities)',
}

export interface Place {
  point: Point;
  placeType: PlaceType;
}

export interface MapObject {
  place: Place;
  zoom: number;
  name: string;
}

export interface Address {
  street:       string;
  locality:     string;
  streetNumber: string;
}

export interface MapAutoCompleteData {
  placePoint: Point;
  address: Address;
  placeObject: Place;
}

export type ZoomLevel = 'HIGH' | 'BELOW_NEIGHBOURHOOD' | 'NEIGHBOURHOOD' | 'LOCALITY' | 'COUNTY' | 'STATE' | 'COUNTRY';
