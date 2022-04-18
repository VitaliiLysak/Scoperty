import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild, } from '@angular/core';
import { FormControl, FormGroup, Validators, } from '@angular/forms';

import { NgxModalStack, } from 'ngx-multi-modal';

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
import { CognitoUser, IUserData } from '../../../../core/models/user.model';
import { isEmptyString } from '../../../../shared/utils/empty-string.util';
import { EmailValidators } from '../../../../shared/validators/email.validator';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
// tslint:disable-next-line:max-line-length
import { ErrorUnconfirmedEmailComponent } from '../../../../core/components/registration/error-unconfirmed-email/error-unconfirmed-email.component';
import { ShowLoginModalService } from '../../../../core/services/show-login-modal.service';
import { LOCAL_STORAGE } from '../../../../core/services/local-storage.provider';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements AfterViewInit {
  @Input() predefinedEmail: string;
  @Input() controlsWidth: string;

  @Output() signUp = new EventEmitter<CognitoUser>();

  @ViewChild('emailInput') emailInput: InputComponent;
  @ViewChild('emailInputContainer') emailInputContainer: ElementRef;
  @ViewChild('passwordInput') passwordInput: InputComponent;
  @ViewChild('passwordInputContainer') passwordInputContainer: ElementRef;
  @ViewChild('registerButton') registerButton: ButtonComponent;

  name: string = 'signup-modal';

  showErrorMessage: boolean = false;

  dataProtectionPageLink: string[] = [ `/${ SHARED_ROUTES_NAMES.DATAPROTECTION }` ];
  termsOfServiceLink: string[] = [ `/${SHARED_ROUTES_NAMES.TERMS_OF_SERVICE}` ];

  isSmallMobileDevice$ = isSmallMobileDevice$;

  isSigningUpInProcess: boolean = false;

  verifyForm: FormGroup;

  private user: IUserData = {
    email: '',
    password: '',
    commercial: '',
  };

  get isEmailPredefined(): boolean {
    return !isNullOrUndefined(this.predefinedEmail);
  }

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
    private analyticsService: AnalyticsService,
    private showLoginModalService: ShowLoginModalService,
    @Inject(LOCAL_STORAGE) private localStorage: Storage,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.predefinedEmail) {
      this.email.setValue(this.predefinedEmail);
    }
  }

  ngAfterViewInit(): void {
    if (!isNullOrUndefined(this.controlsWidth)) {
      if (!isNullOrUndefined(this.emailInputContainer)) {
        this.emailInputContainer.nativeElement.style.width = this.controlsWidth;
      }

      this.passwordInputContainer.nativeElement.style.width = this.controlsWidth;
      (this.registerButton as any).elementRef.nativeElement.style.width = this.controlsWidth;
    }

    if (!isNullOrUndefined(this.emailInput)) {
      this.emailInput.focus();
    }
  }

  confirmEmail(): void {
    this.modalService.openFromComponent(ErrorUnconfirmedEmailComponent);
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
    };

    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);

    Object.assign(modalRef.instance, dialogModel);

    modalRef.result.then(
      result => {
        if (result === ConfirmationDialogResult.Link) {
          this.sendConfirmUser();
        }
      },
      () => {}
    );
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

      const user = await this.authService.signUp2(this.user);

      this.signUp.emit(user);
      this.analyticsService.triggerFormSubmissionSuccess('signupForm', 'signup');

      this.showSignupSuccessModal();
    } catch (error) {
      this.isSigningUpInProcess = false;

      if (error.message === AuthException.UserNotConfirmed) {
        this.confirmEmail();
      } else if (error.message === AuthException.UserNameExists) {
        console.log('qwe');
      } else {
        this.showErrorMessage = true;
      }
    }
  }

  async sendConfirmUser(): Promise<void> {
    if (!isEmptyString(this.user.email)) {
      await this.authService.resendConfirmation(this.user.email);
    }
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
}
