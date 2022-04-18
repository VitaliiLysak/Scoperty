import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

import { NgxModalStack } from 'ngx-multi-modal';

import { IAddressData } from '../address/address.model';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { StateManagerService } from '../../../../core/services/state-manager.service';
import { MapManagerService } from '../../../../core/services/map-manager.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import {
  CommonErrorComponent,
  CommonErrorDialogModel,
} from '../../../../shared/components/common-error/common-error.component';
import { isSmallMobileDevice, isSmallMobileDevice$ } from '../../../../shared/utils/responsive.util';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { ShowSignupModalService } from '../../../../core/services/show-signup-modal.service';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import { CODE_MISMATCH_EXCEPTION, CognitoUserFields, MESSAGE_USER_ALREADY_CONFIRMED } from '../../../../app.constants';

import { IPhoneData } from './phone.model';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.css']
})

export class PhoneComponent implements OnInit {

  @Input() mode: string;
  @Input() role: string = '';
  @Input() page: string;
  @Input() addressData: IAddressData = null;
  @Input() reloadOwnership: boolean = false;

  @Output() phoneCompleted: EventEmitter<IPhoneData> = new EventEmitter<IPhoneData>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  private _apartmentError: string = 'Wir konnten keine Wohnung hinzufügen, bitte versuchen Sie es später';

  public _name: string = 'phone';
  public selectedOption: 'owner' | 'realtor' = null;
  public agreed: 'owner' | 'realtor' = null;
  public phone = null;
  public phoneForm: FormGroup;
  public markerId: any = this.stateManagerService.activeMarker.id;
  public userRoleChose: boolean = false;
  public CognitoUserFields: typeof CognitoUserFields = CognitoUserFields;

  isSmallMobileDevice$ = isSmallMobileDevice$;

  public get number(): AbstractControl {
    return this.phoneForm.get('number');
  }

  public get code(): AbstractControl {
    return this.phoneForm.get('code');
  }

  public get givenName(): AbstractControl {
    return this.phoneForm.get(CognitoUserFields.GivenName);
  }

  public get familyName(): AbstractControl {
    return this.phoneForm.get(CognitoUserFields.FamilyName);
  }

  public get email(): AbstractControl {
    return this.phoneForm.get('email');
  }

  public async getUserSub(): Promise<string> {
    await this.authService.userAuth(this.phone.number, null);
    const sub = (await this.authService.getUserAttributesAsync()).sub;
    await this.authService.logout();
    this.userService.clearUserInfo();

    return sub;
  }

  private _close(): void {
    this.close.emit();
  }

  private async _changeActiveProperty({id, isSimilar = true}): Promise<void> {
    const event = { action: 'Go to similar offer', properties: { category: 'Property', label: id }};
    this.mapManager.setActivatedMarkerId(id);
  }

  private async _initForm(): Promise<void> {
    this._setSettings();

    this.phoneForm = new FormGroup({});

    if (this.mode === 'delete') this.selectOption('owner');
  }

  private _setSettings(): void {
    if (this.mode === 'delete') {
      this.phone = {
        [CognitoUserFields.GivenName]: '',
        [CognitoUserFields.FamilyName]: '',
        email: '',
        number: '',
        code: '',
      };
    } else {
      this.phone = {
        number: '',
        code: '',
      };
    }
  }

  private async _deleteProperty(): Promise<void> {
    this.analyticsService.triggerFormSubmissionSuccess('phoneForm', `${this.page}-opposition`);
    try {
      this.phoneCompleted.emit({...this.phone, role: this.selectedOption, sub: await this.getUserSub()});
    } catch (error) {
      this.logger.error('PhoneComponent::_deleteProperty', error);
    }
  }

