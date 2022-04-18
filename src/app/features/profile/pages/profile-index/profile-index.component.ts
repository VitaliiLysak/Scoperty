import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgxModalStack } from 'ngx-multi-modal';

import { MapManagerService } from '../../../../core/services/map-manager.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ChangeUserPhoneComponent } from '../../components/change-user-phone/change-user-phone.component';
import { DeleteAccountComponent } from '../../components/delete-account/delete-account.component';
import { AvatarLimitComponent } from '../../components/avatar-limit/avatar-limit.component';
import { EmailUpdateComponent } from '../../components/email-update/email-update.component';
import {
  CommonErrorComponent,
  CommonErrorDialogModel,
} from '../../../../shared/components/common-error/common-error.component';
import { isSmallMobileDevice$ } from '../../../../shared/utils/responsive.util';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { CognitoUserFields } from '../../../../app.constants';

@Component({
  selector: 'app-profile-index',
  templateUrl: './profile-index.component.html',
  styleUrls: ['./profile-index.component.css']
})

export class ProfileIndexComponent implements OnInit {

  public userPassword = {
    old_password: '',
    new_password: '',
    new_password_check: ''
  };

  public userData = {
    vorname: '',
    name: ''
  };

  public userEmail = {
    email: ''
  };

  public passwordForm: FormGroup;
  public dataForm: FormGroup;
  public emailForm: FormGroup;

  public _name: string = 'profile';
  public userInfo: any;
  isSmallMobileDevice$ = isSmallMobileDevice$;
  public CognitoUserFields: typeof CognitoUserFields = CognitoUserFields;

  @ViewChild('photoInput')
  photoInput: ElementRef;

  private async _loadUserInfo() {
    try {
      this.userInfo = await this.auth.getUserAttributes();
    } catch (error) {
      this.logger.error('ProfilePage::_loadUserInfo:Error', error);
    }
  }

  constructor(
    private propertiesRepositoryService: PropertiesRepositoryService,
    private auth: AuthService,
    private mapManager: MapManagerService,
    private modalService: NgxModalStack,
    private changeDetectorRef: ChangeDetectorRef,
    private analyticsService: AnalyticsService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
    this._initForm();
  }

  public _initForm() {
    this.passwordForm = new FormGroup({
      'old_password': new FormControl(this.userPassword.old_password, [
        Validators.required
      ]),
      'new_password': new FormControl(this.userPassword.new_password, [
        Validators.required,
        Validators.pattern('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,}')
      ]),
      'new_password_check': new FormControl(this.userPassword.new_password_check, [
        Validators.required
      ])
    });

    this.dataForm = new FormGroup({
      vorname: new FormControl(this.userData.vorname, [
        Validators.required,
        Validators.minLength(2)
      ]),
      name: new FormControl(this.userData.name, [
        Validators.required
      ])
    });

    this.emailForm = new FormGroup({
      email: new FormControl(this.userEmail.email, [
        Validators.required,
        Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*' +
                            '@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')
      ])
    });
  }

  public ngOnInit() {
    this._loadUserInfo();
  }

  public get new_password_check() {
    return this.passwordForm.get('new_password_check');
  }

  public formatDate(obj): any {
    if (obj != null) {
      const a = obj.split(/[^0-9]/);
      const d = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
      return d;
    } else {
      return '';
    }
  }

  public async setMapState(id: string, type: string) {
    const property = await this.propertiesRepositoryService.getMarkerDetails(id);
    this.mapManager.saveMapSettings({
      zoom: 19,
      mapTypeId: 'hybrid',
      center: {
        lat: property.position.lat,
        lng: property.position.lng
      },
      activeMarkerId: id,
      activeMarkerType: type,
      needOpenDetailWindow: true,
    });
  }

  public async openChangeMobilePhoneForm(): Promise<void> {
    const modalRef = this.modalService.openFromComponent(ChangeUserPhoneComponent);
    const modalResult = await modalRef.result;
    if (modalResult) {
      this._loadUserInfo();
    }
  }

  public async openDeleteAccountForm(): Promise<void> {
    const modalRef = this.modalService.openFromComponent(DeleteAccountComponent);
  }

  public async openAvatarLimitForm(): Promise<void> {
    const modalRef = this.modalService.openFromComponent(AvatarLimitComponent);
    const modalResult = await modalRef.result;
    if (modalResult) {
      this.photoInput.nativeElement.click();
    }
  }

  public openEmailUpdateForm(): void {
    this.modalService.openFromComponent(EmailUpdateComponent);
  }

  public onPhotoChanged(event: any) {
    const file = event.target.files[0];
    if (file.size < 1e6 && file.type === 'image/jpeg') {
      const form = new FormData();
      form.append('file', file);
      // @TODO: req to upload/update avatar
    } else {
      this.openAvatarLimitForm();
    }
  }

  public updateEmail() {
    this.openEmailUpdateForm();
    this.emailForm.reset();
    this._loadUserInfo();
    this.analyticsService.triggerFormSubmissionSuccess('profileEmailForm', 'update-email');
  }

  public async updatePassword() {
    if (this.userPassword.new_password !== this.userPassword.new_password_check) {
      this.new_password_check.setErrors({discrepancy: {valid: false}});
      setTimeout(() => this.changeDetectorRef.detectChanges(), 300);
     return;
    }
    try {
      await this.auth.changePassword(this.userPassword.old_password, this.userPassword.new_password);
      this.analyticsService.triggerFormSubmissionSuccess('profilePasswordForm', 'update-password');
    } catch (e) {
      return e;
    }
    this.passwordForm.reset();
  }

  public async updateData() {
    try {
      await this.auth.updateProfile(this.userInfo[CognitoUserFields.GivenName], this.userInfo[CognitoUserFields.FamilyName]);
      this.analyticsService.triggerFormSubmissionSuccess('profileDataForm', 'update-profile-data');
    } catch (e) {
      const dialogModel: CommonErrorDialogModel = {
        title: 'Beim Versuch dein Profil zu aktualisieren, ist ein Fehler aufgetreten.',
      };
      const modalRef = this.modalService.openFromComponent(CommonErrorComponent);
      Object.assign(modalRef.instance, dialogModel);
    }
    this.dataForm.reset();
    await this._loadUserInfo();
  }
}
