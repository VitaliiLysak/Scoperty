import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route
} from '@angular/router';

import { AuthService } from '../services/auth.service';
import { CognitoUser } from '../models/user.model';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const url: string = state.url;
    return await this.guardAllow(url);
  }

  async canLoad(route: Route): Promise<boolean> {
    const url: string = route.path;
    return await this.guardAllow(url);
  }

  async guardAllow(url: string): Promise<boolean> {
    const user: CognitoUser = await this.authService.getCurrentUserAsync();

    if (!isNullOrUndefined(user)) {
      return true;
    }

    this.authService.redirectUrl = url;
    this.router.navigate([ this.authService.loginUrl ], { queryParamsHandling: 'merge' });
    return false;
  }
}