  private async _addApartment(type: string = 'addApartment'): Promise<void> {
    let result = null;
    const property = this.stateManagerService.activeMarker;
    const reloadOwnership = property.hasOwner || property.hasRealtor;

    this.analyticsService.triggerFormSubmissionSuccess('phoneForm', `${this.page}-add-apartment`);

    /**
     * @FIXME:
     * In future releases need update this function and hide
     * confirmUserPhone for users which confirmed their number earlier
     * and just use for user without confirmed phone number
    */
    try {
      if (this.stateManagerService.activeMarker) result = await this._updateProperty();
      else result = true;

      if (type === 'reg') {
        this._openModal(result);
      } else {
        this._openModal(result, reloadOwnership);
      }
    } catch (error) {
      this.logger.error('PhoneComponent::_addApartment', error);
    }
  }

  private async _registrationSuccess(): Promise<void> {
    if (this.addressData) {
      if (this.addressData.address.floor !== null && this.addressData.address.floor !== '') {
        await this._addApartment('reg');
      } else {
        await this._setPropertyOwner('reg');
      }
    } else {
      this._openModal(true);
    }
  }

  private async _setPropertyOwner(type: string = 'setProperty'): Promise<void> {
    let property = null;

    if (this.addressData) {
      const markerId = this.addressData.propertyId;
      if (markerId !== '' && markerId != null) {
        const tempData = await this.propertiesRepositoryService.getMarkerDetails(markerId);
        this.stateManagerService.activeMarker = null;
        this.stateManagerService.activeMarker = tempData;
        this.markerId = this.stateManagerService.activeMarker.id;
        property = this.stateManagerService.activeMarker;
      }
    } else {
      if (!isNullOrUndefined(this.stateManagerService.assignedEmbededAppartment)) {
        property = this.stateManagerService.assignedEmbededAppartment;
      } else {
        property = this.stateManagerService.activeMarker;
      }
    }
    const reloadOwnership = property.hasOwner || property.hasRealtor;

    this.analyticsService.triggerFormSubmissionSuccess('phoneForm', `${this.page}-set-owner`);

    /**
     * @FIXME:
     * In future releases need update this function and hide
     * confirmUserPhone for users which confirmed their number earlier
     * and just use for user without confirmed phone number
    */
    if (reloadOwnership) return this._openModal(true, reloadOwnership);
    try {
      if (this.selectedOption === 'owner') {
        await this.propertiesRepositoryService.setOwner(property.id);
      } else if (this.selectedOption === 'realtor') {
        await this.propertiesRepositoryService.setRealtor(property.id);
      }
      this.stateManagerService.apartmentsListChanged$.next(true);

      this._changeActiveProperty({id: property.id, isSimilar: false});

      await this.propertiesRepositoryService.reloadProperty(property);

      if (type === 'reg') {
        this._openModal(true);
      } else {
        this._openModal(true, reloadOwnership);
      }
    } catch (error) {
      this._openModal(false);
      this.logger.error('PhoneComponent::_setPropertyOwner', error);
    }
  }

