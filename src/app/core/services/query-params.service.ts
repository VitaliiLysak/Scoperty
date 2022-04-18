import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, ActivationEnd, ParamMap, Params, Router, RouterEvent, } from '@angular/router';

import { filter, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { propTypeToFrontEnd, statusToFrontEndOriginal, } from '../../shared/utils/deserializator.util';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';
import { PropertyStatus, PropertyType, PropertyTypeDto, } from '../models/properties-repository.model';
import { Point } from '../models/location.model';
import { LOCATION } from './location.provider';
import { WINDOW } from './window.provider';
import { LAST_LANDING_QUERY_PARAM } from '../../app.constants';

export interface QueryParamsFilters {
  sellingStatus?: PropertyStatus;
  propertyType?: PropertyType;
}

export interface TrackingQueryParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  last_land?: string;
}

export interface MapInitializationQueryParams extends Point {
  zoom?: number;
}

const QP_UTM_SOURCE: string = 'utm_source';
const QP_UTM_MEDIUM: string = 'utm_medium';
const QP_UTM_CAMPAIGN: string = 'utm_campaign';
const QP_UTM_CONTENT: string = 'utm_content';
const QP_PARAMS_FOR_SEARCH_ALERT_POPUP: string = 'search_alert_popup';
const QP_SELLING_STATUS: string = 'selling_status';
const QP_SEARCH_QUERY: string = 'search_query';
const QP_PROPERTY_TYPE: string = 'property_type';
const QP_LATITUDE: string = 'lat';
const QP_LONGITUDE: string = 'lng';
const QP_ZOOM: string = 'zoom';
const QP_OPEN_SCOPERTY_PLUS_ONBOARD: string = 'open_scoperty_plus_onboard';
export const QP_OPEN_SEARCH_ALERT_MODAL: string = 'open_search_alert_modal';
const PARAMS_FOR_DISAGREEMENT: string = 'disagreement';

@Injectable({
  providedIn: 'root'
})
export class QueryParamsService {
  private previousRoute = '';

  readonly showSearchAlertPopup$: Observable<boolean> = this.activatedRoute.queryParamMap
    .pipe(
      map((paramMap: ParamMap) => {
        const showSearchAlertPopup = paramMap.get(QP_PARAMS_FOR_SEARCH_ALERT_POPUP);
        return this.booleanFromString(showSearchAlertPopup);
      }),
      take(1),
    );

  readonly filters$: Observable<QueryParamsFilters> = this.activatedRoute.queryParamMap
    .pipe(
      map((paramMap: ParamMap) => {
        const sellingStatus = paramMap.get(QP_SELLING_STATUS);
        const propertyType = paramMap.get(QP_PROPERTY_TYPE);
        if (isNullOrUndefined(sellingStatus) && isNullOrUndefined(propertyType)) {
          return  null;
        }

        const sellingStatusFE: PropertyStatus = statusToFrontEndOriginal(sellingStatus);
        const propertyTypeFE: PropertyType = propTypeToFrontEnd(<PropertyTypeDto>propertyType);
        return {
          sellingStatus: sellingStatusFE,
          propertyType: propertyTypeFE,
        };
      }),
      take(1),
    );

  readonly mapAddressQuery$: Observable<string> = this.activatedRoute.queryParamMap
    .pipe(
      map((paramMap: ParamMap) => paramMap.get(QP_SEARCH_QUERY)),
      take(1)
    );

  readonly presetMapLocation$: Observable<MapInitializationQueryParams> = this.activatedRoute.queryParamMap
    .pipe(
      map((paramMap: ParamMap) => {
        const lat = parseFloat(paramMap.get(QP_LATITUDE));
        const lng = parseFloat(paramMap.get(QP_LONGITUDE));
        let zoom = parseFloat(paramMap.get(QP_ZOOM));

        zoom = isFinite(zoom) && !isNaN(zoom) ? zoom : null;

        if (
          lat && lng &&
          !isNaN(lat) && !isNaN(lng) &&
          isFinite(lat) && isFinite(lng)
        ) {
          return {lat, lng, zoom};
        }

        return null;
      }),
      take(1)
    );

  readonly trackingQueryParams$: Observable<TrackingQueryParams> = this.activatedRoute.queryParamMap
    .pipe(
      map((paramMap: ParamMap) => {
        const utmSource = paramMap.get(QP_UTM_SOURCE);
        const utmMedium = paramMap.get(QP_UTM_MEDIUM);
        const utmCampaign = paramMap.get(QP_UTM_CAMPAIGN);
        const utmContent = paramMap.get(QP_UTM_CONTENT);
        const lastLand = paramMap.get(LAST_LANDING_QUERY_PARAM);
        const queryParams: TrackingQueryParams = {
          utm_source: 'direct'
        };

        if (!isNullOrUndefined(utmSource)) {
          queryParams.utm_source = utmSource;
        }
        if (!isNullOrUndefined(utmMedium)) {
          queryParams.utm_medium = utmMedium;
        }
        if (!isNullOrUndefined(utmCampaign)) {
          queryParams.utm_campaign = utmCampaign;
        }
        if (!isNullOrUndefined(utmContent)) {
          queryParams.utm_content = utmContent;
        }
        if (!isNullOrUndefined(lastLand)) {
          queryParams.last_land = lastLand;
        }

        return queryParams;
      }),
      take(1),
    );

