import { DOCUMENT } from '@angular/common';
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  NgxActiveModal,
  NgxModalStack,
} from 'ngx-multi-modal';

import {
  ForgotPasswordComponent,
  ForgotPasswordModel,
} from '../../../forgot-password/components/forgot-password/forgot-password.component';
import {
  AuthService,
  AuthException,
} from '../../../../core/services/auth.service';
import {
  ConfirmPasswordComponent,
  ConfirmPasswordModel,
} from '../../../forgot-password/components/confirm-password/confirm-password.component';
import { PropertyDetailsService } from '../../../property-detail/services/property-details.service';
import { CognitoUser } from '../../../../core/models/user.model';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import {
  AddFavoriteSignupInfo,
  ClaimApartmentSignupInfo,
  ClaimPropertySignupInfo,
  CreateOfferSignupInfo,
  CreateSearchAlertsSignupInfo,
  ContactOwnerSignupInfo,
  OpenMarketAttractivitySignupInfo,
  SignupInfo,
} from '../../../../core/models/signup-info/signup-info.model';
import {
  PASSWORD_REQUIRED,
  SHARED_ROUTES_NAMES,
  AuthError,
} from '../../../../app.constants';
import { EmailValidators } from '../../../../shared/validators/email.validator';
import { markFormGroupControlsAsDirty } from '../../../../shared/utils/form-group.util';
import { isEmptyString } from '../../../../shared/utils/empty-string.util';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
  ConfirmationDialogType,
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {
  CommonErrorComponent,
  CommonErrorDialogModel
} from '../../../../shared/components/common-error/common-error.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { LOCAL_STORAGE } from '../../../../core/services/local-storage.provider';
import { ScopertyPlusAdService } from '../../../../core/services/scoperty-plus-ad.service';
import { take } from 'rxjs/operators';

export enum LoginResultType {
  SuccessLogin = 'SuccessLogin',
  OpenRegistration = 'OpenRegistration',
}