  private _getDataForSuccessSignup(reloadOwnership: boolean = null): any {
    let data = null;
    if (reloadOwnership !== null) {
      if (!reloadOwnership) {
        data = {
          role: 'owner',
          title: 'Herzlichen Glückwunsch du bist nun als Eigentümer hinterlegt!',
          text: 'Du kannst nun alle Services auf Scoperty nutzen. Viel Spaß!',
          button: 'Zu deiner Immobilie',
        };
      } else {
        data = {
          role: 'owner',
          title: 'Deine Anfrage ist bei uns eingegangen! Leider ist bereits ein Eigentümer hinterlegt.',
          text: 'Wir werden dies nun überprüfen und uns in kürze bei dir telefonisch melden!',
          button: 'Zurück zur Karte',
        };
      }
    } else {
      switch (this.role) {
        case 'buyer':
          data = {
            role: this.role,
            title: 'Vielen Dank! Wir haben dein Gebot erhalten und du bist jetzt bei SCOPERTY registriert.',
            text: 'Auf deinem persönlichen Bereich kannst du alle verfügbaren SCOPERTY Services entdecken ' +
              'und deine Aktivitäten jederzeit verfolgen. Wir wünschen dir viel Erfolg und jede Menge Spaß.',
            button: 'Zu deinem Bereich',
          };
          break;
        case 'owner':
          if (this.mode === 'confirm_phone' && !this.reloadOwnership) {
            data = {
              role: this.role,
              title: 'Herzlichen Glückwunsch du bist nun als Eigentümer hinterlegt!',
              text: `Du kannst nun alle Services auf Scoperty nutzen. Viel Spaß!`,
              button: 'Zu deiner Immobilie',
            };
          } else if (this.mode === 'confirm_phone' && this.reloadOwnership) {
            data = {
              role: this.role,
              title: 'Deine Anfrage ist bei uns eingegangen! Leider ist bereits ein Eigentümer hinterlegt.',
              // text: 'Wir werden dies nun überprüfen und uns in kürze bei dir telefonisch melden!',
              text: 'Du kannst nun alle Services auf Scoperty nutzen. Viel Spaß!',
              button: 'Zurück zur Karte',
            };
          } else {
            data = {
              role: this.role,
              title: 'Herzlichen Glückwunsch du bist nun als Eigentümer registriert!',
              text: 'Du kannst nun alle Services auf Scoperty nutzen. Viel Spaß!',
              button: 'Zu deiner Immobilie',
            };
          }
          break;
        case 'global':
          data = {
            role: this.role,
            title: 'Herzlichen Glückwunsch du bist registriert!',
            button: 'Weiter suchen',
            buttonInactive: isSmallMobileDevice() ? 'Zu meinem Bereich' : 'Weiter zu meinem Bereich',
          };
          break;
        case 'realtor':
          data = {
            role: this.role,
            title: 'Herzlichen Glückwunsch du bist registriert!',
            button: 'Weiter suchen',
            buttonInactive: isSmallMobileDevice() ? 'Zu meinem Bereich' : 'Weiter zu meinem Bereich',
          };
          break;
      }
    }

    return data;
  }

