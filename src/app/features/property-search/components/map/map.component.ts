import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MapsEventListener } from '@agm/core/services/google-maps-types';
import { EMPTY, forkJoin, Observable, of, Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap, take, takeWhile } from 'rxjs/operators';
import { NgxModalStack } from 'ngx-multi-modal';
import { debounce } from 'lodash';

import { MapManagerService } from '../../../../core/services/map-manager.service';
import { MapFilterService } from '../../../../core/services/map-filter.service';
import { MapsAutoCompleteService } from '../../../../core/services/maps-auto-complete.service';
import { SchedulerService } from '../../../../core/services/scheduler.service';
import { StateManagerService } from '../../../../core/services/state-manager.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { LOCAL_STORAGE } from '../../../../core/services/local-storage.provider';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { MarkerModel } from '../../../../core/models/marker.model';
import { FragmentModel } from '../../../../core/models/fragment.model';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { MapAutoCompleteData, MapObject, Place, ZoomLevel } from '../../../../core/models/location.model';
import { Coordinates } from '../../../../core/models/coordinates.model';
import { MAP_STYLED_TYPE_BASE, MAP_STYLED_TYPE_LABELS, } from '../../../../gmaps.style';
import { FetchableBehaviorSubject } from '../../../../shared/utils/fetchable-rx.util';
import calculateZoomLevel from '../../../../shared/utils/zoom-level.util';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import { isEmptyString } from '../../../../shared/utils/empty-string.util';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
  ConfirmationDialogType
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import {
  AVAILABLE_MAP_TYPES,
  MAP_CLUSTERS_CONFIG,
  MAP_DATA_SHADER_LAYER_CONFIG,
  MAP_SETTINGS,
  ZOOM_CONSTANTS,
} from '../../../../main/main.constants';
import {
  MAP_BOUNDS_CHANGED_DEBOUNCE,
  NARROWING_FACTOR,
  SQUARE_COORDINATES_COEFFICIENT
} from '../../../../app.constants';
import { FancyInfoWindowComponent } from '../fancy-info-window/fancy-info-window.component';
import { GmapsUtils } from '../../../../shared/utils/gmaps.util';
import { shouldShowDataShaderLayer } from '../../../../shared/utils/data-shader-layer.util';
import { MapInitializationQueryParams, QueryParamsService } from '../../../../core/services/query-params.service';
import { ClustersManagerService } from '../../services/clusters-manager.service';
import { MarkerModelWithoutAddress } from '../../../../core/models/marker-without-address.model';
import { PROPERTY_SEARCH_ROUTE_PARAMS } from '../../property-search-routing.module';
import { MapRouteService } from '../../services/map-route.service';
import { ScopertyPlusManagerService } from '../../services/scoperty-plus-manager.service';
import { calculateCoordinateShift, ScopertyPlusMarkerModel } from '../../../../core/models/scoperty-plus-marker.model';
import { ScopertyPlusAdService } from '../../../../core/services/scoperty-plus-ad.service';
import { ClusterModel } from '../../../../core/models/cluster.model';
import { PlaceDescription } from 'app/shared/components/search-place/search-place.component';
import { isSmallDevice } from '../../../../shared/utils/responsive.util';
import PlaceResult = google.maps.places.PlaceResult;

enum MapLayer {
  DataShaderLayer = 0,
  StreetAndCityLabels = 1,
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['../../../../main.css', './map.component.css'],
  providers: [
    ClustersManagerService,
    ScopertyPlusManagerService,
    MapRouteService
  ]
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() isSidebarShown: boolean;

  @Output() markerActivate: EventEmitter<MarkerModel | FragmentModel> = new EventEmitter();

  @ViewChild('fancyInfoWindow') fancyInfoWindow: FancyInfoWindowComponent;

  private mapsModule: any = null;

  private oldZoom: number;
  private currentZoom: number;

  private zoomChanged: boolean;

  private isFilterResponse: boolean = false;
  private firstMapUpdate: boolean = true;

  private showedMarkersHistory: Array<MarkerModel | FragmentModel> = [];
  private mapListeners: Array<MapsEventListener> = [];

  private zoomOutInProgress: boolean = false;

  public googleMap: google.maps.Map = null;
  public googleMapSettings: any = MAP_SETTINGS;

  public activeBuilding: MarkerModel = null;
  public activeMarker: MarkerModel | FragmentModel | MarkerModelWithoutAddress = null;
  public activeMarkerId: string = null;
  public activeMarkerType: string = null;

  private legacyPinsLoading = new Subject<void>();
  readonly legacyPinsLoading$ = this.legacyPinsLoading.asObservable();

