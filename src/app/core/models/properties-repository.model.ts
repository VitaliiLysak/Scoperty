import { Geometry } from '@agm/core/services/google-maps-types';

import { SellingStatus } from '../../app.constants';

import {
  IImage,
  ImageDto,
} from './image.model';
import { Coordinates } from './coordinates.model';
import { SearchAlert } from './search-alert.model';
import { Offer } from './offers.model';
import { UserRole } from './user.model';
import { CognitoUser } from './user.model';

export interface PropertyDetailData {
  propertyType?: PropertyTypeDto;
  uuid: string;
  streetName: string;
  zipCode: string;
  city: string;
  url: string;
  images: string[];
  matchedProperty: string;
  salePrice: number;
  isScraped: boolean;
}

export interface GroupedMarkerWithoutAddressData {
  coordinates?: CoordinatesTuple;
  propertyDetailData: {
    propertyType?: PropertyTypeDto;
    uuid?: string;
    streetName?: string;
    zipCode?: string;
    city?: string;
    url?: string;
    images?: string[];
    matchedProperty?: string;
    salePrice?: number;
    length?: number;
  };
}

export interface MapDiffs<T = any> {
  added: Map<string, T>;
  updated: Map<string, T>;
  removed: Map<string, boolean>;
}

export interface MarkersDto {
  geometry: PropertyGeometry;
  coordinates?: CoordinatesTuple;
  properties: MarkersPropertiesDto;
  type: string;
  markerWithoutAddress?: GroupedMarkerWithoutAddressData;
}

export interface MarkersPropertiesDto {
  uuid?: string;
  name?: string;
  matchedProperty?: string;
  coordinates: PropertyGeometry;
  propertyType: PropertyTypeDto;
  salePrice?: number;
  createdAt?: string;
  sellingStatus: PropertyStatusDto;
  isScrapedWithoutAddress?: boolean;
  scrapedWithoutAddressGroupedQuantity?: number;
  url?: string;
}

export interface PropertyGeometry extends Geometry {
  type: string;
  coordinates: CoordinatesTuple;
}

export interface FilterOptions {
  AreaSize: number;
  AreaSize2: number;
  PriceDevelopmentFrom: number;
  PriceDevelopmentTo: number;
  PriceFrom: number;
  PriceTo: number;
  PropertyType: PropertyType;
  SellingStatus: SellingStatus;
  pageSize?: number;
}

export interface QueryOptions {
  coordinates: Coordinates;
  zoom: number;
  filterOptions?: FilterOptions;
  page?: number;
}

export interface PropertiesListResult {
  count?: number;
  next: string;
  previous: string;
  results?: Array<InitialPropertyObject>;
  features?: Array<MarkersDto>;
}

export interface PropertiesListFeatures {
  geometry?: PropertyGeometry;
  properties?: InitialPropertyDto;
}

export interface ListingListResult {
  count?: number;
  next: string;
  previous: string;
  features?: Array<PropertiesListFeatures>;
}

export interface ListingDetailsDto {
  city: string;
  country: string;
  county: string;
  images: ImageDto[];
  matchedProperty: string;
  propertyType: PropertyTypeDto;
  salePrice: number;
  estimatedPrice: number;
  showAddress: boolean;
  state: string;
  streetName: string;
  streetNumber: string;
  url: string;
  uuid: string;
  zipCode: string;
}

export interface ListingDetails {
  city: string;
  country: string;
  county: string;
  images: IImage[];
  matchedProperty: string;
  propertyType: PropertyTypeDto;
  salePrice: number;
  showAddress: boolean;
  state: string;
  streetName: string;
  streetNumber: string;
  url: string;
  uuid: string;
  zipCode: string;
}

export interface PropertyStatistic {
  numberOfVisits: number;
  puttedOnFavorite: number;
  receivedOffers: number;
  cityAveragePriceM2: number;
}

export interface PropertiesListCounts {
  all: number;
  withAddress: number;
  withoutAddress: number;
}

export interface SearchAlertsObject {
  count: number;
  results: Array<SearchAlert>;
}

