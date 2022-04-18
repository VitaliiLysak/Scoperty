import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class IsFirstTimeGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (state.url === '/map' || state.url.indexOf('confirmuser') > -1 || state.url.indexOf('changepassword') > -1) {
      return true;
    }
    if (localStorage.hasAlreadyLooked) {
      return true;
    }

    this.router.navigate([ '/map' ], { queryParamsHandling: 'merge' });
    return false;
  }
}
