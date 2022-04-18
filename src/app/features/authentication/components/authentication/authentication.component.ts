import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  NavigationExtras,
  Router,
} from '@angular/router';

import {
  NgxActiveModal,
  NgxModalStack,
} from 'ngx-multi-modal';

import {
  AuthenticationEnterCodeComponent,
  AuthenticationEnterCodeModel,
} from '../authentication-enter-code/authentication-enter-code.component';
import {
  MyPropertiesTabs,
  PROFILE_MY_PROPERTIES_QUERY_PARAMS,
} from '../../../profile/services/my-properties.service';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { PropertyAlreadyClaimed } from '../../../../core/models/errors.model';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { EmbededAppartment } from '../../../../core/models/embeded-appartment.model';
import {
  createFloors,
  Floor,
} from '../../../../core/models/floor.model';
import { InputTextMask } from '../../../../core/models/input-text-mask.model';
import {
  MAX_LIVING_AREA,
  MIN_LIVING_AREA,
} from '../../../../core/models/living-area.model';
import { UserRole } from '../../../../core/models/user.model';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { UserService } from '../../../../core/services/user.service';
import { CommonErrorComponent } from '../../../../shared/components/common-error/common-error.component';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
  ConfirmationDialogType,
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CognitoErrors } from '../../../../shared/utils/cognito-errors.util';
import { markFormGroupControlsAsDirty } from '../../../../shared/utils/form-group.util';
import { LIVING_AREA_INPUT_MASK } from '../../../../shared/utils/living-area-input-mask.util';
import { getCognitoMobilePhone } from '../../../../shared/utils/cognito.util';
import { isEmptyString } from '../../../../shared/utils/empty-string.util';
import { sameObjects } from '../../../../shared/utils/same-objects.util';
import { cleanFormattedLivingAreaString } from '../../../../shared/utils/string.util';
import { PhoneNumberValidators } from '../../../../shared/validators/phone-number.validator';
import { TransformControlValueValidators } from '../../../../shared/validators/transform-control-value.validator';

import {
  AuthenticationModel,
  AuthenticationUserInfoModel,
} from './authentication.model';
import { ApartmentDataSerializer } from './authentication.serializer';

enum SendConfirmationCodeUpdate {
  UserData = 'UserData',
  PhoneNumber = 'PhoneNumber',
}

interface LivingAreaBoundaries {
  minLivingArea: number;
  maxLivingArea: number;
}

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: [
    './authentication.component.css',
  ],
})
export class AuthenticationComponent implements OnInit, AuthenticationModel {
  @Input() userInfo: AuthenticationUserInfoModel;
  @Input() property: ExtendedMarkerModel | EmbededAppartment;
  @Input() apartmentFloor: string = '';
  @Input() apartmentLivingArea: string = '';
  @Input() correctedLivingArea: string = '';
  @Input() correctedConstructionYear: string = '';
  @Input() analyticsFormContext: string;

  @Output() propertyChange: EventEmitter<void> = new EventEmitter<void>();

  name: string = 'authentication';

  authenticationForm: FormGroup = null;
  floors: Floor[] = createFloors();
  unknownError: boolean = false;
  areaInputMask: InputTextMask = LIVING_AREA_INPUT_MASK;
  livingAreaBoundaries: LivingAreaBoundaries = {
    minLivingArea: MIN_LIVING_AREA,
    maxLivingArea: MAX_LIVING_AREA,
  };
  Role: typeof UserRole = UserRole;

  get givenNameControl(): FormControl {
    return this.authenticationForm.get('givenName') as FormControl;
  }

  get familyNameControl(): FormControl {
    return this.authenticationForm.get('familyName') as FormControl;
  }

  get floorControl(): FormControl {
    return this.authenticationForm.get('floor') as FormControl;
  }

  get livingAreaControl(): FormControl {
    return this.authenticationForm.get('livingArea') as FormControl;
  }

  get roleControl(): FormControl {
    return this.authenticationForm.get('role') as FormControl;
  }

  get mobilePhoneControl(): FormControl {
    return this.authenticationForm.get('mobilePhone') as FormControl;
  }

  get isUserAuthenticated(): boolean {
    return this.userInfo.phoneNumberVerified;
  }

  get isMFH(): boolean {
    return this.property instanceof ExtendedMarkerModel && this.property.isPropertyOfTypeMFH;
  }

  constructor(
    private router: Router,
    private activeModal: NgxActiveModal,
    private modalService: NgxModalStack,
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private propertiesRepositoryService: PropertiesRepositoryService,
    private userService: UserService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.configureAuthenticationForm();
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }

