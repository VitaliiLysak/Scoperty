import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';

import { PropertiesRepositoryService } from '../../../core/services/properties-repository.service';
import { QueryOptions } from '../../../core/models/properties-repository.model';
import { LOGGER } from '../../../core/services/logger/logger.provider';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { ScopertyPlusMarkerModel } from '../../../core/models/scoperty-plus-marker.model';

import { AbstractMarkerManager } from './abstract-marker-manager.service';
import { GmapsUtils } from 'app/shared/utils/gmaps.util';

const SUPPORTED_ZOOM_LEVELS: ReadonlyArray<number> = Object.freeze([14, 15, 16, 17]);

@Injectable()
export class ScopertyPlusManagerService extends AbstractMarkerManager implements OnDestroy {
  private shortDetailPageEnabledBS = new BehaviorSubject(false);

  readonly shortDetailPageEnabled$ = this.shortDetailPageEnabledBS.asObservable();

  private subscriptions = new Subscription();

  constructor(
    private propertiesRepositoryService: PropertiesRepositoryService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
    super(SUPPORTED_ZOOM_LEVELS);
  }

  ngOnDestroy (): void {
    this.subscriptions.unsubscribe();
  }

  init(
    googleMap: google.maps.Map,
    onMarkerClick: () => any,
    initialZoom: number,
    legacyPinsLoading$?: Observable<void>
  ) {
    super.init(googleMap, onMarkerClick, initialZoom);

    this.subscriptions.add(GmapsUtils.observableFromEvent(googleMap, 'zoom_changed').subscribe(() =>
      this.hideMarkersFromZoomLevel(this.mapZoom)
    ));

    this.subscriptions.add(this.mapBoundsChanged$
      .pipe(switchMap(() => {
        if (!SUPPORTED_ZOOM_LEVELS.includes(this.mapZoom)) {
          return new Observable<void>(observer => {
            observer.next();
            observer.complete();
          });
        } else {
          return legacyPinsLoading$.pipe(debounceTime(1000));
        }
      }))
      .subscribe(() => {
        this.setZoomLevel(this.mapZoom);
        this.fetchMarkers();
      })
    );
  }

  fetchMarkers() {
    if (SUPPORTED_ZOOM_LEVELS.includes(this.mapZoom)) {
      this.shortDetailPageEnabledBS.next(true);
      const options: QueryOptions = {
        coordinates: this.mapBounds,
        zoom: this.mapZoom
      };
      this.propertiesRepositoryService.getScopertyPlusGeo(options)
        .pipe(
          map(scopertyPlusData => scopertyPlusData.features
            .filter(feature => !this.hasMarker(
              ScopertyPlusMarkerModel.createIdentifier(feature, this.mapZoom)
            ))
            .map(feature => {
              const plusPin = new ScopertyPlusMarkerModel(feature, this.mapZoom);
              plusPin.setMap(this.googleMap);
              plusPin.setOnClickHandler(event => this.onMarkerClick(event, plusPin));
              return plusPin;
            })
          )
        )
        .subscribe(
          plusPins => {
            this.pushMarkers(plusPins);
            this.showMarkersForCurrentZoomLevel();
          },
          error => this.logger.error('ScopertyPlusManager::fetchMarkers:error', error)
        );
    } else {
      this.shortDetailPageEnabledBS.next(false);
    }
  }
}
