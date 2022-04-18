import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { NgxModalStack } from 'ngx-multi-modal';

import { SignupMobileMenuComponent } from '../../features/registration/components/signup-mobile-menu/signup-mobile-menu.component';
import { isMobileDevice } from '../../shared/utils/responsive.util';

@Injectable({
  providedIn: 'root',
})
export class ShowSignupModalService {
  private isMobileDevice: boolean = isMobileDevice();

  constructor(
    private router: Router,
    private modalService: NgxModalStack,
  ) {
  }

  public showSignup(): void {
    if (this.isMobileDevice) {
      this.openSignUpMobileMenu();
    } else {
      this.openSignUpModal();
    }
  }

  public openSignUpModal(): void {
    this.router.navigate(
      [{ outlets: { modal: [ 'signup' ] } }],
      { queryParamsHandling: 'merge' }
    );
  }

  public closeSignUpModal(): void {
    this.router.navigate(
      [{ outlets: { modal: null } }],
      { queryParamsHandling: 'merge' }
    );
  }

  public openSignUpMobileMenu(): void {
    this.modalService.openFromComponent(SignupMobileMenuComponent);
  }
}
