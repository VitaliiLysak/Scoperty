import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

import { Observable } from 'rxjs';

import { SHARED_ROUTES_NAMES } from '../../../app.constants';

import { FeatureToggleService } from './feature-toggle.service';

@Injectable()
export class MessagingFeatureToggleGuard implements CanActivate {
  constructor(
    private router: Router,
    private featureToggleService: FeatureToggleService,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.featureToggleService.messaging) {
      this.router.navigate(
        [ `/${ SHARED_ROUTES_NAMES.MAP }` ],
        { queryParamsHandling: 'merge' }
      );
      return false;
    }

    return true;
  }
}
