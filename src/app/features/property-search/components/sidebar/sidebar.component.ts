import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, take } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { MapManagerService } from '../../../../core/services/map-manager.service';
import { MapFilterService } from '../../../../core/services/map-filter.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { isSmallDevice$, isSmallMobileDevice, isSmallMobileDevice$ } from '../../../../shared/utils/responsive.util';
import { WINDOW } from '../../../../core/services/window.provider';
import { Coordinates, CoordinatesDescription } from '../../../../core/models/coordinates.model';
import { MAP_CLUSTERS_CONFIG, ZOOM_CONSTANTS } from '../../../../main/main.constants';
import {
  FilterOptions,
  ListingListResult,
  PropertiesListFeatures,
  PropertiesListResult,
  QueryOptions,
} from '../../../../core/models/properties-repository.model';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { ListingModel } from '../../../../core/models/listing.model';
import { ListingSerializer } from '../../../../core/models/listing.serializer';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import { ScreenSizeService } from '../../../../core/services/screen-size.service';
import { VerticalAlignment } from '../../../../shared/components/accordion/accordion.component';
import { FragmentModel } from '../../../../core/models/fragment.model';
import { MarkerModel } from '../../../../core/models/marker.model';

interface ICarousel {
  topTab: boolean;
  bottomTab: boolean;
}

interface ListingsCount {
  all: number;
  withAddress: number;
  withoutAddress: number;
}

interface ListingsQueryOptions {
  ordering: 'sale_price' | '-sale_price';
  show_address: boolean;
}

