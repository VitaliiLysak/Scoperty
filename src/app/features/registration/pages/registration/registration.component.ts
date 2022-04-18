import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { NgxActiveModal, NgxModalStack, } from 'ngx-multi-modal';

import { IAddressData } from '../../components/address/address.model';
import { IPhoneData } from '../../components/phone/phone.model';
import { MsgDeleteDataComponent } from '../../components/msg-delete-data/msg-delete-data.component';
import { DissentType } from '../../models/dissent-type.model';
import { RegistrationMode } from '../../models/registration-mode.model';
import { RemoveTicket } from '../../../../core/models/remove-ticket.model';
import { OpenModalService } from '../../../../core/services/open-modal.service';
import { MapManagerService } from '../../../../core/services/map-manager.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MapFilterService } from '../../../../core/services/map-filter.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
  ConfirmationDialogType
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { isSmallMobileDevice } from '../../../../shared/utils/responsive.util';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';

export interface RegistrationModel {
  title:              string;
  activeTab:          string;
  nextStep:           string;
  isOwnerWindow:      boolean;
  goToMain:           boolean;
  isOpenLogin:        boolean;
  showEmailVerifyMessage: boolean;
  mode:               string;
  reloadOwnership:    boolean;
  needPrefillData:    boolean;
  markerId:           string;
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent extends DialogComponent <RegistrationModel, string> implements OnInit, OnDestroy {
  private userEmail: string = '';

  public title: string = '';
  public activeTab: string = 'registration';
  // @FIXME: check nextStep when you register.
  public nextStep: string = 'registration';

  public phoneData: IPhoneData = null;
  public addressData: IAddressData = null;
  public dissentType: DissentType = null;

  public isEmailVerify: boolean = false;
  public showEmailVerifyMessage: boolean = false;
  public reloadOwnership: boolean = false;
  public needPrefillData: boolean = false;
  public markerId: string = null;
  public isUserLoggedIn: boolean = this.authService.isUserLoggedIn();

  public _name: string = 'registration';

  public infoAccepted: boolean = false;
  public mode: RegistrationMode = 'registration';

  public get isRegistrationTabActive(): boolean {
    return this.activeTab === 'registration';
  }

  public get isVerifyTabActive(): boolean {
    return this.activeTab === 'verify';
  }

  public get isAddressTabActive(): boolean {
    return this.activeTab === 'address';
  }

  public get isDeleteMode(): boolean {
    return this.mode === 'delete';
  }

  public get isNonDeleteMode(): boolean {
    return [ 'registration', 'add_property', 'set_owner' ].includes(this.mode);
  }

  public get isConfirmPhoneMode(): boolean {
    return this.mode === 'confirm_phone';
  }

  public get isAddPropertyOrSetOwnerMode(): boolean {
    return this.mode === 'add_property' || this.mode === 'set_owner';
  }

  public get showInfo(): boolean {
    return !isSmallMobileDevice() ||
      (isSmallMobileDevice() && this.isDeleteMode && !this.infoAccepted);
  }

  public get showForm(): boolean {
    return !isSmallMobileDevice() ||
      (isSmallMobileDevice() && !this.isDeleteMode) ||
      (isSmallMobileDevice() && this.isDeleteMode && this.infoAccepted);
  }

  private showUnconfirmedEmailSuccessModal(): void {
    const dialogModel: ConfirmationDialogModel = {
      header: 'E-Mail-Adresse bestätigen',
      message: 'Dein Bestätigungslink wurde erneut versendet.',
      type: ConfirmationDialogType.Success,
      buttonLabel: 'Verstanden',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  private showUnconfirmedEmailErrorModal(): void {
    const dialogModel: ConfirmationDialogModel = {
      header: 'E-Mail-Adresse bestätigen',
      message: 'Beim Senden der Bestätigungsmail ist ein Fehler aufgetreten.',
      type: ConfirmationDialogType.Error,
      buttonLabel: 'Weiter',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  constructor(
    private openModalService: OpenModalService,
    private router: Router,
    private mapManager: MapManagerService,
    private mapFilterService: MapFilterService,
    private authService: AuthService,
    private scrollToService: ScrollToService,
    private propertiesRepositoryService: PropertiesRepositoryService,
    private modalService: NgxModalStack,
    private activeModal: NgxActiveModal,
    public dialogService: DialogService,
  ) {
    super(dialogService);
  }

  public ngOnInit(): void {
    if (['add_property'].includes(this.mode)) this.activeTab = 'address';
    if (['confirm_phone', 'set_owner', 'delete'].includes(this.mode)) this.activeTab = 'verify';
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public async showAuthorization(): Promise<void> {
    this.close();
    this.router.navigate(
      [{ outlets: { 'modal': [ 'login'] }}],
      { queryParamsHandling: 'merge' }
    );
  }

  public signupCompleted(email: string): void {
    this.userEmail = email;
    this.isEmailVerify = true;
  }

  public addressCompleted(addressData?: IAddressData): void {
    this.goElement('elementTabs');

    if (addressData) this.addressData = addressData;
    let tab: string = null;

    if (this.isDeleteMode) tab = 'opposition';
    else tab = 'verify';

    this.handleCurrentTab(tab);
  }

  public phoneCompleted(phoneData?: IPhoneData): void {
    if (phoneData) {
      this.phoneData = phoneData;
    }

    this.goElement('elementTabs');

    if (this.isConfirmPhoneMode) {
      this.close();
    } else if (this.isDeleteMode) {
      this.handleCurrentTab('address');
    }
  }

  public oppositionCompleted(dissentType?: DissentType): void {
    if (dissentType) this.dissentType = dissentType;
  }

  public async dissentProperty(): Promise<void> {
    const dissentData = await this.dissentData();
    await this.removePropertyTicket(dissentData);
    await this.openMessageDeleteDataForm();
  }

  public async removePropertyTicket(removePropertyTicket: RemoveTicket): Promise<void> {
    await this.propertiesRepositoryService.removePropertyTicket(removePropertyTicket);
  }

  public async openMessageDeleteDataForm(): Promise<void> {
    this.openModalService.open();
    this.dialogService.addDialog(
      MsgDeleteDataComponent,
      {title: 'Account löschen'}
    )
      .subscribe(() => {
        this.openModalService.close();
        this.closeModal();
      });
  }

  public handleCurrentTab(tab: string): void {
    this.activeTab = tab;
  }

  public async sendMessageAgain(): Promise<void> {
    if (this.userEmail !== '') {
      try {
        await this.authService.resendConfirmation(this.userEmail);
        this.showUnconfirmedEmailSuccessModal();
        this.activeModal.close();
      } catch (error) {
        this.showUnconfirmedEmailErrorModal();
        this.activeModal.close();
      }
    } else {
      this.showUnconfirmedEmailErrorModal();
      this.activeModal.close();
    }
  }

  public clickOnLogo(): void {
    this.router.navigate(['/map'], { queryParamsHandling: 'merge' });
    this.mapManager.resetSettingsToDefaultAndNotify();
    if (isSmallMobileDevice()) {
      setTimeout(() => {
        this.mapFilterService.toggleFiltersShown(false);
      }, 500);
    }
    this.closeModal();
  }

  public goElement(element: string): void {
    const config: ScrollToConfigOptions = {
      target: element,
      duration: 650,
      easing: 'easeOutElastic',
      offset: 20
    };

    this.scrollToService.scrollTo(config);
  }

  public acceptInfo(): void {
    this.infoAccepted = true;
  }

  public closeModal(): void {
    this.close();
  }

  public async dissentData(): Promise<RemoveTicket> {
    let data: RemoveTicket = null;

    const reporterSub = this.phoneData.sub;
    const isOwner = this.phoneData.role === 'owner' ? true : false;
    const property = this.addressData.propertyId;
    const remove = this.dissentType === 'remove_property' ? true : false;
    const floor = this.addressData.address.floor;

    if (isNullOrUndefined(floor) || floor === '') data = {reporterSub, isOwner, property, remove};
    else data = {reporterSub, isOwner, property, remove, floor};

    return data;
  }
}
