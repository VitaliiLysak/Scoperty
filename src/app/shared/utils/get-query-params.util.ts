import { InjectionToken } from '@angular/core';
import { Params } from '@angular/router';

import { isEmptyString } from './empty-string.util';
import { isNullOrUndefined } from './null-or-undefined.util';

export const QUERY_PARAMS = new InjectionToken<Params>(
  'QUERY_PARAMS'
);

export function getQueryParams(): Params {
  if (isEmptyString(document.location.search)) {
    return {};
  }
  return document.location.search
    .slice(document.location.search.indexOf('?') + 1)
    .split('&')
    .reduce((params, keyValue) => {
      const [key, value] = keyValue.split('=');
      if (isNullOrUndefined(key)) {
        return params;
      }
      if (isNullOrUndefined(value)) {
        return Object.assign(
          params,
          { [key]: decodeURIComponent('') }
        );
      }
      return Object.assign(
        params,
        { [key]: decodeURIComponent(value) }
      );
    }, {});
}

export default getQueryParams;
