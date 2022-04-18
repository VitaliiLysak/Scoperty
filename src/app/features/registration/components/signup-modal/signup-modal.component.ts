import { AfterViewInit, Component, Inject, ViewChild, } from '@angular/core';
import { FormControl, FormGroup, Validators, } from '@angular/forms';

import { NgxActiveModal, NgxModalStack, } from 'ngx-multi-modal';

import { AuthException, AuthService, } from '../../../../core/services/auth.service';
import { PasswordValidators } from '../../../../shared/validators/password.validator';
import { markFormGroupControlsAsDirty } from '../../../../shared/utils/form-group.util';
import { isSmallMobileDevice$ } from '../../../../shared/utils/responsive.util';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
  ConfirmationDialogResult,
  ConfirmationDialogType
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { IUserData } from '../../../../core/models/user.model';
import { isEmptyString } from '../../../../shared/utils/empty-string.util';
import { EmailValidators } from '../../../../shared/validators/email.validator';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
// tslint:disable-next-line:max-line-length
import { ErrorUnconfirmedEmailComponent } from '../../../../core/components/registration/error-unconfirmed-email/error-unconfirmed-email.component';
import {
  ForgotPasswordComponent,
  ForgotPasswordModel
} from '../../../forgot-password/components/forgot-password/forgot-password.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ShowLoginModalService } from '../../../../core/services/show-login-modal.service';
import { LOCAL_STORAGE } from '../../../../core/services/local-storage.provider';

export enum SignupResult {
  OpenLogin = 'OpenLogin',
}

const USER_EMAIL: string = 'userEmailCopyForAutofill';

@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: [
    './signup-modal.component.css',
  ],
})
export class SignupModalComponent implements AfterViewInit {
  @ViewChild('emailInput') emailInput: InputComponent;

  name: string = 'signup-modal';

  private user: IUserData = {
    email: '',
    password: '',
    commercial: '',
  };

  showErrorMessage: boolean = false;

  dataProtectionPageLink: string[] = [ `/${ SHARED_ROUTES_NAMES.DATAPROTECTION }` ];
  termsOfServiceLink: string[] = [ `/${SHARED_ROUTES_NAMES.TERMS_OF_SERVICE}` ];

  isSmallMobileDevice$ = isSmallMobileDevice$;

  isSigningUpInProcess: boolean = false;

  verifyForm: FormGroup;

  get email(): FormControl {
    return this.verifyForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.verifyForm.get('password') as FormControl;
  }

  get acceptedTermsConditions(): FormControl {
    return this.verifyForm.get('acceptedTermsConditions') as FormControl;
  }

  get acceptedEmailInform(): FormControl {
    return this.verifyForm.get('acceptedEmailInform') as FormControl;
  }

  constructor(
    private authService: AuthService,
    private modalService: NgxModalStack,
    private activeModal: NgxActiveModal,
    private analyticsService: AnalyticsService,
    private showLoginModalService: ShowLoginModalService,
    @Inject(LOCAL_STORAGE) private localStorage: Storage,
  ) {
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.emailInput.focus();
  }

  private initForm(): void {
    this.verifyForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        EmailValidators.pattern,
      ]),
      password: new FormControl('', [
        Validators.required,
        PasswordValidators.minLength,
        PasswordValidators.letter,
        PasswordValidators.number,
      ]),
      acceptedTermsConditions: new FormControl(false, [
        Validators.requiredTrue,
      ]),
      acceptedEmailInform: new FormControl(false),
    });
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }

  async signup(): Promise<void> {
    if (this.verifyForm.invalid) {
      markFormGroupControlsAsDirty(this.verifyForm);
      return;
    }

    try {
      this.isSigningUpInProcess = true;
      this.showErrorMessage = false;
      const { email, password, acceptedEmailInform } = this.verifyForm.value;

      this.user.email = email;
      this.user.password = password;
      this.user.commercial = acceptedEmailInform
        ? '{"email": true, "phone": true, "letter": true}'
        : '{"email": false, "phone": false, "letter": false}';

      await this.authService.signUp2(this.user);
      this.analyticsService.triggerFormSubmissionSuccess('signupForm', 'signup');

      this.activeModal.close();
      this.showSignupSuccessModal();
    } catch (error) {
      this.isSigningUpInProcess = false;
      if (error.message === AuthException.UserNotConfirmed) {
        this.confirmEmail();
      } else if (error.message === AuthException.UserNameExists) {
        await this.resetPassword();
      } else {
        this.showErrorMessage = true;
      }
    }
  }

  openLogin(): void {
    this.localStorage.setItem(USER_EMAIL, JSON.stringify(this.verifyForm.value.email));
    this.activeModal.close(SignupResult.OpenLogin);
    this.showLoginModalService.openLoginModal();
  }

  confirmEmail(): void {
    this.activeModal.close();
    this.modalService.openFromComponent(ErrorUnconfirmedEmailComponent);
  }

  async resetPassword(): Promise<void> {
    this.activeModal.close();

    const dialogModel: ConfirmationDialogModel = {
      message: `
        Deine E-Mail-Adresse existiert bereits bei Scoperty.
        Erstelle Dir ein neues Passwort, um Dich einzuloggen.
      `,
      type: ConfirmationDialogType.Info,
      buttonLabel: 'Weiter',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);

    modalRef.result.then(() => {
      this.forgotPassword();
    }, () => {
    });
  }

  forgotPassword(): void {
    const dialogModel: ForgotPasswordModel = { email: this.user.email };
    const modalRef = this.modalService.openFromComponent(ForgotPasswordComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  showSignupSuccessModal(): void {
    const dialogModel: ConfirmationDialogModel = {
      type: ConfirmationDialogType.Custom,
      icon: 'check',
      iconSize: '32px',
      title: 'Fast geschafft!',
      message: 'Bitte klicke den Link in der Mail und melde dich direkt mit deinen Daten an, um deine Registrierung abzuschließen.',
      linkLabel: 'Email zur Bestätigung erneut senden',
      buttonLabel: 'Verstanden',
      buttonId: 'signup-success-confirm-button',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);
    modalRef.result.then(result => {
      if (result === ConfirmationDialogResult.Link) {
        this.sendConfirmUser();
      }
    }, () => {});
  }

  async sendConfirmUser(): Promise<void> {
    if (!isEmptyString(this.user.email)) {
      await this.authService.resendConfirmation(this.user.email);
    }
  }
}
