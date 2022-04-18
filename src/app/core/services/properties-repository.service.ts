import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Subject, Observable, EMPTY, forkJoin, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { cloneDeep } from 'lodash';

import { MarkerModel, IHistogram } from '../models/marker.model';
import { FragmentModel } from '../models/fragment.model';
import { MarkerModelWithoutAddress } from '../models/marker-without-address.model';
import { ExtendedMarkerModel } from '../models/extended-marker.model';
import { Coordinates } from '../models/coordinates.model';
import {
  PriceTrend,
  PriceTrendObj,
  PriceTrends
} from '../models/marker-price-trend.model';
import {
  MarkersDto,
  FilterOptions,
  QueryOptions,
  PropertiesListResult,
  ListingListResult,
  PropertiesListCounts,
  SearchAlertsObject,
  SearchAlertsScheme,
  OfferPrice,
  OfferData,
  ApartmentData,
  EnergyCertificate,
  ImageResponse,
  InitialPropertyObject,
  PageType,
  MinePropertiesData,
  PropertyStatistic,
  PropertyType,
  PropertyStatus,
  PropertyStatusDto,
  ListingDetailsDto,
  PropertyTypeDto,
  GroupedMarkerWithoutAddressData,
  MapDiffs,
  UpdatePropertyValuation,
  CreateNewCityAlert,
} from '../models/properties-repository.model';
import { RealtorTicket, RealtorTicketResponse } from '../models/realtor-ticket.model';
import { RemoveTicket, RemoveTicketResponse } from '../models/remove-ticket.model';
import { SearchAlert } from '../models/search-alert.model';
import { Offer } from '../models/offers.model';
import { FetchableSubject } from '../../shared/utils/fetchable-rx.util';
import { statusToBackEnd, propTypeToBackEnd } from '../../shared/utils/deserializator.util';
import { lat2tile, lng2tile } from '../../shared/utils/translate-lat-lng-tile.util';
import calculateDistance from '../../shared/utils/calculate-distance.util';
import { evadePreflight } from '../../shared/utils/evade-preflight.util';
import { HTTP_Settings, SKIP_AUTH_HEADER, SellingStatus, SQUARE_COORDINATES_COEFFICIENT } from '../../app.constants';
import { IMarkersPoints } from '../../shared/components/marker-detail-data-place/marker-detail-data-place.component';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';
import { responseHasError } from '../../shared/utils/respone-has-error.util';
import { splitMarkersIntoGroups } from '../../shared/utils/markers-group-splitter';
import { PropertyAlreadyClaimed } from '../models/errors.model';
import { SearchPointData } from '../models/search.model';
import { MarkerWithoutAddressSerializer } from '../models/marker-without-address.serializer';
import { ZOOM_CONSTANTS } from '../../main/main.constants';
import { MapFilterService } from '../../core/services/map-filter.service';
import { PlaceDescription } from '../../shared/components/search-place/search-place.component';
import { isEmptyString } from '../../shared/utils/empty-string.util';
import { GmapsUtils } from '../../shared/utils/gmaps.util';
import { shouldShowDataShaderLayer } from '../../shared/utils/data-shader-layer.util';
import { environment } from '../../../environments/environment';

import { AuthService } from './auth.service';
import { Streams } from './map-manager.service';
import { LoggerService } from './logger/logger.service';
import { LOGGER } from './logger/logger.provider';
import { GeoJSON, Point } from 'geojson';

enum ErrorCodes {
  PropertyAlreadyClaimed = 'property_already_claimed',
}

interface GeoRequests {
  responseProperties?: Observable<PropertiesListResult>;
  responseFragments?: Observable<PropertiesListResult>;
  responseActiveSFH?: Observable<PropertiesListResult>;
  responseScrapedListings?: Observable<PropertiesListResult>;
  responsePropertiesWithoutAddress?: Observable<MarkersWithoutAddressData.Response>;
}

interface GeoResponses {
  responseProperties?: PropertiesListResult;
  responseFragments?: PropertiesListResult;
  responseScrapedListings?: PropertiesListResult;
  responseActiveSFH?: PropertiesListResult;
  responsePropertiesWithoutAddress?: MarkersWithoutAddressData.Response;
}

export declare namespace ClustersData {
  export interface Response {
    features: Feature[];
    type: string;
  }

  export type Feature = GeoJSON.Feature<GeoJSON.Point, Properties>;

  interface Properties {
    count: number;
    meta: Meta;
    zoom_level: number;
  }

  interface Meta {
    for_sale_apartment_count: number;
    for_sale_count: number;
    for_sale_sfh_count: number;
    make_me_move_apartment_count: number;
    make_me_move_count: number;
    make_me_move_sfh_count: number;
    property_type: PropertyStatusDto;
  }
}

export declare namespace MarkersWithoutAddressData {
  export interface Response {
    count: number;
    next: string;
    previous: string;
    results: Marker[];
  }

  interface Marker {
    city: string;
    coordinates: GeoJSON.Position;
    country: string;
    county: string;
    images: Image[];
    isScraped: boolean;
    matchedProperty: string;
    propertyType: PropertyTypeDto;
    propertyUuid: string;
    providerId: string;
    salePrice: number;
    showAddress: boolean;
    state: string;
    streetName: string;
    streetNumber: string;
    title: string;
    url: string;
    uuid: string;
    zipCode: string;
  }

  interface Image {
    image: string;
    imageThumbnail: string;
    uuid: string;
  }
}

export declare namespace ScopertyPlus {
  export interface Response {
    features: Feature[];
    type: string;
  }

  export interface Feature {
    geometry: Geometry;
    properties: Properties;
    type: string;
  }

  interface Geometry {
    coordinates: number[];
    type: string;
  }

  interface Properties {
    zip_code: string;
  }
}

@Injectable()
export class PropertiesRepositoryService {
  private GLOBAL_URL_V1: string = HTTP_Settings.host;
  private GLOBAL_URL_V1_CASHED: string = HTTP_Settings.hostCached;
  private GLOBAL_URL_V2_CASHED: string = HTTP_Settings.hostCachedV2;
  private URL_V1: string = `${this.GLOBAL_URL_V1}/properties`;
  private URL_V1_CASHED: string = `${this.GLOBAL_URL_V1_CASHED}/properties`;
  private ENERGY_CERTIFICATE_URL = `${this.GLOBAL_URL_V1}/properties/{property_uuid}/energy-certificate`;
  private FOR_SALE_URL_CASHED: string = `${this.GLOBAL_URL_V1_CASHED}/listings`;
  private SCRAPED_LISTINGS_GEO_CASHED = `${this.GLOBAL_URL_V1_CASHED}/scraped-listings/geo`;
  private CLUSTERS_GEO_CACHED = `${this.GLOBAL_URL_V2_CASHED}/clusters`;
  private FAVORITES_URL: string = `${this.URL_V1}/favorites`;
  private CRM_URL: string = `${this.GLOBAL_URL_V1}/crm`;
  private TICKETS_URL: string = `${this.CRM_URL}/tickets`;
  private WITHOUT_ADDRESS_GEO: string = `${this.GLOBAL_URL_V1_CASHED}/listings/without-address/geo`;
  private SCOPERTY_PLUS_GEO: string = `${this.GLOBAL_URL_V1_CASHED}/scoperty-plus/geo`;
  private cachedMarkers: Map<string, boolean> = new Map<string, boolean>();
  private cachedZoom: number = 0;

