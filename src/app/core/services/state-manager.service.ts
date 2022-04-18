import { Inject, Injectable } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import FontFaceObserver from 'fontfaceobserver';

import { ExtendedMarkerModel } from '../models/extended-marker.model';
import { SHARED_ROUTES_NAMES } from '../../app.constants';
import { MapFilterService } from '../../core/services/map-filter.service';
import { EmbededAppartment } from '../models/embeded-appartment.model';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';
import { isEmptyString } from '../../shared/utils/empty-string.util';

import { LoggerService } from './logger/logger.service';
import { LOGGER } from './logger/logger.provider';
import { LOCATION } from './location.provider';


const { MORTGAGE_REQUEST, BROKER, IMPRESSUM, PROPERTY_DETAIL, PROFILE, BUY, SELL } = SHARED_ROUTES_NAMES;

@Injectable()
export class StateManagerService {
  public static _fontLoaded: boolean = false;

  private propertyIdForNewHolderSubject: BehaviorSubject<string> = new BehaviorSubject('');
  private mapFilterService: any = null;

  public isMapPageChanged: Subject<boolean> = new Subject();
  public isImpressumPageChanged: Subject<boolean> = new Subject();
  public isBrokerPageChanged: Subject<boolean> = new Subject();
  public isMortgageRequestPageChanged: Subject<boolean> = new Subject();
  public isPropertyDetailPageChanged: Subject<boolean> = new Subject();
  public isProfilePageChanged: Subject<boolean> = new Subject();
  public isStartPageChanged: Subject<boolean> = new Subject();
  public apartmentsListChanged$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public activeMarker: ExtendedMarkerModel = new ExtendedMarkerModel();
  public assignedEmbededAppartment: EmbededAppartment = null;
  public isTipShown: boolean = true;
  public isStartPage: boolean = true;
  public isPropertyDetailPage: boolean = true;
  public isProfilePage: boolean = true;
  public isBrokerPage: boolean = true;
  public isMortgageRequestPage: boolean = true;
  public isImpressumPage: boolean = true;
  public isDashboardNavbarShown: boolean = true;
  public isMapPage: boolean = true;
  public markersDetailIsOpen: boolean = false;
  public markersDetailShouldBeReopened: boolean = false;

  public readonly propertyIdForNewHolder$: Observable<string> = this.propertyIdForNewHolderSubject.asObservable();

