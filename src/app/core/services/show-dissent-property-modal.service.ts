import {
  Inject,
  Injectable,
} from '@angular/core';

import { DialogService } from 'ng2-bootstrap-modal';

import { RegistrationComponent } from '../../features/registration/pages/registration/registration.component';

import {
  AuthService,
  ConfigureType,
} from './auth.service';
import { OpenModalService } from './open-modal.service';

@Injectable({
  providedIn: 'root',
})
export class ShowDissentPropertyModalService {
  constructor(
    private dialogService: DialogService,
    private authService: AuthService,
    private openModalService: OpenModalService,
  ) {
  }

  openDissentPropertyModal(): void {
    this.authService.initConfigure(ConfigureType.Dissent);
    this.openModalService.open();
    this.dialogService
      .addDialog(
        RegistrationComponent,
        { mode: 'delete' },
      )
      .subscribe(() => {
        this.authService.initConfigure();
        this.openModalService.close();
      });
  }
}