  public get convertOptions(): Function {
    return this.optionsToParams;
  }

  private get skipAuthHeaders(): HttpHeaders {
    return new HttpHeaders().set(SKIP_AUTH_HEADER, 'true');
  }

  private mapCoordinatesToParams(coordinates: Coordinates, zoom: number, separator: string = '?'): string {
    if (coordinates == null) return '';
    return  `${separator}nwx=${lng2tile(coordinates.nwLongitude, zoom)}` +
            `&nwy=${lat2tile(coordinates.nwLatitude, zoom)}`             +
            `&sex=${lng2tile(coordinates.seLongitude, zoom)}`            +
            `&sey=${lat2tile(coordinates.seLatitude, zoom)}`;
  }

  private mapZoomToParams(zoom: number, separator: string = '?'): string {
    if (zoom == null) {
      return '';
    } else {
      return `${separator}zoom=${zoom}`;
    }
  }

  private filterOptionsToParams(options, separator: string = '?'): string {
    if (options == null || !Object.keys(options).length) return '';

    const params = [];

    if (options.PropertyType) {
      if (options.PropertyType === PropertyType.ETW) {
        params.push(`property_type=${propTypeToBackEnd(options.PropertyType)}`);
        params.push(`property_type=${propTypeToBackEnd(PropertyType.MFH)}`);
      } else {
        params.push(`property_type=${propTypeToBackEnd(options.PropertyType)}`);
      }
    }

    if (options.cursor) params.push(`cursor=${options.cursor}`);
    if (options.pageSize) params.push(`page_size=${options.pageSize}`);

    // Specify ordering. Choices: ['estimated_price', '-estimated_price', 'living_area', '-living_area']
    if (options.ordering) params.push(`ordering=${options.ordering}`);

    if (Number.isInteger(options.PriceFrom)) params.push(`price_min=${options.PriceFrom}`);
    if (Number.isInteger(options.PriceTo)) params.push(`price_max=${options.PriceTo}`);

    if (options.AreaSize) params.push(`living_area_min=${options.AreaSize}`);
    if (options.AreaSize2) params.push(`living_area_max=${options.AreaSize2}`);

    return `${separator}${params.join('&')}`;
  }

  private sellingStatusToParams(sellingStatus: SellingStatus, separator: string = '?'): string {
    sellingStatus.Idle = false;

    const options = [];
    const statusesString = JSON.stringify(sellingStatus);
    const getAllMarkersByStatus = statusesString === JSON.stringify({Idle: false, MakeMeMove: false, ForSale: false, Active: false});
    const dontGetMarkersByStatus = statusesString === JSON.stringify({Idle: false, MakeMeMove: false, ForSale: false, Active: true});
    const getMarkersForSale = statusesString === JSON.stringify({Idle: false, MakeMeMove: false, ForSale: true, Active: true});
    const getMarkersMakeMeMove = statusesString === JSON.stringify({Idle: false, MakeMeMove: true, ForSale: false, Active: true});
    const emptyStatusObj = sellingStatus == null || !Object.keys(sellingStatus).length;

    if (getAllMarkersByStatus) return '';
    else if (emptyStatusObj) return '';
    else if (dontGetMarkersByStatus || getMarkersForSale || getMarkersMakeMeMove) sellingStatus.Active = false;

    Object.keys(sellingStatus).forEach(status => {
      if (sellingStatus[status]) options.push(`selling_status=${statusToBackEnd(status as PropertyStatus)}`);
    });

    return `${separator}${options.join('&')}`;
  }

  private pageToParams(page: number, separator: string = '&'): string {
    if (page) return `${separator}page=${page}`;
    else return '';
  }

  private calculateMapDiff<T = any, B = boolean>(
    oldMap: Map<string, B>,
    newMap: Map<string, T>
  ): MapDiffs {
    const diffs: MapDiffs<T> = {
      added: new Map<string, T>(),
      updated: new Map<string, T>(),
      removed: new Map<string, boolean>()
    };

    oldMap.forEach((_, id) => {
      if (newMap.has(id)) {
        diffs.updated.set(id, newMap.get(id));
      } else {
        diffs.removed.set(id, true);
      }
    });

    newMap.forEach((marker, id) => {
      if (!oldMap.has(id)) {
        diffs.added.set(id, marker);
      } else {
        diffs.updated.set(id, marker);
      }
    });

    return diffs;
  }

  private async splitAndEmitMarkers(
    features: Array<MarkersDto>,
    stream: Subject<Array<MarkerModel | FragmentModel>>,
    zoom: number
  ): Promise<number> {
    if (!(features instanceof Array)) return;

    const timeOut = zoom > 17 ? 200 : 16;
    const sliceSize = zoom > 17 ? 100 : 250;
    let markers: Array<MarkerModel | FragmentModel> = null;
    let markerChunk: Array<MarkerModel | FragmentModel> = null;
    let markersLength: number = 0;

    if (zoom > 17) {
      markers = features.map(feature => new MarkerModel(feature.properties));
    } else {
      markers = features.map(feature => new FragmentModel(feature));
    }

    markersLength = markers.length;
    markerChunk = markers.splice(0, sliceSize);
    stream.next(markerChunk);

    while (markerChunk.length > 0) {
      await new Promise(resolve => setTimeout(resolve, timeOut));

      markerChunk = markers.splice(0, sliceSize);
      stream.next(markerChunk);
    }

    return markersLength;
  }

  private async splitAndEmitMarkersWithoutAddress(
    features: GroupedMarkerWithoutAddressData[],
    stream: Subject<Array<MarkerModel | FragmentModel | MarkerModelWithoutAddress>>,
    zoom: number
  ): Promise<number> {
    if (!(features instanceof Array)) return;

    const timeOut = zoom > 17 ? 200 : 16;
    const sliceSize = zoom > 17 ? 100 : 250;
    let markers: any = null;
    let markerChunk: any = null;
    let markersLength: number = 0;

    if (zoom > 17) {
      markers = features.map(feature => new MarkerModelWithoutAddress(feature));
    } else {
      markers = features.map((feature) => {
        const featureFragment = MarkerWithoutAddressSerializer.createFragmentsFromMarkerWithoutAddress(feature);
        return new FragmentModel(featureFragment);
      });
    }

    markersLength = markers.length;
    markerChunk = markers.splice(0, sliceSize);
    stream.next(markerChunk);

    while (markerChunk.length > 0) {
      await new Promise(resolve => setTimeout(resolve, timeOut));

      markerChunk = markers.splice(0, sliceSize);
      stream.next(markerChunk);
    }

    return markersLength;
  }

