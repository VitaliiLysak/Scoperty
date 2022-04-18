import {
  Component,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

import { NgxModalStack, NgxActiveModal } from 'ngx-multi-modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../../../core/services/auth.service';
import {
  CommonErrorComponent,
  CommonErrorDialogModel
} from '../../../../shared/components/common-error/common-error.component';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { CODE_MISMATCH_EXCEPTION } from '../../../../app.constants';

@Component({
  selector: 'app-change-user-phone',
  templateUrl: './change-user-phone.component.html',
  styleUrls: ['./change-user-phone.component.css'],
})

export class ChangeUserPhoneComponent {

  public _name: string = 'change-user-phone';
  public phoneForm: FormGroup;

  private _initForm(): void {
    this.phoneForm = new FormGroup({
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('^[+]?[0-9]{6,}')
      ]),
      code: new FormControl('', [
        Validators.required
      ])
    });
  }

  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private analyticsService: AnalyticsService,
    private modalService: NgxModalStack,
    public activeModal: NgxActiveModal,
  ) {
    this._initForm();
  }

  public get phone() {
    return this.phoneForm.get('phone');
  }

  public get code() {
    return this.phoneForm.get('code');
  }

  public validatePhoneNumber(): void {
    let { phone } = this.phoneForm.value;
    if (phone.startsWith('00')) {
      phone = `+${phone.substring(2)}`;
    } else if (phone.startsWith('0')) {
      phone = `+49${phone.substring(1)}`;
    } else if (!phone.startsWith('+')) {
      phone = `+49${phone}`;
    }
  }

  public async getCode(): Promise<void> {
    if (this.phone.valid) {
      this.validatePhoneNumber();
      try {
        await this.authService.sendCode();
      } catch (error) {
        const dialogModel: CommonErrorDialogModel = {
          title: 'Es gibt ein Problem mit der Telefonverifizierung.',
        };
        const modalRef = this.modalService.openFromComponent(CommonErrorComponent);
        Object.assign(modalRef.instance, dialogModel);
      }
    }
  }

  public async apply(): Promise<void> {
    try {
      const { code, phone } = this.phoneForm.value;
      await this.authService.confirmUserPhone(code);
      await this.authService.updatePhone(phone);
      this.authService.send('update-phone');
      this.analyticsService.triggerFormSubmissionSuccess('changeUserPhoneForm', 'profile-page');
      this.activeModal.close(true);
    } catch (error) {
      if (error.name === CODE_MISMATCH_EXCEPTION) {
        this.code.setErrors({code: {valid: false}});
        setTimeout(() => this.changeDetectorRef.detectChanges(), 300);
      }
    }
  }

  public close(): void {
    this.activeModal.close();
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }
}
