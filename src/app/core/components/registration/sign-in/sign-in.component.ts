import { DOCUMENT } from '@angular/common';
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  AfterViewInit, Input, Output, ElementRef, EventEmitter,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  NgxModalStack,
} from 'ngx-multi-modal';

import {
  ForgotPasswordComponent,
  ForgotPasswordModel,
} from '../../../../features/forgot-password/components/forgot-password/forgot-password.component';
import {
  AuthService,
  AuthException,
} from '../../../../core/services/auth.service';
import {
  ConfirmPasswordComponent,
  ConfirmPasswordModel,
} from '../../../../features/forgot-password/components/confirm-password/confirm-password.component';
import { CognitoUser } from '../../../../core/models/user.model';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import {
  PASSWORD_REQUIRED,
  SHARED_ROUTES_NAMES,
  AuthError,
} from '../../../../app.constants';
import { markFormGroupControlsAsDirty } from '../../../../shared/utils/form-group.util';
import { isEmptyString } from '../../../../shared/utils/empty-string.util';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { LOCAL_STORAGE } from '../../../../core/services/local-storage.provider';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

const USER_EMAIL: string = 'userEmailCopyForAutofill';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit, AfterViewInit {
  @ViewChild('emailInput') emailInput: InputComponent;
  @ViewChild('emailInputContainer') emailInputContainer: ElementRef;
  @ViewChild('passwordInput') passwordInput: InputComponent;
  @ViewChild('passwordInputContainer') passwordInputContainer: ElementRef;
  @ViewChild('loginButton') loginButton: ButtonComponent;

  @Input() predefinedEmail: string;
  @Input() controlsWidth: string;

  @Output() signIn = new EventEmitter<CognitoUser>();

  name: string = 'login';
  user = null;
  isMobileDevice: boolean = this.document.body.clientWidth < 768;
  loginForm: FormGroup;
  currentError: AuthError;
  AuthError: typeof AuthError = AuthError;

  get isEmailPredefined(): boolean {
    return !isNullOrUndefined(this.predefinedEmail);
  }

  get isNeedToShowMessage(): boolean {
    return this.isConfirmUserPath || !isNullOrUndefined(this.currentError);
  }

  get isConfirmUserPath(): boolean {
    return new RegExp(`${ SHARED_ROUTES_NAMES.CONFIRMUSER }`).test(this.router.url);
  }

  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  constructor(
    private modalService: NgxModalStack,
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private propertiesRepositoryService: PropertiesRepositoryService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOGGER) private logger: LoggerService,
    @Inject(LOCAL_STORAGE) private localStorage: Storage,
  ) {
  }

  ngOnInit(): void {
    this.authService.clearSignupState();
    this.configureLoginForm();
    this.autoFillEmailInput();
  }

  ngAfterViewInit(): void {
    if (!isNullOrUndefined(this.controlsWidth)) {
      if (!isNullOrUndefined(this.emailInputContainer)) {
        this.emailInputContainer.nativeElement.style.width = this.controlsWidth;
      }

      this.passwordInputContainer.nativeElement.style.width = this.controlsWidth;
      (this.loginButton as any).elementRef.nativeElement.style.width = this.controlsWidth;
    }

    if (!isNullOrUndefined(this.emailInput)) {
      this.emailInput.focus();
    }
  }

  autoFillEmailInput(): void {
    const userEmail: string = JSON.parse(this.localStorage.getItem(USER_EMAIL));
    this.email.setValue(userEmail);
    this.localStorage.removeItem(USER_EMAIL);
  }

  async login(): Promise<void> {
    if (this.predefinedEmail) {
      this.email.setValue(this.predefinedEmail);
    }

    if (this.loginForm.invalid) {
      markFormGroupControlsAsDirty(this.loginForm);
      return;
    }

    try {
      const { email, password } = this.loginForm.value;
      const user: CognitoUser = await this.authService.userAuth(email.toLowerCase(), password);

      this.signIn.emit(user);

      if (user.challengeName === PASSWORD_REQUIRED) {
        this.showSetPasswordForInvitedUser();
        return;
      }

      this.authService.send('login');
      this.analyticsService.triggerFormSubmissionSuccess('loginForm', 'reqular-login');
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

  async forgotPassword(): Promise<any> {
    const { email } = this.loginForm.value;
    const dialogModel: ForgotPasswordModel = { email };
    const modalRef = this.modalService.openFromComponent(ForgotPasswordComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  async resendEmail(): Promise<void> {
    const { email } = this.loginForm.value;
    if (!isEmptyString(email)) {
      await this.authService.resendConfirmation(email);
    }
  }

  private configureLoginForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  private showSetPasswordForInvitedUser(): void {
    const dialogModel: ConfirmPasswordModel = { type: 'invite' };
    const modalRef = this.modalService.openFromComponent(ConfirmPasswordComponent);
    Object.assign(modalRef.instance, dialogModel);
  }
}
