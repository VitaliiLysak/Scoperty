import { PropertyType } from '../../core/models/properties-repository.model';
import { statusToFrontEnd, propTypeToFrontEnd } from '../../shared/utils/deserializator.util';
import { isEmptyArray } from '../../shared/utils/empty-array.util';
import { isEmptyString } from '../../shared/utils/empty-string.util';

export interface FavoriteImage {
  uuid: string;
  image: string;
  imageThumbnail: string;
}

export interface IFavorite {
  uuid:             string;
  salePrice:        number;
  estimatedPrice:   number;
  estimatedPriceM2: number;
  offerPrice:       number;
  sellingStatus:    string;
  estateImgUrl:     string;
  propertyType:     PropertyType;
  country:          string; // Default : "DE"
  state:            string;
  county:           string;
  city:             string;
  streetName:       string;
  streetNumber:     string;
  zipCode:          string;
  roomsNumber:      number;
  floor:            number;
  livingArea:       number;
  images:           Array<FavoriteImage>;
  constructionYear: string;

  realtyProperties:         Array<string>;
  fullAddress?:             string;
  updatedSellingStatus?:    string;
  receiveNotifications?:    boolean; // @FIXME: check API
}

export class FavoriteModel implements IFavorite {
  uuid:             string;
  salePrice:        number;
  estimatedPrice:   number;
  estimatedPriceM2: number;
  offerPrice:       number;
  sellingStatus:    string;
  estateImgUrl:     string;
  srcImg:           string;
  propertyType:     PropertyType;
  country:          string;
  state:            string;
  county:           string;
  city:             string;
  streetName:       string;
  streetNumber:     string;
  zipCode:          string;
  roomsNumber:      number;
  floor:            number;
  livingArea:       number;
  images:           Array<FavoriteImage>;
  constructionYear: string;
  favorite: boolean;
  showAddress: boolean;
  title: string;

  realtyProperties:         Array<string>;
  fullAddress?:             string;
  updatedSellingStatus?:    string;
  receiveNotifications?:    boolean; // @FIXME: check API

  get isPropertyOfTypeEFH(): boolean {
    return this.propertyType === PropertyType.EFH;
  }

  get isPropertyOfTypeMFH(): boolean {
    return this.propertyType === PropertyType.MFH;
  }

  get isPropertyOfTypeETW(): boolean {
    return this.propertyType === PropertyType.ETW;
  }

  get isFavourite(): boolean {
    return this.favorite;
  }

  get hasSalePrice(): boolean {
    return this.salePrice != null;
  }

  get hasTitle(): boolean {
    return !isEmptyString(this.title);
  }

  get hasImage(): boolean {
    if (isEmptyArray(this.images) || isEmptyString(this.images[0].image)) {
      return false;
    }

    return true;
  }

  get imageLink(): string {
    return this.images[0] ? this.images[0].image : '';
  }

  get buildingType(): string {
    if (this.isPropertyOfTypeEFH) return 'Haus';
    else if (this.isPropertyOfTypeMFH) return 'Mehrfamilienhaus';
    else return 'Wohnung';
  }

  get isForSale(): boolean {
    return this.sellingStatus === 'ForSale';
  }

  get isMakeMeMove(): boolean {
    return this.sellingStatus === 'MakeMeMove';
  }

  get isIdle(): boolean {
    return this.sellingStatus === 'Idle';
  }

  get isActive(): boolean {
    return this.sellingStatus === 'Active';
  }

  get isNotActiveYet(): boolean {
    return this.sellingStatus === 'NotActiveYet';
  }

  constructor(data: any) {
    this.deserialize(data);
  }

  private deserialize(data: any): void {
    this.uuid             = data.uuid;
    this.salePrice        = data.salePrice;
    this.estimatedPrice   = data.estimatedPrice;
    this.estimatedPriceM2 = data.estimatedPriceM2;
    this.offerPrice       = data.offerPrice || null;
    this.sellingStatus    = statusToFrontEnd(data);
    this.propertyType     = propTypeToFrontEnd(data.propertyType);
    this.estateImgUrl     = data.estateImgUrl;
    this.country          = data.country;
    this.state            = data.state;
    this.county           = data.county;
    this.city             = data.city;
    this.streetName       = data.streetName;
    this.streetNumber     = data.streetNumber;
    this.zipCode          = data.zipCode;
    this.roomsNumber      = data.numberOfRooms;
    this.floor            = data.floor;
    this.livingArea       = data.livingArea;
    this.images           = data.images;
    this.constructionYear = data.constructionYear;
    this.favorite        = true;
    this.showAddress = data.showAddress;
    this.title = data.title;
  }
}
