import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';
import { StateManagerService } from '../services/state-manager.service';
import { PropertiesRepositoryService } from '../services/properties-repository.service';
import { ExtendedMarkerModel } from '../models/extended-marker.model';

@Injectable()
export class IsActiveMarkerExistGuardService implements CanActivate {

  constructor(
    private router: Router,
    private stateManagerService: StateManagerService,
    private propertiesRepositoryService: PropertiesRepositoryService,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const markerId: string = route.params['id'];
    const marker: ExtendedMarkerModel = await this.propertiesRepositoryService.getMarkerDetails(markerId);

    if (!isNullOrUndefined(marker)) {
      this.stateManagerService.activeMarker = marker;
      return true;
    } else {
      this.router.navigate(['/map'], { queryParamsHandling: 'merge' });
      return false;
    }
  }
}