  private async listResultAsStream(
    stream: Subject<Array<MarkerModel | FragmentModel>>,
    options: QueryOptions,
    streams: Streams
  ): Promise<void> {
    const requests: GeoRequests = {};

    let markersCount = 0;

    if (this.optionsIsValid(options)) {
      if (options.zoom >= 14 && this.shouldItShowForSale(options)) {
        requests.responseScrapedListings = this.getScrapedListingsGeo(options);
        requests.responsePropertiesWithoutAddress = this.getPropertiesWithoutAddressGeo(options);
      }

      if (options.zoom >= 14 && this.showsOnlyForSale(options)) {
        const activeSFHOptions = cloneDeep(options);

        activeSFHOptions.filterOptions.SellingStatus.ForSale = false;
        activeSFHOptions.filterOptions.SellingStatus.Active = true;
        activeSFHOptions.filterOptions.PropertyType = PropertyType.EFH;

        requests.responseActiveSFH = this.getPropertiesGeo(activeSFHOptions);
      }

      if (options.zoom >= 14 && options.zoom < 16) {
        const pinsOptions: QueryOptions = cloneDeep(options);

        pinsOptions.filterOptions.SellingStatus.Active = false;

        if (
          !pinsOptions.filterOptions.SellingStatus.ForSale &&
          !pinsOptions.filterOptions.SellingStatus.MakeMeMove
        ) {
          pinsOptions.filterOptions.SellingStatus.ForSale = true;
          pinsOptions.filterOptions.SellingStatus.MakeMeMove = true;
        }

        if (this.optionsIsValid(pinsOptions)) {
          requests.responseFragments = this.getPropertiesGeo(pinsOptions);
        }

      } else if (options.zoom >= 16 && options.zoom <= 17) {
        requests.responseFragments = this.getPropertiesGeo(options);
      } else if (options.zoom > 17) {
        requests.responseProperties = this.getPropertiesGeo(options);
      }
    } else {
      if (options.zoom > 15) {
        stream.next([]);
      }
    }

    forkJoin(requests).subscribe(
      async ({
         responseProperties,
         responseScrapedListings,
         responseActiveSFH,
         responseFragments,
         responsePropertiesWithoutAddress,
      }: GeoResponses) => {
        const matchedActiveSFH = [];
        if (
          !isNullOrUndefined(responseScrapedListings) &&
          responseScrapedListings.features instanceof Array
        ) {
          markersCount += await this.splitAndEmitMarkers(
            responseScrapedListings.features
              .filter(feature => {

                if (isNullOrUndefined(feature.properties.matchedProperty)) {
                  return true;
                }

                if (
                  !isNullOrUndefined(responseActiveSFH) &&
                  responseActiveSFH.features instanceof Array
                ) {
                  return this.searchMatchedActiveSFH(matchedActiveSFH, responseActiveSFH, feature, responseScrapedListings);
                }

                if (
                  !isNullOrUndefined(responseProperties) &&
                  responseProperties.features instanceof Array
                ) {
                  return this.searchMatchedActiveSFH(matchedActiveSFH, responseProperties, feature, responseScrapedListings);
                }

                if (
                  !isNullOrUndefined(responseFragments) &&
                  responseFragments.features instanceof Array
                ) {
                  return this.searchMatchedActiveSFH(matchedActiveSFH, responseFragments, feature, responseScrapedListings);
                }

                return false;
              }),
            stream,
            options.zoom
          );
        }

        if (
          !isNullOrUndefined(responseProperties) &&
          options.zoom > 17 &&
          responseProperties.features instanceof Array
        ) {
          markersCount += await this.splitAndEmitMarkers(
            responseProperties.features.filter(feature =>
              !matchedActiveSFH.find(id => feature.properties.uuid === id)
            ),
            stream,
            options.zoom
          );
        }

        if (
          !isNullOrUndefined(responsePropertiesWithoutAddress) &&
          responsePropertiesWithoutAddress.results instanceof Array
        ) {
          if (responsePropertiesWithoutAddress.next) {
            await this.getMarkerWithoutAddressListByUrl(
              responsePropertiesWithoutAddress.next,
              stream,
              streams.count,
              options.zoom,
              responsePropertiesWithoutAddress.results
            );
          } else {
            await this.handleMarkersWithoutAddress(
              responsePropertiesWithoutAddress.results,
              stream,
              streams.count,
              options.zoom
            );
          }
        }

        if (!isNullOrUndefined(responseFragments) && responseFragments.features instanceof Array) {
          markersCount += await this.splitAndEmitMarkers(
            responseFragments.features
            .filter((fragment) => {
              if (matchedActiveSFH.includes(fragment.properties.matchedProperty)) {
                fragment.properties.sellingStatus = PropertyStatusDto.ForSale;
              }

              return fragment.properties.sellingStatus !== PropertyStatusDto.Active &&
                     fragment.properties.sellingStatus !== PropertyStatusDto.Inactive;
            }),
            stream,
            options.zoom
          );

          if (responseFragments.next) {
            this.getFragmentsListByUrl(responseFragments.next, stream, options.zoom);
          }
        }

        if (streams.count) {
          streams.count.next({value: markersCount});
        }

        stream.complete();
      },
      error => {
        this.logger.error(
          'PropertiesRepositoryService::listResultAsStream:Error',
          error
        );
        return EMPTY;
      }
    );
  }

  private async handleMarkersWithoutAddress(
    features,
    stream: Subject<Array<MarkerModel | FragmentModel | MarkerModelWithoutAddress>>,
    count: Subject<Object>,
    zoom: number
  ): Promise<void> {
    const groupedMarker: GroupedMarkerWithoutAddressData[] = MarkerWithoutAddressSerializer.groupedMarker(
      features
    );

    const markersCount = await this.splitAndEmitMarkersWithoutAddress(
      groupedMarker,
      stream,
      zoom
    );

    if (count) {
      count.next({value: markersCount});
    }
  }

  private searchMatchedActiveSFH(
    matchedActiveSFH: string[],
    searchSource: PropertiesListResult,
    feature: MarkersDto,
    featureSource: PropertiesListResult
  ): boolean {
    const matchedPropertyId = feature.properties.matchedProperty;
    const matchedProperty = searchSource.features.find(property => property.properties.uuid === matchedPropertyId);

    if (
      !isNullOrUndefined(matchedProperty) &&
      matchedProperty.properties.sellingStatus === PropertyStatusDto.Active &&
      matchedProperty.properties.propertyType === PropertyTypeDto.SingleFamilyHouse
    ) {
      const sameAddressListings = featureSource.features
        .filter(listing => listing.properties.matchedProperty === matchedPropertyId)
        .sort((a, b) => new Date(b.properties.createdAt).getTime() - new Date(a.properties.createdAt).getTime());

      if (sameAddressListings[0].properties.uuid === feature.properties.uuid) {
        matchedActiveSFH.push(matchedPropertyId);
        return true;
      }
    }

    return false;
  }

