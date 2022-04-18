import { Inject, Injectable } from '@angular/core';

import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { QueryParamsService } from '../../../core/services/query-params.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WINDOW } from '../../../core/services/window.provider';
import { SHARED_ROUTES_NAMES } from '../../../app.constants';
import { isNullOrUndefined } from '../../../shared/utils/null-or-undefined.util';

export enum MyPropertiesTabs {
  Overview = 'overview',
  Edit = 'edit',
  Settings = 'settings',
}

export const PROFILE_MY_PROPERTIES_QUERY_PARAMS: Readonly<Dictionary<string>> = {
  ACTIVE_TAB: 'activeTab'
};

@Injectable({
  providedIn: 'root',
})
export class MyPropertiesService {
  private activeTabSubject: BehaviorSubject<MyPropertiesTabs> = new BehaviorSubject<MyPropertiesTabs>(MyPropertiesTabs.Overview);
  readonly activeTab$: Observable<MyPropertiesTabs> = this.activeTabSubject.asObservable();

  private activePropertyIdSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  readonly activePropertyId$: Observable<string> = this.activePropertyIdSubject.asObservable();

  readonly activeTabQueryParam$: Observable<MyPropertiesTabs> = this.activatedRoute.queryParams
    .pipe(
      take(1),
      filter(queryParams => !isNullOrUndefined(queryParams[PROFILE_MY_PROPERTIES_QUERY_PARAMS.ACTIVE_TAB])),
      map(queryParams => queryParams[PROFILE_MY_PROPERTIES_QUERY_PARAMS.ACTIVE_TAB])
    );

  readonly isOverview$: Observable<boolean> = this.activeTab$.pipe(
    map((tab: MyPropertiesTabs) => tab === MyPropertiesTabs.Overview),
  );
  readonly isEdit$: Observable<boolean> = this.activeTab$.pipe(
    map((tab: MyPropertiesTabs) => tab === MyPropertiesTabs.Edit),
  );
  readonly isSettings$: Observable<boolean> = this.activeTab$.pipe(
    map((tab: MyPropertiesTabs) => tab === MyPropertiesTabs.Settings),
  );

  get activePropertyId(): string {
    return this.activePropertyIdSubject.value;
  }

  constructor(
    private queryParamsService: QueryParamsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(WINDOW) private window: Window,
  ) {}

  updatePropertyIdRouteParam(propertyId: string): void {
    const queryParams = this.queryParamsService.getDirectQueryParams();
    const commands = [SHARED_ROUTES_NAMES.PROFILE, SHARED_ROUTES_NAMES.PROPERTY];
    if (!isNullOrUndefined(propertyId)) {
      commands.push(propertyId);
    }

    const url = this.router.createUrlTree(commands, { queryParams: queryParams }).toString();

    this.window.history.replaceState({}, '', url);
  }

  setActiveTab(tab: MyPropertiesTabs): void {
    this.activeTabSubject.next(tab);
    this.updateActiveTabQueryParam(tab);
  }

  setActivePropertyId(propertyId: string): void {
    this.activePropertyIdSubject.next(propertyId);

    this.setActiveTab(MyPropertiesTabs.Overview);
  }

  clearActivePropertyId(): void {
    this.activePropertyIdSubject.next(null);
  }

  openEditPropertyTab(propertyId: string): void {
    this.setActiveTab(MyPropertiesTabs.Edit);
    this.setActivePropertyId(propertyId);
  }

  private updateActiveTabQueryParam(activeTab: MyPropertiesTabs): void {
    const queryParams = this.queryParamsService.getDirectQueryParams();
    const commands = [SHARED_ROUTES_NAMES.PROFILE, SHARED_ROUTES_NAMES.PROPERTY];
    if (!isNullOrUndefined(activeTab)) {
      queryParams['activeTab'] = activeTab;
    } else {
      delete queryParams['activeTab'];
    }

    const propertyId = this.activePropertyId;
    if (!isNullOrUndefined(propertyId)) {
      commands.push(propertyId);
    }
    const url = this.router.createUrlTree(commands, { queryParams: queryParams }).toString();

    this.window.history.replaceState({}, '', url);
  }
}
