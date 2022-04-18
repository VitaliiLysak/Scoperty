import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';

import { NgxModalStack } from 'ngx-multi-modal';
import { Observable, Subscription, } from 'rxjs';
import { filter, take, } from 'rxjs/operators';

import { AddApartmentResult } from '../../components/property-detail-add-apartment/property-detail-add-apartment.component';
import { PropertyDetailsService, PropertyDetailsTab, } from '../../services/property-details.service';
import {
  MarkerDetailGalleryViewWindowComponent,
  MarkerDetailGalleryViewWindowModel,
} from '../../../../shared/components/marker-detail-gallery/marker-detail-gallery-view-window/marker-detail-gallery-view-window.component';
import {
  CreateOfferPriceResult,
  MakeMeMoveModel,
  MarkerDetailMakeMeMoveComponent,
} from '../../../../shared/components/marker-detail-make-me-move/marker-detail-make-me-move.component';
import { AuthService } from '../../../../core/services/auth.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { StateManagerService } from '../../../../core/services/state-manager.service';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { WINDOW } from '../../../../core/services/window.provider';
import { OfferData } from '../../../../core/models/properties-repository.model';
import { Offer } from '../../../../core/models/offers.model';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { ValuateProperty } from '../../../../shared/components/valuate-property/valuate-property.model';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import { ShowSignupModalService } from '../../../../core/services/show-signup-modal.service';
import { ShowLoginModalService } from '../../../../core/services/show-login-modal.service';
import { isEmptyArray } from '../../../../shared/utils/empty-array.util';
import { isEmptyString } from '../../../../shared/utils/empty-string.util';
import { QueryParamsService, TrackingQueryParams, QueryParamsFilters } from '../../../../core/services/query-params.service';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';

interface Aggregation {
  id: string;
  price: number;
  EstimatedPrice: number;
  EstimatedPricePerM2: number;
  area: number;
  isPropertyOfTypeMFH: boolean;
}

const sellerLandings = [
  SHARED_ROUTES_NAMES.PROPERTY_VALUATION,
  SHARED_ROUTES_NAMES.PROPERTY_VALUATION_DUPLICATE,
  SHARED_ROUTES_NAMES.SELL_APARTMENT,
  SHARED_ROUTES_NAMES.SELL_HOUSE,
  SHARED_ROUTES_NAMES.SELL_PROPERTY,
  SHARED_ROUTES_NAMES.ADVERTISE_PROPERTY,
  SHARED_ROUTES_NAMES.SELL
];

@Component({
  selector: 'app-property-detail-page',
  templateUrl: './property-detail.component.html',
  styleUrls: [
    './property-detail.component.css',
  ],
})
export class PropertyDetailComponent implements OnInit, AfterViewChecked, OnDestroy, AfterViewInit {
  public _name: string = 'property-detail';

  public step: string = '';
  public offerPrice: number = null;
  // 56 - This is height of header component.
  public displayHeight: string = `${this.window.document.body.clientHeight - 56}px`;

  public isLoad: boolean = false;
  public userNotAuthorized: boolean = true;

  public markers: Array<Array<ExtendedMarkerModel>> = [];
  public offerPropertyCombination: Aggregation = null;

  public chosenOffer: Offer;
  public activeMarker: ExtendedMarkerModel = null;
  public sliderTitle: string = 'Neueste Immobilien die zum Verkauf stehen';

  private subscriptions: Subscription = new Subscription();

  private userLoggedIn$: Observable<boolean> = this.authService.loggedIn$.pipe(
    filter(loggedIn => loggedIn === true),
  );

  public get isOverview$(): Observable<boolean> {
    return this.propertyDetailsService.isOverview$;
  }

  public get isMarketView$(): Observable<boolean> {
    return this.propertyDetailsService.isMarketView$;
  }

  public get isMarkersListNotEmpty(): boolean {
    return this.markers.length > 0;
  }

  private async loadMarkersList(): Promise<void> {
    try {
      this.markers = await this.propertiesRepositoryService.getPropertyListings(this.activeMarker.id);
      this.isLoad = !isEmptyArray(this.markers);
    } catch (error) {
      this.isLoad = true;
      this.logger.error('PropertyDetailComponent::loadMarkersData', error);
    }
  }

  private async updateMarker(): Promise<void> {
    await this.propertiesRepositoryService.reloadProperty(this.activeMarker);
  }

  private async loadOffersData(): Promise<void> {
    if (this.userNotAuthorized) {
      this.offerPrice = null;
      this.offerPropertyCombination = null;
    } else {
      try {
        const response: OfferData = await this.propertiesRepositoryService.getOffersDataForUser();
        if (response && response.results) {
          this.chosenOffer = response.results.find(item => item.property && item.property.uuid === this.activeMarker.id);
          if (this.chosenOffer) {
            this.offerPropertyCombination = this.combineOfferWithProperty(this.activeMarker, this.chosenOffer);
            this.offerPrice = this.chosenOffer.price;
          }
        }
      } catch (error) {
        this.logger.error('PropertyDetailPage::loadOffersData:Error', error.message);
      }
    }
  }

  private setPropertyVisited(): void {
    if (isNullOrUndefined(this.activeMarker) || isEmptyString(this.activeMarker.id)) {
      return;
    }

    this.propertiesRepositoryService.setPropertyVisited(this.activeMarker.id);
  }

  private async getPropertyInfo(): Promise<void> {
    const propertyId: string = this.activatedRoute.snapshot.paramMap.get('id');
    this.propertyDetailsService.getPropertyInfo(propertyId);
  }

