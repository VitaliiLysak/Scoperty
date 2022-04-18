import { AfterViewInit, Component, Inject, ViewChild, } from '@angular/core';
import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { Params, Router, } from '@angular/router';

import { NgxActiveModal, NgxModalStack, } from 'ngx-multi-modal';

import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
  ConfirmationDialogType,
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { EmailValidators } from '../../../../shared/validators/email.validator';
import { markFormGroupControlsAsDirty } from '../../../../shared/utils/form-group.util';
import { AuthService, ForgotPasswordDeliveryMedium, } from '../../../../core/services/auth.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
// tslint:disable-next-line:max-line-length
import { ErrorUnconfirmedEmailComponent } from '../../../../core/components/registration/error-unconfirmed-email/error-unconfirmed-email.component';

export interface ForgotPasswordModel {
  email: string;
}

enum ForgotPasswordError {
  DefaultError,
  UserEmailNotConfirmedError,
  UserNotRegisteredError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: [
    './forgot-password.component.css',
  ],
})
export class ForgotPasswordComponent implements ForgotPasswordModel, AfterViewInit {
  @ViewChild('emailInput') emailInput: InputComponent;

  email: string;
  name: string = 'forgot-password';
  passwordError: ForgotPasswordError = null;
  userDataForm: FormGroup;

  errors = ForgotPasswordError;

  get userEmail(): FormControl {
    return this.userDataForm.get('email') as FormControl;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgxModalStack,
    private activeModal: NgxActiveModal,
    private analyticsService: AnalyticsService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.emailInput.focus();
  }

  private initForm(): void {
    this.userDataForm = new FormGroup({
      'email': new FormControl(this.email, [
        Validators.required,
        EmailValidators.pattern,
      ]),
    });
  }

  onDismiss(): void {
    this.activeModal.dismiss();
  }

  async onForgotPassword(): Promise<void> {
    if (!this.userDataForm.valid) {
      markFormGroupControlsAsDirty(this.userDataForm);
      return;
    }

    this.passwordError = null;

    this.analyticsService.triggerFormSubmissionSuccess('forgotPasswordForm', 'forgot-password');

    try {
      const userEmail = this.userDataForm.value.email;
      const { email, data } = await this.authService.forgotPassword(userEmail.toLowerCase());
      const deliveryMedium = data.DeliveryMedium;
      if (deliveryMedium === ForgotPasswordDeliveryMedium.Sms) {
        await this.showPhoneCodeConfirmationModal(email);
      } else if (deliveryMedium === ForgotPasswordDeliveryMedium.Email) {
        this.showEmailConfirmationModal();
      } else {
        this.logger.error(`Unknown deliveryMedium "${ deliveryMedium }" in AuthService.forgotPassword.data`);
      }
    } catch (error) {
      if (error.code === 'UserNotFoundException') {
        this.passwordError = ForgotPasswordError.UserNotRegisteredError;
      } else if (error.code === 'InvalidParameterException') {
        this.passwordError = ForgotPasswordError.UserEmailNotConfirmedError;
      } else {
        this.passwordError = ForgotPasswordError.DefaultError;
      }
      this.logger.error('ForgotPasswordComponent::onForgotPassword', error);
    }
  }

  private async showPhoneCodeConfirmationModal(email: string): Promise<void> {
    this.activeModal.close();

    const dialogModel: ConfirmationDialogModel = {
      title: 'Wir haben dir eine SMS an deine Mobilfunknummer geschickt mit der du dich verifiziert hast.',
      type: ConfirmationDialogType.Custom,
      buttonLabel: 'Verstanden',
      icon: 'check',
      iconSize: '40px',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);
    try {
      await modalRef.result;
      this.navigateToChangePasswordPage(email);
    } catch (error) {
      this.logger.error('ForgotPasswordComponent::showPhoneCodeConfirmationModal', error);
    }
  }

  openLinkResend() {
    this.activeModal.close();
    this.modalService.openFromComponent(ErrorUnconfirmedEmailComponent);
  }

  private showEmailConfirmationModal(): void {
    this.activeModal.close();

    const dialogModel: ConfirmationDialogModel = {
      title: 'Wir haben dir eine E-Mail geschickt mit einem Link zum Zurücksetzen des Passwortes.',
      type: ConfirmationDialogType.Custom,
      buttonLabel: 'Verstanden',
      icon: 'check',
      iconSize: '40px',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  private navigateToChangePasswordPage(email: string): void {
    const queryParams: Params = {
      user: email,
      isPhoneCode: true,
    };
    this.router.navigate(
      [ `/${ SHARED_ROUTES_NAMES.CHANGEPASSWORD }` ],
      { queryParams, queryParamsHandling: 'merge' }
    );
  }
}
