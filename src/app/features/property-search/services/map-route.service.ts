import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { QueryParamsService } from '../../../core/services/query-params.service';
import { SHARED_ROUTES_NAMES } from '../../../app.constants';
import { WINDOW } from '../../../core/services/window.provider';
import { isNullOrUndefined } from '../../../shared/utils/null-or-undefined.util';

@Injectable()
export class MapRouteService {
  constructor(
    private queryParamsService: QueryParamsService,
    private router: Router,
    @Inject(WINDOW) private window: Window,
  ) {}

  updateRoute(propertyId: string): void {
    const queryParams = this.queryParamsService.getDirectQueryParams();
    const commands = [SHARED_ROUTES_NAMES.MAP];
    if (!isNullOrUndefined(propertyId)) {
      commands.push(propertyId);
    }

    const url = this.router.createUrlTree(commands, { queryParams: queryParams }).toString();

    this.window.history.replaceState({}, '', url);
  }
}
