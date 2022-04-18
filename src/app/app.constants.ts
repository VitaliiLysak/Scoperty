import { environment } from '../environments/environment';
import { AWSSettings } from '../environments/environment.model';

import { FilterOptions } from './core/models/filter-options.model';

interface GoogleMapConfig {
  protocol: string;
  host: string;
  path: string;
  queryParams: {
    v: string;
    callback: string;
    key: string;
    client: string;
    channel: string;
    libraries: Array<string>;
    region: string;
    language: string;
  };
}

interface HTTPSettings {
  host: string;
  hostCached: string;
  hostCachedV2: string;
}

export interface SellingStatus {
  Idle: boolean;
  MakeMeMove: boolean;
  ForSale: boolean;
  Active: boolean;
}

export type SellingStatusFE = 'ForSale' | 'MakeMeMove' | 'Active' | 'NotActiveYet' | 'Idle';
export type SellingStatusDesign = 'Zum Verkauf' | 'Offen für Gebote' | 'Active' | 'Noch nicht aktiv' | 'Deaktiviert';

export const GOOGLE_ANALYTICS_KEY: string = environment.googleAnalyticsKey;
export const GOOGLE_MAPS_API_KEY: string = environment.googleMapsApiKey;

export const SCOPERTY_PLUS_INVISION_LANDING = 'https://immobilien.scoperty.de/scoperty-plus/';

export const GOOGLE_MAPS_SDK_CONFIG: GoogleMapConfig = {
  protocol: 'https://',
  host: 'maps.googleapis.com',
  path: '/maps/api/js',
  queryParams: {
    v: '3',
    callback: '',
    key: GOOGLE_MAPS_API_KEY,
    client: null,
    channel: null,
    libraries: ['places'],
    region: null,
    language: 'de'
  }
};

export const AWS_SETTINGS: AWSSettings = {
  region: environment.awsSettings.region,
  userPoolId: environment.awsSettings.userPoolId,
  clientId: environment.awsSettings.clientId,
};

export const AWS_SETTINGS_DISSENT: AWSSettings = {
  region: environment.awsSettingsDissent.region,
  userPoolId: environment.awsSettingsDissent.userPoolId,
  clientId: environment.awsSettingsDissent.clientId,
};

export const HTTP_Settings: HTTPSettings = {
  host: environment.backendUrl,
  hostCached: environment.backendCashedUrl,
  hostCachedV2: environment.backendCashedUrl.replace('v1', 'v2')
};

export const SHARED_ROUTES_NAMES = {
  PROFILE: 'profile',
  MAP: 'map',
  TERMS_OF_SERVICE: 'terms-of-service',
  SCOPERTY_PLUS_ANMELDUNG: 'Scoperty-Plus-Anmeldung',
  PRIVACY: 'privacy',
  HOWITWORKS: 'howitworks',
  ABOUT: 'about',
  BROKER: 'broker',
  DATAPROTECTION: 'dataprotection',
  IMPRESSUM: 'impressum',
  CONFIRMUSER: 'confirmuser',
  SIGNUP: 'signup',
  LOGIN: 'login',
  CHANGEPASSWORD: 'changepassword',
  OFFERS: 'offers',
  PROPERTY: 'my-property',
  MORTGAGE_REQUEST: 'mortgage-request',
  SEARCH: 'search-alerts',
  FAVORITES: 'favorites',
  CHAT: 'chat',
  PROPERTY_DETAIL: 'property-detail',
  PROPERTY_DETAIL_QUERY: 'property-detail/:id',
  SEARCHBROKER: 'search-broker',
  PROFESSIONALS: 'for-realtors',
  BUY: 'buy',
  SELL: 'sell',

  // Landing pages
  PROPERTY_VALUATION: 'immobilienbewertung',
  PROPERTY_VALUATION_DUPLICATE: 'immobilienbewertung-muc',
  SELL_APARTMENT: 'wohnung-verkaufen',
  SELL_HOUSE: 'haus-verkaufen',
  SELL_PROPERTY: 'immobilie-verkaufen',
  ADVERTISE_PROPERTY: 'immobilie-inserieren',
};

export const LANDING_PAGE_ROUTES: string[] = [
  SHARED_ROUTES_NAMES.PROPERTY_VALUATION,
  SHARED_ROUTES_NAMES.PROPERTY_VALUATION_DUPLICATE,
  SHARED_ROUTES_NAMES.SELL_APARTMENT,
  SHARED_ROUTES_NAMES.SELL_HOUSE,
  SHARED_ROUTES_NAMES.SELL_PROPERTY,
  SHARED_ROUTES_NAMES.ADVERTISE_PROPERTY,
];

export const LANDING_PAGES: Array<string> = [
  SHARED_ROUTES_NAMES.PROPERTY_VALUATION,
  SHARED_ROUTES_NAMES.PROPERTY_VALUATION_DUPLICATE,
  SHARED_ROUTES_NAMES.SELL_APARTMENT,
  SHARED_ROUTES_NAMES.SELL_HOUSE,
  SHARED_ROUTES_NAMES.SELL_PROPERTY,
  SHARED_ROUTES_NAMES.ADVERTISE_PROPERTY,
  SHARED_ROUTES_NAMES.BUY,
  SHARED_ROUTES_NAMES.SELL
];

export const LAST_LANDING_QUERY_PARAM = 'last_land';

