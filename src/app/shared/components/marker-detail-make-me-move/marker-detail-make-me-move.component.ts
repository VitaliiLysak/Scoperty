import { Component, Inject, OnInit, } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgxActiveModal, NgxModalStack } from 'ngx-multi-modal';

import { StateManagerService } from '../../../core/services/state-manager.service';
import { AuthService } from '../../../core/services/auth.service';
import { PropertiesRepositoryService } from '../../../core/services/properties-repository.service';
import { isSmallMobileDevice$ } from '../../utils/responsive.util';
import { markFormGroupControlsAsDirty } from '../../../shared/utils/form-group.util';
import { InputTextMask } from '../../../core/models/input-text-mask.model';
import { SQUARE_INPUT_MASK } from '../../../shared/utils/square-input-mask.util';
import { AMOUNT_INPUT_MASK } from '../../../shared/utils/amount-input-mask.util';
import { getNumberFromSquareString, getNumberFromString } from '../../../shared/utils/number-from-string.util';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { LOGGER } from '../../../core/services/logger/logger.provider';
import { ShowSignupModalService } from '../../../core/services/show-signup-modal.service';
import { AnalyticsService } from '../../../core/services/analytics/analytics.service';
import { ExtendedMarkerModel } from '../../../core/models/extended-marker.model';
import { Offer } from '../../../core/models/offers.model';
import { OfferPrice } from '../../../core/models/properties-repository.model';
import { Aggregation } from '../../../features/profile/pages/profile-favorites/profile-favorites.component';
import { isNullOrUndefined } from '../../../shared/utils/null-or-undefined.util';
import { SHARED_ROUTES_NAMES } from '../../../app.constants';

export interface MakeMeMoveModel {
  model: ExtendedMarkerModel | Aggregation;
  actionWithOfferPrice: string;
  chosenOffer: Offer;
  page: string;
}

interface OfferToBackEnd {
  price: number;
  property?: string;
  preferredTotalArea: number;
}

export enum CreateOfferPriceResult {
  SuccessfullySet,
  DoesNotSet
}

export type ActionWithOfferPrice = 'createOfferPrice' | 'updateOfferPrice';

@Component({
  selector: 'app-marker-detail-make-me-move',
  templateUrl: './marker-detail-make-me-move.component.html',
  styleUrls: ['./marker-detail-make-me-move.component.css'],
})

export class MarkerDetailMakeMeMoveComponent implements MakeMeMoveModel, OnInit {
  public linkToBroker: string = SHARED_ROUTES_NAMES.BROKER;
  public model: ExtendedMarkerModel | Aggregation = null;
  public step: string = 'firstStep';
  public actionWithOfferPrice: ActionWithOfferPrice;
  public chosenOffer: Offer = null;
  public page: string = null;
  public name: string = 'marker-detail-make-me-move';
  isSmallMobileDevice$ = isSmallMobileDevice$;
  public secondStepTitle: string = null;
  public secondStepText: string = null;
  public offerForm: FormGroup = null;
  public priceMask: InputTextMask = AMOUNT_INPUT_MASK(8);
  public squareMask: InputTextMask = SQUARE_INPUT_MASK;
  public offerDescriptions: Array<string> = [
    'Gebe ein Gebot ab mit deiner Wunschfläche und deinem Budget',
    'Dein Gebot geht den Eigentümern in diesem	Haus zu, sobald sie sich registrieren',
    'Ist es für sie attraktiv, melden sie sich bei dir',
  ];
  public result: CreateOfferPriceResult = CreateOfferPriceResult.DoesNotSet;

  public get isTipShown(): boolean {
    return this.stateManagerService.isTipShown;
  }

  public get square(): FormControl {
    return this.offerForm.get('square') as FormControl;
  }

  public get price(): FormControl {
    return this.offerForm.get('price') as FormControl;
  }

  public initForm(): void {
    this.offerForm = new FormGroup({
      price: new FormControl('', [Validators.required])
    });

    if (this.model.isPropertyOfTypeMFH) {
      this.offerForm.addControl('square', new FormControl('', [Validators.required]));
    }
  }

  private async setOfferPrice(price: number, preferredTotalArea: number): Promise<void> {
    if (this.actionWithOfferPrice === 'updateOfferPrice') {
      await this.patchOfferPrice(price, this.chosenOffer.preferredTotalArea);
    } else {
      await this.createOfferPrice(price, preferredTotalArea);
    }
    this.result = CreateOfferPriceResult.SuccessfullySet;
  }

  private async createOfferPrice(price: number, preferredTotalArea: number): Promise<void> {
    const data: OfferToBackEnd = { price, preferredTotalArea, property: this.model.id };
    try {
      await this.propertiesRepositoryService.createOfferPrice(data);
      this.step = 'secondStep';
    } catch (error) {
      this.logger.error('PropertyDetailComponent::createOfferPrice', error);
      this.step = '';
      this.close();
    }
  }

  private async patchOfferPrice(price: number, preferredTotalArea: number): Promise<void> {
    const data: OfferToBackEnd = { price, preferredTotalArea };

    try {
      await this.propertiesRepositoryService.setOfferPrice(this.chosenOffer.uuid, data);
    } catch (error) {
      this.logger.error('PropertyDetailComponent::patchOfferPrice', error);
    }
  }

  constructor(
    public stateManagerService: StateManagerService,
    private modalService: NgxModalStack,
    private activeModal: NgxActiveModal,
    private propertiesRepositoryService: PropertiesRepositoryService,
    private authService: AuthService,
    private showSignupModalService: ShowSignupModalService,
    private analyticsService: AnalyticsService,
    @Inject(LOGGER) private logger: LoggerService,
  ) { }

  public ngOnInit(): void {
    this.initForm();

    this.secondStepTitle = this.page === 'offers' ? 'Gebot geändert!' : 'Glückwunsch!';
    this.secondStepText =
      this.page === 'offers' ? 'Der Eigentümer hat dein neues Gebot erhalten.' : 'Der Eigentümer hat dein Gebot erhalten.';
  }

  public closeTip() {
    this.stateManagerService.isTipShown = false;
  }

  public async saveOfferPrice(): Promise<void> {
    if (this.offerForm.invalid) {
      markFormGroupControlsAsDirty(this.offerForm);
      return;
    }

    if (this.model instanceof ExtendedMarkerModel && this.model.isOwner) {
      return;
    }

    const { square, price } = this.offerForm.value;
    const parsedSquare = isNullOrUndefined(square) ? null : getNumberFromSquareString(square);
    const parsedPrice = getNumberFromString(price);

    if (this.authService.isUserLoggedIn()) {
      this.analyticsService.triggerFormSubmissionSuccess('bidForm', 'logged-user');
      await this.setOfferPrice(parsedPrice, parsedSquare);
      this.step = 'secondStep';
    } else {
      this.analyticsService.triggerFormSubmissionSuccess('bidForm', 'not-logged-in-user');
      const saveOfferData: OfferPrice = {
        property: this.model.id,
        price: parsedPrice,
        preferredTotalArea: parsedSquare,
      };
      this.authService.setCreateOfferSignupInfo(saveOfferData);
      this.close();
      this.showSignupModalService.showSignup();
    }
  }

  public close(): void {
    this.activeModal.close(this.result);
  }
}