  public markers: Map<string, MarkerModel | FragmentModel> = new Map<string, MarkerModel | FragmentModel>();

  public subscriptionMap: Map<string, Subscription> = new Map<string, Subscription>();

  public showHintboxNoMarkers: boolean = false;
  public incorrectLocation: boolean = false;
  public needOpenDetailWindow = false;

  openWithoutAddress: boolean = false;

  public searchPointData: MapAutoCompleteData = null;

  public _name: string = 'map';

  private subscriptions: Subscription = new Subscription();

  scopertyPlusMarker: ScopertyPlusMarkerModel = null;

  public get mapBounds(): Coordinates {
    const bounds = this.googleMap.getBounds();
    if (bounds == null) throw new Error('Map not ready!');

    const neBound = bounds.getNorthEast();
    const swBound = bounds.getSouthWest();

    if (this.mapZoom <= 17) {
      return {
        nwLatitude: neBound.lat() - NARROWING_FACTOR,
        nwLongitude: swBound.lng() - NARROWING_FACTOR,
        seLatitude: swBound.lat() - NARROWING_FACTOR,
        seLongitude: neBound.lng() - NARROWING_FACTOR,
      };
    }

    return {
      nwLatitude: neBound.lat(),
      nwLongitude: swBound.lng(),
      seLatitude: swBound.lat(),
      seLongitude: neBound.lng(),
    };
  }

  public get mapZoom(): number {
    if (this.googleMap == null) return 0;
    return this.googleMap.getZoom();
  }

  public set mapZoom(value: number) {
    if (!isNullOrUndefined(value)) {
      this.googleMap.setZoom(value);
    }
  }

  public set mapCenter(value: google.maps.LatLngLiteral | google.maps.LatLng) {
    if (this.googleMap == null) return;
    // @FIXME: later check this code for further use
    // this.googleMap.setCenter(value);
    this.googleMap.panTo(value);
  }

  public get zoomLevel(): ZoomLevel {
    return calculateZoomLevel(this.mapZoom);
  }

  public get zoomLevelChanged(): boolean {
    const res = this.zoomLevel !== calculateZoomLevel(this.oldZoom);
    this.updateZoom();
    return res;
  }

  public get getMapZoomLow(): boolean {
    return this.mapZoom > this.googleMapSettings.minZoom;
  }

  public get getMapZoomHigh(): boolean {
    return this.mapZoom < this.googleMapSettings.maxZoom;
  }

  get isDataShaderLayerVisible(): boolean {
    return shouldShowDataShaderLayer(this.mapZoom);
  }

  private _fetchMarkers: (options: any) => void;

  private subscribeOnMarkersStream(key: string, stream: FetchableBehaviorSubject<any>, handler: (data: any) => void): void {
    this._fetchMarkers = stream.fetch;
    this.subscribeOn(key, stream, handler);
  }

  private clearRenderedMarkers(): void {
    this.markers.forEach((marker, id) => {
      marker.unsubscribe((<any>window).google.maps);
      marker.hide();
      this.markers.delete(id);
    });
  }

  private computeDistanceBetween(fromPoint: google.maps.LatLng, toPoint: google.maps.LatLng): number {
    try {
      return google.maps.geometry.spherical.computeDistanceBetween(fromPoint, toPoint);
    } catch (error) {
      return 0;
    }
  }

  private getClosestMarker(initialMarker: MarkerModel | FragmentModel | MarkerModelWithoutAddress): MarkerModel {
    let closestMarker = null;
    let closestDistance = Infinity;
    this.markers.forEach((marker) => {
      if (!marker.isRendered || marker === initialMarker || this.showedMarkersHistory.indexOf(marker) > -1) return;
      const distance = this.computeDistanceBetween(initialMarker.positionAsLatLng, marker.positionAsLatLng);
      if (distance > 0 && distance < closestDistance) {
        closestMarker = marker;
        closestDistance = distance;
      }
    });
    return closestMarker;
  }

  private zoomOutForResults(state: boolean): void {
    this.zoomOutInProgress = state;
    if (!state) return;
    --this.mapZoom;
  }

  private zoomOutResults(): void {
    if (this.currentZoom > 15) {
      if (!this.markers.size) {
        this.mapFilter.setZoomOutForResults(true);
      } else {
        this.mapFilter.setZoomOutForResults(false);
      }
    } else {
      this.mapFilter.setZoomOutForResults(false);
    }
  }

  private initMapLoadedListener (): void {
    google.maps.event.addListenerOnce(this.googleMap, 'idle', () => {
      this.mapManager.mapLoaded();
    });
  }

