import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { NgxModalStack } from 'ngx-multi-modal';

import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { Offer } from '../../../../core/models/offers.model';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import {
  MarkerDetailMakeMeMoveComponent,
  MakeMeMoveModel,
  CreateOfferPriceResult,
} from '../../../../shared/components/marker-detail-make-me-move/marker-detail-make-me-move.component';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  public _name: string = 'offers';
  public linkToMortgageRequest: string = `/${SHARED_ROUTES_NAMES.MORTGAGE_REQUEST}`;
  public linkToPropertyDetail: string = `/${SHARED_ROUTES_NAMES.PROPERTY_DETAIL}`;
  public pageTitle = `Hier findest du alle deine bisher abgegebenen Gebote auf Immobilien mit Kauf-Chancen.`;

  public isTipHidden: boolean = false;
  public isLoaded: boolean = false;
  public isError:  boolean = false;
  public hintShouldBeClosen: boolean = false;

  public isMakeMeMoveShown: number = null;

  public offers: Offer[] = [];

  public chosenOffer: Offer;
  public activeMarker: ExtendedMarkerModel;
  public offerPropertyCombination: any;

  // @FIXME: Fix bug for Mac OS Safari: class Date can not parse date string
  // with spacing instead 'T' separator; later should check this bug for this.buildingOffers too
  private _formatDate(item: any): any {
    const offerDate = new Date(item.createdAt.replace(' ', 'T'));
    item.OfferFormatedDate = offerDate.toLocaleDateString('tr-TR');
    return item;
  }

  // @FIXME: temporary solution without pagination, add it later
  private async _loadOffersData() {
    try {
      const response: any = await this.propertiesRepositoryService.getOffersDataForUser();

      const itemsPerPage = 10;
      const pages = Math.ceil(response.count / itemsPerPage) - 1; // rest of pages
      const firstOffers = [...response.results];

      const promisesArray: Array<any> = [];
      for (let i: number = 0; i < pages; i++) {
        const query: string = `?page=${i + 2}`; // begin with page #2
        const offersPart$ = this.propertiesRepositoryService.getOffersDataForUser(query);
        promisesArray.push(offersPart$);
      }

      const responses = await Promise.all(promisesArray);
      const results = responses.map(arrItem => arrItem.results);
      const merged = [].concat.apply([], results);
      const restOfOffers = firstOffers.concat.apply(firstOffers, merged);

      this.offers = restOfOffers.map(item => this._formatDate(item));

      this.isLoaded = true;
    } catch (error) {
      this.logger.error('OffersComponent::loadOffersData:Error', error.message);

      this.isLoaded = true;
      this.isError = true;
    }
  }

  private async _getMarker(markerId: string): Promise<ExtendedMarkerModel> {
    return await this.propertiesRepositoryService.getMarkerDetails(markerId);
  }

  private _combineOfferWithProperty(marker: ExtendedMarkerModel, offer: Offer): any {
    const agregation = {} as any;

    agregation.id = offer.uuid;
    agregation.price = offer.price;
    agregation.EstimatedPrice = marker.EstimatedPrice;
    agregation.EstimatedPricePerM2 = 1;       // ?? do we need it for offers
    agregation.area = 1;                      // ?? do we need it for offers

    return agregation;
  }

  private _toggleMakeMeMoveModal(action: string): void {
    const dialogModel: MakeMeMoveModel = {
      model: this.offerPropertyCombination,
      chosenOffer: this.chosenOffer,
      actionWithOfferPrice: action,
      page: this._name
    };
    const modalRef = this.modalService.openFromComponent(MarkerDetailMakeMeMoveComponent);
    Object.assign(modalRef.instance, dialogModel);
    modalRef.result.then(result => {
      if (result === CreateOfferPriceResult.SuccessfullySet) {
        this._loadOffersData();
      }
    }, () => {});
  }

  constructor(
    private propertiesRepositoryService: PropertiesRepositoryService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgxModalStack,
    @Inject(LOGGER) private logger: LoggerService,
  ) {}

  public ngOnInit(): void {
    this._loadOffersData();
  }

  public closeHint(): void {
    this.hintShouldBeClosen = true;
  }

  public closeTip(): void {
    this.isTipHidden = true;
  }

  public goToMortgagePage(): void {
    // @FIXME: later should navigate to another page
    this.router.navigate(['/map'], { queryParamsHandling: 'merge' });
  }

  public async changeOfferPrice(id: number) {
    this.chosenOffer = this.offers[id];
    this.activeMarker = await this._getMarker(this.chosenOffer.property.uuid);
    this.offerPropertyCombination = this._combineOfferWithProperty(this.activeMarker, this.chosenOffer);
    this._toggleMakeMeMoveModal('updateOfferPrice');
  }

  public trackByFn(index, item): number {
    return index;
  }

  public get offersIsEmpty(): boolean {
    return  this.offers && this.offers.length === 0;
  }
}
