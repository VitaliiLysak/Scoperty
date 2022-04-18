import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';

import { Observable, from, of  } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { LOGGER } from './logger/logger.provider';
import { LoggerService } from './logger/logger.service';
import { SKIP_AUTH_HEADER, CONTENT_TYPE_HEADER } from '../../app.constants';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';

import { AuthService } from './auth.service';

const ASSETS_FOLDER = 'assets/';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private accessToken: string = '';

  constructor(
    private authService: AuthService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isAssetRequest = req.url.startsWith(ASSETS_FOLDER);
    if (isAssetRequest) {
      this.logger.info('AuthInterceptor::RequestIsAsset', req.url);
      return next.handle(req);
    }

    let headers: HttpHeaders = req.headers;
    if (!headers.has(CONTENT_TYPE_HEADER)) {
      headers = headers.set(CONTENT_TYPE_HEADER, 'application/json');
    } else if (headers.get(CONTENT_TYPE_HEADER) === 'default') {
      headers = headers.delete(CONTENT_TYPE_HEADER);
    }

    const currentUser$ = from(this.authService.getCurrentUserAsync());
    return currentUser$.pipe(
      flatMap(user => {
        if (!isNullOrUndefined(user) && !headers.get(SKIP_AUTH_HEADER)) {
          const session$ = from(this.authService.getSession());
          return session$.pipe(
            map(session => {
              this.accessToken = session.getAccessToken().getJwtToken();
              return req.clone({headers: headers.set('Authorization', `Bearer ${this.accessToken}`)});
            }),
          );
        } else {
          if (headers.get(SKIP_AUTH_HEADER) === 'true') {
            headers = headers.delete(SKIP_AUTH_HEADER);
          }

          return of(req.clone({headers}));
        }
      }),
      flatMap(res => next.handle(res)),
    );
  }
}