  async sendConfirmationCode(update: SendConfirmationCodeUpdate = SendConfirmationCodeUpdate.UserData): Promise<void> {
    if (this.authenticationForm.invalid) {
      markFormGroupControlsAsDirty(this.authenticationForm);
      return;
    }

    this.resetErrors();

    try {
      await this.requestAuthenticationCode();

      this.activeModal.close();
      const dialogModel: AuthenticationEnterCodeModel = { analyticsFormContext: this.analyticsFormContext };
      const modalRef = this.modalService.openFromComponent(AuthenticationEnterCodeComponent);
      Object.assign(modalRef.instance, dialogModel);
      modalRef.result
        .then(async () => {
          if (update === SendConfirmationCodeUpdate.UserData) {
            await this.updateUserDataIfNecessary();
          } else {
            await this.updatePhoneNumberIfNecessary();
          }
          await this.claimProperty();
        }, () => {});
    } catch (error) {
      this.showSendConfirmationCodeError(error);
    }
  }

  private showSendConfirmationCodeError(error: any): void {
    if (CognitoErrors.isErrorOfType(error, CognitoErrors.invalidPhoneNumberFormat)) {
      this.mobilePhoneControl.setErrors({ invalidformat: true });
    } else {
      this.unknownError = true;
    }
  }

  async confirm(): Promise<void> {
    if (this.phoneNumberWasChanged) {
      this.sendConfirmationCode(SendConfirmationCodeUpdate.PhoneNumber);
    } else {
      this.confirmWithoutPhoneNumberChanges();
    }
  }

  private async confirmWithoutPhoneNumberChanges(): Promise<void> {
    if (this.authenticationForm.invalid) {
      markFormGroupControlsAsDirty(this.authenticationForm);
      return;
    }

    this.resetErrors();

    try {
      await this.updatePhoneNumberIfNecessary();
      await this.claimProperty();
    } catch (error) {
      this.unknownError = true;
    }
  }

  private configureAuthenticationForm(): void {
    if (this.isMFH) {
      this.configureAuthenticationFormForMFH();
    } else {
      this.configureAuthenticationFormForNonMFH();
    }
  }

  private configureAuthenticationFormForNonMFH(): void {
    this.authenticationForm = new FormGroup({
      ...this.authenticationFormControls,
    });
  }

  private configureAuthenticationFormForMFH(): void {
    const apartmentLivingArea = !isEmptyString(this.correctedLivingArea) ? this.correctedLivingArea : this.apartmentLivingArea;
    this.authenticationForm = new FormGroup({
      ...this.authenticationFormControls,
      floor: new FormControl(this.apartmentFloor, [ Validators.required ]),
      livingArea: new FormControl(apartmentLivingArea, [
        Validators.required,
        TransformControlValueValidators.min(MIN_LIVING_AREA, cleanFormattedLivingAreaString),
        TransformControlValueValidators.max(MAX_LIVING_AREA, cleanFormattedLivingAreaString),
      ]),
    });
  }

  private get authenticationFormControls(): { [ formKey: string ]: FormControl } {
    const { phoneNumber } = this.userInfo;
    const baseFormControls = {
      role: new FormControl('', [
        Validators.required,
      ]),
      mobilePhone: new FormControl(phoneNumber, [
        Validators.required,
        PhoneNumberValidators.phonePattern,
      ]),
    };
    if (this.isUserAuthenticated) {
      return baseFormControls;
    }

    const { givenName, familyName } = this.userInfo;
    return {
      ...baseFormControls,
      givenName: new FormControl(givenName, [
        Validators.required,
      ]),
      familyName: new FormControl(familyName, [
        Validators.required,
      ]),
    };
  }

  private resetErrors(): void {
    this.unknownError = false;
  }

  private async updateUserDataIfNecessary(): Promise<void> {
    if (!this.userDataWasChanged) {
      return;
    }

    try {
      const { givenName, familyName, mobilePhone } = this.authenticationForm.value;
      const cognitoMobilePhone = getCognitoMobilePhone(mobilePhone);
      await this.authService.updateProfile(givenName, familyName);
      await this.authService.updatePhone(cognitoMobilePhone);
      this.analyticsService.triggerFormSubmissionSuccess('authenticationUpdateUserData', this.analyticsFormContext);
    } catch (error) {
      this.unknownError = true;
    }
  }

  private async updatePhoneNumberIfNecessary(): Promise<void> {
    if (!this.phoneNumberWasChanged) {
      return;
    }

    try {
      const { mobilePhone } = this.authenticationForm.value;
      const cognitoMobilePhone = getCognitoMobilePhone(mobilePhone);
      await this.authService.updatePhone(cognitoMobilePhone);
      this.analyticsService.triggerFormSubmissionSuccess('authenticationUpdateMobilePhone', this.analyticsFormContext);
    } catch (error) {
      this.unknownError = true;
    }
  }

  private async requestAuthenticationCode(): Promise<void> {
    const { mobilePhone } = this.authenticationForm.value;
    const cognitoMobilePhone = getCognitoMobilePhone(mobilePhone);
    await this.authService.updatePhone(cognitoMobilePhone);
    await this.authService.sendCode();
    this.analyticsService.triggerFormSubmissionSuccess('authenticationResendSmsCode', this.analyticsFormContext);
  }