interface ListingsIsOpenedStates {
  [key: string]: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnDestroy, OnInit, OnChanges {

  @Input() activeMarker: FragmentModel | MarkerModel;

  @Output() sidebarShown: EventEmitter<boolean> = new EventEmitter<boolean>();

  name: string = 'sidebar';

  listingsCount: ListingsCount = {
    all: 0,
    withAddress: 0,
    withoutAddress: 0,
  };
  queryOptions: ListingsQueryOptions = {
    ordering: 'sale_price',
    show_address: true,
  };

  isLoaded: boolean = false;
  isListingsLoaded: boolean = false;
  isHighZoomLevel: boolean;
  isPropertiesLoaded: boolean = false;
  isListingWithAddresses: boolean = true;

  isSmallMobileDevice$ = isSmallMobileDevice$;
  isSmallDevice$ = isSmallDevice$;
  isSidebarShown: boolean = !isSmallMobileDevice();
  isSubscriptionsEnabled: boolean = false;

  tooltipPosition: string = 'bottom';
  displayHeight: number;
  possiblePropertiesCount: number = 0;

  nextListingMarkersUrl: string = '';
  nextPropertiesMarkersUrl: string = '';
  nextListingMarkers: ListingListResult = null;
  nextPropertiesMarkers: PropertiesListResult = null;
  markers: ListingModel[] = [];
  markersWithoutAddress: ListingModel[] = [];
  listingsIsOpenedStates: ListingsIsOpenedStates = {};
  carouselObj: ICarousel = { topTab: true, bottomTab: false };
  listingOptions: string;
  propertiesOptions: string;

  zoom: number;

  private cashedZoom: number = ZOOM_CONSTANTS.MINIMUM_ZOOM.value;
  private cashedCoordinates: Coordinates;

  private subscriptions: Subscription = new Subscription();
  private zoomSubscription: Subscription;
  private subscriptionMap: Map<string, Subscription> = new Map<string, Subscription>();
  private screenSubscription: Subscription;
  private filtersUpdatedSubscription: Subscription;
  private dynamicSubscriptions: Subscription = new Subscription();

  get titleWithAddress(): string {
    const objectWord = this.listingsCount.withAddress === 1 ? 'OBJEKT' : 'OBJEKTE';
    return `${this.listingsCount.withAddress} ${objectWord}`;
  }

  get titleWithoutAddress(): string {
    const objectWord = this.listingsCount.withAddress === 1 ? 'OBJEKT' : 'OBJEKTE';
    return `${this.listingsCount.withoutAddress} ${objectWord}`;
  }

  get isSidebarActive(): boolean {
    if (!isSmallMobileDevice()) {
      return true;
    }

    const { ForSale, MakeMeMove } = this.mapFilterService.filters.SellingStatus;
    return (ForSale || (!ForSale && !MakeMeMove));
  }

  get isNoFilters(): boolean {
    const { ForSale, MakeMeMove } = this.mapFilterService.filters.SellingStatus;
    return ForSale === MakeMeMove;
  }

  get isOpenForOffersFilter(): boolean {
    return this.mapFilterService.filters.SellingStatus.MakeMeMove;
  }

  get accordionVerticalAlignment(): VerticalAlignment {
    return this.isHighZoomLevel ? VerticalAlignment.Bottom : VerticalAlignment.Top;
  }

  constructor(
    private mapManagerService: MapManagerService,
    private propertiesRepository: PropertiesRepositoryService,
    private mapFilterService: MapFilterService,
    private screenSizeService: ScreenSizeService,
    @Inject(LOGGER) private logger: LoggerService,
    @Inject(WINDOW) private window: Window,
    @Inject(DOCUMENT) private document: Document,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.getFavoriteData();

    this.subscriptions.add(
      this.mapManagerService.activatedMarkerId$.subscribe(
        propertyId => {
          this.resetListingsIsOpenedStates();
          this.listingsIsOpenedStates[propertyId] = true;
        }
      )
    );

    this.screenSubscription = this.screenSizeService.screenSize$.subscribe(this.checkDisplayHeight.bind(this));

    this.mapManagerService.mapZoom$.pipe(take(1)).subscribe(
      zoom => {
        const isHighZoomLevel = zoom <= MAP_CLUSTERS_CONFIG.maxZoom;

        if (isHighZoomLevel) {
          this.isLoaded = true;

          if (!isSmallMobileDevice()) {
            this.isSidebarShown = false;
          }
        }
      }
    );

    this.zoomSubscription = this.mapManagerService.mapZoom$
      .pipe(
        distinctUntilChanged(),
        filter(zoom => (zoom <= MAP_CLUSTERS_CONFIG.maxZoom) !== this.isHighZoomLevel)
      )
      .subscribe(zoom => this.onZoomChange(zoom));

    this.checkDisplayHeight();

    if (isSmallMobileDevice()) {
      this.isSidebarShown = false;
    }

    this.sidebarShown.emit(this.isSidebarShown);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('activeMarker')) {
      const marker: MarkerModel | FragmentModel = changes.activeMarker.currentValue;

      this.resetListingsIsOpenedStates();
      if (!isNullOrUndefined(marker)) {
        this.listingsIsOpenedStates[marker.id] = true;
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.zoomSubscription.unsubscribe();
    this.unsubscribeAll();
  }

  onZoomChange(zoom: number): void {
    this.zoom = zoom;
    const isHighZoomLevel = zoom <= MAP_CLUSTERS_CONFIG.maxZoom;
    this.isHighZoomLevel = isHighZoomLevel;

    if (isHighZoomLevel) {
      this.isLoaded = true;
      if (!isNullOrUndefined(this.filtersUpdatedSubscription)) {
        this.filtersUpdatedSubscription.unsubscribe();
      }
      this.isSubscriptionsEnabled = false;
      this.clearMarkers();
      this.possiblePropertiesCount = 0;
    } else  if (!this.isSubscriptionsEnabled) {
      this.isLoaded = false;
      this.isSubscriptionsEnabled = true;
      this.filtersUpdatedSubscription = this.mapFilterService.filters$.subscribe(() => this.filtersUpdated());
      if (!isSmallMobileDevice()) {
        this.isSidebarShown = true;
      }
    }
  }

  onListingObjectClick(marker: ListingModel): void {
    this.resetListingsIsOpenedStates();
    this.listingsIsOpenedStates[marker.id] = true;
  }

  closeSidebar(): void {
    this.toggleSidebar();
  }

  async onScroll(): Promise<void> {
    await this.loadMarkersListByUrl();
  }

  trackByFn(index: number, item: ListingModel): string {
    return item.id;
  }

  toggle(state: boolean, tab: string): void {
    if (state) {
      this.carouselObj.topTab = false;
      this.carouselObj.bottomTab = false;
      this.carouselObj[tab] = true;
      if (!this.isHighZoomLevel) {
        this.isLoaded = false;
        this.isListingWithAddresses = tab !== 'bottomTab';
        this.queryOptions.show_address = this.isListingWithAddresses;
        this.mapFilterService.coordinatesDescription$.pipe(take(1)).subscribe(
          (coordinatesDescription: CoordinatesDescription) => this.coordinatesUpdated(coordinatesDescription)
        );
      }
    } else {
      this.carouselObj[tab] = false;
    }
  }

  toggleSidebar(): void {
    if (!this.isSidebarActive) {
      this.isSidebarShown = false;
      this.sidebarShown.emit(this.isSidebarShown);
      return;
    }

    this.isSidebarShown = !this.isSidebarShown;
    this.sidebarShown.emit(this.isSidebarShown);
    if (this.isSidebarShown && !this.isHighZoomLevel) {
      this.carouselObj.topTab = true;
    } else {
      this.unsubscribeOne('listings');
    }
  }

  private loadOpenForOffers(markers: PropertiesListResult): void {
    this.nextPropertiesMarkersUrl = markers.next;

    if (
      !this.isListingsLoaded &&
      this.isNoFilters &&
      isNullOrUndefined(this.nextPropertiesMarkersUrl)
    ) {
      this.loadListings();
    }

    this.renderPropertyData(markers);

    this.isLoaded = true;
  }

  private resetListingsIsOpenedStates(): void {
    Object.keys(this.listingsIsOpenedStates).forEach(id => this.listingsIsOpenedStates[id] = false);
  }

  private loadMarkersList(listings: ListingListResult): void {
    this.nextListingMarkersUrl = listings.next;

    this.getResultsMarkersList(listings);
  }

  private async loadMarkersListByUrl(): Promise<void> {
    if (this.nextListingMarkersUrl) {
      this.nextListingMarkers = await this.propertiesRepository.getListingsByUrl(this.nextListingMarkersUrl);
      this.nextListingMarkersUrl = this.nextListingMarkers.next;

      this.getResultsMarkersList(this.nextListingMarkers);
    } else if (this.nextPropertiesMarkersUrl) {
      this.nextPropertiesMarkers = await this.propertiesRepository.getPropertiesByUrl(this.nextPropertiesMarkersUrl);
      this.nextPropertiesMarkersUrl = this.nextPropertiesMarkers.next;

      this.renderPropertyData(this.nextPropertiesMarkers);
    } else if (
      this.isPropertiesLoaded &&
      !this.isListingsLoaded &&
      this.isNoFilters
    ) {
      this.loadListings();
    }
  }

  private counterUpdated(counters: ListingsCount): void {
    this.listingsCount = counters;

    if (counters && counters.all) {
      this.possiblePropertiesCount = counters.all;
    } else {
      this.possiblePropertiesCount = 0;
    }
  }

  private loadListings(): void {
    this.dynamicSubscriptions.add(
      this.propertiesRepository.getListings(this.listingOptions)
        .subscribe(
          (listings: ListingListResult) => {
            this.isListingsLoaded = true;
            this.loadMarkersList(listings);
          },
          () => {},
          () => this.isLoaded = true
        )
    );
  }

  private loadProperties(): void {
    this.dynamicSubscriptions.add(
      this.propertiesRepository.getProperties(this.propertiesOptions)
        .subscribe(
          (markers: PropertiesListResult) => {
            this.isPropertiesLoaded = true;
            this.loadOpenForOffers(markers);
          },
          () => {},
          () => this.isLoaded = true
        )
    );
  }

  private coordinatesUpdated({ coordinates = null, zoom = null }: CoordinatesDescription): void {
    if (zoom <= MAP_CLUSTERS_CONFIG.maxZoom) {
      return;
    }
    this.clearMarkers();

    let _zoom: number = 0;
    let _coordinates: Coordinates = {} as Coordinates;

    if (!zoom && !coordinates) {
      _zoom = this.cashedZoom;
      _coordinates = this.cashedCoordinates;
    } else {
      _zoom = zoom;
      this.cashedZoom = zoom;

      _coordinates = coordinates;
      this.cashedCoordinates = coordinates;
    }

    const options: QueryOptions = {
      filterOptions: this.mapFilterService.filters as FilterOptions,
      coordinates: _coordinates,
      zoom: _zoom
    };

    const openForOffersOptions: QueryOptions = cloneDeep(options);
    openForOffersOptions.filterOptions.SellingStatus.MakeMeMove = true;

    this.listingOptions = this.generateParamsString(options);
    this.propertiesOptions = this.generateParamsString(openForOffersOptions);

    if (this.isListingWithAddresses && this.isNoFilters || this.isOpenForOffersFilter) {
      this.loadProperties();
    } else {
      this.loadListings();
    }

    this.subscribeOn('markersCount', this.propertiesRepository.getListingsCount(options), this.counterUpdated);
  }

  private clearMarkers(): void {
    this.dynamicSubscriptions.unsubscribe();
    this.dynamicSubscriptions = new Subscription();
    this.markers.length = 0;
    this.markersWithoutAddress.length = 0;
    this.isListingsLoaded = false;
    this.isPropertiesLoaded = false;
    this.nextListingMarkers = null;
    this.nextPropertiesMarkers = null;
    this.nextListingMarkersUrl = null;
    this.nextPropertiesMarkersUrl = null;
    this.listingsCount.all = 0;
    this.listingsCount.withAddress = 0;
    this.listingsCount.withoutAddress = 0;
  }

  private renderListingData(markersList: PropertiesListFeatures[]): void {
    markersList.forEach(marker =>  {
      marker.properties.isFavorite = this.mapManagerService.hasFavoriteId(marker.properties.uuid);

      if (this.isListingWithAddresses) {
        this.markers.push(ListingSerializer.createListing(marker));
      } else {
        this.markersWithoutAddress.push(ListingSerializer.createListing(marker));
      }
    });
  }

  private renderPropertyData(markers: PropertiesListResult): void {
    markers.results.forEach(marker =>  {
      marker.isFavorite = this.mapManagerService.hasFavoriteId(marker.uuid);

      this.markers.push(ListingSerializer.createListingFromProperty(marker));
    });
  }

  private filtersUpdated(): void {
    /**
     * This is bad way but it necessary solution for current architecture
     * Next step: change architecture of queries and delete this
     * bad part of code.
     * @FIXME: delete it after refactoring.
    */
    this.clearMarkers();
    if (this.isSidebarActive) {
      this.collectDataForLoadMarkers();
      if (!isSmallMobileDevice()) {
        this.isSidebarShown = true;
      }
    } else {
      this.isSidebarShown = false;
      this.listingsCount.all = 0;
      this.listingsCount.withAddress = 0;
      this.listingsCount.withoutAddress = 0;
      this.unsubscribeOne('listings');
      this.unsubscribeOne('markersCount');
      this.unsubscribeOne('coordinatesUpdated');
      this.markers.length = 0;
      this.markersWithoutAddress.length = 0;
    }
  }

  private collectDataForLoadMarkers(): void {
    this.subscribeOn('coordinatesUpdated', this.mapFilterService.coordinatesDescription$, this.coordinatesUpdated);
  }

  private generateParamsString(options: QueryOptions): string {
    const mainOptions = this.propertiesRepository.convertOptions(options);
    return `${mainOptions}&ordering=has_url,${this.queryOptions.ordering}&show_address=${this.queryOptions.show_address}`;
  }

  private subscribeOn(key: string, stream: any, handler: (data: any) => void): void {
    if (this.subscriptionMap.has(key)) {
      this.subscriptionMap.get(key).unsubscribe();
    }
    this.subscriptionMap.set(key, stream.subscribe(handler.bind(this)));
  }

  private unsubscribeAll(): void {
    this.subscriptionMap.forEach(subscription => subscription.unsubscribe());
  }

  private unsubscribeOne(name: string): void {
    if (this.subscriptionMap.has(name)) {
      this.subscriptionMap.get(name).unsubscribe();
    }
  }

  private getResultsMarkersList(markers: ListingListResult): void {
    if (markers && markers.features instanceof Array) {
      this.renderListingData(markers.features);
    }
  }

  private async getFavoriteData(): Promise<void> {
    let favoriteData: string[] = [];

    try {
      favoriteData = await this.propertiesRepository.getFavoritesForListings();
    } catch (error) {
      this.logger.error('SidebarComponent::getFavoriteData', error);
    } finally {
      this.updateFavoriteData(favoriteData);
    }
  }

  private updateFavoriteData(favoriteIds: string[]): void {
    favoriteIds.forEach(id => this.mapManagerService.addFavoriteId(id));
  }

  private checkDisplayHeight(): void {
    this.displayHeight = this.window.innerHeight - 56;
  }
}