  private handlePropertyChanges(): void {
    const subscription = this.propertyDetailsService.property$.subscribe(async (property: ExtendedMarkerModel) => {
      this.activeMarker = property;
      this.stateManagerService.activeMarker = this.activeMarker;

      if (!isNullOrUndefined(this.activeMarker)) {
        await this.loadMarkersList();
      }

      this.userNotAuthorized = !this.authService.isUserLoggedIn();
      if (!this.userNotAuthorized && !isNullOrUndefined(this.activeMarker)) {
        await this.loadOffersData();
      }
    });
    this.subscriptions.add(subscription);
  }

  private handleAuthChanges(): void {
    const subscription = this.authService.events.subscribe(() => {
      this.userNotAuthorized = !this.authService.isUserLoggedIn();

      if (isNullOrUndefined(this.activeMarker) || isEmptyString(this.activeMarker.id)) {
        return;
      }

      this.updateMarker();
      this.loadOffersData();
    });
    this.subscriptions.add(subscription);
  }

  private combineOfferWithProperty(marker: ExtendedMarkerModel, offer: Offer): Aggregation {
    const aggregation = {} as Aggregation;

    aggregation.id = offer.uuid;
    aggregation.price = offer.price;
    aggregation.EstimatedPrice = marker.EstimatedPrice;
    aggregation.EstimatedPricePerM2 = 1;       // ?? do we need it for offers
    aggregation.area = 1;                      // ?? do we need it for offers

    return aggregation;
  }

  constructor(
    private modalService: NgxModalStack,
    private authService: AuthService,
    private propertyDetailsService: PropertyDetailsService,
    private propertiesRepositoryService: PropertiesRepositoryService,
    private stateManagerService: StateManagerService,
    private queryParamsService: QueryParamsService,
    private changeDetectorRef: ChangeDetectorRef,
    private showSignupModalService: ShowSignupModalService,
    private showLoginModalService: ShowLoginModalService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(LOGGER) private logger: LoggerService,
    @Inject(WINDOW) private window: Window,
  ) {
  }

  public ngOnInit(): void {
    this.handlePropertyChanges();
    this.handleAuthChanges();
    this.setPropertyVisited();
    this.getPropertyInfo();
    this.handleTrackingParams();
  }

  public ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.queryParamsService.changeQueryParamsViaAngularRouter({
        property_type: null,
        selling_status: null
      });
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public handleTrackingParams() {
    this.queryParamsService.filters$
      .subscribe((params: QueryParamsFilters) => {
        if (
          !isNullOrUndefined(params) &&
          params.sellingStatus === 'MakeMeMove' &&
          params.propertyType === 'MFH'
        ) {
          return this.activateSection('overview');
        }
      });

    this.queryParamsService.trackingQueryParams$
      .subscribe((params: TrackingQueryParams) => {
        if (
          params.last_land &&
          sellerLandings.includes(params.last_land)
        ) {
          this.activateSection('marketView');
        }
      });
  }

  makeMeOwner(result?: ValuateProperty): void {
    const property: ExtendedMarkerModel = this.activeMarker;
    const { livingArea, constructionYear } = !isNullOrUndefined(result) ? result : {} as ValuateProperty;
    if (!this.authService.isUserLoggedIn()) {
      this.authService.setClaimPropertySignupInfo(property.id, livingArea, constructionYear);
      this.showSignupModalService.showSignup();
      this.userLoggedIn$.pipe(take(1))
        .subscribe(() => {
          this.openMakeMeOwnerModal(livingArea, constructionYear);
        });

      return;
    }

    this.openMakeMeOwnerModal(livingArea, constructionYear);
  }

  public addApartment(result: AddApartmentResult): void {
    const { floor, livingArea } = result;
    if (!this.authService.isUserLoggedIn()) {
      this.authService.setClaimApartmentSignupInfo(this.activeMarker.id, floor, livingArea);
      this.showSignupModalService.showSignup();
      this.userLoggedIn$.pipe(take(1))
        .subscribe(() => {
          this.openAddApartmentModal(floor, livingArea);
        });

      return;
    }

    this.openAddApartmentModal(floor, livingArea);
  }

  openMakeMeOwnerModal(livingArea: string, constructionYear: string): void {
    this.propertyDetailsService.openMakeMeOwnerModal(livingArea, constructionYear);
  }

  openAddApartmentModal(floor: string, livingArea: string): void {
    this.propertyDetailsService.openAddApartmentModal(floor, livingArea);
  }

  public openSlideshow(): void {
    const activeImageIndex: number = 0;
    const images: string[] = this.activeMarker.images;
    const dialogModel: MarkerDetailGalleryViewWindowModel = {images, activeImageIndex};
    const modalRef = this.modalService.openFromComponent(MarkerDetailGalleryViewWindowComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  public toggleMakeMeMoveModal(action: string): void {
    const dialogModel: MakeMeMoveModel = {
      model: this.offerPropertyCombination || this.activeMarker,
      chosenOffer: this.chosenOffer,
      actionWithOfferPrice: action,
      page: this._name
    };
    const modalRef = this.modalService.openFromComponent(MarkerDetailMakeMeMoveComponent);
    Object.assign(modalRef.instance, dialogModel);
    modalRef.result.then(result => {
      if (result === CreateOfferPriceResult.SuccessfullySet) {
        this.loadOffersData();
      }
    }, () => {});
  }

  public openContactMeForm(): void {
    if (!this.authService.isUserLoggedIn()) {
      this.authService.setContactOwnerSignupInfo(this.activeMarker.id);
      this.showSignupModalService.showSignup();
    } else {
      this.propertyDetailsService.openContactOwnerModal();
    }
  }

  private activateSection(section: PropertyDetailsTab): void {
    this.propertyDetailsService.setActiveTab(section);
  }
}