  private get phoneNumberWasChanged(): boolean {
    const { mobilePhone } = this.authenticationForm.value;
    const formValue = { mobilePhone };
    const userData = {
      mobilePhone: this.userInfo.phoneNumber,
    };

    return !sameObjects(formValue, userData);
  }

  private get userDataWasChanged(): boolean {
    const { givenName, familyName, mobilePhone } = this.authenticationForm.value;
    const formValue = { givenName, familyName, mobilePhone };
    const userData = {
      givenName: this.userInfo.givenName,
      familyName: this.userInfo.familyName,
      mobilePhone: this.userInfo.phoneNumber,
    };

    return !sameObjects(formValue, userData);
  }

  private async claimProperty(): Promise<void> {
    if (this.isMFH) {
      await this.claimPropertyOfTypeMFH();
    } else {
      await this.claimPropertyOfTypeNonMFH();
    }
  }

  private async claimPropertyOfTypeNonMFH(): Promise<void> {
    try {
      const { id: propertyId } = this.property;
      const { role } = this.authenticationForm.value;
      if (role === UserRole.Owner) {
        await this.propertiesRepositoryService.setOwner(propertyId);
        await this.correctPropertyValuation(propertyId);
        this.showClaimPropertySuccessModal(propertyId);
      } else if (role === UserRole.Realtor) {
        await this.propertiesRepositoryService.setRealtor(propertyId);
        await this.correctPropertyValuation(propertyId);
        this.showClaimPropertySuccessModal(propertyId);
      } else {
        this.logger.error('AuthenticationComponent::roleNotSupported', role);
      }
    } catch (error) {
      this.showClaimPropertyError(error);
    }
  }

  private async claimPropertyOfTypeMFH(): Promise<void> {
    try {
      const { id: propertyId } = this.property;
      const apartmentData = ApartmentDataSerializer.from(this.authenticationForm.value);
      const marker: ExtendedMarkerModel = await this.propertiesRepositoryService.addNewApartmentToHouse(propertyId, apartmentData);
      await this.correctPropertyValuation(marker.id);
      this.showClaimPropertySuccessModal(marker.id);
    } catch (error) {
      this.showClaimPropertyError(error);
    }
  }

  private correctPropertyValuation(propertyId: string): Promise<void> {
    const hasCorrectedLivingArea = !isEmptyString(this.correctedLivingArea);
    const hasCorrectedConstructionYear = !isEmptyString(this.correctedConstructionYear);
    if (!(hasCorrectedLivingArea || hasCorrectedConstructionYear)) {
      return;
    }

    return this.propertiesRepositoryService.updatePropertyValuation(propertyId, this.correctedLivingArea, this.correctedConstructionYear)
      .toPromise();
  }

  private async goToEditPropertyPage(propertyId: string): Promise<void> {
    const url: string[] = [ `/${ SHARED_ROUTES_NAMES.PROFILE }`, SHARED_ROUTES_NAMES.PROPERTY, propertyId ];
    const extras: NavigationExtras = {
      queryParamsHandling: 'merge',
      queryParams: {
        [ PROFILE_MY_PROPERTIES_QUERY_PARAMS.ACTIVE_TAB ]: MyPropertiesTabs.Edit,
      },
    };
    await this.router.navigate(url, extras);
  }

  private showClaimPropertyError(error: any): void {
    if (error instanceof PropertyAlreadyClaimed) {
      this.showClaimPropertyAlreadyClaimedErrorModal();
    } else {
      this.showCommonErrorModal();
    }
  }

  private showClaimPropertySuccessModal(propertyId: string): void {
    const dialogModel: ConfirmationDialogModel = {
      type: ConfirmationDialogType.Custom,
      icon: 'success',
      iconSize: '46px',
      title: 'Herzlichen Glückwunsch! Du bist nun als Eigentümer hinterlegt.',
      message: 'Du kannst nun alle Services auf Scoperty nutzen. Viel Spaß!',
      buttonLabel: 'Weiter',
    };

    this.activeModal.close();

    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);
    modalRef.result
      .then(async () => {
        await this.goToEditPropertyPage(propertyId);
      }, () => {
        this.propertyChange.emit();
      });
  }

  private showClaimPropertyAlreadyClaimedErrorModal(): void {
    const dialogModel: ConfirmationDialogModel = {
      type: ConfirmationDialogType.Custom,
      title: 'Deine Anfrage ist bei uns eingegangen. Leider hat sich bereits ein Eigentümer vor dir registriert!',
      message: 'Wir werden dies prüfen und uns in Kürze bei dir telefonisch melden.',
      buttonLabel: 'Weiter',
    };

    this.activeModal.close();

    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  private showCommonErrorModal(): void {
    this.activeModal.close();

    this.modalService.openFromComponent(CommonErrorComponent);
  }
}