  // Public methods
  constructor(
    private elementRef: ElementRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private mapManager: MapManagerService,
    private mapFilter: MapFilterService,
    private scheduler: SchedulerService,
    private autocompleteService: MapsAutoCompleteService,
    private zone: NgZone,
    private stateManager: StateManagerService,
    private authService: AuthService,
    private mapManagerService: MapManagerService,
    private propertiesRepositoryService: PropertiesRepositoryService,
    private modalService: NgxModalStack,
    private queryParamsService: QueryParamsService,
    private clustersManagerService: ClustersManagerService,
    public scopertyPlusManagerService: ScopertyPlusManagerService,
    private scopertyPlusAdService: ScopertyPlusAdService,
    private mapRouteService: MapRouteService,
    @Inject(LOGGER) private logger: LoggerService,
    @Inject(LOCAL_STORAGE) private localStorage: Storage,
  ) {
    this.fetchMarkers = debounce(this.fetchMarkers.bind(this), 300);
    this.filtersUpdated = debounce(this.filtersUpdated.bind(this), 400);
    this.placeChanged = debounce(this.placeChanged.bind(this), 500);
    this.settingUpdated = debounce(this.settingUpdated.bind(this), 500);
    this.mapBoundsChanged = debounce(this.mapBoundsChanged.bind(this), MAP_BOUNDS_CHANGED_DEBOUNCE);
    this.countMarkersChanged = debounce(this.countMarkersChanged.bind(this), 2000);
    this.zoomOutForResults = this.zoomOutForResults.bind(this);
    this.zoomOutResults = this.zoomOutResults.bind(this);
  }

  public ngOnInit(): void {
    this.subscriptions.add(this.activatedRoute.params.subscribe(params => {
      const propertyId = params[PROPERTY_SEARCH_ROUTE_PARAMS.PROPERTY_ID];

      if (!isNullOrUndefined(propertyId)) {
        this.activeMarkerId = propertyId;
        this.activeMarkerChanged(propertyId);
      }
    }));

    this.loadGoogleMapSDK();
    this.subscribeOnMarkersStream('handleMarkersChunk', this.mapManager.getMarkersStream(), this.handleMarkersChunk);
    this.subscribeOn('filtersUpdated', this.mapFilter.filters$, this.filtersUpdated);
    this.subscribeOn('markersChunksLoaded', this.mapManager.markersChunksLoaded$, this.markersChunksLoaded);
    this.subscribeOn('placeChanged', this.mapManager.getPlaceChangesStream(), this.placeChanged);
    this.subscribeOn('settingChanged', this.mapManager.getSettingsChangesStream(), this.settingChanged);
    this.subscribeOn('settingUpdated', this.mapManager.getUpdatedSettingsStream(), this.settingUpdated);
    this.subscribeOn('activeMarkerIdChanged', this.mapManager.activatedMarkerId$, this.activeMarkerChanged);
    this.subscribeOn('activeMarkerModelChanged', this.mapManager.activatedMarkerModel$, this.activeMarkerChanged);
    this.subscribeOn('hasMarkersInAreaChanged', this.mapManager.getNoDataStream(), this.hasMarkersInAreaChanged);
    this.subscribeOn('hasNoticeNewsAdded', this.mapManager.getNewsNoticeStream(), this.hasNoticeNewsAdded);
    this.subscribeOn('countMarkersChanged', this.mapManager.getMarkersCountStream(), this.countMarkersChanged);
    this.subscribeOn('transitionToPreviousMarker', this.mapManager.getTransitionToPreviousMarkerEventStream(), this.prevMarker);
    this.subscribeOn('transitionToClosestMarker', this.mapManager.getTransitionToClosestMarkerEventStream(), this.nextMarker);
    this.subscribeOn('updateActiveMarker', this.mapManager.getUpdateActiveMarkerEventStream(), this.updateActiveMarker);
    this.subscribeOn('userLogout', this.authService.events, this.authChange);
    this.subscribeOn('zoomOutForResults', this.mapFilter.zoomOutForResults$, this.zoomOutForResults);

    if (!isSmallDevice()) this.mapFilter.toggleFiltersShown(true);
    // Clear cached data
    this.propertiesRepositoryService.clearCache();

    if (this.mapManager.placeChangerData) {
      this.placeChanged(this.mapManager.placeChangerData);
      this.mapManager.placeChangerData = null;
    }

    if (this.mapManager.mapSettingsData) {
      this.settingUpdated(this.mapManager.mapSettingsData);
      this.mapManager.mapSettingsData = null;
    }
  }

