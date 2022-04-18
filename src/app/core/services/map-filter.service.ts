import { Injectable, OnDestroy } from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { FilterOptions } from '../models/filter-options.model';
import { CoordinatesDescription } from '../models/coordinates.model';
import { FILTER_INITIAL_VALUES } from '../../app.constants';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';

import { StateManagerService } from './state-manager.service';
import { MapFilterStorageService } from './map-filter-storage.service';

@Injectable()
export class MapFilterService implements OnDestroy {
  public filtersShown = true;
  public temporaryFilters: FilterOptions = {} as FilterOptions;
  public filters: FilterOptions = {} as FilterOptions;

  private authSubscription: Subscription;

  public zoomOutForResultsSubject: Subject<boolean> = new Subject<boolean>();
  public readonly zoomOutForResults$: Observable<boolean> = this.zoomOutForResultsSubject.asObservable();

  private coordinatesDescriptionSubject: BehaviorSubject<CoordinatesDescription> = new BehaviorSubject<CoordinatesDescription>({
    coordinates: null,
    zoom: null,
  });
  public readonly coordinatesDescription$: Observable<CoordinatesDescription> = this.coordinatesDescriptionSubject.asObservable();

  private filtersSubject: BehaviorSubject<Object> = new BehaviorSubject<Object>({});
  readonly filters$: Observable<Object> = this.filtersSubject.asObservable();

  constructor(
    private stateManagerService: StateManagerService,
    private mapFilterStorageService: MapFilterStorageService,
  ) {
    this.stateManagerService.setMapFilterService(this);
    this.clearFilters();
  }

  public confirmFilters(): void {
    if (JSON.stringify(this.filters) === JSON.stringify(this.temporaryFilters)) return;
    this.filters = cloneDeep(this.temporaryFilters);
    this.filtersSubject.next(this.filters);
  }

  public clearFilters(): void {
    const storedFilters: FilterOptions = this.mapFilterStorageService.getFilters();
    if (!isNullOrUndefined(storedFilters)) {
      this.temporaryFilters = storedFilters;
      this.mapFilterStorageService.clearFilters();
    } else {
      this.temporaryFilters = cloneDeep(FILTER_INITIAL_VALUES);
    }

    this.confirmFilters();
  }

  public toggleFiltersShown(value: boolean): void {
    this.filtersShown = value;
  }

  setCoordinates(coordinatesDescription: CoordinatesDescription): void {
    this.coordinatesDescriptionSubject.next(coordinatesDescription);
  }

  public setZoomOutForResults(zoomOut: boolean): void {
    this.zoomOutForResultsSubject.next(zoomOut);
  }

  public ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