const USER_EMAIL: string = 'userEmailCopyForAutofill';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
  ],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('emailInput') emailInput: InputComponent;

  public name: string = 'login';
  public confirmationLogin: boolean = false;
  public user = null;
  public isMobileDevice: boolean = this.document.body.clientWidth < 768;
  public loginForm: FormGroup;
  public currentError: AuthError;
  public AuthError: typeof AuthError = AuthError;

  public get isNeedToShowMessage(): boolean {
    return this.isConfirmUserPath || !isNullOrUndefined(this.currentError);
  }

  public get isConfirmUserPath(): boolean {
    return new RegExp(`${ SHARED_ROUTES_NAMES.CONFIRMUSER }`).test(this.router.url);
  }

  public get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  public get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  constructor(
    private activeModal: NgxActiveModal,
    private modalService: NgxModalStack,
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private propertyDetailsService: PropertyDetailsService,
    private propertiesRepositoryService: PropertiesRepositoryService,
    private router: Router,
    private scopertyPlusAdService: ScopertyPlusAdService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOGGER) private logger: LoggerService,
    @Inject(LOCAL_STORAGE) private localStorage: Storage,
  ) {
  }

  public ngOnInit(): void {
    this.authService.clearSignupState();
    this.configureLoginForm();
    this.autoFillEmailInput();
  }

  public ngAfterViewInit(): void {
    this.emailInput.focus();
  }

  public autoFillEmailInput(): void {
    const userEmail: string = JSON.parse(this.localStorage.getItem(USER_EMAIL));
    this.email.setValue(userEmail);
    this.localStorage.removeItem(USER_EMAIL);
  }

  public async login(): Promise<void> {
    if (this.loginForm.invalid) {
      markFormGroupControlsAsDirty(this.loginForm);
      return;
    }

    try {
      const { email, password } = this.loginForm.value;
      const user: CognitoUser = await this.authService.userAuth(email.toLowerCase(), password);
      if (user.challengeName === PASSWORD_REQUIRED) {
        this.showSetPasswordForInvitedUser();
        return;
      }

      this.authService.send('login');
      this.activeModal.close(LoginResultType.SuccessLogin);
      this.analyticsService.triggerFormSubmissionSuccess('loginForm', 'reqular-login');
      await this.continueProcessIfNeeded();

      this.scopertyPlusAdService.scopertyPlusOnboardingOpenedState$
        .pipe(take(1))
        .subscribe(state => {
          if (!state && this.scopertyPlusAdService.onboardingNeedsToBeOpened) {
            this.scopertyPlusAdService.openScopertyOnBoard();
          }
        });
    } catch (error) {
      if (error.code === AuthException.UserNotFound) {
        this.currentError = AuthError.UserNotFound;
      } else if (error.code === AuthException.UserNotConfirmed) {
        this.currentError = AuthError.UnconfirmedEmail;
      } else if (error.code === AuthException.NotAuthorizedException) {
        this.currentError = AuthError.NotAuthorizedException;
      } else {
        this.currentError = AuthError.UnknownError;
      }
    }
  }

  public async register(): Promise<any> {
    this.activeModal.close(LoginResultType.OpenRegistration);
    const url: any[] = [ { outlets: { modal: [ 'signup' ] } } ];
    this.router.navigate(url, { queryParamsHandling: 'merge' });
  }

  public async forgotPassword(): Promise<any> {
    this.activeModal.close();

    const { email } = this.loginForm.value;
    const dialogModel: ForgotPasswordModel = { email };
    const modalRef = this.modalService.openFromComponent(ForgotPasswordComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  public async resendEmail(): Promise<void> {
    this.activeModal.close();

    const { email } = this.loginForm.value;
    if (!isEmptyString(email)) {
      await this.authService.resendConfirmation(email);
    }
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }

  private configureLoginForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        EmailValidators.pattern,
      ]),
      password: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  private showSetPasswordForInvitedUser(): void {
    this.activeModal.close();

    const dialogModel: ConfirmPasswordModel = { type: 'invite' };
    const modalRef = this.modalService.openFromComponent(ConfirmPasswordComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  private showFavouriteSuccessModal(): void {
    const dialogModel: ConfirmationDialogModel = {
      type: ConfirmationDialogType.Custom,
      icon: 'favorite_outline',
      iconSize: '40px',
      title: 'Die Immobilie wurde erfolgreich in deiner Merkliste gespeichert!',
      buttonLabel: 'Weitere Immobilien finden',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);

    modalRef.result.then(() => {
      this.goToMapPage();
    }, () => {});
  }

  private showSearchAlertSuccessModal(): void {
    const dialogModel: ConfirmationDialogModel = {
      type: ConfirmationDialogType.Custom,
      icon: 'magnifying_glass_with_house',
      iconSize: '48px',
      title: 'Dein Suchauftrag wurde erfolgreich angelegt!',
      buttonLabel: 'Weitere Immobilien finden',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);

    modalRef.result.then(() => {
      this.goToMapPage();
    }, () => {});
  }

  private showCreateOfferSuccessModal(): void {
    const dialogModel: ConfirmationDialogModel = {
      type: ConfirmationDialogType.Custom,
      icon: 'hand_with_house',
      iconSize: '48px',
      title: 'Danke! Wir haben dein Gebot erhalten.',
      buttonLabel: 'Weitere Immobilien finden',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);

    modalRef.result.then(async () => {
      this.goToMapPage();
    }, () => {});
  }

  private async goToMapPage(): Promise<void> {
    const url: string[] = [ `/${ SHARED_ROUTES_NAMES.MAP }` ];
    await this.router.navigate(url, { queryParamsHandling: 'merge' });
  }

  private async goToPropertyDetailsPageAndMakeMeOwner(model: ClaimPropertySignupInfo): Promise<void> {
    const { propertyId, livingArea, constructionYear } = model;
    const url: string[] = [ `/${ SHARED_ROUTES_NAMES.PROPERTY_DETAIL }`, propertyId ];
    await this.router.navigate(url, { queryParamsHandling: 'merge' });
    this.propertyDetailsService.openMakeMeOwnerModal(livingArea, constructionYear);
  }

  private async goToPropertyDetailsPageAndAddApartment(model: ClaimApartmentSignupInfo): Promise<void> {
    const { propertyId, floor, floorLocation } = model;
    const url: string[] = [ `/${ SHARED_ROUTES_NAMES.PROPERTY_DETAIL }`, propertyId ];
    await this.router.navigate(url, { queryParamsHandling: 'merge' });
    this.propertyDetailsService.openAddApartmentModal(floor, floorLocation);
  }

  private async goToPropertyDetailAndOpenContactOwnerModal(processData: ContactOwnerSignupInfo): Promise<void> {
    const { propertyId } = processData;
    const url: string[] = [ `/${ SHARED_ROUTES_NAMES.PROPERTY_DETAIL }`, propertyId ];
    await this.router.navigate(url, { queryParamsHandling: 'merge' });
    this.propertyDetailsService.openContactOwnerModal();
  }

  private async goToPropertyDetailsPageAndOpenMarketAttractivityTab(model: OpenMarketAttractivitySignupInfo): Promise<void> {
    const { propertyId } = model;
    const url: string[] = [ `/${ SHARED_ROUTES_NAMES.PROPERTY_DETAIL }`, propertyId ];
    await this.router.navigate(url, { queryParamsHandling: 'merge' });
    this.propertyDetailsService.openMarketAttractivityTab();
  }

  private async continueProcessIfNeeded(): Promise<void> {
    if (this.authService.isUserLoggedIn()) {
      const processData: SignupInfo = await this.authService.getSignupInfo();

      if (isNullOrUndefined(processData)) {
        if (this.isConfirmUserPath) {
          const url: string[] = [ `/${ SHARED_ROUTES_NAMES.MAP }` ];
          this.router.navigate(url, { queryParamsHandling: 'merge' });
        }
        return;
      }

      if (processData instanceof AddFavoriteSignupInfo) {
        await this.markPropertyAsFavourite(processData.propertyId, false);
      } else if (processData instanceof CreateSearchAlertsSignupInfo) {
        await this.createSearchAlert(processData);
      } else if (processData instanceof CreateOfferSignupInfo) {
        await this.createOffer(processData);
      } else if (processData instanceof ClaimPropertySignupInfo) {
        this.goToPropertyDetailsPageAndMakeMeOwner(processData);
      } else if (processData instanceof ClaimApartmentSignupInfo) {
        this.goToPropertyDetailsPageAndAddApartment(processData);
      } else if (processData instanceof ContactOwnerSignupInfo) {
        await this.goToPropertyDetailAndOpenContactOwnerModal(processData);
      } else if (processData instanceof OpenMarketAttractivitySignupInfo) {
        this.goToPropertyDetailsPageAndOpenMarketAttractivityTab(processData);
      } else {
        this.logger.error('LoginComponent::processDataNotSupported', processData);
      }
      await this.authService.clearSignupProcessInfo();
    }
  }

  private async markPropertyAsFavourite(propertyId: string, isFavourite: boolean): Promise<void> {
    try {
      await this.propertiesRepositoryService.toggleMarkerFavorite(propertyId, isFavourite);
      this.showFavouriteSuccessModal();
    } catch (error) {
      this.logger.error('LoginComponent::toggleMarkerFavorite', error);
      this.showCommonErrorModal();
    }
  }

  private async createSearchAlert(searchAlertsData: CreateSearchAlertsSignupInfo): Promise<void> {
    try {
      await this.propertiesRepositoryService.createSearchAlerts(searchAlertsData);
      this.showSearchAlertSuccessModal();
    } catch (error) {
      this.logger.error('LoginComponent::createSearchAlert', error);
      this.showCommonErrorModal();
    }
  }

  private async createOffer(offerData: CreateOfferSignupInfo): Promise<void> {
    if (isNullOrUndefined(offerData.preferredTotalArea)) {
      delete offerData.preferredTotalArea;
    }
    try {
      await this.propertiesRepositoryService.createOfferPrice(offerData);
      this.showCreateOfferSuccessModal();
    } catch (error) {
      this.logger.error('LoginComponent::createOffer', error);
      this.showCommonErrorModal();
    }
  }

  private showCommonErrorModal(): void {
    const dialogModel: CommonErrorDialogModel = {
      title: 'Oops! Etwas ist schief gelaufen. Bitte probiere es zu einem späteren Zeitpunkt nochmal.'
    };
    const modalRef = this.modalService.openFromComponent(CommonErrorComponent);
    Object.assign(modalRef.instance, dialogModel);
  }
}