  ngAfterViewInit(): void {
    this.subscribeOn('searchProperty', this.mapManager.getSearchPropertyStream(), this.searchProperty);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    // Clear RxJs subscriptions
    this.unsubscribeAll();
    // Clear data from map
    this.clearRenderedMarkers();
    // Clear listeners from map
    this.mapListeners.forEach(listener => (<any>window).google.maps.event.removeListener(listener));

    this.mapManagerService.clearMapSettings();
  }

  public authChange(): void {
    if (!this.authService.isUserLoggedIn()) {
      this.deactivateActiveMarker();
    }
  }

  public unsubscribeAll(): void {
    this.subscriptionMap.forEach((subscription) => subscription.unsubscribe());
  }

  public subscribeOn(key: string, stream: Observable<any>, handler: (data: any) => void): void {
    if (this.subscriptionMap.has(key)) this.subscriptionMap.get(key).unsubscribe();
    this.subscriptionMap.set(key, stream.subscribe(handler.bind(this)));
  }

  public async activeMarkerChanged(property: string | ExtendedMarkerModel): Promise<void> {
    let marker;

    if (property instanceof ExtendedMarkerModel) {
      marker = property;
    } else {
      marker = this.markers.get(property);

      if (isNullOrUndefined(marker)) {
        marker = await this.propertiesRepositoryService.getMarkerDetails(property);
        if (!isNullOrUndefined(marker)) {
          this.markers.set(marker.id, marker);
        }
      }
    }

    this.activateMarker(marker);
  }

  public updateActiveMarker(data: MarkerModel): void {
    const marker = this.markers.get(data.PropertyId);
    marker.activate();
  }

  public deactivateActiveMarker(): void {
    if (!isNullOrUndefined(this.activeMarker)) {
      this.mapRouteService.updateRoute(null);
      this.activeMarker.deactivate();
      this.activeMarker = null;
      this.activeMarkerId = null;
    }
  }

  public hasMarkersInAreaChanged({ value }: any): void {
    this.zone.run(() => {
      this.incorrectLocation = value;
    });
  }

  public countMarkersChanged({ value }: any): void {
    this.zone.run(() => {
      this.showHintboxNoMarkers = value === 0;

      if (value === 0) {
        this.clearRenderedMarkers();
      }
    });
  }

  public hasNoticeNewsAdded(): void {
    this.mapManager.addNoticeNews(this.mapBounds)
      .subscribe(
        () => {
          const message: string = `Wir haben für dich einen Suchauftrag angelegt.
            Wenn es Änderungen bei den ausgewählten Immobilien gibt, wirst du per Email informiert.
            Über die Email kannst du auch jederzeit den Suchauftrag wieder löschen.`;
          this.showInfoDialog(message);
        },
        error => {
          const message: string = error.isClientError
            ? `Hoppla! Etwas ist schief gelaufen! \n ${error.message}`
            : 'Hoppla! Etwas ist schief gelaufen!';
          this.showInfoDialog(message);
          this.logger.error('Filter NOT saved', error);
        }
      );
  }

  private showInfoDialog(message: string): void {
    const dialogModel: ConfirmationDialogModel = {
      message,
      type: ConfirmationDialogType.Info,
      buttonLabel: 'OK',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);
  }

  public settingChanged(): void {
    this.firstMapUpdate = true;
    this.googleMap.setOptions(this.googleMapSettings);
    setTimeout(() => {
      if (this.firstMapUpdate) this.mapUpdated();
    }, 5000);
  }

  public settingUpdated({latitude, longitude, zoom}: any): void {
    this.googleMap.panTo({lat: latitude, lng: longitude});
    this.googleMap.setZoom(zoom);
  }

  public placeChanged({place, zoom, name}: MapObject): void {
    this.mapCenter = place.point;
    this.mapZoom = zoom;
  }

  public searchProperty(placeData): void {
    this.searchPointData = placeData;
  }

  public async filtersUpdated(): Promise<void> {
    /**
     * This not good part of code
     * prevent initial rerender of the map.
     * Need to upgrade this part
     * and make this by RxJs
     */
    // FIXME: Refactor the code for "filtersUpdatedCounter"
    ++this.mapManager.filtersUpdatedCounter;
    if (this.mapManager.filtersUpdatedCounter < 2) return;
    this.propertiesRepositoryService.clearCache();

    this.clearRenderedMarkers();
    await this.scheduler.sleep();

    this.isFilterResponse = true;
    this.fetchMarkers();
  }

  private markersChunksLoaded(): void {
    this.legacyPinsLoading.next();
  }

