import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  NgxActiveModal,
  NgxModalStack,
} from 'ngx-multi-modal';

@Component({
  selector: 'app-signup-mobile-menu',
  templateUrl: './signup-mobile-menu.component.html',
  styleUrls: [
    './signup-mobile-menu.component.css',
  ],
})
export class SignupMobileMenuComponent {
  public _name: string = 'signup-mobile-menu';

  constructor(
    private modalService: NgxModalStack,
    private activeModal: NgxActiveModal,
    private router: Router,
  ) {
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }

  public close(): void {
    this.activeModal.close();
  }

  public openLogin(): void {
    this.close();
    this.router.navigate(
      [{ outlets: { 'modal': [ 'login'] }}],
      { queryParamsHandling: 'merge' }
    );
  }

  public openSignup(): void {
    this.close();
    this.router.navigate(
      [{ outlets: { 'modal': [ 'signup'] }}],
      { queryParamsHandling: 'merge' }
    );
  }
}
