import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';

import { WINDOW } from '../window.provider';
import { GOOGLE_ANALYTICS_KEY } from '../../../app.constants';
import { environment } from '../../../../environments/environment';

import { GTMWindow } from './analytics.model';
import { LOCAL_STORAGE } from '../local-storage.provider';
import { isNullOrUndefined } from '../../../shared/utils/null-or-undefined.util';

const gaDisableCookie = `ga-disable-${GOOGLE_ANALYTICS_KEY}`;
const COOKIES_PERMISSION: string = 'cookies-permission';

@Injectable()
export class AnalyticsService {
  public get isAvailableGA(): boolean {
    return (isNullOrUndefined(this.localStorage.getItem(gaDisableCookie)) && this.localStorage.getItem(COOKIES_PERMISSION) === 'all') ||
      (!isNullOrUndefined(this.localStorage.getItem(gaDisableCookie)) && this.localStorage.getItem(gaDisableCookie) !== 'true');
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: GTMWindow,
    @Inject(LOCAL_STORAGE) private localStorage: Storage,
  ) {
    this.configureDataLayer();
  }

  public activateAnalytics(): void {
    this.activateGoogleTagManager();
  }

  public triggerFormSubmissionSuccess(formId: string, formContext: string): void {
    const event = 'formSubmissionSuccess';
    this.window.dataLayer.push({
      event,
      formId,
      formContext,
    });
  }

  public disableGoogleAnalytics(): void {
    if (!this.isAvailableGA) {
      this.localStorage.setItem(gaDisableCookie, JSON.stringify(true));
    }
    this.window[gaDisableCookie] = true;
  }

  // Google Tag Manager functions best when deployed alongside a data layer.
  // A data layer is a JavaScript object that is used to pass information from your website
  // to your Tag Manager container.
  private configureDataLayer(): void {
    this.window.dataLayer = this.window.dataLayer || [];
  }

  private activateGoogleTagManager(): void {
    this.window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    const firstScriptElement = this.document.getElementsByTagName('script')[0];
    const gtmScriptElement = this.document.createElement('script');

    gtmScriptElement.type = 'text/javascript';
    gtmScriptElement.async = true;
    gtmScriptElement.src = `https://www.googletagmanager.com/gtm.js?id=${ environment.googleTagManagerKey }`;
    firstScriptElement.parentNode.insertBefore(gtmScriptElement, firstScriptElement);
  }
}
