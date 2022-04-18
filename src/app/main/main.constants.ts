import { Cities } from '../core/models/coordinates.model';

export const ZOOM_CONSTANTS = {
  MINIMUM_ZOOM: {
    value: 7,
    name: 'MINIMUM_ZOOM',
  },
  COUNTRY: {
    value: 9,
    name: 'COUNTRY',
  },
  TOWN: {
    value: 12,
    name: 'TOWN'
  },
  NEIGHBOURHOOD: {
    value: 14,
    name: 'NEIGHBOURHOOD'
  },
  STREET: {
    value: 18,
    name: 'STREET'
  },
  QUARTER: {
    value: 19,
    name: 'QUARTER'
  },
  MAXIMUM_ZOOM: {
    value: 20,
    name: 'MAXIMUM_ZOOM'
  },
  LEVELS: {
    HIGH: {
      NEXT_UP: 'HIGH',
      UP_EDGE: 20,
      DOWN_EDGE: 17,
      NEXT_DOWN: 'BELOW_NEIGHBOURHOOD'
    },
    BELOW_NEIGHBOURHOOD: {
      NEXT_UP: 'HIGH',
      UP_EDGE: 17,
      DOWN_EDGE: 15,
      NEXT_DOWN: 'NEIGHBOURHOOD'
    },
    NEIGHBOURHOOD: {
      NEXT_UP: 'BELOW_NEIGHBOURHOOD',
      UP_EDGE: 15,
      DOWN_EDGE: 13,
      NEXT_DOWN: 'LOCALITY'
    },
    LOCALITY: {
      NEXT_UP: 'NEIGHBOURHOOD',
      UP_EDGE: 13,
      DOWN_EDGE: 11,
      NEXT_DOWN: 'COUNTY'
    },
    COUNTY: {
      NEXT_UP: 'LOCALITY',
      UP_EDGE: 11,
      DOWN_EDGE: 9,
      NEXT_DOWN: 'STATE'
    },
    STATE: {
      NEXT_UP: 'COUNTY',
      UP_EDGE: 9,
      DOWN_EDGE: 6,
      NEXT_DOWN: 'COUNTRY'
    },
    COUNTRY: {
      NEXT_UP: 'STATE',
      UP_EDGE: 6,
      DOWN_EDGE: 5,
      NEXT_DOWN: 'COUNTRY'
    },
  }
};

export const AVAILABLE_MAP_TYPES = {
  ROADMAP: 'roadmap', // google.maps.MapTypeId.ROADMAP,
  HYBRID: 'hybrid', // google.maps.MapTypeId.HYBRID,
  STYLED: 'styled', // Styled Map Type,
};

const MAP_CENTER_KOLN = {
  LATITUDE: 50.936637,
  LONGITUDE: 6.953584
};

const MAP_CENTER_NURNBERG = {
  LATITUDE: 49.4521,
  LONGITUDE: 11.0767
};

const MAP_CENTER_BERLIN = {
  LATITUDE: 52.5200,
  LONGITUDE: 13.4050
};

const MAP_CENTER_HAMBURG = {
  LATITUDE: 53.5487,
  LONGITUDE: 9.9928
};

const MAP_CENTER_MUNICH = {
  LATITUDE: 48.1423,
  LONGITUDE: 11.5561
};

const MAP_CENTER_ERLANGEN = {
  LATITUDE: 49.5891,
  LONGITUDE: 10.9494
};

const MAP_CENTER_FRANKFURT = {
  LATITUDE: 50.1051,
  LONGITUDE: 8.6575
};

const MAP_CENTER_FURTH = {
  LATITUDE: 49.4886,
  LONGITUDE: 10.9257
};

const MAP_CENTER_GERMANY = {
  LATITUDE: 51.1657,
  LONGITUDE: 10.4515
};

export const CITIES: Cities = {
  KOLN: MAP_CENTER_KOLN,
  NURNBERG: MAP_CENTER_NURNBERG,
  BERLIN: MAP_CENTER_BERLIN,
  HAMBURG: MAP_CENTER_HAMBURG,
  FRANKFURT: MAP_CENTER_FRANKFURT,
  MUNICH: MAP_CENTER_MUNICH,
  FURTH: MAP_CENTER_FURTH,
  ERLANGEN: MAP_CENTER_ERLANGEN
};

// not dev
const MAP_INIT_SETTINGS = {
  MAP_TYPE: AVAILABLE_MAP_TYPES.STYLED,
  ZOOM: 7,
  MINIMUM_ZOOM: ZOOM_CONSTANTS.MINIMUM_ZOOM.value,
  MAXIMUM_ZOOM: ZOOM_CONSTANTS.MAXIMUM_ZOOM.value,
  ACTIVE_MARKER: { PropertyId: '' },
  SEARCH_QUERY: '',
  HIDE_SEARCH: false,
  ACTIVE_ID: '',
  LATITUDE: MAP_CENTER_GERMANY.LATITUDE,
  LONGITUDE: MAP_CENTER_GERMANY.LONGITUDE,
};

const MAP_STYLES = [{
  featureType: 'poi',
  elementType: 'labels',
  stylers: [
    { visibility: 'off' }
  ]
}];

export const MAP_SETTINGS = {
  zoom: MAP_INIT_SETTINGS.ZOOM,
  maxZoom: MAP_INIT_SETTINGS.MAXIMUM_ZOOM,
  minZoom: MAP_INIT_SETTINGS.MINIMUM_ZOOM,
  mapTypeId: MAP_INIT_SETTINGS.MAP_TYPE,
  center: {
    lat: MAP_INIT_SETTINGS.LATITUDE,
    lng: MAP_INIT_SETTINGS.LONGITUDE
  },
  disableDefaultUI: true,
  streetViewControl: false,
  fullscreenControl: false,
  mapTypeControl: false,
  rotateControl: false,
  scaleControl: false,
  signInControl: false,
  zoomControl: false,
  panControl: false,
  clickableIcons: false,
  noClear: true,
  styles: MAP_STYLES
};

export const MAP_DATA_SHADER_LAYER_CONFIG = {
  tileSize: 256,
  minZoom: 7,
  maxZoom: 17,
  opacity: 1,
};

export const MAP_CLUSTERS_CONFIG = {
  maxZoom: 13,
};

const COORDINATES_INIT = {
  NW_LATITUDE: 180,
  NW_LONGTITUDE: 0,
  SE_LATITUDE: -180,
  SE_LONGTITUDE: 0,
};

export const MAP_CONSTANTS = {
  AVAILABLE_MAP_TYPES,
  MAP_INIT_SETTINGS,
  COORDINATES_INIT,
  MAP_STYLES,
};
