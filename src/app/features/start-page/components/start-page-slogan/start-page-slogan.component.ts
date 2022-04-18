import { Component } from '@angular/core';

import { DialogService } from 'ng2-bootstrap-modal';

import { RegistrationComponent } from '../../../registration/pages/registration/registration.component';
import { AuthService, ConfigureType } from '../../../../core/services/auth.service';
import { OpenModalService } from '../../../../core/services/open-modal.service';
import { isSmallMobileDevice$ } from '../../../../shared/utils/responsive.util';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';

@Component({
  selector: 'app-start-page-slogan',
  templateUrl: './start-page-slogan.component.html',
  styleUrls: [
    './start-page-slogan.component.css',
  ],
})
export class StartPageSloganComponent {
  public _name: string = 'start-page-slogan';

  isSmallMobileDevice$ = isSmallMobileDevice$;

  public linkToAbout: string = `/${SHARED_ROUTES_NAMES.ABOUT}`;

  constructor(
    private authService: AuthService,
    private dialogService: DialogService,
    private openModalService: OpenModalService,
  ) {}

  public onOpenContradictionPossibility(): void {
    this.authService.initConfigure(ConfigureType.Dissent);
    this.openModalService.open();
    this.dialogService.addDialog(
      RegistrationComponent,
      { mode: 'delete' },
    )
      .subscribe((message) => {
        this.authService.initConfigure();
        this.openModalService.close();
      });
  }
}