  readonly showDisagreementModal$: Observable<boolean> = this.activatedRoute.queryParamMap
    .pipe(
      map((paramMap: ParamMap) => {
        // Return true if parameter is present
        return !isNullOrUndefined(paramMap.get(PARAMS_FOR_DISAGREEMENT));
      }),
      take(1),
    );

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(LOCATION) private location: Location,
    @Inject(WINDOW) private window: Window,
  ) {
    router.events
      .pipe(
        filter(event => event instanceof ActivationEnd)
      )
      .subscribe((event: RouterEvent) => {
        const route = this.getRouteFromPath();

        if (route !== '/map' && this.previousRoute === '/map') {
          setTimeout(() => this.clearLocation());
        }

        this.previousRoute = route;
      });
  }

  changeQueryParams(params: Params): void {
    const url = new URL(this.location.href);
    const searchParams = new URLSearchParams(url.search);
    Object.keys(params)
      .forEach((key) => {
        if (params[key]) {
          searchParams.set(key, params[key]);
        } else {
          searchParams.delete(key);
        }
      });

    url.search = searchParams.toString();
    this.window.history.replaceState({}, '', url.toString());
  }

  getDirectQueryParams() {
    const searchParams = new URLSearchParams(new URL(this.location.href).search);
    const returnedQueryParams = {};

    searchParams.forEach((value, key) => {
      returnedQueryParams[key] = value;
    });

    return returnedQueryParams;
  }

  changeQueryParamsViaAngularRouter(queryParams: Params) {
    this.router.navigate([this.location.pathname], {
      queryParamsHandling: 'merge',
      replaceUrl: true,
      queryParams,
    });
  }

  getLocation(): Partial<MapInitializationQueryParams> {
    const params: Partial<MapInitializationQueryParams> = {};
    const queryParams = this.getDirectQueryParams();

    params.lat = parseFloat(queryParams[QP_LATITUDE]);
    params.lng = parseFloat(queryParams[QP_LONGITUDE]);
    params.zoom = parseFloat(queryParams[QP_ZOOM]);

    if (
      !isNullOrUndefined(params.lat) && !isNaN(params.lat) && isFinite(params.lat) &&
      !isNullOrUndefined(params.lng) && !isNaN(params.lng) && isFinite(params.lng) &&
      !isNullOrUndefined(params.zoom) && !isNaN(params.zoom) && isFinite(params.zoom)
    ) {
      return params;
    }

    return null;
  }

  hasOpenSearchAlertModal() {
    return this.getDirectQueryParams()[QP_OPEN_SEARCH_ALERT_MODAL];
  }

  hasOpenScopertyPlusOnboard(): string {
    return this.getDirectQueryParams()[QP_OPEN_SCOPERTY_PLUS_ONBOARD];
  }

  clearOpenSearchAlertModal() {
    const params = {};
    params[QP_OPEN_SEARCH_ALERT_MODAL] = null;

    this.changeQueryParamsViaAngularRouter(params);
  }

  clearOpenScopertyPlusOnboardModal() {
    const params = {};
    params[QP_OPEN_SCOPERTY_PLUS_ONBOARD] = null;

    this.changeQueryParamsViaAngularRouter(params);
  }

  setLocation(params: MapInitializationQueryParams): void {
    const queryParams = {};

    // 5 digits are more than enough since they give 1 meter of precision.
    // Better leave more space to the marketing params.
    queryParams[QP_LATITUDE] = params.lat.toFixed(5);
    queryParams[QP_LONGITUDE] = params.lng.toFixed(5);
    queryParams[QP_ZOOM] = params.zoom;

    this.changeQueryParams(queryParams);
  }

  clearLocation(): void {
    const queryParams = {};

    queryParams[QP_LATITUDE] = null;
    queryParams[QP_LONGITUDE] = null;
    queryParams[QP_ZOOM] = null;

    this.changeQueryParams(queryParams);
  }

  private getRouteFromPath(): string {
    const path = this.location.pathname;
    const slashQuantity = (path.match(/\//g) || []).length;
    if (slashQuantity > 1) {
      return location.pathname.match(/(^\/.*?)\//)[1];
    } else {
      return this.location.pathname;
    }
  }

  private booleanFromString(value: string): boolean {
    return value === 'true';
  }
}