  public handleMarkersChunk(
    {
      added = new Map<string, MarkerModel | FragmentModel>(),
      updated = new Map<string, MarkerModel | FragmentModel>(),
      removed = new Map<string, boolean>()
    }: any
  ): void {
    if (!isNullOrUndefined(added)) {
      added.forEach((marker: MarkerModel | FragmentModel, id: string) => {
        if (this.markers.has(id)) {
          this.markers.get(id).hide();
        }

        this.markers.set(id, marker);

        if (this.activeMarkerId === id) {
          this.activateMarker(marker, false);
        }
      });
    }

    if (!isNullOrUndefined(updated)) {
      if (updated.has(this.activeMarkerId) && !this.markers.has(this.activeMarkerId)) {
        const marker = updated.get(this.activeMarkerId);

        this.markers.set(this.activeMarkerId, marker);
        this.activateMarker(marker, false);
      }

      updated.forEach(marker => {
        if (!this.markers.has(marker.id)) {
          this.markers.set(marker.id, marker);
        }
      });
    }

    if (!isNullOrUndefined(removed)) {
      removed.forEach((_, id) => {
        if (this.markers.has(id)) {
          this.markers.get(id).hide();
        }

        this.markers.delete(id);
      });
    }

    if (this.zoomOutInProgress) this.zoomOutResults();
    if (this.searchPointData) this.activateSearchProperty();

    this.renderObjectOnMap();
  }

  async activateSearchProperty(): Promise<void> {
    if (this.markers.size === 0) return;

    this.getPropertyId().subscribe((searchPropertyId: string) => {
      if (!isEmptyString(searchPropertyId)) {
        this.mapManagerService.setActivatedMarkerId(searchPropertyId);
      }
    });

    this.searchPointData = null;
  }

  private getPropertyId(): Observable<string> {
    return this.propertiesRepositoryService.getMarkerIdFromFragmentsList({
      coordinates: {
        nwLatitude: this.searchPointData.placePoint.lat + SQUARE_COORDINATES_COEFFICIENT,
        nwLongitude: this.searchPointData.placePoint.lng + SQUARE_COORDINATES_COEFFICIENT,
        seLatitude: this.searchPointData.placePoint.lat - SQUARE_COORDINATES_COEFFICIENT,
        seLongitude: this.searchPointData.placePoint.lng - SQUARE_COORDINATES_COEFFICIENT,
      },
      zoom: ZOOM_CONSTANTS.QUARTER.value,
    }, this.searchPointData);
  }

  public async loadGoogleMapSDK(): Promise<void> {
    await this.mapManager.loadGoogleMapSDK();
    this.createMap((<any>window).google.maps);
  }

  public async createMap(mapsModule: any): Promise<void> {
    const mapContainer = this.elementRef.nativeElement.querySelector('.map__wrapper');

    this.mapsModule = mapsModule;

    if (this.mapManager.hasSavedMapSettings()) {
      const {
        zoom,
        mapTypeId,
        center: {lat, lng},
        activeMarkerId,
        activeMarkerType,
        needOpenDetailWindow
      } = this.mapManager.getSavedMapSettings();
      this.googleMapSettings.zoom = zoom;
      this.googleMapSettings.mapTypeId = mapTypeId;
      this.googleMapSettings.center.lat = lat;
      this.googleMapSettings.center.lng = lng;
      this.activeMarkerId = activeMarkerId;
      this.activeMarkerType = activeMarkerType;
      this.needOpenDetailWindow = needOpenDetailWindow;
    }
    // Init Map
    this.googleMap = new mapsModule.Map(mapContainer, this.googleMapSettings);

    // Unloads for Event Loop
    await this.scheduler.sleep();

    // Style Map
    this.addBaseLayer(this.googleMap, this.mapsModule);
    this.addDataShaderLayer(this.googleMap);
    this.addStreetAndCityLabels(this.googleMap);

    this.clustersManagerService.init(this.googleMap, this.onClusterClick.bind(this), this.mapZoom);
    this.scopertyPlusManagerService.init(
      this.googleMap,
      this.onScopertyPlusClick.bind(this),
      this.mapZoom,
      this.legacyPinsLoading$
    );

    this.googleMap.setTilt(0);
    this.autocompleteService.setInstance(google, this.googleMap);
    this.initMapListeners();
    this.updateZoom();
    this.initMapLoadedListener();

    forkJoin([this.queryParamsService.mapAddressQuery$, this.queryParamsService.presetMapLocation$])
      .pipe(
        switchMap(
          ([query, mapLocation]: [string, MapInitializationQueryParams]) => {
            if (!isNullOrUndefined(query)) {
              return forkJoin([
                this.autocompleteService.findPlace({
                  query: query,
                  fields: ['place_id']
                }).pipe(switchMap(place => this.autocompleteService.getDetails({
                  placeId: place.place_id,
                  fields: ['geometry', 'types', 'address_components']
                }))),
                of(mapLocation)
              ]);
            } else {
              this.handleMapLocation(mapLocation);
              return EMPTY;
            }
          }
        )
      )
      .subscribe(([place, mapLocation]) => this.handlePlaceFromQuery(place, mapLocation));
  }