  private shouldItShowForSale(options: QueryOptions): boolean {
    return options.filterOptions.SellingStatus.MakeMeMove === options.filterOptions.SellingStatus.ForSale ||
      options.filterOptions.SellingStatus.ForSale;
  }

  private showsOnlyForSale(options: QueryOptions): boolean {
    return options.filterOptions.SellingStatus.ForSale &&
      !options.filterOptions.SellingStatus.Active &&
      !options.filterOptions.SellingStatus.Idle &&
      !options.filterOptions.SellingStatus.MakeMeMove;
  }


  private *createStream(stream: Subject<Object>, streams: Streams): IterableIterator<void> {
    while (true) {
      const options = yield;
      const tmpStream = new Subject<Array<MarkerModel | FragmentModel>>();

      const newCachedMarkers = new Map<string, boolean>();
      if (options.resetFECache) {
        this.cachedMarkers.clear();
      }

      const subscription = tmpStream.subscribe(
        markers => {
          const markerMap = new Map<string, MarkerModel | FragmentModel>();
          markers.forEach((marker) => {
            markerMap.set(marker.id, marker);
          });

          const { added, updated } = this.calculateMapDiff<FragmentModel | MarkerModel>(this.cachedMarkers, markerMap);
          added.forEach((value, key) => this.cachedMarkers.set(key, true));

          added.forEach((value, key) => newCachedMarkers.set(key, true));
          updated.forEach((value, key) => newCachedMarkers.set(key, true));

          stream.next({added, updated, removed: null});
        },
        error => { throw error; },
        () => {
          const { removed } = this.calculateMapDiff(this.cachedMarkers, newCachedMarkers);
          stream.next({added: null, updated: null, removed});
          streams.markersChunksLoaded.next();
          this.cachedMarkers = newCachedMarkers;
          subscription.unsubscribe();
        }
      );
      this.listResultAsStream(tmpStream, options, streams);
    }
  }

  private optionsIsValid({ filterOptions }: QueryOptions): boolean {
    return !(filterOptions.PropertyType === 'PropertyTypeWhereReturnZeroProperties');
  }

  private clearInactiveStatus({ SellingStatus: sellingStatus }: FilterOptions): void {
    if (sellingStatus.Idle) sellingStatus.Idle = false;
  }

  private optionsToParams(options: QueryOptions): string {
    let params: string = this.mapCoordinatesToParams(options.coordinates, options.zoom, '?');

    if (options.zoom) {
      if (params !== '') params += this.mapZoomToParams(options.zoom, '&');
      else params += this.mapZoomToParams(options.zoom, '?');
    }

    if (options.filterOptions) {
      if (params !== '') params += this.filterOptionsToParams(options.filterOptions, '&');
      else params += this.filterOptionsToParams(options.filterOptions, '?');
    }

    if (options.filterOptions && options.filterOptions.SellingStatus) {
      if (params !== '') params += this.sellingStatusToParams(options.filterOptions.SellingStatus, '&');
      else params += this.sellingStatusToParams(options.filterOptions.SellingStatus, '?');
    }

    if (options.page) {
      if (params !== '') params += this.pageToParams(options.page, '&');
      else params += this.pageToParams(options.page, '?');
    }
    return params;
  }

  private async getFragmentsListByUrl(
    url: string,
    stream: Subject<Array<MarkerModel | FragmentModel>>,
    zoom: number
  ): Promise<void> {
    try {
      const response = await this.httpClient.get(url, { headers: this.skipAuthHeaders }).toPromise();
      await this.splitAndEmitMarkers(response['features'], stream, zoom);

      if (response['next']) this.getFragmentsListByUrl(response['next'], stream, zoom);

    } catch (error) {
      this.logger.error('PropertiesRepositoryService::getFragmentsListByUrl:Error', error);
    }
  }

  private async getMarkerWithoutAddressListByUrl(
    url: string,
    stream: Subject<Array<MarkerModel | FragmentModel | MarkerModelWithoutAddress>>,
    count: Subject<Object>,
    zoom: number,
    features: MarkersWithoutAddressData.Marker[]
  ): Promise<void> {
    try {
      const response = await this.httpClient.get<MarkersWithoutAddressData.Response>(url, { headers: this.skipAuthHeaders }).toPromise();

      if (!isNullOrUndefined(response.next)) {
        this.getMarkerWithoutAddressListByUrl(
          response['next'],
          stream,
          count,
          zoom,
          [...features, ...response.results]
        );
      } else {
        await this.handleMarkersWithoutAddress(
          [...features, ...response.results],
          stream,
          count,
          zoom
        );
      }
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::getMarkerWithoutAddressListByUrl:Error', error);
    }
  }

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private mapFilterService: MapFilterService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {}

  getDataShaderLayerTileUrl(coordinate: google.maps.Point, zoom: number): string {
    if (!shouldShowDataShaderLayer(zoom)) {
      return null;
    }

    const { x, y } = GmapsUtils.convertPointToTmsCoordinates(coordinate, zoom);
    const tileUrl = `${ environment.dataShaderLayerUrl }/properties/gradient/v1/${ zoom }/${ x }/${ y }.png`;
    return tileUrl;
  }

  public openStream(additionalStreams: Streams): Subject<Object> {
    const mainStream = new Subject<Object>() as FetchableSubject<Object>;
    const generator = this.createStream(mainStream, additionalStreams);

    generator.next();
    mainStream.fetch = (options) => {
      generator.next(options);
    };
    return mainStream;
  }

  public async getDataByUrl(page: PageType): Promise<ExtendedMarkerModel[]> {
    let url: string = '';
    let markersList: InitialPropertyObject[] = [];

    switch (page) {
      case 'start-page': url = `${this.GLOBAL_URL_V1_CASHED}/listings/latest`; break;
      case 'favorites': url = `${this.GLOBAL_URL_V1}/listings/similar?source=favorites`; break;
      default: url = `${this.GLOBAL_URL_V1_CASHED}/listings/latest`;
    }

    try {
      markersList = await this.httpClient.get<InitialPropertyObject[]>(url).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::getDataByUrl:error', error);
    } finally {
      return markersList.map(property => new ExtendedMarkerModel(property));
    }
  }

  public async getPropertyListings(propertyId: string): Promise<ExtendedMarkerModel[][]> {
    let markersList: InitialPropertyObject[] = [];
    const url = `${this.GLOBAL_URL_V1}/listings/similar?source=property&property_id=${propertyId}`;

    try {
      markersList = await this.httpClient.get<InitialPropertyObject[]>(url).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::getDataByUrl:error', error);
    } finally {
      const markers = markersList.map(property => new ExtendedMarkerModel(property));
      return splitMarkersIntoGroups(markers);
    }
  }

  public async getFavoritesForListings(): Promise<Array<string>> {
    try {
      return this.httpClient.get<Array<string>>(`${this.FAVORITES_URL}/uuids`).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::getFavoritesForListings:error', error);
    }
  }

