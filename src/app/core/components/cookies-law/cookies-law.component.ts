import { Component } from '@angular/core';

import { SHARED_ROUTES_NAMES } from '../../../app.constants';
import { CookiesPermission, CookiesService } from '../../services/cookies.service';
import { AnalyticsService } from '../../services/analytics/analytics.service';

@Component({
  selector: 'app-cookies-law',
  templateUrl: './cookies-law.component.html',
  styleUrls: ['./cookies-law.component.css']
})
export class CookiesLawComponent {
  public _name: string = 'cookies-law';

  CookiesPermission = CookiesPermission;

  public get linkDataProtection(): string {
    return `/${SHARED_ROUTES_NAMES.DATAPROTECTION}`;
  }

  constructor(
    private cookiesService: CookiesService,
    private analyticsService: AnalyticsService,
  ) {
  }

  public setPermission(cookiesPermission: CookiesPermission): void {
    this.cookiesService.cookiesPermission = cookiesPermission;
    this.cookiesService.cookiesFormIsShown = false;
    if (this.analyticsService.isAvailableGA && cookiesPermission !== CookiesPermission.No) {
      this.analyticsService.activateAnalytics();
    }
  }
}