  private handlePlaceFromQuery(placeResult: PlaceResult, mapLocation: MapInitializationQueryParams): void {
    if (isNullOrUndefined(placeResult)) {
      this.handleMapLocation(mapLocation);
      return;
    }

    const address = GmapsUtils.getAddressFromComponents(placeResult.address_components);
    const place = GmapsUtils.convertPlaceResultToPlace(placeResult);
    const locality: google.maps.GeocoderAddressComponent = placeResult.address_components[0];
    const zoom = GmapsUtils.getZoomLevelForPlace(placeResult.types[0]);

    const placeDescription: PlaceDescription = {
      place,
      locality,
      point: place.point,
      address,
      zoom
    };

    if (
      !isNullOrUndefined(address.street) &&
      !isNullOrUndefined(address.streetNumber)
    ) {
      this.propertiesRepositoryService.getPropertyIdFromPlaceDescription(placeDescription).subscribe(
        propertyId => {
          if (!isNullOrUndefined(propertyId)) {
            this.activeMarkerId = propertyId;
            this.activeMarkerChanged(propertyId);
          } else {
            this.goToLocation(placeResult.geometry.location, placeDescription.zoom);
          }
        },
        () => this.goToLocation(placeResult.geometry.location, placeDescription.zoom)
      );
    } else {
      this.goToLocation(placeResult.geometry.location, placeDescription.zoom);
    }
  }

  private goToLocation(point: google.maps.LatLng, zoom: number) {
    this.googleMap.setCenter(point);
    this.googleMap.setZoom(zoom);
  }

  private handleMapLocation(mapLocation: MapInitializationQueryParams): void {
    if (!isNullOrUndefined(mapLocation)) {
      this.googleMap.setCenter(mapLocation);

      if (!isNullOrUndefined(mapLocation.zoom)) {
        this.googleMap.setZoom(mapLocation.zoom);
      }
    } else {
      this.queryParamsService.setLocation({...this.googleMap.getCenter().toJSON(), zoom: this.googleMap.getZoom()});
    }
  }

  private addBaseLayer(googleMap: google.maps.Map, mapsModule: any): void {
    const styledMapType = new mapsModule.StyledMapType(MAP_STYLED_TYPE_BASE, { name: 'Styled Map' });
    googleMap.mapTypes.set(AVAILABLE_MAP_TYPES.STYLED, styledMapType);
  }

  private addDataShaderLayer(googleMap: google.maps.Map): void {
    const { minZoom, maxZoom, tileSize, opacity } = MAP_DATA_SHADER_LAYER_CONFIG;
    const overlayMapType = new google.maps.ImageMapType({
      getTileUrl: (coordinate, zoom) => {
        const tileUrl = this.propertiesRepositoryService.getDataShaderLayerTileUrl(coordinate, zoom);
        return tileUrl;
      },
      name: 'Data Shader',
      minZoom,
      maxZoom,
      tileSize: new google.maps.Size(tileSize, tileSize),
      opacity,
    });
    googleMap.overlayMapTypes.setAt(MapLayer.DataShaderLayer, overlayMapType);
  }

  private addStreetAndCityLabels(googleMap: google.maps.Map): void {
    const roadsType = new google.maps.StyledMapType(MAP_STYLED_TYPE_LABELS, { name: 'Labels' });
    googleMap.overlayMapTypes.setAt(MapLayer.StreetAndCityLabels, roadsType);
  }

  private removeStreetAndCityLabels(googleMap: google.maps.Map): void {
    googleMap.overlayMapTypes.removeAt(MapLayer.StreetAndCityLabels);
  }

  private addOrRemoveStreetAndCityLabels(): void {
    if (this.googleMap.getMapTypeId() !== AVAILABLE_MAP_TYPES.HYBRID) {
      this.addStreetAndCityLabels(this.googleMap);
    } else {
      this.removeStreetAndCityLabels(this.googleMap);
    }
  }