  public getProperties(params: string): Observable<PropertiesListResult> {
    return this.httpClient.get<PropertiesListResult>(`${this.URL_V1_CASHED}${params}`)
      .pipe(
        catchError(error => {
          this.logger.error('PropertiesRepositoryService::getProperties:error', error);
          return EMPTY;
        })
      );
  }

  public getPropertiesByUrl(url: string): Promise<PropertiesListResult> {
    try {
      return this.httpClient.get<PropertiesListResult>(url).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::getListings:error', error);
    }
  }

  public getListings(params: string): Observable<ListingListResult> {
    return this.httpClient
      .get<ListingListResult>(
        `${this.FOR_SALE_URL_CASHED}${params}`,
        { headers: evadePreflight(this.skipAuthHeaders) }
      )
      .pipe(
        catchError(error => {
          this.logger.error('PropertiesRepositoryService::getListings:error', error);
          return EMPTY;
        })
      );
  }

  getListingDetails(propertyId: string): Observable<ListingDetailsDto> {
    const url = `${ this.FOR_SALE_URL_CASHED }/${ propertyId }`;
    const headers = evadePreflight(this.skipAuthHeaders);
    return this.httpClient.get<ListingDetailsDto>(url, { headers });
  }

  public getListingsByUrl(url: string): Promise<ListingListResult> {
    try {
      return this.httpClient.get<ListingListResult>(url).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::getListings:error', error);
    }
  }

  public getListingsCount(options: QueryOptions): Observable<PropertiesListCounts> {
    try {
      const params = this.optionsToParams(options);
      return this.httpClient.get<PropertiesListCounts>(
          `${this.FOR_SALE_URL_CASHED}/counts${params}`,
          { headers: evadePreflight(this.skipAuthHeaders) }
        );
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::getListingsCount:error', error);
    }
  }

  public async createRealtorLeadTicket(body: RealtorTicket): Promise<RealtorTicketResponse> {
    try {
      return await this.httpClient.post<RealtorTicketResponse>(`${this.TICKETS_URL}/realtor_lead`, body).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::createRealtorLeadTicket:Error', error);
      throw new Error('PropertiesRepositoryService::createRealtorLeadTicket:Error');
    }
  }

  public async createRealtorPartnerTicket(body: RealtorTicket): Promise<RealtorTicketResponse> {
    try {
      return await this.httpClient.post<RealtorTicketResponse>(`${this.TICKETS_URL}/realtor_partner`, body).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::createRealtorPartnerTicket:Error', error);
    }
  }

  async removePropertyTicket(body: RemoveTicket): Promise<RemoveTicketResponse> {
    try {
      const url = `${ this.TICKETS_URL }/remove_property`;
      const options = { headers: this.skipAuthHeaders };
      return this.httpClient.post<RemoveTicketResponse>(url, body, options).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::removePropertyTicket:Error', error);
    }
  }

  createNewCityAlert(data: CreateNewCityAlert): Observable<void> {
    const url = `${ this.GLOBAL_URL_V1 }/new-city-alert`;
    const options = { headers: this.skipAuthHeaders };

    return this.httpClient.post<void>(url, data, options);
  }

  async getMarkerDetails(propertyId: string): Promise<ExtendedMarkerModel> {
    try {
      let marker: InitialPropertyObject = null;
      const getMarkerUrl: string = `${this.URL_V1}/${propertyId}`;
      if (this.authService.isDissentConfigureType) {
        marker = await this.httpClient.get<InitialPropertyObject>(getMarkerUrl, { headers: this.skipAuthHeaders }).toPromise();
      } else {
        marker = await this.httpClient.get<InitialPropertyObject>(getMarkerUrl).toPromise();
      }
      return new ExtendedMarkerModel(marker);
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::getMarkerDetails:Error', error);
    }
  }

  public async getFragmentsList(options: QueryOptions): Promise<PropertiesListResult> {
    try {
      const params = this.optionsToParams(options);
      return await this.httpClient.get<PropertiesListResult>(
        `${this.URL_V1_CASHED}/geo${params}`, { headers: evadePreflight(this.skipAuthHeaders) }
      ).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::getFragmentsList:Error', error);
    }
  }

  getScrapedListingsGeo(options: QueryOptions): Observable<PropertiesListResult> {
    return this.httpClient.get<PropertiesListResult>(
      `${this.SCRAPED_LISTINGS_GEO_CASHED}${this.optionsToParams(options)}`,
      { headers: evadePreflight(this.skipAuthHeaders) }
    ).pipe(
      catchError(error => {
        this.logger.error(
          'PropertiesRepositoryService::getScrapedProperties:Error',
          error
        );
        return of(null);
      })
    );
  }

  getPropertiesGeo(options: QueryOptions): Observable<PropertiesListResult> {
    return this.httpClient.get<PropertiesListResult>(
      `${this.URL_V1_CASHED}/geo${this.optionsToParams(options)}`,
      { headers: evadePreflight(this.skipAuthHeaders) }
    ).pipe(
      catchError(error => {
        this.logger.error(
          'PropertiesRepositoryService::getFragmentsList:Error',
          error
        );
        return of(null);
      })
    );
  }

  getPropertiesWithoutAddressGeo(options: QueryOptions): Observable<MarkersWithoutAddressData.Response> {
    return this.httpClient.get<MarkersWithoutAddressData.Response>(
      `${this.WITHOUT_ADDRESS_GEO}${this.optionsToParams(options)}`,
      { headers: evadePreflight(this.skipAuthHeaders) }
    ).pipe(
      catchError(error => {
        this.logger.error(
          'PropertiesRepositoryService::getPropertiesWithoutAddressList:Error',
          error
        );
        return of(null);
      })
    );
  }

  getClustersGeo(options: QueryOptions): Observable<ClustersData.Response> {
    this.cachedZoom = options.zoom;
    return this.httpClient.get<ClustersData.Response>(
      this.CLUSTERS_GEO_CACHED,
      {
        headers: evadePreflight(this.skipAuthHeaders),
        params: this.getHttpParamsFromOptionsForClusters(options)
      }
    ).pipe(
      catchError(error => {
        this.logger.error(
          'PropertiesRepositoryService::getClustersGeo:Error',
          error
        );
        return EMPTY;
      })
    );
  }

  getScopertyPlusGeo(options: QueryOptions): Observable<ScopertyPlus.Response> {
    return this.httpClient.get<ScopertyPlus.Response>(
      `${this.SCOPERTY_PLUS_GEO}${this.optionsToParams(options)}`,
      {
        headers: evadePreflight(this.skipAuthHeaders)
      }
    ).pipe(
      catchError(error => {
        this.logger.error(
          'PropertiesRepositoryService::getScopertyPlusGeo:Error',
          error
        );
        return EMPTY;
      })
    );
  }

