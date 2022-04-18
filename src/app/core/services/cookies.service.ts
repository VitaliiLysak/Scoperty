import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AnalyticsService } from './analytics/analytics.service';
import { LOCAL_STORAGE } from './local-storage.provider';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';

const COOKIES_PERMISSION: string = 'cookies-permission';

export enum CookiesPermission {
  All = 'all',
  No = 'no',
  GA = 'ga',
}

@Injectable()
export class CookiesService {
  private formIsShown: boolean = false;
  private allCookiesPermittedBS = new BehaviorSubject<boolean>(false);

  allCookiesPermitted$: Observable<boolean> = this.allCookiesPermittedBS.asObservable();

  constructor(
    private analyticsService: AnalyticsService,
    @Inject(LOCAL_STORAGE) private localStorage: Storage
  ) {
    this.handlePermissions();
  }

  public set cookiesFormIsShown(isShown: boolean) {
    this.formIsShown = isShown;
  }

  public get cookiesFormIsShown(): boolean {
    return this.formIsShown;
  }

  public set cookiesPermission(cookiesPermission: CookiesPermission) {
    this.localStorage.setItem(COOKIES_PERMISSION, cookiesPermission);
    this.handlePermissions();
  }

  private handlePermissions() {
    const cookiesPermission = this.cookiesPermission;

    if (cookiesPermission === CookiesPermission.No) {
      this.analyticsService.disableGoogleAnalytics();
    }

    if (cookiesPermission === CookiesPermission.All) {
      this.allCookiesPermittedBS.next(true);
    }
  }

  public get cookiesPermission(): CookiesPermission {
    return <CookiesPermission>this.localStorage.getItem(COOKIES_PERMISSION);
  }

  checkPermission(): boolean {
    return !isNullOrUndefined(this.localStorage.getItem(COOKIES_PERMISSION));
  }
}
