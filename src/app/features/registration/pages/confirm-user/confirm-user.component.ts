import { AfterViewInit, Component, OnInit, } from '@angular/core';
import { ActivatedRoute, Params, Router, } from '@angular/router';

import { NgxModalStack } from 'ngx-multi-modal';

import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { AuthService } from '../../../../core/services/auth.service';
import { MapFilterService } from '../../../../core/services/map-filter.service';
import { ShowLoginModalService } from '../../../../core/services/show-login-modal.service';
import {
  CommonErrorComponent,
  CommonErrorDialogModel,
} from '../../../../shared/components/common-error/common-error.component';
import { isSmallMobileDevice } from '../../../../shared/utils/responsive.util';

@Component({
  selector: 'app-confirm-user',
  template: '',
})
export class ConfirmUserComponent implements OnInit, AfterViewInit {
  public _name: string = 'confirm';

  public message: string = '';
  public params: Params = null;

  constructor(
    private actRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private modalService: NgxModalStack,
    private showLoginModalService: ShowLoginModalService,
    private mapFilterService: MapFilterService,
  ) {}

  public async ngOnInit(): Promise<void> {
    this.params = this.actRoute.snapshot.queryParams;
  }

  public async ngAfterViewInit(): Promise<void> {
    if (this.params) {
      await this.confirmUser(this.params);
    } else {
      this.goToMapPage();
      this.toggleShownFiltersOnMobile();
    }
  }

  private async confirmUser(params: Params): Promise<void> {
    try {
      await this.authService.confirm(params.user, params.code);
      this.message = 'Deine E-Mail Adresse wurde bestätigt. Vielen Dank!';

      this.goToMapPage();
      this.toggleShownFiltersOnMobile();

      this.showLoginModal();
    } catch (error) {
      if (error.code != null && error.code === 'NotAuthorizedException'
        && error.message === 'User cannot be confirm. Current status is CONFIRMED') {

        // use timer to show error-confirm modal over onboard-process modal (if it is open)
        setTimeout(() => {
          const dialogModel: CommonErrorDialogModel = {
            title: 'Der Bestätigungslink ist inaktiv.',
            text: 'Bitte registrieren oder melden Sie sich erneut.'
          };
          const modalRef = this.modalService.openFromComponent(CommonErrorComponent);
          Object.assign(modalRef.instance, dialogModel);
        }, 500);
      }

      this.goToMapPage();
      this.toggleShownFiltersOnMobile();
    }
  }

  private async showLoginModal(): Promise<void> {
    this.showLoginModalService.openLoginModal();
  }

  private goToMapPage(): void {
    this.router.navigate(
      [ `/${ SHARED_ROUTES_NAMES.MAP }` ],
      { queryParamsHandling: 'merge' }
    );
  }

  private toggleShownFiltersOnMobile(): void {
    if (isSmallMobileDevice()) {
      setTimeout(() => {
        this.mapFilterService.toggleFiltersShown(false);
      }, 500);
    }
  }
}
