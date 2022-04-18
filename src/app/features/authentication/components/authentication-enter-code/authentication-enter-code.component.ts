import { AfterViewInit, Component, Inject, Input, ViewChild, } from '@angular/core';
import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { Router } from '@angular/router';

import { NgxActiveModal, NgxModalStack, } from 'ngx-multi-modal';

import { SMSLimitExceededException, VerificationCodeMismatchException } from '../../../../core/models/errors.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { markFormGroupControlsAsDirty } from '../../../../shared/utils/form-group.util';

enum Error {
  WrongCode = 'WrongCode',
  SMSLimitExceededCode = 'SMSLimitExceededCode',
  UnknownError = 'UnknownError',
}

export interface AuthenticationEnterCodeModel {
  analyticsFormContext: string;
}

@Component({
  selector: 'app-authentication-enter-code',
  templateUrl: './authentication-enter-code.component.html',
  styleUrls: [
    './authentication-enter-code.component.css',
  ],
})
export class AuthenticationEnterCodeComponent implements AfterViewInit, AuthenticationEnterCodeModel {
  @Input() analyticsFormContext: string;

  @ViewChild('codeInput') codeInput: InputComponent;

  public name: string = 'authentication-enter-code';

  public codeForm: FormGroup;
  public currentError: Error;

  public Error: typeof Error = Error;

  public get code(): FormControl {
    return this.codeForm.get('code') as FormControl;
  }

  constructor(
    private router: Router,
    private modalService: NgxModalStack,
    private activeModal: NgxActiveModal,
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
    this.configureCodeForm();
  }

  public ngAfterViewInit(): void {
    this.focusCodeInput();
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }

  public async resendPhoneCode(): Promise<void> {
    try {
      await this.authService.sendCode();
      this.analyticsService.triggerFormSubmissionSuccess('authenticationEnterCodeResendSmsCode', this.analyticsFormContext);
    } catch (error) {
      this.currentError = Error.UnknownError;
    }
  }

  public async confirmPhoneCode(): Promise<void> {
    if (this.codeForm.invalid) {
      markFormGroupControlsAsDirty(this.codeForm);
      return;
    }

    try {
      const { code } = this.codeForm.value;
      await this.authService.confirmUserPhone(code);
      this.analyticsService.triggerFormSubmissionSuccess('authenticationEnterCodeConfirm', this.analyticsFormContext);
      this.activeModal.close();
    } catch (error) {
      if (error instanceof VerificationCodeMismatchException) {
        this.currentError = Error.WrongCode;
      } else if (error instanceof SMSLimitExceededException) {
        this.currentError = Error.SMSLimitExceededCode;
      } else {
        this.currentError = Error.UnknownError;
      }
    }
  }

  private configureCodeForm(): void {
    this.codeForm = new FormGroup({
      code: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  private focusCodeInput(): void {
    this.codeInput.focus();
  }
}