  getPropertyIdFromPlaceDescription(placeDescription: PlaceDescription): Observable<string> {
    const { point } = placeDescription;
    const options: QueryOptions = {
      coordinates: {
        nwLatitude: point.lat + SQUARE_COORDINATES_COEFFICIENT,
        nwLongitude: point.lng + SQUARE_COORDINATES_COEFFICIENT,
        seLatitude: point.lat - SQUARE_COORDINATES_COEFFICIENT,
        seLongitude: point.lng - SQUARE_COORDINATES_COEFFICIENT,
      },
      zoom: ZOOM_CONSTANTS.QUARTER.value,
    };

    return forkJoin([
      this.getPropertiesGeo(options),
      this.getScrapedListingsGeo(options)
    ]).pipe(
      map(([responseFragments, responseScrapedListings]: [PropertiesListResult, PropertiesListResult]) => {
        if (
          !isNullOrUndefined(responseScrapedListings) &&
          responseScrapedListings.features instanceof Array
        ) {
          this.replaceActiveSFHWithScrapedInPropertyListResult(
            responseFragments,
            responseScrapedListings
          );
        }

        const markers = responseFragments.features.map(feature => new MarkerModel(feature.properties));

        return this.findPropertyIdFromMarkers(placeDescription, markers);
      }),
      catchError(error => {
        this.logger.error('PropertiesRepositoryService::getFragmentsList:Error', error);
        return EMPTY;
      })
    );
  }

  getOwnProperties(): Observable<MinePropertiesData> {
    return this.httpClient.get<MinePropertiesData>(`${this.URL_V1}/mine`)
      .pipe(
        catchError(error => {
          this.logger.error('PropertiesRepositoryService::getProfileDataRaw:Error', error);
          return EMPTY;
        })
      );
  }

  private replaceActiveSFHWithScrapedInPropertyListResult(
    responseFragments: PropertiesListResult,
    responseScrapedListings: PropertiesListResult
  ): PropertiesListResult {
    const scrapedFeaturesWithMatchedProperty = responseScrapedListings.features
      .filter(feature => !isNullOrUndefined(feature.properties.matchedProperty));

    responseFragments.features = responseFragments.features
      .map(feature => {
        if (
          feature.properties.sellingStatus !== PropertyStatusDto.Active ||
          feature.properties.propertyType !== PropertyTypeDto.SingleFamilyHouse
        ) {
          return feature;
        }

        const scrapedMatchedFeature = scrapedFeaturesWithMatchedProperty
          .filter(scraped => scraped.properties.matchedProperty === feature.properties.uuid)
          .sort((a, b) => new Date(b.properties.createdAt).getTime() - new Date(a.properties.createdAt).getTime());

        if (scrapedMatchedFeature.length === 0) {
          return feature;
        }

        return scrapedMatchedFeature[0];
      });

    return responseFragments;
  }

  private findPropertyIdFromMarkers(
    placeDescription: PlaceDescription,
    markers: MarkerModel[],
  ): string {
    if (isNullOrUndefined(markers) || markers.length === 0) {
      return null;
    }

    const { street, streetNumber } = placeDescription.address;

    const foundMarker = markers.find(marker =>
      marker.Street.toLowerCase() === street.toLowerCase() &&
      marker.HouseNumber === streetNumber
    );

    if (isNullOrUndefined(foundMarker)) {
      return null;
    }

    return foundMarker.id;
  }

  public getMarkerIdFromFragmentsList(options: QueryOptions, query: SearchPointData): Observable<string> {
    return forkJoin(
      this.httpClient.get<PropertiesListResult>(
        `${this.URL_V1_CASHED}/geo${this.optionsToParams(options)}`,
        { headers: this.skipAuthHeaders }
      ),
      this.getScrapedListingsGeo(options),
    ).pipe(
      map(([responseFragments, responseScrapedListings]: [PropertiesListResult, PropertiesListResult]) => {
        if (
          !isNullOrUndefined(responseScrapedListings) &&
          responseScrapedListings.features instanceof Array
        ) {
          const scrapedHasMatched = responseScrapedListings.features
            .filter(feature => !isNullOrUndefined(feature.properties.matchedProperty));

          responseFragments.features = responseFragments.features
            .map(feature => {
              if (
                feature.properties.sellingStatus !== PropertyStatusDto.Active ||
                feature.properties.propertyType !== PropertyTypeDto.SingleFamilyHouse
              ) {
                return feature;
              }

              const scrapedListingsForFeature = scrapedHasMatched
                .filter(scraped => scraped.properties.matchedProperty === feature.properties.uuid)
                .sort((a, b) => new Date(b.properties.createdAt).getTime() - new Date(a.properties.createdAt).getTime());

              if (!scrapedListingsForFeature.length) {
                return feature;
              }

              return scrapedListingsForFeature[0];
            });
        }

        let fragments: Array<MarkerModel> = [];
        if (responseFragments != null && responseFragments.features instanceof Array) {
          fragments = responseFragments.features.map(item => new MarkerModel(item.properties));
        }

        if (query === null || fragments.length === 0) {
          return null;
        }
        const markersPoints: Array<IMarkersPoints> = [];

        fragments.map(marker => {
          if (marker instanceof MarkerModel) {
            markersPoints.push(
              {
                id: marker.id,
                street: marker.Street,
                houseNumber: marker.HouseNumber,
                lat: marker.Latitude,
                lng: marker.Longitude
              }
            );
          }
        });

        for (let i = 0; i < markersPoints.length; i++) {
          markersPoints[i].distance = calculateDistance(
            query.placePoint.lat,
            query.placePoint.lng,
            markersPoints[i].lat,
            markersPoints[i].lng,
            'K'
          );
        }

        markersPoints.sort((a: IMarkersPoints, b: IMarkersPoints) => {
          return a.distance - b.distance;
        });

        const pointStreet = String(query.address.street).slice(0, 1).toLowerCase();
        const pointStreetNumber = String(query.address.streetNumber);

        const searchProperty = markersPoints.find(markerPoint => {
          return (
            (String(markerPoint.street).slice(0, 1).toLowerCase() === pointStreet) &&
            (String(markerPoint.houseNumber) === pointStreetNumber)
          );
        });

        if (isNullOrUndefined(searchProperty)) {
          return null;
        }

        return searchProperty.id;
      }),
      catchError(error => {
        this.logger.error('PropertiesRepositoryService::getFragmentsList:Error', error);
        return EMPTY;
      })
    );
  }

  /**
   * Returns price histogram data to be used on the frontend to build filter by price.
   * property_type string Choices are: ['apartment', 'single_family_house', 'multi_family_house']
   */
  getPriceHistogram(options: QueryOptions): Observable<IHistogram> {
    const clonedOptions: QueryOptions = cloneDeep(options);
    this.clearInactiveStatus(clonedOptions.filterOptions);
    const params = this.optionsToParams(clonedOptions);

    return this.httpClient.get<IHistogram>(
      `${this.URL_V1_CASHED}/price-histogram${params}`,
      { headers: evadePreflight(this.skipAuthHeaders) }
    ).pipe(catchError(
      error => {
        this.logger.error('PropertiesRepositoryService:getPriceHistogram:Error', error);
        return throwError(error);
      }
    ));
  }

  public async getFavoriteProperties(): Promise<PropertiesListResult> {
    try {
      return await this.httpClient.get<PropertiesListResult>(`${this.FAVORITES_URL}`).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::getFavoriteProperties:Error', error);
    }
  }

