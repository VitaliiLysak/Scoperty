import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MapsAPILoader } from '@agm/core';

import { Point, MapObject } from '../models/location.model';
import { Coordinates } from '../models/coordinates.model';
import { MapSettings } from '../models/map-settings.model';
import { MapFilterService } from './map-filter.service';
import { FilterOptions } from '../models/filter-options.model';
import { PropertiesRepositoryService } from './properties-repository.service';

import { HTTP_Settings } from '../../app.constants';
import { SearchPointData } from '../models/search.model';

import {
  MAP_CONSTANTS,
  ZOOM_CONSTANTS,
} from '../../main/main.constants';
import { ExtendedMarkerModel } from '../models/extended-marker.model';
import { isSmallMobileDevice } from '../../shared/utils/responsive.util';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';

export interface Streams {
  count: Subject<Object>;
  markersChunksLoaded: Subject<void>;
  noDataChannel: BehaviorSubject<Object>;
}

@Injectable()
export class MapManagerService {
  private savedMapSettings: MapSettings = null;
  private savedSearchSettings: any = null;
  private MAP_ZOOM_DEFAULT = ZOOM_CONSTANTS.NEIGHBOURHOOD.value;
  private GLOBAL_URL = HTTP_Settings.host;
  private _mapInitSettings: MapSettings;
  private placeChangerSubject: Subject<MapObject> = new Subject<MapObject>();
  private mapCenterChangeBS: BehaviorSubject<Point> = new BehaviorSubject<Point>(null);
  private mapZoomChangeBS: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  private mapLoadedSubject: Subject<void> = new Subject<void>();
  private activatedMarkerIdSubject: Subject<string> = new Subject<string>();
  private activatedMarkerModelSubject: Subject<ExtendedMarkerModel> = new Subject<ExtendedMarkerModel>();
  private settingsChange$: Subject<MapSettings> = new Subject<MapSettings>();
  private settingsUpdateSubject: Subject<MapSettings> = new Subject<MapSettings>();
  private countMarkers$: Subject<Object> = new Subject<Object>();
  private noDataChannel$: BehaviorSubject<Object> = new BehaviorSubject<Object>({value: false});
  private transitionToPreviousMarkerEventStream: Subject<null> = new Subject();
  private transitionToClosestMarkerEventStream: Subject<null> = new Subject();
  private updateActiveMarkerEventStream: Subject<any> = new Subject<any>();
  private newsNotice$: Subject<null> = new Subject();
  private searchPropertySubject: BehaviorSubject<SearchPointData> = new BehaviorSubject<SearchPointData>(null);
  private searchPropertyActivated$: Subject<string> = new Subject<string>();
  private checkProperty$: Subject<boolean> = new Subject<boolean>();
  private googleMapSDKLoadPromise: Promise<void> = null;
  private favoriteIdsMap: Set<string> = new Set<string>();
  private markersChunksLoaded = new Subject<void>();
  readonly markersChunksLoaded$ = this.markersChunksLoaded.asObservable();

  public readonly mapZoom$: Observable<number> = this.mapZoomChangeBS.asObservable().pipe(filter(zoom => !isNullOrUndefined(zoom)));
  public readonly placeChanger$: Observable<MapObject> = this.placeChangerSubject.asObservable();
  public readonly settingsUpdate$: Observable<MapSettings> = this.settingsUpdateSubject.asObservable();
  public readonly activatedMarkerId$: Observable<string> = this.activatedMarkerIdSubject.asObservable();
  public readonly activatedMarkerModel$: Observable<ExtendedMarkerModel> = this.activatedMarkerModelSubject.asObservable();
  public readonly mapLoaded$: Observable<void> = this.mapLoadedSubject.asObservable();
  public searchbarAutofocusChanger$: Subject<boolean> = new Subject<boolean>();