  public static getBrowserVersion(): {name: string, version: string} {
    const ua = navigator.userAgent;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    let tem: any;

    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return { name: 'IE', version: (tem[1] || '') };
    }

    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) {
        tem = tem.slice(1);
        return {name: tem[0].replace('OPR', 'Opera'), version: tem[1]};
      }
    }

    M = M[2]
      ? [M[1], M[2]]
      : [navigator.appName, navigator.appVersion, '-?'];

    if (!isNullOrUndefined(tem = ua.match(/version\/(\d+)/i))) {
      M.splice(1, 1, tem[1]);
    }

    return {
      name: M[0],
      version: M[1]
    };
  }

  constructor(
    private router: Router,
    @Inject(LOGGER) private logger: LoggerService,
    @Inject(LOCATION) private location: Location,
  ) {
    this.subscribeToRouterEvents();
    this.loadFonts();
    this.webpHandler();
  }

  public setMapFilterService(mapFilterService: MapFilterService): void {
    this.mapFilterService = mapFilterService;
  }

  private webpHandler(): void {
    window['_canIUseWebP'] = (() => {
      const browser = StateManagerService.getBrowserVersion();
      if (browser.name === 'Firefox' && +browser.version >= 65) {
        return true;
      }
      if (browser.name === 'Chrome' && +browser.version >= 23) {
        return true;
      }
      if (browser.name === 'Opera' && +browser.version >= 13) {
        return true;
      }
      if (browser.name === 'Edge' && +browser.version >= 18) {
        return true;
      }
      return false;
    })();
  }

  private subscribeToRouterEvents(): void {
    const isFirstPage: {state: boolean} = { state: true };
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart || event instanceof NavigationEnd),
        tap((event: NavigationStart | NavigationEnd) => {
          this.checkMapRoute(isFirstPage, event);
          this.checkCurrentRoute(event);
        }),
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe((event: NavigationEnd) => {
        this.checkProfileAndPropertyDetailRoutes(event);
      });
  }

  private checkMapRoute(isFirstPage: {state: boolean}, event: NavigationStart | NavigationEnd): void {
    if (
      event instanceof NavigationStart ||
      (
        event instanceof NavigationEnd &&
        event.url.indexOf('/map') === -1 &&
        event.urlAfterRedirects.indexOf('/map') === -1 &&
        this.isMapPage
      )
    ) {
      this.changeIsMapPage(false);
      isFirstPage.state = false;
      if (this.markersDetailIsOpen) this.markersDetailShouldBeReopened = true;
      return;
    }

    if (
      event.url.includes('/map') ||
      (event instanceof NavigationEnd && event.urlAfterRedirects.includes('/map'))
    ) {
      this.changeIsMapPage(true);
    }

    if (event instanceof NavigationEnd && isFirstPage.state) {
      isFirstPage.state = false;
    }
  }

  private checkCurrentRoute(event: NavigationStart | NavigationEnd): void {
    const urlsList = ['', '/', MORTGAGE_REQUEST, BROKER, IMPRESSUM, BUY, SELL];

    const urlWithQueryParams = event instanceof NavigationStart
      ? event.url
      : event.urlAfterRedirects;

    const url = (new URL(this.location.origin + urlWithQueryParams)).pathname;

    for (const urlToCheck of urlsList) {
      if (this.isUrlEqualRoute(url, urlToCheck)) {
        this.changeIsThisRouteCurrent(urlToCheck, true);
        return;
      }
      this.changeIsThisRouteCurrent(urlToCheck, false);
    }
  }

  // this func check if current url includes 'property-detail' and 'profile' in naming (e.g. profile, profile/chat, profile/offers etc)
  private checkProfileAndPropertyDetailRoutes(event: NavigationEnd): void {
    const urlList = [PROPERTY_DETAIL, PROFILE];

    const currentUrl = event.url;
    const urlAfterRedirects = event.urlAfterRedirects;

    for (const url of urlList) {
      if (
        !isNullOrUndefined(currentUrl) &&
        this.isUrlEqualRoute(currentUrl, url) ||
        !isNullOrUndefined(urlAfterRedirects) &&
        this.isUrlEqualRoute(urlAfterRedirects, url)
      ) {
        this.changeIsThisRouteCurrent(url, true);
      } else {
        this.changeIsThisRouteCurrent(url, false);
      }
    }
  }

  private changeIsThisRouteCurrent(url: string, value: boolean) {
    switch (url) {
      case '': case '/': case BUY: case SELL: {
        this.isStartPage = value;
        this.isStartPageChanged.next(value);
        break;
      }
      case BROKER: {
        this.isBrokerPage = value;
        this.isBrokerPageChanged.next(value);
        break;
      }
      case MORTGAGE_REQUEST: {
        this.isMortgageRequestPage = value;
        this.isMortgageRequestPageChanged.next(value);
        break;
      }
      case IMPRESSUM: {
        this.isImpressumPage = value;
        this.isImpressumPageChanged.next(value);
        break;
      }
      case PROPERTY_DETAIL: {
        this.isPropertyDetailPage = value;
        this.isPropertyDetailPageChanged.next(value);
        break;
      }
      case PROFILE: {
        this.isProfilePage = value;
        this.isProfilePageChanged.next(value);
        break;
      }
    }
  }

  private changeIsMapPage(value: boolean): void {
    this.isMapPage = value;
    this.isMapPageChanged.next(value);
  }

  private loadFonts(): void {
    Promise
      .all([
        new FontFaceObserver('Nunito Sans', {weight: 200}).load(),
        new FontFaceObserver('Nunito Sans', {weight: 300}).load(),
        new FontFaceObserver('Nunito Sans', {weight: 400}).load(),
      ])
      .then(() => StateManagerService._fontLoaded = true)
      .catch(error => {
        StateManagerService._fontLoaded = false;
        this.logger.error('MapManagerService::loadFonts', error);
      });
  }

  private isUrlEqualRoute(url: string, routeName: string): boolean {
    return url.length <= 1 || routeName.length <= 1
      ? url === routeName
      : new RegExp(`^\/${routeName}\S*`).test(url);
  }
}