  public async getFavoritePropertiesByUrl(url: string): Promise<PropertiesListResult> {
    try {
      return await this.httpClient.get<PropertiesListResult>(url).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::getFavoritePropertiesByUrl:Error', error);
    }
  }

  public getEnergyCertificate(id: string): Observable<EnergyCertificate> {
    return this.httpClient.get<EnergyCertificate>(`${this.URL_V1}/${id}/energy-certificate`);
  }

  public getOffersDataForUser(params: string = ''): Promise<OfferData> {
    return this.httpClient.get<OfferData>(`${this.GLOBAL_URL_V1}/user/offers${params}`).toPromise();
  }

  private getProfileDataRaw(params: string = ''): Promise<MinePropertiesData> {
    return this.httpClient.get<MinePropertiesData>(`${this.URL_V1}/mine${params}`).toPromise();
  }

  private getSearchAlertsRaw(params: string = ''): Promise<SearchAlertsObject> {
    return this.httpClient.get<SearchAlertsObject>(`${this.GLOBAL_URL_V1}/alerts/search${params}`).toPromise();
  }

  public async getSearchAlerts(): Promise<Array<SearchAlert>> {
    try {
      const response: SearchAlertsObject = await this.getSearchAlertsRaw();
      const itemsPerPage: number = 10;
      const pages: number = Math.ceil(response.count / itemsPerPage) - 1; // rest of pages
      let searchAlerts: Array<SearchAlert> = [...response.results];

      const promisesArray: Array<Promise<SearchAlertsObject>> = [];
      for (let i: number = 0; i < pages; i++) {
        const query: string = `?page=${i + 2}`; // begin with page #2
        promisesArray.push(this.getSearchAlertsRaw(query));
      }

      const responses: Array<SearchAlertsObject> = await Promise.all(promisesArray);
      const results: Array<Array<SearchAlert>> = responses.map(arrItem => arrItem.results);
      searchAlerts = searchAlerts.concat(...results);
      return searchAlerts;
    } catch (error) {
      this.logger.error('PropertySearchAlertsComponent::loadSearchTemplates', error);
    }
  }

  public async getProfileData(): Promise<Array<ExtendedMarkerModel>> {
    try {
      const response: MinePropertiesData = await this.getProfileDataRaw();
      const itemsPerPage: number = 10;
      const pages: number = Math.ceil(response.count / itemsPerPage) - 1; // rest of pages
      let profileData: Array<InitialPropertyObject> = [...response.results];

      const promisesArray: Array<Promise<MinePropertiesData>> = [];
      for (let i: number = 0; i < pages; i++) {
        const query: string = `?page=${i + 2}`; // begin with page #2
        promisesArray.push(this.getProfileDataRaw(query));
      }

      const responses: Array<MinePropertiesData> = await Promise.all(promisesArray);
      const results: Array<Array<InitialPropertyObject>> = responses.map(arrItem => arrItem.results);
      profileData = profileData.concat(...results);
      return (profileData || []).map(item => new ExtendedMarkerModel(item));
    } catch (error) {
      this.logger.error('PropertySearchAlertsComponent::loadSearchTemplates', error);
    }
  }

  /**
   * Reload property after it was updated
   * @param property : MarkerModel
   */
  public async reloadProperty(property: MarkerModel): Promise<ExtendedMarkerModel> {
    try {
      const response = await this.httpClient.get<ExtendedMarkerModel>(
          `${this.URL_V1}/${property.id}`, { headers: this.skipAuthHeaders }
        ).toPromise();
      return new ExtendedMarkerModel(response);
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::reloadProperty', error);
    }
  }

  public async getTrends(id: string): Promise<PriceTrendObj> {
    return this.httpClient.get<PriceTrend[]>(`${this.URL_V1}/${id}/trend`)
      .toPromise()
      .then(trends => {
        return { uuid: id, trends };
      });
  }

  public async getCityTrends(id: string): Promise<PriceTrendObj> {
    return this.httpClient.get<PriceTrend[]>(`${this.URL_V1}/${id}/trend-city`)
      .toPromise()
      .then(trends => {
        return { uuid: id, trends };
      });
  }

  public async getAllTrends(id: string): Promise<PriceTrends> {
    const property = await this.getTrends(id);
    const city = await this.getCityTrends(id);
    return {
      property,
      city,
    };
  }

  public async setOfferPrice(id: string, body: OfferPrice): Promise<Offer> {
    try {
      return await this.httpClient.patch<Offer>(`${this.GLOBAL_URL_V1}/user/offers/${id}`, body).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::setOfferPrice:Error', error);
    }
  }

  public createOfferPrice(body: OfferPrice): Promise<Offer> {
    try {
      return this.httpClient.post<Offer>(`${this.GLOBAL_URL_V1}/user/offers`, body).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::createOfferPrice:Error', error);
      throw new Error('PropertiesRepositoryService::createOfferPrice:Error');
    }
  }

  public async setSellingStatus(property: ExtendedMarkerModel, status?: PropertyStatus): Promise<ExtendedMarkerModel> {
    try {
      return new ExtendedMarkerModel(
        await this.httpClient.patch<ExtendedMarkerModel>(
          `${this.URL_V1}/${property.id}`,
          {sellingStatus: statusToBackEnd(status)}
        ).toPromise()
      );
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::setSellingStatus:Error', error);
    }
  }

  public saveEnergyCertificate(id: string, certificate: FormData): Observable<EnergyCertificate> {
    return this.httpClient.post<EnergyCertificate>(`${this.URL_V1}/${id}/energy-certificate`, certificate);
  }

  public async createSearchAlerts(body: SearchAlertsScheme): Promise<void> {
    try {
      await this.httpClient.post(`${this.GLOBAL_URL_V1}/alerts/search`, body).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::createSearchAlerts:Error', error);
      throw new Error('PropertiesRepositoryService::createSearchAlerts:Error');
    }
  }

  public async updateSearchAlert(id: string, body: SearchAlertsScheme): Promise<SearchAlert> {
    try {
      return await this.httpClient.patch<SearchAlert>(`${this.GLOBAL_URL_V1}/alerts/search/${id}`, body).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::updateSearchAlert:Error', error);
    }
  }

  public async setOwner(id: string): Promise<void> {
    try {
      await this.httpClient.post(`${this.URL_V1}/${id}/owner`, {}).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::setOwner:Error', error);
      const propertyAlreadyClaimed = responseHasError(error, ErrorCodes.PropertyAlreadyClaimed);
      if (propertyAlreadyClaimed) {
        throw new PropertyAlreadyClaimed();
      } else {
        throw new Error('PropertiesRepositoryService::setOwner:Error');
      }
    }
  }

  public async setRealtor(id: string): Promise<void> {
    try {
      await this.httpClient.post(`${this.URL_V1}/${id}/realtor`, {}).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::setRealtor:Error', error);
      const propertyAlreadyClaimed = responseHasError(error, ErrorCodes.PropertyAlreadyClaimed);
      if (propertyAlreadyClaimed) {
        throw new PropertyAlreadyClaimed();
      } else {
        throw new Error('PropertiesRepositoryService::setRealtor:Error');
      }
    }
  }

