import { HttpErrorResponse } from '@angular/common/http';

import { isEmptyArray } from './empty-array.util';
import { isNullOrUndefined } from './null-or-undefined.util';

interface Error {
  code: string;
}

export function responseHasError(response: HttpErrorResponse, errorCode: string): boolean {
  const errors = response.error;
  if (isNullOrUndefined(errors) || isEmptyArray(errors)) {
    return false;
  }

  const errorForErrorCode = errors.find((error: Error) => {
    return error.code === errorCode;
  });

  return !isNullOrUndefined(errorForErrorCode);
}
