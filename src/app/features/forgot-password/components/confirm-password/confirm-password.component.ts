import { AfterViewInit, Component, Input, ViewChild, } from '@angular/core';
import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NgxActiveModal, NgxModalStack } from 'ngx-multi-modal';

import { AuthService } from '../../../../core/services/auth.service';
import { PasswordValidators } from '../../../../shared/validators/password.validator';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { markFormGroupControlsAsDirty } from '../../../../shared/utils/form-group.util';
import { isSmallMobileDevice$ } from '../../../../shared/utils/responsive.util';
import { CognitoUser } from '../../../../core/models/user.model';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { AuthError } from '../../../../app.constants';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

type ConfirmType = 'reset' | 'invite';

interface User {
  user: string;
  code: string;
}

export interface ConfirmPasswordModel {
  type: string;
}

@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: [
    './confirm-password.component.css',
  ],
})
export class ConfirmPasswordComponent implements ConfirmPasswordModel, AfterViewInit {
  @ViewChild('codeInput') codeInput: InputComponent;
  @ViewChild('passwordInput') passwordInput: InputComponent;

  @Input() type: ConfirmType = 'reset';

  _name: string = 'confirm-password';

  private user: User = {
    user: '',
    code: '',
  };
  private userInvite: CognitoUser = null;

  currentError: AuthError;
  AuthError: typeof AuthError = AuthError;

  isPhoneCode: boolean = false;
  isSmallMobileDevice$ = isSmallMobileDevice$;

  verifyForm: FormGroup;

  get isNeedToShowMessage(): boolean {
    return this.isPhoneCode || this.isUnknownError || this.isBadResetLink;
  }

  get isUnknownError(): boolean {
    return this.currentError === AuthError.UnknownError;
  }

  get isBadResetLink(): boolean {
    return this.currentError === AuthError.NotAuthorizedException;
  }

  get code(): FormControl {
    return this.verifyForm.get('code') as FormControl;
  }

  get password(): FormControl {
    return this.verifyForm.get('password') as FormControl;
  }

  get repassword(): FormControl {
    return this.verifyForm.get('repassword') as FormControl;
  }

  private get firstInput(): InputComponent {
    return this.isPhoneCode ? this.codeInput : this.passwordInput;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private activeModal: NgxActiveModal,
    private analyticsService: AnalyticsService,
    private modalService: NgxModalStack,
  ) {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    const { user, code, isPhoneCode } = queryParams;
    this.isPhoneCode = isPhoneCode || false;
    this.user.user = user || '';
    this.user.code = code || '';
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.firstInput.focus();
  }

  private initForm(): void {
    if (this.isPhoneCode) {
      this.initPhoneCodeForm();
    } else {
      this.initEmailLinkForm();
    }
  }

  private initPhoneCodeForm(): void {
    this.verifyForm = new FormGroup({
      'code': new FormControl(this.user.code, [
        Validators.required,
      ]),
      'password': new FormControl('', [
        Validators.required,
        PasswordValidators.minLength,
        PasswordValidators.letter,
        PasswordValidators.number,
      ]),
      'repassword': new FormControl('', [
        Validators.required,
      ]),
    }, PasswordValidators.repassword);
  }

  private initEmailLinkForm(): void {
    this.verifyForm = new FormGroup({
      'password': new FormControl('', [
        PasswordValidators.minLength,
        PasswordValidators.letter,
        PasswordValidators.number,
      ]),
      'repassword': new FormControl('', [
        Validators.required,
      ]),
    }, PasswordValidators.repassword);
  }

  onDismiss(): void {
    this.activeModal.dismiss();
  }

  async onResendPhoneCode(): Promise<void> {
    this.resetErrors();
    try {
      const { user } = this.user;
      await this.authService.forgotPassword(user);
      this.analyticsService.triggerFormSubmissionSuccess('resendPhoneCodeForm', 'confirm-password');
    } catch (error) {
      this.currentError = AuthError.UnknownError;
    } finally {
      this.code.reset('');
      this.codeInput.focus();
    }
  }

  async onChangePassword(): Promise<void> {
    this.resetErrors();
    if (!this.verifyForm.valid) {
      markFormGroupControlsAsDirty(this.verifyForm);
      return;
    }

    try {
      const { user } = this.user;
      const { code } = this.isPhoneCode ? this.verifyForm.value : this.user;
      const { password } = this.verifyForm.value;
      if (this.type === 'reset') {
        await this.authService.confirmForgotPassword(user, code, password);
        this.analyticsService.triggerFormSubmissionSuccess('confirmForgotPasswordForm', 'confirm-password');
      } else if (this.type === 'invite') {
        this.userInvite = await this.authService.completeNewPassword(password);
        this.analyticsService.triggerFormSubmissionSuccess('completeNewPasswordForm', 'confirm-password');
      }
      this.close();
    } catch (error) {
      if (this.type === 'reset') {
        this.currentError = AuthError.NotAuthorizedException;
      } else {
        this.currentError = AuthError.UnknownError;
      }
    }
  }

  openPasswordReset() {
    this.activeModal.close();
    this.modalService.openFromComponent(ForgotPasswordComponent);
  }

  private close(): void {
    const username: string = this.type === 'invite'
      ? this.userInvite.username
      : this.user.user;
    const { password } = this.verifyForm.value;
    this.activeModal.close({username, password});
  }

  private resetErrors(): void {
    this.currentError = null;
  }
}
