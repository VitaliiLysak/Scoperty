import { DecimalPipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { NgxModalStack } from 'ngx-multi-modal';

import { FavoriteModel } from '../../../../core/models/favorite-estate.model';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { StateManagerService } from '../../../../core/services/state-manager.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import {
  MarkerDetailMakeMeMoveComponent,
  MakeMeMoveModel,
} from '../../../../shared/components/marker-detail-make-me-move/marker-detail-make-me-move.component';
import { templateStatusToFrontend } from '../../../../shared/utils/deserializator.util';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import { Offer } from '../../../../core/models/offers.model';
import { PropertiesListResult, OfferData } from '../../../../core/models/properties-repository.model';
import { splitMarkersIntoGroups } from '../../../../shared/utils/markers-group-splitter';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';

type OfferPriceType = 'updateOfferPrice' | 'createOfferPrice';

export interface Aggregation {
  id: string;
  price: number;
  EstimatedPrice: number;
  EstimatedPricePerM2: number;
  area: number;
  isPropertyOfTypeMFH: boolean;
}

@Component({
  selector: 'app-profile-favorites',
  templateUrl: './profile-favorites.component.html',
  styleUrls: ['./profile-favorites.component.css']
})
export class ProfilesFavoritesComponent implements OnInit {
  public isTipHidden: boolean = false;
  public dataIsGot: boolean = false;
  public isCarouselLoaded: boolean = false;

  public _name: string = 'profile-favorites';

  linkToMortgageRequest: string[] = [ `/${ SHARED_ROUTES_NAMES.MORTGAGE_REQUEST }` ];

  public previousOffer: Offer = null;
  public favorites: Array<FavoriteModel> = [];
  public favoriteCombinedObj: Aggregation = null;
  public markers: Array<Array<ExtendedMarkerModel>> = [];
  public sliderTitle: string = 'Neueste Immobilien die zum Verkauf stehen';

  public get allDataIsLoaded(): boolean {
    return this.dataIsGot && this.isCarouselLoaded && this.favorites && this.favorites.length === 0;
  }

  public get favoritesIsLoaded(): boolean {
    return this.favorites && this.favorites.length > 0;
  }

  // @FIXME: check missing properties from API
  private splitMarkersIntoGroups(fav: FavoriteModel): FavoriteModel {
    const street = isNullOrUndefined(fav.streetNumber) && isNullOrUndefined(fav.streetName)
      ? ''
      : `${fav.streetName} ${fav.streetNumber}, `;
    fav.zipCode = isNullOrUndefined(fav.zipCode) ? '' : `${fav.zipCode} `;
    fav.fullAddress = `${street}${fav.zipCode}${fav.city || ''}`;
    fav.updatedSellingStatus = templateStatusToFrontend(fav.sellingStatus);
    fav.receiveNotifications = false;              // @FIXME: add logic after API updates

    fav.realtyProperties = [];

    fav.realtyProperties.push(fav.buildingType);

    if (fav.roomsNumber != null) {
      fav.realtyProperties.push(`${fav.roomsNumber} Zi.`);
    }

    if (fav.livingArea != null) {
      const modifiedLifingArea = `${ this.decimalPipe.transform(fav.livingArea) } m²`;
      fav.realtyProperties.push(modifiedLifingArea);
    }

    if (fav.constructionYear != null) {
      const yearOfBuild = `BJ. ${fav.constructionYear.split('-')[0]}`;
      fav.realtyProperties.push(yearOfBuild);
    }

    return fav;
  }

  private combineOfferWithProperty(property: FavoriteModel): Aggregation {
    const aggregation = {} as Aggregation;

    aggregation.id = property.uuid;
    aggregation.price = property.estimatedPrice;
    aggregation.EstimatedPrice = aggregation.price;
    aggregation.EstimatedPricePerM2 = 1;           // ?? do we need it for property
    aggregation.area = 1;                          // ?? do we need it for property
    aggregation.isPropertyOfTypeMFH = property.propertyType === 'MFH';

    return aggregation;
  }

  // @FIXME: temporarily solution without pagination, fix later
  private async loadProfileData(url?: string): Promise<void> {
    try {
      let response: PropertiesListResult = null;

      if (url) response = await this.propertiesRepository.getFavoritePropertiesByUrl(url);
      else response = await this.propertiesRepository.getFavoriteProperties();

      if (response.next) this.loadProfileData(response.next);

      response.results.forEach(favorite => {
        this.favorites.push(this.splitMarkersIntoGroups(new FavoriteModel(favorite)));
      });

      if (!this.dataIsGot) this.dataIsGot = true;
    } catch (error) {
      this.dataIsGot = true;
      this.logger.error('ProfilePage::loadProfileData:Error', error);
    }
  }

  private async loadMarkersList(): Promise<void> {
    try {
      const extendedMarkersList = await this.propertiesRepository.getDataByUrl('favorites');
      this.markers = splitMarkersIntoGroups(extendedMarkersList);
      this.isCarouselLoaded = (this.markers != null && this.markers.length > 0);
    } catch (error) {
      this.isCarouselLoaded = true;
      this.logger.error('ProfilesFavoritesComponent:loadMarkersList:error', error);
    }
  }

  private async toggleMakeMeMoveModal(): Promise<void> {
    const action: OfferPriceType = await this.handleChangedPrice();
    const dialogModel: MakeMeMoveModel = {
      model: this.favoriteCombinedObj,
      chosenOffer: this.previousOffer,
      actionWithOfferPrice: action,
      page: this._name
    };
    const modalRef = this.modalService.openFromComponent(MarkerDetailMakeMeMoveComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  constructor(
    private decimalPipe: DecimalPipe,
    private router: Router,
    private stateManagerService: StateManagerService,
    private propertiesRepository: PropertiesRepositoryService,
    private modalService: NgxModalStack,
    @Inject(LOGGER) private logger: LoggerService,
  ) {}

  public async ngOnInit(): Promise<void> {
    await this.loadProfileData();
    await this.loadMarkersList();

    this.stateManagerService.isTipShown = false;
  }

  public closeTip(): void {
    this.isTipHidden = true;
  }

  public async changeOfferPrice(id: string): Promise<void> {
    const currentProperty = this.favorites.find(({ uuid }) => uuid === id);
    this.favoriteCombinedObj = this.combineOfferWithProperty(currentProperty);
    await this.toggleMakeMeMoveModal();
  }

  public async handleChangedPrice(): Promise<OfferPriceType> {
    const uuid: string = this.favoriteCombinedObj.id;
    try {
      const offers: OfferData = await this.propertiesRepository.getOffersDataForUser();
      this.previousOffer = offers.results.find(item => item.property.uuid === uuid);

      if (this.previousOffer) return 'updateOfferPrice';
      else return 'createOfferPrice';
    } catch (error) {
      this.logger.error('ProfilesFavoritesComponent::handleChangedPrice:error', error);
    }
  }

  public trackFavoritesByUiid(index: number, item: FavoriteModel): string {
    return item.uuid;
  }
}
