import { HttpHeaders } from '@angular/common/http';

import { CONTENT_TYPE_HEADER } from '../../app.constants';

export function evadePreflight(headers = new HttpHeaders()): HttpHeaders {
  return headers.set(CONTENT_TYPE_HEADER, 'text/plain');
}
