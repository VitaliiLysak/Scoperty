import {
  PropertyTypeDto,
  PropertyStatusDto,
} from '../properties-repository.model';

export enum ProcessType {
  AddFavorite = 'add_favorite',
  CreateSearchAlerts = 'create_search_alerts',
  CreateOffer = 'create_offer',
  ClaimProperty = 'claim_property',
  ClaimApartment = 'claim_apartment',
  ContactOwner = 'contact_owner',
  OpenMarketAttractivity = 'open_market_attractivity',
}

export type SignupInfo =
  | AddFavoriteSignupInfo
  | CreateSearchAlertsSignupInfo
  | CreateOfferSignupInfo
  | ClaimPropertySignupInfo
  | ClaimApartmentSignupInfo
  | ContactOwnerSignupInfo
  | OpenMarketAttractivitySignupInfo;

export type SignupInfoPayloadDto =
  | AddFavoriteSignupInfoPayloadDto
  | CreateSearchAlertsSignupInfoPayloadDto
  | CreateOfferSignupInfoPayloadDto
  | ClaimPropertySignupInfoPayloadDto
  | ClaimApartmentSignupInfoPayloadDto
  | ContactOwnerSignupInfoPayloadDto
  | OpenMarketAttractivityPayloadDto;

export class CreateSearchAlertsSignupInfo {
  constructor(
    public name: string,
    public coordinates: [number, number], // longitude, latitude;
    public radius: number,
    public address_line: string,
    public city: string,
    public priceMin: number,
    public priceMax: number,
    public livingAreaMin: number,
    public livingAreaMax: number,
    public propertyTypes: Array<PropertyTypeDto>,
    public sellingStatuses: Array<PropertyStatusDto>,
  ) {
  }
}

export class CreateOfferSignupInfo {
  constructor(
    public property: string,
    public price: number,
    public preferredTotalArea: number,
  ) {
  }
}

export class ClaimPropertySignupInfo {
  constructor(
    public propertyId: string,
    public livingArea?: string,
    public constructionYear?: string,
    ) {
  }
}

export class ClaimApartmentSignupInfo {
  constructor(
    public propertyId: string,
    public floor?: string,
    public floorLocation?: string,
  ) {
  }
}

export class AddFavoriteSignupInfo {
  constructor(public propertyId: string) {
  }
}

export class ContactOwnerSignupInfo {
  constructor(public propertyId: string) {
  }
}

export class OpenMarketAttractivitySignupInfo {
  constructor(public propertyId: string) {
  }
}

export interface SignupInfoDto {
  processType: ProcessType;
  payload: SignupInfoPayloadDto;
}

export interface AddFavoriteSignupInfoPayloadDto {
  propertyId: string;
}

export interface CreateSearchAlertsSignupInfoPayloadDto {
  name: string;
  coordinates?: [number, number]; // longitude, latitude;
  radius?: number;
  address_line?: string;
  city: string;
  priceMin: number;
  priceMax: number;
  livingAreaMin: number;
  livingAreaMax: number;
  propertyTypes: Array<PropertyTypeDto>;
  sellingStatuses: Array<PropertyStatusDto>;
}

export interface CreateOfferSignupInfoPayloadDto {
  property: string;
  price: number;
  preferredTotalArea: number;
}

export interface ClaimPropertySignupInfoPayloadDto {
  propertyId: string;
  livingArea?: string;
  constructionYear?: string;
}

export interface ClaimApartmentSignupInfoPayloadDto {
  propertyId: string;
  floor?: string;
  floorLocation?: string;
}

export interface ContactOwnerSignupInfoPayloadDto {
  propertyId: string;
}

export interface OpenMarketAttractivityPayloadDto {
  propertyId: string;
}