  public showFilteredMarkers: boolean = false;
  public filtersUpdatedCounter: number = 0;
  public placeChangerData: MapObject = null;
  public mapSettingsData: MapSettings = null;
  public isSmallMobileDevice: boolean = isSmallMobileDevice();

  constructor(
    private httpClient: HttpClient,
    private apiLoader: MapsAPILoader,
    private mapFilterService: MapFilterService,
    private propertiesRepositoryService: PropertiesRepositoryService,
  ) {
    this._initMapSettings();
    this.loadGoogleMapSDK();
  }

  public async loadGoogleMapSDK(): Promise<any> {
    this.googleMapSDKLoadPromise = this.apiLoader.load();

    return await this.googleMapSDKLoadPromise;
  }

  public get mapInitSettings(): MapSettings {
    return this._mapInitSettings;
  }

  private _initMapSettings(): void {
    const settings = this._generateDefaultMapSettings();
    this._mapInitSettings = settings;
    this.MAP_ZOOM_DEFAULT = this.mapInitSettings.zoom;
  }

  private _generateDefaultMapSettings(): MapSettings {
    const { MAP_INIT_SETTINGS } = MAP_CONSTANTS;
    return {
      mapTypeId: MAP_INIT_SETTINGS.MAP_TYPE,
      latitude: MAP_INIT_SETTINGS.LATITUDE,
      longitude: MAP_INIT_SETTINGS.LONGITUDE,
      zoom: MAP_INIT_SETTINGS.ZOOM,
      activatedMarkerId: null,
    };
  }

  private _serializeFilter(filters: FilterOptions): any {
    const data = {
      PropertyType: filters.PropertyType,
      PriceMin: filters.PriceFrom,
      PriceMax: filters.PriceTo,
      LivingSurfaceMin: <number>filters.AreaSize,
      LivingSurfaceMax: <number>filters.AreaSize2,
    };
    const statuses = (<any>Object).entries(filters.SellingStatus);
    const activeStatuses = statuses.filter(([key, value]) => value);
    if (!activeStatuses.length) {
      return null;
    } else if (activeStatuses.length < statuses.length) {
      data['SellingStatus1'] = activeStatuses[0][0];
      if (activeStatuses.length === 2) {
        data['SellingStatus2'] = activeStatuses[1][0];
      }
    }
    return data;
  }

  private _serializeCoordinates(coordinates): any {
    return {
      NWLat: coordinates.nwLatitude,
      NWLong: coordinates.nwLongitude,
      SELat: coordinates.seLatitude,
      SELong: coordinates.seLongitude
    };
  }

  public getOptionsForMarkersRequest(coordinates: Coordinates, zoom: number, resetFECache: boolean): any {
    return {
      coordinates: coordinates,
      filterOptions: this.mapFilterService.filters,
      zoom: zoom,
      resetFECache,
    };
  }

  public getMarkersStream(): any {
    return this.propertiesRepositoryService.openStream({
      count: this.countMarkers$,
      markersChunksLoaded: this.markersChunksLoaded,
      noDataChannel: this.noDataChannel$
    });
  }

  public getTransitionToPreviousMarkerEventStream(): Subject<null> {
    return this.transitionToPreviousMarkerEventStream;
  }

  public getTransitionToClosestMarkerEventStream(): Subject<null> {
    return this.transitionToClosestMarkerEventStream;
  }

  public getMarkersCountStream(): Subject<Object> {
    return this.countMarkers$;
  }

  public getNewsNoticeStream(): Subject<null> {
    return this.newsNotice$;
  }

  public addNoticeNews(coordinates: Coordinates): Observable<any> {
    const _filter = this._serializeFilter(this.mapFilterService.filters);
    if (!_filter) {
      return throwError({isClientError: true, message: 'Bitte wählen Sie den Verkaufsstatus.'});
    }
    const _coordinates = this._serializeCoordinates(coordinates);
    const data = Object.assign(_filter, _coordinates);
    const url = `${this.GLOBAL_URL}/filter`;
    return this.httpClient.post(`${url}`, data);
  }