export interface SearchAlertsScheme {
  name?: string;
  coordinates?: [number, number]; // longitude, latitude;
  radius?: number;
  address_line?: string;
  emailFrequency?: string;
  isActive?: boolean;
  city?: string;
  priceMin?: number;
  priceMax?: number;
  livingAreaMin?: number;
  livingAreaMax?: number;
  propertyTypes?: Array<PropertyTypeDto>;
  sellingStatuses?: Array<PropertyStatusDto>;
}

export interface OfferPrice {
  price: number;
  property?: string;
  preferredTotalArea?: number;
}

export interface Offer {
  uuid: string;
  user: CognitoUser;
  property: InitialPropertyDto;
  price: number;
  status: OfferStatus;
  createdAt: Date;
}

export interface OfferData {
  count: number;
  next: string;
  previous: string;
  results: Array<Offer>;
}

export interface MinePropertiesData {
  count: number;
  next: string;
  previous: string;
  results: Array<InitialPropertyObject>;
}

export interface ApartmentData {
  floor: number;
  livingArea?: number;
  userRole?: UserRole;
}

export interface EnergyCertificate {
  certificate: string;
  certificateType: string;
}

export interface ImageResponse {
  image: string;
}

export interface InitialPropertyObject {
  uuid: string;
  coordinates?: PropertyGeometry;
  propertyType: PropertyTypeDto;
  images: Array<string>;
  title?: string;
  description?: string;
  url?: string;
  country: string;
  state: string;
  county: string;
  city: string;
  zipCode: number;
  streetName: string;
  streetNumber: number;
  constructionYear: number;
  renovationYear: number;
  numberOfRooms: number;
  numberOfUnits: number;
  livingArea: number;
  estimatedPrice: number;
  estimatedPriceM2: number;
  salePrice: number;
  isFavorite?: boolean;
  sellingStatus: PropertyStatusDto;
  showAddress?: boolean;
}

export interface InitialPropertyDto {
  uuid: string;
  coordinates?: CoordinatesTuple;
  propertyType: PropertyTypeDto;
  images: Array<string>;
  title?: string;
  description?: string;
  providerId?: string;
  matchedProperty?: string;
  url?: string;
  country: string;
  state: string;
  county: string;
  city: string;
  zipCode: string;
  streetName: string;
  streetNumber: string;
  constructionYear: string;
  renovationYear: string;
  numberOfRooms: number;
  numberOfUnits: number;
  livingArea: number;
  estimatedPrice: number;
  estimatedPriceM2: number;
  salePrice: number;
  isFavorite?: boolean;
  sellingStatus: PropertyStatusDto;
  showAddress?: boolean;
}


export enum PropertyType {
  EFH = 'EFH',
  MFH = 'MFH',
  ETW = 'ETW',
  PropertyTypeWhereReturnZeroProperties = 'PropertyTypeWhereReturnZeroProperties',
  All = 'All',
}

export enum PropertyTypeDto {
  Apartment = 'apartment',
  SingleFamilyHouse = 'single_family_house',
  MultiFamilyHouse = 'multi_family_house',
}

export enum OfferStatus {
  Accepted = 'accepted',
  Declined = 'declined',
  New = 'new',
}

export enum PropertyStatus {
  Idle = 'Idle',
  Active = 'Active',
  NotActiveYet = 'NotActiveYet',
  MakeMeMove = 'MakeMeMove',
  ForSale = 'ForSale',
  All = 'All',
}

export enum PropertyStatusDto {
  Inactive = 'inactive',
  Active = 'active',
  MakeMeMove = 'make_me_move',
  ForSale = 'for_sale',
}

export interface PropertyListingCreationData {
  salePrice: number;
  sellingStatus: PropertyStatusDto;
}

export type PageType = 'start-page' | 'property' | 'favorites';

export type CoordinatesTuple = [number, number];

export enum EmailFrequencyDto {
  Immediately = 'immediately',
  Daily = 'daily',
  Weekly = 'weekly',
  Disable = 'disable',
}

export interface UpdatePropertyValuation {
  livingArea?: number;
  constructionYear?: string;
}

export interface CreateNewCityAlert {
  email: string;
  zip_code: string;
}
