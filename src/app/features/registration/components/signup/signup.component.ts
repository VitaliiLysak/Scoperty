import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { NgxModalStack } from 'ngx-multi-modal';

import { AuthException, AuthService } from '../../../../core/services/auth.service';
import { MapManagerService } from '../../../../core/services/map-manager.service';
// tslint:disable-next-line:max-line-length
import { ErrorUnconfirmedEmailComponent } from '../../../../core/components/registration/error-unconfirmed-email/error-unconfirmed-email.component';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
  ConfirmationDialogType
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {
  ForgotPasswordComponent,
  ForgotPasswordModel,
} from '../../../forgot-password/components/forgot-password/forgot-password.component';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { StateManagerService } from '../../../../core/services/state-manager.service';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';

export interface SignupModel {
  title: string;
  isOwnerWindow: boolean;
  mode: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})

export class SignupComponent implements SignupModel, OnInit, OnDestroy {

  @Input() role: string = '';
  @Input() mode: string = 'confirm_phone';
  @Output() signupCompleted: EventEmitter<string> = new EventEmitter<string>();
  @Output() close: EventEmitter<null> = new EventEmitter<null>();

  private chosePropertyId: string = '';
  private subscriptions: Subscription = new Subscription();

  public isOwnerWindow: boolean;
  public user = null;
  public isSubmit: boolean = false;
  public isPasswordShown: boolean = false;
  public user_email: string = '';
  public linkToDataProtection: string = SHARED_ROUTES_NAMES.DATAPROTECTION;
  public linkToTermsOfService: string = SHARED_ROUTES_NAMES.TERMS_OF_SERVICE;

  public title: string;
  public _name: string = 'signup';
  public signupForm: FormGroup;
  public termsAccepted: boolean = false;
  public termsTriggered: boolean = false;

  private completeSignup(email: string): void {
    this.analyticsService.triggerFormSubmissionSuccess('signupForm', 'new-user-registered');
    this.signupCompleted.emit(email);
  }

  private setSettings(): void {
    const {signupState} = this.authService;
    if (this.authService.signupState) {
      this.user = {
        ...signupState,
        password: undefined,
      };
    } else {
      this.user = {
        given_name: '',
        family_name: '',
        email: '',
        password: '',
        gender: 'male',
        use: false,
        privacy: false
      };
    }
  }

  private checkQuantityValidator(control: FormControl): {[s: string]: boolean} {
    if (control.value.length < 8) {
      return {'quantityErr': true};
    }
    return null;
  }

  private checkLetterValidator(control: FormControl): {[s: string]: boolean} {
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(control.value)) {
      return {'letterErr': true};
    }
    return null;
  }

  private checkNumberValidator(control: FormControl): {[s: string]: boolean} {
    if (!/(?=.*[0-9])/.test(control.value)) {
      return {'numberErr': true};
    }
    return null;
  }

  private initForm(): void {
    this.setSettings();

    this.signupForm = new FormGroup({
      'given_name': new FormControl(this.user.given_name, [
        Validators.required,
        Validators.minLength(2)
      ]),
      'family_name': new FormControl(this.user.family_name, [
        Validators.required
      ]),
      'email': new FormControl(this.user.email, [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+)*' +
                                    '@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?')
      ]),
      'password': new FormControl(this.user.password, [
        Validators.required,
        this.checkQuantityValidator,
        this.checkLetterValidator,
        this.checkNumberValidator
      ]),
    });

    this.authService.clearSignupState();
  }

  private confirmEmail(): void {
    this.modalService.openFromComponent(ErrorUnconfirmedEmailComponent);
  }

  private showSignupErrorModal(): void {
    const dialogModel: ConfirmationDialogModel = {
      message: 'Bei der Registrierung ist ein Fehler aufgetreten.',
      type: ConfirmationDialogType.Error,
      buttonLabel: 'Weiter',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  private async resetPassword(): Promise<void> {
    const dialogModel: ConfirmationDialogModel = {
      message: `Deine E-Mail-Adresse existiert bereits bei Scoperty.
      Erstelle Dir ein neues Passwort, um Dich einzuloggen.`,
      type: ConfirmationDialogType.Info,
      buttonLabel: 'Weiter',
      buttonId: 'signup-email-already-exists-button'
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);

    modalRef.result.then((result) => {
      this.forgotPassword();
    }, (reason) => {
    });
  }

  private forgotPassword(): void {
    const dialogModel: ForgotPasswordModel = {
      email: this.user.email
    };
    const modalRef = this.modalService.openFromComponent(ForgotPasswordComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  constructor(
    private authService: AuthService,
    private mapManager: MapManagerService,
    private stateManager: StateManagerService,
    private modalService: NgxModalStack,
    private analyticsService: AnalyticsService,
  ) {}

  public ngOnInit(): void {
    const propIdSubscription: Subscription = this.stateManager.propertyIdForNewHolder$
      .subscribe(propertyId => {
        this.chosePropertyId = propertyId;
      });

    this.subscriptions.add(propIdSubscription);
    this.initForm();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.mapManager.changeAutofocus(true);
  }

  public get given_name() {
    return this.signupForm.get('given_name');
  }

  public get family_name() {
    return this.signupForm.get('family_name');
  }

  public get email() {
    return this.signupForm.get('email');
  }

  public get password() {
    return this.signupForm.get('password');
  }

  public async apply(): Promise<void> {
    Object.keys(this.signupForm.controls).forEach(key => {
      this.signupForm.get(key).markAsTouched();
      this.signupForm.get(key).markAsDirty();
    });

    this.termsTriggered = true;
    if (this.signupForm.invalid || !this.termsAccepted) return;

    this.isSubmit = true;
    this.user.email = this.user_email.toLowerCase();
    try {
      await this.authService.signUp2(this.user);
      this.completeSignup(this.user.email);
      this.showInformationModal();
    } catch (error) {
      if (error.message === AuthException.UserNotConfirmed) {
        this.confirmEmail();
      } else if (error.message === AuthException.UserNameExists) {
        await this.resetPassword();
      } else {
        this.showSignupErrorModal();
      }
    }
  }

  public showInformationModal(): void {
    const dialogModel: ConfirmationDialogModel = {
      title: 'E-Mail Adresse bestätigen',
      message: 'Bitte bestätige deine E-Mail, um mit der Verifizierung fortfahren zu können!',
      type: ConfirmationDialogType.Info,
      buttonLabel: 'Verstanden',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  public togglePasswordToShow(): void {
    this.isPasswordShown = !this.isPasswordShown;
  }

  public checkboxChanged(event: boolean): void {
    this.termsAccepted = event;
    this.termsTriggered = false;
  }
}
