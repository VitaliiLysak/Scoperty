import { Inject, Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { GOOGLE_MAPS_API_KEY } from '../../app.constants';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';

import { LoggerService } from './logger/logger.service';
import { LOGGER } from './logger/logger.provider';

@Injectable()
export class MapsAutoCompleteService {

  private service: google.maps.places.PlacesService;
  private onAutoCompleteLoad: Subject<boolean> = new Subject<boolean>();
  events$: Observable<boolean> = this.onAutoCompleteLoad.asObservable();

  constructor(@Inject(LOGGER) private logger: LoggerService) {}

  setInstance(googleWrapper: any, map?: google.maps.Map): void {
    if (!isNullOrUndefined(map)) {
      this.service = new googleWrapper.maps.places.PlacesService(map);
    } else {
      this.service = new googleWrapper.maps.places.PlacesService(document.createElement('div'));
    }
    this.onAutoCompleteLoad.next(true);
  }

  findPlace(params: google.maps.places.FindPlaceFromQueryRequest): Observable<google.maps.places.PlaceResult> {
    return new Observable(subscriber => {
      this.service.findPlaceFromQuery(params, (response: google.maps.places.PlaceResult[], status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          response.length
        ) {
          subscriber.next(response[0]);
          subscriber.complete();
        } else {
          subscriber.error(status);
        }
      });
    });
  }

  getDetails(params: google.maps.places.PlaceDetailsRequest): Observable<google.maps.places.PlaceResult> {
    return new Observable(subscriber => {
      this.service.getDetails(params, (response: google.maps.places.PlaceResult, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK
        ) {
          subscriber.next(response);
          subscriber.complete();
        } else {
          subscriber.error(status);
        }
      });
    });
  }
}
