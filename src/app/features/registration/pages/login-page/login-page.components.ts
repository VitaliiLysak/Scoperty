import {
  AfterViewInit,
  Component,
  OnDestroy,
} from '@angular/core';

import {
  ComponentModalRef,
  NgxModalStack,
} from 'ngx-multi-modal';
import { debounce } from 'lodash';

import {
  LoginComponent,
  LoginResultType,
} from '../../components/login/login.component';
import { ShowLoginModalService } from '../../../../core/services/show-login-modal.service';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';

@Component({
  selector: 'app-login-page',
  template: '',
})
export class LoginPageComponent implements AfterViewInit, OnDestroy {
  private modalRef: ComponentModalRef<LoginComponent>;

  constructor(
    private showLoginModalService: ShowLoginModalService,
    private modalService: NgxModalStack,
  ) {
    this.openModal = debounce(this.openModal.bind(this), 300);
  }

  public ngAfterViewInit(): void {
    this.openModal();
  }

  public ngOnDestroy(): void {
    if (!isNullOrUndefined(this.modalRef)) {
      this.modalRef.close(LoginResultType.OpenRegistration);
    }
  }

  private openModal(): void {
    this.modalRef = this.modalService.openFromComponent(LoginComponent);
    this.modalRef.result
      .then(result => this.closeModal(result), () => this.closeModal());
  }

  private closeModal(result?: LoginResultType): void {
    if (result !== LoginResultType.OpenRegistration) {
      this.showLoginModalService.closeLoginModal();
    }
  }
}
