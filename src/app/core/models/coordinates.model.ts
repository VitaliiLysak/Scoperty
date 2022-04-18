export interface Coordinates {
  nwLatitude:   number;
  nwLongitude:  number;
  seLongitude:  number;
  seLatitude:   number;
}

export interface CoordinatesDescription {
  coordinates: Coordinates;
  zoom: number;
}

export interface Cities {
  KOLN: LatLng;
  NURNBERG: LatLng;
  BERLIN: LatLng;
  HAMBURG: LatLng;
  FRANKFURT: LatLng;
  MUNICH: LatLng;
  FURTH: LatLng;
  ERLANGEN: LatLng;
}

export interface LatLng {
  LATITUDE: number;
  LONGITUDE: number;
}
