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
  SignupResult,
  SignupModalComponent,
} from '../../components/signup-modal/signup-modal.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ShowSignupModalService } from '../../../../core/services/show-signup-modal.service';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';

@Component({
  selector: 'app-signup-page',
  template: '',
})
export class SignupPageComponent implements AfterViewInit, OnDestroy {
  private modalRef: ComponentModalRef<SignupModalComponent>;

  constructor(
    private modalService: NgxModalStack,
    private authService: AuthService,
    private showSignupModalService: ShowSignupModalService,
  ) {
    this.openModal = debounce(this.openModal.bind(this), 300);
  }

  public ngAfterViewInit(): void {
    this.openModal();
  }

  public ngOnDestroy(): void {
    if (!isNullOrUndefined(this.modalRef)) {
      this.modalRef.close(SignupResult.OpenLogin);
    }
    this.authService.clearSignupInfo();
  }

  private openModal(): void {
    this.modalRef = this.modalService.openFromComponent(SignupModalComponent);
    this.modalRef.result
      .then(result => this.closeModal(result), () => this.closeModal());
  }

  private closeModal(result?: SignupResult): void {
    if (result !== SignupResult.OpenLogin) {
      this.showSignupModalService.closeSignUpModal();
    }
    this.authService.clearSignupInfo();
  }
}