export const TRACKING_PARAMS: Array<string> = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  LAST_LANDING_QUERY_PARAM
];

export enum MailToLinks {
  Realtors = 'mailto:makler@scoperty.de',
  DataProtection = 'mailto:datenschutz@scoperty.de',
  Contact = 'mailto:kontakt@scoperty.de',
}

export enum TelLinks {
  Contact = 'tel:+49089124794100'
}

export enum AuthError {
  UnconfirmedEmail = 'UnconfirmedEmail',
  UserNotFound = 'UserNotFound',
  NotAuthorizedException = 'NotAuthorizedException',
  UnknownError = 'UnknownError',
}

export enum CognitoUserFields {
  GivenName = 'custom:_given_name',
  FamilyName = 'custom:_family_name',
}

export const PRIVATE_URLS: Array<string> = [
  '/profile',
  '/profile/offers',
  '/profile/my-property',
  '/profile/chat',
  '/profile/favorites',
  '/profile/search-alerts',
];

export const FILTER_MAX_PRICE: number = null;
export const FILTER_MIN_PRICE: number = null;

// 1 Miles to Kilometres = 1.609344
export const MILE_IN_KILOMETRES: number = 1.609344;

// 1 Miles to Nautical Miles (international) = 0.8684
export const MILE_IN_NAUTICAL: number = 0.8684;

// 1.1515 is the number of statute miles in a nautical mile
export const NAUTICAL_IN_MILE: number = 1.1515;

export const SQUARE_COORDINATES_COEFFICIENT: number = 0.001;

export const FILTER_INITIAL_VALUES_SELLING_STATUS: SellingStatus = {
  Idle: false,
  MakeMeMove: false,
  ForSale: false,
  Active: false,
};

export const FILTER_INITIAL_VALUES: FilterOptions = {
  PropertyType: null,
  PriceFrom: null,
  PriceTo: null,
  PriceDevelopmentFrom: null,
  PriceDevelopmentTo: null,
  AreaSize: null,
  AreaSize2: null,
  SellingStatus: FILTER_INITIAL_VALUES_SELLING_STATUS
};

export const SKIP_AUTH_HEADER: string = 'Skip-Authentication';
export const CONTENT_TYPE_HEADER: string = 'Content-Type';

export const PASSWORD_REQUIRED: string = 'NEW_PASSWORD_REQUIRED';

export const CODE_MISMATCH_EXCEPTION: string = 'CodeMismatchException';
export const MESSAGE_USER_ALREADY_CONFIRMED: string = 'User cannot be confirmed. Current status is CONFIRMED';

// maximum number of floors in MFH
export const MAX_FLOORS_COUNT: number = 40;

// ground floor designation
export const GROUND_FLOOR: string = 'EG';

const SUPPORTED_CITIES: Array<string> = [
  'Adelsdorf', 'Alfeld', 'Altdorf', 'Ammerndorf', 'Aurachtal',
  'Baiersdorf', 'Berlin', 'Bubenreuth', 'Buckenhof', 'Burgthann',
  'Cadolzburg',
  'Eckental', 'Engelthal', 'Erlangen',
  'Feucht', 'Frankfurt am Main', 'Fürth',
  'Gremsdorf', 'Großenseebach', 'Großhabersdorf',
  'Hamburg', 'Happurg', 'Hartenstein', 'Hemhofen', 'Henfenfeld', 'Heroldsberg', 'Hersbruck', 'Herzogenaurach', 'Heßdorf', 'Höchstadt',
  'Kalchreuth', 'Kammerstein', 'Kirchensittenbach', 'Köln',
  'Langenzenn', 'Lauf', 'Leinburg', 'Lonnerstadt',
  'Marloffstein', 'Möhrendorf', 'Mühlhausen', 'München',
  'Neuhaus', 'Neunkirchen', 'Nürnberg',
  'Oberasbach', 'Obermichelbach', 'Oberreichenbach', 'Offenhausen', 'Ottensoos',
  'Pommelsbrunn', 'Puschendorf',
  'Rednitzhembach', 'Reichenschwand', 'Roßtal', 'Röthenbach', 'Röttenbach', 'Rückersdorf',
  'Schnaittach', 'Schwabach', 'Schwaig', 'Schwarzenbruck', 'Seukendorf', 'Simmelsdorf', 'Spardorf', 'Stein',
  'Tuchenbach',
  'Uttenreuth',
  'Veitsbronn', 'Velden', 'Vestenbergsgreuth', 'Vorra',
  'Wachenroth', 'Weisendorf', 'Wilhermsdorf', 'Winkelhaid',
  'Zirndorf',
];

export function isCitySupported(place: string): boolean {
  return SUPPORTED_CITIES.includes(place);
}

export const NAVBAR_BREAKPOINT_PX = 1279;

export const NARROWING_FACTOR = 0.001;
export const MAP_BOUNDS_CHANGED_DEBOUNCE = 100;

export const SCOPERTY_PLUS_ONBOARD_FORM_DATA_LOCAL_STORAGE_KEY = 'scoperty_plus_onboard_form';
export const SCOPERTY_INDEXEDDB_NAME = 'scoperty';
export const SCOPERTY_PLUS_MORTGAGE_CERTIFICATE_STORE = 'scoperty_plus_onboard_form_mortgage_certificate_store';

export const INDEXEDDB_STORES = [
  SCOPERTY_PLUS_MORTGAGE_CERTIFICATE_STORE,
];
