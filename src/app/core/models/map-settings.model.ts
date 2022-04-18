export interface MapSettings {
  mapTypeId?:          string;
  latitude?:           number;
  longitude?:          number;
  zoom?:               number;
  center?: google.maps.LatLngLiteral;
  activatedMarkerId?:  string;
  activeMarkerId?:     string;
  activeMarkerType?:   string;
  needOpenDetailWindow?: boolean;
}

export interface HintActivator {
  NO_MARKERS: boolean;
  ZOOM_IN:    boolean;
}
