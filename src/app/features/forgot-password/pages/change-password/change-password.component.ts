import { AfterViewInit, Component, Inject, } from '@angular/core';
import { Router } from '@angular/router';

import { NgxModalStack } from 'ngx-multi-modal';

import { ConfirmPasswordComponent } from '../../components/confirm-password/confirm-password.component';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { MapFilterService } from '../../../../core/services/map-filter.service';
import { AuthService } from '../../../../core/services/auth.service';
import { isSmallMobileDevice } from '../../../../shared/utils/responsive.util';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
  ConfirmationDialogResult,
  ConfirmationDialogType
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CommonErrorComponent } from '../../../../shared/components/common-error/common-error.component';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';

interface TemporaryUserData {
  username: string;
  password: string;
}

@Component({
  selector: 'app-change-password',
  template: '',
})
export class ChangePasswordComponent implements AfterViewInit {
  constructor(
    private authService: AuthService,
    private mapFilterService: MapFilterService,
    private modalService: NgxModalStack,
    private router: Router,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
  }

  public async ngAfterViewInit(): Promise<void> {
    await this.openModal();
  }

  private async openModal(): Promise<void> {
    try {
      const modalRef = this.modalService.openFromComponent(ConfirmPasswordComponent);
      const user: TemporaryUserData = await modalRef.result;
      this.openSuccessModal(user);
    } catch (error) {
      this.logger.error('ChangePassword', error);
      this.onCloseModal();
    }
  }

  private async openSuccessModal({username, password}: TemporaryUserData): Promise<void> {
    this.onCloseModal();

    const dialogModel: ConfirmationDialogModel = {
      title: 'Dein Passwort wurde erfolgreich geändert!',
      type: ConfirmationDialogType.Custom,
      buttonLabel: 'Jetzt anmelden',
      icon: 'check',
      iconSize: '40px',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);

    const type = await modalRef.result;
    if (type === ConfirmationDialogResult.Button) {
      try {
        await this.authService.userAuth(username, password);
        this.authService.send('login');
      } catch (error) {
        this.modalService.openFromComponent(CommonErrorComponent);
      }
    }
  }

  private onCloseModal(): void {
    if (isSmallMobileDevice()) {
      setTimeout(() => {
        this.mapFilterService.toggleFiltersShown(false);
      }, 500);
    }
    this.navigateToMapPage();
  }

  private navigateToMapPage(): void {
    this.router.navigate(
      [ `/${ SHARED_ROUTES_NAMES.MAP }` ],
      { queryParamsHandling: 'merge' }
    );
  }
}