  public initMapListeners(): void {
    const centerChanged$ = GmapsUtils.observableFromEvent(this.googleMap, 'center_changed');
    const zoomChanged$ = GmapsUtils.observableFromEvent(this.googleMap, 'zoom_changed');
    const boundsChanged$ = GmapsUtils.observableFromEvent(this.googleMap, 'bounds_changed');
    this.mapListeners.push(
      this.googleMap.addListener('zoom_changed', this.mapZoomChanged.bind(this)),
      this.googleMap.addListener('click', this.mapClicked.bind(this)),
    );

    boundsChanged$.pipe(take(1)).subscribe(() => this.mapBoundsChanged());

    this.subscriptionMap.set('gmapsDragBoundsChanged', centerChanged$
      .pipe(debounceTime(100))
      .subscribe(() => this.mapBoundsChanged())
    );

    this.subscriptionMap.set('gmapsZoomBoundsChanged', zoomChanged$
      .pipe(debounceTime(100))
      .subscribe(() => this.mapBoundsChanged(true))
    );

    this.subscriptionMap.set(
      'gmapsDragSubscrbtion',
      centerChanged$
        .pipe(debounceTime(1000))
        .subscribe(() => {
          const center = this.googleMap.getCenter().toJSON();

          this.mapManager.updateMapCenter(center);

          this.queryParamsService.setLocation({...center, zoom: this.googleMap.getZoom()});
        })
    );

    this.subscriptionMap.set(
      'gmapsZoomSubscrbtion',
      zoomChanged$
        .subscribe(() => {
          const center = this.googleMap.getCenter().toJSON();
          const zoom = this.googleMap.getZoom();

          this.queryParamsService.setLocation({...center, zoom});
        })
    );
  }

  public mapClicked(event: any): void {
    this.deactivateActiveMarker();
  }

  public mapBoundsChanged(byZoom = false): void {
    this.mapUpdated();

    this.isFilterResponse = false;

    this.fetchMarkers(byZoom);

    this.localStorage.setItem('coordinates', JSON.stringify(this.mapBounds));

    this.mapFilter.setCoordinates({coordinates: this.mapBounds, zoom: this.mapZoom});
  }

  public mapUpdated(): void {
    if (this.firstMapUpdate) {
      this.firstMapUpdate = false;
    }
  }

  public fetchMarkers(resetCache = true): void {
    if (isNullOrUndefined(this.googleMap) || this.mapZoom <= MAP_CLUSTERS_CONFIG.maxZoom) {
      return;
    }
    try {
      const options = this.mapManager.getOptionsForMarkersRequest(this.mapBounds, this.mapZoom, resetCache);
      this._fetchMarkers(options);
    } catch (error) {
      this.logger.error('MapComponent::fetchMarkers:error', error);
    }
  }

  public incMapZoom(): void {
    if (!this.getMapZoomHigh) return;
    ++this.mapZoom;
  }

  public decMapZoom(): void {
    if (!this.getMapZoomLow) return;
    --this.mapZoom;
  }

  public renderObjectOnMap(): void {
    if (this.mapZoom >= 18) {
      this.renderMarkers();
    } else if (this.mapZoom >= 14 && this.mapZoom <= 17) {
      this.deactivateActiveMarker();
      this.renderMarkers();
    } else {
      this.deactivateActiveMarker();
    }
    this.zoomChanged = false;
  }

  public renderMarkers(): void {
    if (!this.mapsModule) {
      setTimeout(this.renderMarkers.bind(this), 200);
      return;
    }

    this.markers.forEach((marker) => {
      this.renderMarker(marker);
    });
  }

  public renderMarker(marker: MarkerModel | FragmentModel | MarkerModelWithoutAddress): void {
    marker.renderIfNeed(this.googleMap);
    // @FIXME: test for cashing markers
    // this.pointInBound(marker.position) ? marker.show() : marker.hide();
    // if (this.pointInBound(marker.position)) marker.show();
    if (this.mapZoom < 18 && marker instanceof MarkerModel) marker.hide();
    if (marker.id === this.activeMarkerId) marker.activate();
    if (this.activeMarkerType === 'ETW' && marker instanceof MarkerModel && marker.ApartmentsPropertyIds.includes(this.activeMarkerId)) {
      marker.activate();
    }
    marker.subscribe('click', () => this.activateMarker(marker), 'mapComponent::activateMarker');
  }

