import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import {
  HttpClient,
} from '@angular/common/http';

import { NgxModalStack, NgxActiveModal } from 'ngx-multi-modal';

import { AuthService } from '../../../core/services/auth.service';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { LOGGER } from '../../../core/services/logger/logger.provider';
import { CustomerRelationshipManagementService } from '../../../core/services/customer-relationship-manager.service';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
  ConfirmationDialogType
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { EmailValidators } from '../../../shared/validators/email.validator';
import { markFormGroupControlsAsDirty } from '../../../shared/utils/form-group.util';
import { isEmptyString } from '../../../shared/utils/empty-string.util';
import { UserObjectAttributes } from '../../../core/models/user.model';

export interface ContactMeModel {
  propertyId: string;
}

@Component({
  selector: 'app-marker-detail-contact-me-window',
  templateUrl: './marker-detail-contact-me-window.component.html',
  styleUrls: ['./marker-detail-contact-me-window.component.css'],
})

export class MarkerDetailContactMeWindowComponent implements ContactMeModel, OnInit {
  public propertyId: string;
  public _name: string = 'marker-detail-contact-me-window';

  public form: FormGroup = new FormGroup({
    givenName: new FormControl('', Validators.required),
    familyName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, EmailValidators.pattern]),
    message: new FormControl('', Validators.required),
  });

  private openMessageWindow(): void {
    const dialogModel: ConfirmationDialogModel = {
      message: 'Vielen Dank, die Nachricht wurde versendet.',
      type: ConfirmationDialogType.Info,
      buttonLabel: 'OK',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  public get message(): FormControl {
    return this.form.get('message') as FormControl;
  }

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private customerRelationshipManagementService: CustomerRelationshipManagementService,
    private modalService: NgxModalStack,
    private activeModal: NgxActiveModal,
    @Inject(LOGGER) private logger: LoggerService,
  ) { }

  public ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.fillForm();
    }
  }

  public async sendRequest(): Promise<void> {
    if (!this.form.valid) {
      markFormGroupControlsAsDirty(this.form);
      return;
    }

    const contactRequest = this.form.value;
    contactRequest.property = this.propertyId;
    try {
      this.customerRelationshipManagementService.contactOwner(contactRequest);
    } catch (error) {
      this.logger.error('MarkerDetailContactMeWindowComponent::sendRequest', error);
    }
    this.openMessageWindow();
    this.close();
  }

  public async fillForm(): Promise<void> {
    const userAttributes = await this.authService.getUserAttributes() as UserObjectAttributes;
    let {
      'custom:_given_name': givenName,
      'custom:_family_name': familyName,
    } = userAttributes;
    const { email } = userAttributes;
    givenName = isEmptyString(givenName) ? email : givenName;
    familyName = isEmptyString(familyName) ? email : familyName;
    this.form.patchValue({ givenName, familyName, email });
  }

  public close(): void {
    this.activeModal.close();
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }
}
