import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { NgxActiveModal, NgxModalStack, } from 'ngx-multi-modal';

import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
  ConfirmationDialogType
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../../../core/services/auth.service';
import { EmailValidators } from '../../../../shared/validators/email.validator';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { AuthError } from '../../../../app.constants';

@Component({
  selector: 'app-error-unconfirmed-email',
  templateUrl: './error-unconfirmed-email.component.html',
  styleUrls: ['./error-unconfirmed-email.component.css']
})
export class ErrorUnconfirmedEmailComponent {
  @ViewChild('emailInput') emailField: InputComponent;

  name: string = 'error-unconfirmed-email';
  userEmail: FormControl;
  email: string = '';
  isEmailShown: boolean = false;

  currentError: AuthError;
  AuthError: typeof AuthError = AuthError;

  private initForm(): void {
    this.userEmail = new FormControl(this.email, [Validators.required, EmailValidators.pattern]);
  }

  private resetErrors(): void {
    this.currentError = null;
  }

  constructor(
    private activeModal: NgxActiveModal,
    private authService: AuthService,
    private modalService: NgxModalStack,
    private analyticsService: AnalyticsService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
    this.initForm();
  }

  showEmailForm(): void {
    if (this.isEmailShown) return;

    this.isEmailShown = true;
    this.emailField.focus();
  }

  onDismiss(): void {
    this.activeModal.dismiss();
  }

  async sendMessageAgain(): Promise<void> {
    if (this.userEmail.invalid) {
      this.userEmail.markAsTouched();
      this.userEmail.markAsDirty();
      return;
    }

    this.analyticsService.triggerFormSubmissionSuccess('ConfirmAgainForm', 'send-email');

    this.resetErrors();
    try {
      await this.authService.resendConfirmation(this.userEmail.value);
      this.showUnconfirmedEmailSuccessModal();
      this.activeModal.close();
    } catch (error) {
      this.currentError = AuthError.UnknownError;
      this.logger.error('ErrorUnconfirmedEmailComponent::sendMessageAgain', error);
    }
  }

  private showUnconfirmedEmailSuccessModal(): void {
    const dialogModel: ConfirmationDialogModel = {
      header: 'E-Mail-Adresse bestätigen',
      message: 'Dein Bestätigungslink wurde erneut versendet.',
      type: ConfirmationDialogType.Success,
      buttonLabel: 'Verstanden',
      buttonId: 'error-unconfirmed-email-resend-success-button'
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);
  }
}