  public activateMarker(
    marker: MarkerModel | FragmentModel | MarkerModelWithoutAddress,
    addToHistory: boolean = true
  ): void {
    if (this.activeMarker === marker || isNullOrUndefined(marker)) {
      this.mapRouteService.updateRoute(null);
      return;
    }

    if (
      !isNullOrUndefined(this.activeMarker) &&
      this.activeMarker instanceof MarkerModel &&
      marker instanceof MarkerModel
    ) {
      if (!isNullOrUndefined(marker.building)) {
        this.activeBuilding = marker.building;
        this.activeBuilding.activate();
      } else if (this.activeMarker.ApartmentsPropertyIds.includes(marker.id)) {
        marker.building = this.activeBuilding = this.activeMarker;
      } else if (
        !isNullOrUndefined(this.activeBuilding) &&
        this.activeBuilding.ApartmentsPropertyIds.includes(marker.id)
      ) {
        this.activeMarker.deactivate();
      } else {
        if (!isNullOrUndefined(this.activeBuilding)) {
          this.activeBuilding.deactivate();
          this.activeBuilding = null;
        }
        this.activeMarker.deactivate();
      }
      if (addToHistory) this.showedMarkersHistory.push(this.activeMarker);
    }

    if (
      marker instanceof MarkerModel ||
      marker instanceof ExtendedMarkerModel ||
      marker instanceof FragmentModel ||
      marker instanceof MarkerModelWithoutAddress
    ) {
      this.activeMarker = marker;
      this.activeMarkerId = marker.id;
      this.activeMarker.activate();
      if (
        marker instanceof MarkerModelWithoutAddress ||
        (marker as FragmentModel).isScrapedWithoutAddress === true
      ) {
        this.openWithoutAddress = true;
      } else {
        this.openWithoutAddress = false;
      }
    }

    if (marker instanceof MarkerModel) {
      marker.updateStyles();
    }

    if (this.zoomLevel !== 'HIGH') {
      this.mapZoom = ZOOM_CONSTANTS.LEVELS.HIGH.UP_EDGE;
    }

    this.mapCenter = {
      lat: marker.position.lat + 0.00018,
      lng: marker.position.lng
    };

    if (!(marker instanceof MarkerModelWithoutAddress)) {
      this.mapRouteService.updateRoute(marker.id);
      this.markerActivate.emit(marker);
    }
  }

  public mapZoomChanged(): void {
    this.updateZoom();

    if (
      calculateZoomLevel(this.oldZoom) === 'HIGH' &&
      calculateZoomLevel(this.mapZoom) !== 'HIGH'
    ) {
      this.deactivateActiveMarker();
    }
    if (this.zoomLevelChanged) {
      this.clearRenderedMarkers();
    }
    this.updateMapType();
    this.addOrRemoveStreetAndCityLabels();
    this.zoomChanged = true;
  }

  public updateZoom(): void {
    this.oldZoom = this.currentZoom;
    this.currentZoom = this.mapZoom;
    this.clustersManagerService.setZoomLevel(this.mapZoom);
    this.mapManagerService.updateMapZoom(this.mapZoom);
  }

  public updateMapType(): void {
    if (['HIGH'].includes(this.zoomLevel)) {
      if (this.googleMap.getMapTypeId() !== AVAILABLE_MAP_TYPES.HYBRID) {
        this.googleMap.setMapTypeId(AVAILABLE_MAP_TYPES.HYBRID);
      }
    } else {
      if (this.googleMap.getMapTypeId() !== AVAILABLE_MAP_TYPES.STYLED) {
        this.googleMap.setMapTypeId(AVAILABLE_MAP_TYPES.STYLED);
      }
    }
  }

  public onHintSuccess({ point }: Place): void {
    this.mapCenter = point;
  }

  public onHintCancel(): void {
    this.showHintboxNoMarkers = false;
  }

  public prevMarker(): void {
    if (this.showedMarkersHistory.length > 0) {
      const prevMarker = this.showedMarkersHistory.pop();
      this.activateMarker(prevMarker, false);
    }
  }

  public nextMarker(): void {
    const nextMarker = this.getClosestMarker(this.activeMarker);
    this.activateMarker(nextMarker, true);
    if (this.showedMarkersHistory.length > 20) this.showedMarkersHistory.shift();
  }

  private onClusterClick(event: google.maps.MouseEvent, cluster: ClusterModel): void {
    this.googleMap.setCenter(cluster.markerPosition);
    this.mapZoom = ZOOM_CONSTANTS.NEIGHBOURHOOD.value;
  }

  private onScopertyPlusClick(event: google.maps.MouseEvent, marker: ScopertyPlusMarkerModel): void {
    this.mapCenter = {
      lat: marker.markerPosition.lat() + calculateCoordinateShift(this.mapZoom),
      lng: marker.markerPosition.lng()
    };

    this.scopertyPlusMarker = marker;
    this.scopertyPlusManagerService.shortDetailPageEnabled$
      .pipe(takeWhile(enabled => enabled))
      .subscribe(
        () => {},
        () => {},
        () => this.scopertyPlusMarker = null
      );
  }

  private onScopertyPlusClose(): void {
    this.scopertyPlusMarker = null;
  }
}
