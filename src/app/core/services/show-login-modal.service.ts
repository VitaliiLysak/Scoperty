import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ShowLoginModalService {
  constructor(
    private router: Router,
  ) {
  }

  public openLoginModal(): void {
    this.router.navigate(
      [{ outlets: { modal: [ 'login' ] } }],
      { queryParamsHandling: 'merge' }
    );
  }

  public closeLoginModal(): void {
    this.router.navigate(
      [{ outlets: { modal: null } }],
      { queryParamsHandling: 'merge' }
    );
  }
}