  private _openModal(result, reloadOwnership: boolean = null): void {
    const data = result ? this._getDataForSuccessSignup(reloadOwnership) : {text: this._apartmentError};
    const dialogModel: CommonErrorDialogModel = data;
    const modalRef = this.modalService.openFromComponent(CommonErrorComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  private async _updateProperty(): Promise<ExtendedMarkerModel> {
    try {
      const result: ExtendedMarkerModel = await this.propertiesRepositoryService
                               .addNewApartmentToHouse(this.markerId, { floor: Number(this.addressData.address.floor) });
      if (result) this.stateManagerService.apartmentsListChanged$.next(true);
      return result;
    } catch (error) {
      this.logger.error('PhoneComponent::_updateProperty', error);
    }
  }

  constructor(
    private authService: AuthService,
    private showSignupModalService: ShowSignupModalService,
    private userService: UserService,
    private propertiesRepositoryService: PropertiesRepositoryService,
    private stateManagerService: StateManagerService,
    private mapManager: MapManagerService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: NgxModalStack,
    private analyticsService: AnalyticsService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
  }

  public ngOnInit(): void {
    if (this.mode == null) this.mode = 'registration';
    this._initForm();
  }

  public _blurred(key: string, value: string): void {
    this.phone[key] = value;
  }

  public _created(formControlName: string, formControl: FormControl): void {
    this.phoneForm.addControl(formControlName, formControl);
  }

  public checkboxChanged(option: 'owner' | 'realtor'): void {
    this.agreed = option;
    this.userRoleChose = false;
  }

  public selectOption(option: 'owner' | 'realtor'): void {
    this.selectedOption = option;
    this.userRoleChose = false;
  }

  public codeInput(): void {
    if (this.userRoleChose) this.userRoleChose = false;
  }

  public validatePhoneNumber(): void {
    if (this.phone.number.startsWith('00')) {
      this.phone.number = '+' + this.phone.number.substring(2);
    } else if (this.phone.number.startsWith('0')) {
      this.phone.number = '+49' + this.phone.number.substring(1);
    } else if (!this.phone.number.startsWith('+')) {
      this.phone.number = '+49' + this.phone.number;
    }
  }

  public async getCode(): Promise<void> {
    if (this.number.valid) {
      this.validatePhoneNumber();
      try {
        if (!this.authService.isUserLoggedIn()) {
          this.showSignupModalService.showSignup();
        }

        await this.authService.updatePhone(this.phone.number);
        await this.authService.sendCode();
      } catch (error) {
        this.logger.error('PhoneComponent::getCode', error);
        const dialogModel: CommonErrorDialogModel = {
          title: 'Es gibt ein Problem mit der Telefonverifizierung.',
        };
        const modalRef = this.modalService.openFromComponent(CommonErrorComponent);
        Object.assign(modalRef.instance, dialogModel);
      }
    }
  }

  public async getCodeDissent(): Promise<void> {
    if (this.number.valid) {
      this.validatePhoneNumber();
      try {
        await this.authService.signUp(this.phone);
      } catch (signUpError) {
        this.logger.error('PhoneComponent::getCodeDissent', signUpError);
        if (signUpError.code === 'UsernameExistsException') {
          try {
            await this.authService.resendConfirmation(this.phone.number);
          } catch (resendConfirmationError) {
            this.logger.error('PhoneComponent::getCodeDissent', resendConfirmationError);
            if (resendConfirmationError.message === 'User is already confirmed.') {
              await this.authService.forgotPassword(this.phone.number);
            }
          }
        } else {
          this.logger.error('PhoneComponent::getCodeDissent', signUpError);
          this.showGetCodeErrorModal();
        }
      }
    }
  }

  public showGetCodeErrorModal(): void {
    const dialogModel: CommonErrorDialogModel = {
      title: 'Es gibt ein Problem mit der Telefonverifizierung.',
    };
    const modalRef = this.modalService.openFromComponent(CommonErrorComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  public async apply(): Promise<void> {
    Object.keys(this.phoneForm.controls).forEach(key => {
      this.phoneForm.get(key).markAsTouched();
      this.phoneForm.get(key).markAsDirty();
    });

    if (this.phoneForm.invalid) {
      return;
    }

    if (!this.agreed  && ['set_owner', 'add_property'].includes(this.mode)) {
      this.userRoleChose = true;
      return;
    }

    try {
      if (this.mode !== 'delete') {
        await this.authService.confirmUserPhone(this.phone.code);
      } else {
        await this.authService.confirm(this.phone.number, this.phone.code);
      }

      switch (this.mode) {
        case 'delete': await this._deleteProperty();
          break;
        case 'set_owner': await this._setPropertyOwner();
          break;
        case 'add_property': await this._addApartment();
          break;
        case 'registration': await this._registrationSuccess();
          break;
        case 'confirm_phone': await this._registrationSuccess();
          break;
      }
    } catch (error) {
      if (error.name === CODE_MISMATCH_EXCEPTION) {
        this.logger.error('PhoneComponent::apply', error);
        this.handleCodeMismatchError();
      } else if (error.message === MESSAGE_USER_ALREADY_CONFIRMED && this.mode === 'delete') {
        this.logger.error('PhoneComponent::apply', error);
        this.confirmForgotPassword();
      }
    }
  }

  private async confirmForgotPassword(): Promise<void> {
    try {
      await this.authService.confirmForgotPassword(this.phone.number, this.phone.code, 'Passw0rd');
      await this._deleteProperty();
    } catch (error) {
      if (error.name === CODE_MISMATCH_EXCEPTION) {
        this.logger.error('PhoneComponent::confirmForgotPassword', error);
        this.handleCodeMismatchError();
      }
    }
  }

  private handleCodeMismatchError(): void {
    this.code.setErrors({codeErr: {valid: false}});
    setTimeout(() => this.changeDetectorRef.detectChanges(), 300);
  }
}