  public async addNewApartmentToHouse(houseId: string, apartmentData: ApartmentData): Promise<ExtendedMarkerModel> {
    try {
      const url = `${this.URL_V1}/${houseId}/apartments`;
      const data = await this.httpClient.post<ExtendedMarkerModel>(url, apartmentData).toPromise();
      return new ExtendedMarkerModel(data);
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::setRealtor:Error', error);
      const propertyAlreadyClaimed = responseHasError(error, ErrorCodes.PropertyAlreadyClaimed);
      if (propertyAlreadyClaimed) {
        throw new PropertyAlreadyClaimed();
      } else {
        throw new Error('PropertiesRepositoryService::addNewApartmentToHouse:Error');
      }
    }
  }

  public async removeOwnership(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`${this.URL_V1}/${id}/owner`).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::removeOwnership:Error', error);
    }
  }

  public changeImageOrder(propertyId: string, imageId: string, order: number): Promise<ImageResponse> {
    const headers: HttpHeaders = new HttpHeaders({'Content-Type': 'default'});
    try {
      return this.httpClient.patch<ImageResponse>(`${this.URL_V1}/${propertyId}/images/${imageId}`, {order}, { headers })
        .toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::uploadImage:Error', error);
    }
  }

  public uploadImage(id: string, body: FormData): Promise<ImageResponse> {
    const headers: HttpHeaders = new HttpHeaders({'Content-Type': 'default'});
    try {
      return this.httpClient.post<ImageResponse>(`${this.URL_V1}/${id}/images`, body, { headers }).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::uploadImage:Error', error);
    }
  }

  public async removeImage(id: string, imageId: string): Promise<void> {
    try {
      await this.httpClient.delete(`${this.URL_V1}/${id}/images/${imageId}`).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::removeImage:Error', error);
    }
  }

  public async toggleMarkerFavorite(propertyId: string, isFavorite: boolean = false): Promise<string> {
    try {
      const response = isFavorite
                         ? await this.httpClient.delete<string>(`${this.FAVORITES_URL}/${propertyId}`).toPromise()
                         : await this.httpClient.post<string>(`${this.FAVORITES_URL}`, { propertyId }).toPromise();
      return response;
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::toggleMarkerFavorite:Error', error);
      throw new Error('PropertiesRepositoryService::toggleMarkerFavorite:Error');
    }
  }

  public async removeSearchAlert(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`${this.GLOBAL_URL_V1}/alerts/search/${id}`).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::createSearchAlerts:Error', error);
    }
  }

  public getOffersData(propertyId: string): Observable<OfferData> {
    return this.httpClient.get<OfferData>(`${this.URL_V1}/offers?property=${propertyId}`);
  }

  public async updatePropertyDetail(id: string, body: ExtendedMarkerModel, onlySaleStatusAndPrice = false): Promise<void> {
    const headers: HttpHeaders = new HttpHeaders({'Content-Type': 'default'});
    let serializedBody = body.serialize();
    if (onlySaleStatusAndPrice) {
      serializedBody = {
        salePrice: serializedBody.salePrice,
        sellingStatus: serializedBody.sellingStatus
      };
    }
    try {
      await this.httpClient.patch(`${this.URL_V1}/${id}`, serializedBody, { headers }).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::updatePropertyDetail:Error', error);
      return await Promise.reject(error);
    }
  }

  createListing(marker: ExtendedMarkerModel): Observable<void> {
    const headers: HttpHeaders = new HttpHeaders({'Content-Type': 'default'});
    const body = marker.serializeListingCreation();

    return this.httpClient.patch<void>(`${this.URL_V1}/${marker.id}`, body, { headers })
      .pipe(catchError(
        error => {
          this.logger.error('PropertiesRepositoryService:createListing:Error', error);
          return throwError(error);
        }
      ));
  }

  updateShowAddressProperty(marker: ExtendedMarkerModel): Observable<void> {
    const headers: HttpHeaders = new HttpHeaders({'Content-Type': 'default'});
    const body = marker.serializeShowAddressProperty();

    return this.httpClient.patch<void>(`${this.URL_V1}/${marker.id}`, body, { headers })
      .pipe(catchError(
        error => {
          this.logger.error('PropertiesRepositoryService:createListing:Error', error);
          return throwError(error);
        }
      ));
  }

  updatePropertyValuation(propertyId: string, livingArea: string, constructionYear: string): Observable<void> {
    const url = `${ this.URL_V1 }/${ propertyId }`;
    const headers: HttpHeaders = new HttpHeaders({'Content-Type': 'default'});
    const serializedBody: UpdatePropertyValuation = {};
    if (!isEmptyString(livingArea)) {
      serializedBody.livingArea = Number.parseInt(livingArea, 10);
    }
    if (!isEmptyString(constructionYear)) {
      serializedBody.constructionYear = `${ constructionYear }-01-01`;
    }

    return this.httpClient.patch<void>(url, serializedBody, { headers });
  }

  updatePropertyEnergyCertificate(id: string, file: File): Observable<{uuid: string, certificate: string}> {
    const headers: HttpHeaders = new HttpHeaders({'Content-Type': 'default'});
    const formData = new FormData();
    formData.append('certificate', file);

    return this.httpClient
      .post<{uuid: string, certificate: string}>(
        this.ENERGY_CERTIFICATE_URL.replace('{property_uuid}', id),
        formData,
        { headers }
      )
      .pipe(catchError(
        error => {
          this.logger.error('PropertiesRepositoryService:updatePropertyEnergyCertificate:Error', error);
          return throwError(error);
        }
      ));
  }

  public async getPropertyStatistic(propertyId: string): Promise<PropertyStatistic> {
    try {
      return await this.httpClient.get<PropertyStatistic>(`${this.URL_V1}/${propertyId}/statistic`).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::getPropertyStatistic', error);
    }
  }

  public clearCache(): void {
    if (this.cachedMarkers) this.cachedMarkers.clear();
  }

  public async setPropertyVisited(propertyId: string): Promise<void> {
    try {
      await this.httpClient.post(`${this.URL_V1}/${propertyId}/visited`, {}).toPromise();
    } catch (error) {
      this.logger.error('PropertiesRepositoryService::setPropertyVisited', error);
    }
  }

  private getHttpParamsFromOptionsForClusters(options: QueryOptions): HttpParams {
    const {nwLongitude, nwLatitude, seLongitude, seLatitude} = options.coordinates;
    const {zoom} = options;

    return new HttpParams({
      fromObject: {
        nwx: lng2tile(nwLongitude, zoom).toString(),
        nwy: lat2tile(nwLatitude, zoom).toString(),
        sex: lng2tile(seLongitude, zoom).toString(),
        sey: lat2tile(seLatitude, zoom).toString(),
        zoom: zoom.toString(),
      }
    });
  }
}
