import { Params } from '@angular/router';
import { InjectionToken } from '@angular/core';

import getQueryParams from './get-query-params.util';

import { TRACKING_PARAMS } from '../../app.constants';

export const TRACKING_QUERY_PARAMS = new InjectionToken<Params>(
  'TRACKING_QUERY_PARAMS'
);

export function getTrackingQueryParams(): Params {
  const queryParams = getQueryParams();
  return Object
    .keys(queryParams)
    .filter(paramKey => TRACKING_PARAMS.includes(paramKey))
    .reduce((params: Params, paramKey) =>
      Object.assign(params, { [paramKey]: queryParams[paramKey] })
    , {});
}

export default getTrackingQueryParams;