  public getPlaceChangesStream(): Subject<MapObject> {
    return this.placeChangerSubject;
  }

  public getSearchPropertyStream(): BehaviorSubject<any> {
    return this.searchPropertySubject;
  }

  public searchProperty(pointData: SearchPointData): void {
    this.searchPropertySubject.next(pointData);
  }

  public getSearchPropertyActivatedStream(): Subject<string> {
    return this.searchPropertyActivated$;
  }

  public getCheckPropertyStream(): Subject<boolean> {
    return this.checkProperty$;
  }

  public getSettingsChangesStream(): Subject<MapSettings> {
    return this.settingsChange$;
  }

  public getUpdatedSettingsStream(): Subject<MapSettings> {
    return this.settingsUpdateSubject;
  }

  public getNoDataStream(): BehaviorSubject<Object> {
    return this.noDataChannel$;
  }

  public getUpdateActiveMarkerEventStream(): Subject<any> {
    return this.updateActiveMarkerEventStream;
  }

  public changePlace(place: MapObject): void {
    this.placeChangerSubject.next(place);
  }

  public mapLoaded(): void {
    this.mapLoadedSubject.next();
  }

  public updateMapCenter(center: Point) {
    this.mapCenterChangeBS.next(center);
  }

  public getMapCenter(): Point {
    return this.mapCenterChangeBS.value;
  }

  public updateMapZoom(zoom: number) {
    this.mapZoomChangeBS.next(zoom);
  }

  public getMapZoom(): number {
    return this.mapZoomChangeBS.value;
  }

  public searchPropertyActivated(propertyId: string): void {
    this.searchPropertyActivated$.next(propertyId);
  }

  public checkProperty(valid: boolean): void {
    this.checkProperty$.next(valid);
  }

  public resetSettingsToDefaultAndNotify(): void {
    this._initMapSettings();
    this.settingsChange$.next(this._mapInitSettings);
  }

  public setMapSettings(settings: MapSettings): void {
    this.settingsUpdateSubject.next(settings);
  }

  public changeAutofocus(enableAutofocus: boolean): void {
    this.searchbarAutofocusChanger$.next(enableAutofocus);
  }

  public setActivatedMarkerId(propertyId: string): void {
    this.activatedMarkerIdSubject.next(propertyId);
  }

  public setActivatedMarkerModel(property: ExtendedMarkerModel): void {
    this.activatedMarkerModelSubject.next(property);
  }

  public saveMapSettings({
    zoom,
    mapTypeId,
    activeMarkerId,
    activeMarkerType,
    needOpenDetailWindow,
    center: {lat, lng},
  }: MapSettings): void {
    this.savedMapSettings = {
      zoom,
      mapTypeId,
      activeMarkerId,
      activeMarkerType,
      needOpenDetailWindow,
      center: {lat, lng}
    };
  }

  public getSavedMapSettings(): MapSettings {
    return this.savedMapSettings;
  }

  hasSavedMapSettings(): boolean {
    return !isNullOrUndefined(this.savedMapSettings);
  }

  clearMapSettings(): void {
    this.savedMapSettings = null;
  }

  public saveSearchSettingsFromStartPage(searchSettings: FilterOptions): void {
    this.showFilteredMarkers = true;
    this.mapFilterService.filtersShown = !this.isSmallMobileDevice;
    this.mapFilterService.temporaryFilters = searchSettings;
    this.savedSearchSettings = searchSettings;
    this.mapFilterService.confirmFilters();
  }

  public hasFavoriteId(id: string): boolean {
    return this.favoriteIdsMap.has(id);
  }

  public addFavoriteId(id: string): void {
    this.favoriteIdsMap.add(id);
  }

  public deleteFavoriteId(id: string): void {
    this.favoriteIdsMap.delete(id);
  }
}
