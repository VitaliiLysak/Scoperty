import {
  Component,
  Inject,
  Input,
  OnInit,
  OnChanges,
  ElementRef,
  OnDestroy,
} from '@angular/core';

import { MapsEventListener } from '@agm/core/services/google-maps-types';
import { Observable, Subscription } from 'rxjs';
import { debounce } from 'lodash';

import { isNullOrUndefined } from '../../utils/null-or-undefined.util';
import { MILE_IN_KILOMETRES, MILE_IN_NAUTICAL, NAUTICAL_IN_MILE } from '../../../app.constants';
import { MapManagerService } from '../../../core/services/map-manager.service';
import { SchedulerService } from '../../../core/services/scheduler.service';
import { PropertiesRepositoryService } from '../../../core/services/properties-repository.service';
import { MarkerModel } from '../../../core/models/marker.model';
import { Coordinates } from '../../../core/models/coordinates.model';
import { SearchPointData } from '../../../core/models/search.model';
import { Place } from '../../../core/models/place.model';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { LOGGER } from '../../../core/services/logger/logger.provider';

import SnazzyInfoWindowFactory from './snazzy-info-window/snazzy-info-window';

export interface IActiveButton {
  shop?: boolean;
  food?: boolean;
  play?: boolean;
  library?: boolean;
  hospital?: boolean;
}

export interface IMarkersPoints {
  id: string;
  street: string;
  houseNumber: string;
  lat: number;
  lng: number;
  distance?: number;
}

const getValues = (object, ...keys): Array<any> => {
  return Array.from((Object as any).entries(object)).reduce(
    (res: Array<any> = [], [k, v]) => keys.indexOf(k) > -1 ? (res.push(v), res) : res,
    []
  ) as Array<any>;
};

@Component({
  selector: 'app-marker-detail-data-place',
  templateUrl: './marker-detail-data-place.component.html',
  styleUrls: ['./marker-detail-data-place.component.css']
})
export class MarkerDetailDataPlaceComponent implements OnInit, OnChanges, OnDestroy {
  @Input() model: any = null;
  @Input() regPage: any = null;
  @Input() mode: 'edit'|'show' = 'show';

  public _name: string = 'marker-detail-data-place';

  public geocoder: any = null;
  public mapsModule: any;
  public googleMap: any;
  public googlePlacesService: any;
  public infoWindow: any;
  public googleMapSettings: any = {
    zoom: 19,
    maxZoom: 20,
    minZoom: 14,
    mapTypeId: 'roadmap',
    center: {
      lat: 51.165691,
      lng: 10.451526000000058
    },
    disableDefaultUI: true,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
    rotateControl: false,
    scaleControl: false,
    signInControl: false,
    zoomControl: false,
    panControl: false,
    clickableIcons: false,
    noClear: true,
    styles: [{
      featureType: 'poi',
      elementType: 'labels',
      stylers: [
        { visibility: 'off' }
      ]
    }]
  };

  public marker: MarkerModel = new MarkerModel();
  public markers: Array<MarkerModel> = [];
  public places: Array<Place> = [];
  public subscriptionMap: Map<string, Subscription> = new Map<string, Subscription>();

  public searchPointData: SearchPointData = null;
  private _mapListeners: Array<MapsEventListener> = [];

  public activeButton: IActiveButton = {
    shop: true,
    food: false,
    play: false,
    library: false,
    hospital: false,
  };

  public hoverButton: IActiveButton = {
    shop: false,
    food: false,
    play: false,
    library: false,
    hospital: false,
  };

  public get cartIconUrl() {
    return `/assets/images/${this.activeButton.shop ? 'cart-active-icon.svg' :
      this.hoverButton.shop ? 'cart-hover-icon.svg' : 'cart-icon.svg'}`;
  }

  public get croissantIconUrl() {
    return `/assets/images/${this.activeButton.food ? 'croissant-active-icon.svg' :
      this.hoverButton.food ? 'croissant-hover-icon.svg' : 'croissant-icon.svg'}`;
  }

  public get swingIconUrl() {
    return `/assets/images/${this.activeButton.play ? 'swing-active-icon.svg' :
      this.hoverButton.play ? 'swing-hover-icon.svg' : 'swing-icon.svg'}`;
  }

  public get bookIconUrl() {
    return `/assets/images/${this.activeButton.library ? 'book-active-icon.svg' :
      this.hoverButton.library ? 'book-hover-icon.svg' : 'book-icon.svg'}`;
  }

  public get medecineIconUrl() {
    return `/assets/images/${this.activeButton.hospital ? 'medecine-active-icon.svg' :
      this.hoverButton.hospital ? 'medecine-hover-icon.svg' : 'medecine-icon.svg'}`;
  }

  public get locationIconUrl() {
    if (this.activeButton.shop) return '/assets/images/location-shopping.svg';
    else if (this.activeButton.play) return '/assets/images/location-kindergarten.svg';
    else if (this.activeButton.library) return '/assets/images/location-school.svg';
    else if (this.activeButton.hospital) return '/assets/images/location-doctor.svg';
    else if (this.activeButton.food) return '/assets/images/location-bakery.svg';
  }

  public get locationHoverIconUrl() {
    if (this.activeButton.shop) return '/assets/images/location-shopping_hover.svg';
    else if (this.activeButton.play) return '/assets/images/location-kindergarten_hover.svg';
    else if (this.activeButton.library) return '/assets/images/location-school_hover.svg';
    else if (this.activeButton.hospital) return '/assets/images/location-doctor_hover.svg';
    else if (this.activeButton.food) return '/assets/images/location-bakery_hover.svg';
  }

  public get locationActiveIconUrl() {
    if (this.activeButton.shop) return '/assets/images/location-shopping_clicked.svg';
    else if (this.activeButton.play) return '/assets/images/location-kindergarten_clicked.svg';
    else if (this.activeButton.library) return '/assets/images/location-school_clicked.svg';
    else if (this.activeButton.hospital) return '/assets/images/location-doctor_clicked.svg';
    else if (this.activeButton.food) return '/assets/images/location-bakery_clicked.svg';
  }

  public getPlacesConfig() {
    const type = Object.keys(this.activeButton)[0];
    switch (type) {
      case 'shop': return { keyword: 'supermarkt' };
      case 'food': return { keyword: 'bäckerei' };
      case 'play': return { keyword: 'kindergarten' };
      case 'library': return { type: 'school', keyword: 'elementary | secondary | gymnasium' };
      case 'hospital': return { keyword: 'arzt' };
      default: return { keyword: 'supermarkt' };
    }
  }

  private _getPlacePostCode(marker) {
    return new Promise((resolve, reject) => {
      if (this.geocoder != null) {
        const placePosition = marker.native.position;
        const placeCoordinates = {lat: placePosition.lat(), lng: placePosition.lng()};
        this.geocoder.geocode({'location': placeCoordinates}, (results, status) => {
          if (status === 'OK') {
            return resolve(results[0] && results[0].formatted_address.match(/[0-9]{5}/) &&
              results[0].formatted_address.match(/[0-9]{5}/)[0]);
          } else {
            reject();
          }
        });
      } else reject();
    });
  }

  public get mapBounds(): Coordinates {
    const bounds = this.googleMap.getBounds();
    if (bounds == null) throw new Error('Map not ready!');
    const neBound = bounds.getNorthEast();
    const swBound = bounds.getSouthWest();
    return {
      nwLatitude: neBound.lat(),
      nwLongitude: swBound.lng(),
      seLatitude: swBound.lat(),
      seLongitude: neBound.lng()
    };
  }

  public get mapZoom(): number {
    if (this.googleMap == null) return 0;
    return this.googleMap.getZoom();
  }

  constructor(
    private elementRef: ElementRef,
    private mapManager: MapManagerService,
    private scheduler: SchedulerService,
    private propertiesRepositoryService: PropertiesRepositoryService,
    @Inject(LOGGER) private logger: LoggerService,
  ) {
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.mapBoundsChanged = debounce(this.mapBoundsChanged.bind(this), 100);
  }

  public async ngOnInit(): Promise<void> {
    await this.loadGoogleMapSDK();
    this.subscribeOn('searchProperty', this.mapManager.getSearchPropertyStream(), this.searchProperty);
    setTimeout(() => this._toggleButton('shop'), 1000);
  }

  public ngOnChanges() {
    if (!this.model) return;
    if (this.googleMap == null) {
      if (this.model.position.lat !== 0 && this.model.position.lng !== 0) this.googleMapSettings.center = this.model.position;
      this.loadGoogleMapSDK();
    } else {
      if (this.model.position.lat !== 0 && this.model.position.lng !== 0) this.googleMap.setCenter(this.model.position);
      this.renderMarker();
    }
  }

  public ngOnDestroy(): void {
    this._mapListeners.forEach(listener => (<any>window).google.maps.event.removeListener(listener));
  }

  public initMapListeners(): void {
    this._mapListeners.push(
      this.googleMap.addListener('idle', this.mapBoundsChanged),
    );
  }

  public mapBoundsChanged(): void {
    this.fetchMarkers();
  }

  public _toggleButton(name: string): void {
    this.activeButton = {
      [name]: true
    };
  }

  public _toggleHover(name) {
    this.hoverButton = {
      [name]: !this.hoverButton[name]
    };
  }

  public async fetchMarkers(): Promise<void> {
    const responseFragments = await this.propertiesRepositoryService.getFragmentsList({
      coordinates: this.mapBounds,
      zoom: this.mapZoom,
    });

    if (!isNullOrUndefined(responseFragments) && responseFragments.features instanceof Array) {
      const markers = responseFragments.features.map(item => new MarkerModel(item.properties));
      const markersWithoutStatusIdle = markers.filter((marker: MarkerModel) => {
        return !marker.isStatusIdle;
      });
      this.markers = markersWithoutStatusIdle;
    }

    if (this.searchPointData) this.activateSearchProperty();
  }

  public searchProperty(placeData: SearchPointData): void {
    this.searchPointData = placeData;
  }

  public async activateSearchProperty (): Promise<void> {
    if (this.markers.length === 0) return;

    const markersPoints: Array<IMarkersPoints> = [];

    this.markers.forEach((marker) => {
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
      markersPoints[i]['distance'] = this.calculateDistance(
        this.searchPointData.placePoint['lat'],
        this.searchPointData.placePoint['lng'],
        markersPoints[i]['lat'],
        markersPoints[i]['lng'],
        'K');
    }

    markersPoints.sort((a: IMarkersPoints, b: IMarkersPoints) => {
      return a.distance - b.distance;
    });

    markersPoints.splice(5);

    const pointStreet = String(this.searchPointData.address.street).slice(0, 1).toLowerCase();
    const pointStreetNumber = String(this.searchPointData.address.streetNumber);

    const searchProperty: IMarkersPoints = markersPoints.find(markerPoint => {
      return (
        (String(markerPoint.street).slice(0, 1).toLowerCase() === pointStreet) &&
        (String(markerPoint.houseNumber) === pointStreetNumber)
      );
    });

    if (searchProperty) this.mapManager.searchPropertyActivated(searchProperty.id);

    this.searchPointData = null;
  }

  public renderMarker(): void {
    if (this.model && !this.model.PropertyId) return;
    this.model.hide();
    this.model.render(this.googleMap, true);
    this.model.show();
  }

  public deactivateMarker() {
    const activeMarker = this.places.find((item) => item.isActive);
    if (activeMarker == null) return;
    activeMarker.isActive = false;
    this.setNormalIconToMarker(activeMarker);
  }

  public setNormalIconToMarker(marker) {
    if (marker.isActive) return;
    marker.native.setIcon({
      url: this.locationIconUrl,
      scaledSize: new this.mapsModule.Size(40, 40)
    });
  }

  public setHoverIconToMarker(marker) {
    if (marker.isActive) return;
    marker.native.setIcon( {
      url: this.locationHoverIconUrl,
      scaledSize: new this.mapsModule.Size(40, 40)
    });
  }

  public setActiveIconToMarker(marker) {
    marker.native.setIcon( {
      url: this.locationHoverIconUrl,
      scaledSize: new this.mapsModule.Size(40, 40)
    });
  }

  public async openInfoWindow(place, marker) {
    try {
      this.deactivateMarker();
      marker.isActive = true;
      this.setActiveIconToMarker(marker);
      const postCode = await this._getPlacePostCode(marker);
      this.infoWindow.setPosition(marker.native.getPosition());
      this.infoWindow.setContent(this.buildContent(place, postCode));
      this.infoWindow.open();
    } catch (error) {
      this.logger.error('MarkerDetailDataPlace::openInfoWindow', error);
    }
  }

  public buildContent({name, place_id, vicinity}, postCode: any = '') {
    const linkToGMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${place_id}`;
    return `<div class="si-content-title">${name}</div>` +
      `<div>${vicinity.split(', ')[0]}</div>` +
      `<div>${postCode} ${vicinity.split(', ')[1]}</div>` +
      `<a class="si-content-link" href="${linkToGMaps}" target="_blank">
        Weitere Informationen<i class="si-content-icon"></i>
       </a>`;
  }

  public async loadGoogleMapSDK(): Promise<void> {
    await this.mapManager.loadGoogleMapSDK();
    if (this.googleMap == null && this.model != null && this.model.id !== `${void 0}`) {
      this.createMap((<any>window).google.maps);
    }
  }

  public async createMap(mapsModule: any): Promise<void> {
    this.mapsModule = mapsModule;
    const maptag = this.elementRef.nativeElement.children[0].children[1];
    await this.scheduler.sleep();
    this.googleMap = new mapsModule.Map(maptag, this.googleMapSettings);
    await this.scheduler.sleep();
    this.renderMarker();
    this.initMapListeners();
    this.geocoder = new google.maps.Geocoder();
  }

  public subscribeOn(key: string, stream: Observable<any>, handler: (data: any) => void): void {
    if (this.subscriptionMap.has(key)) this.subscriptionMap.get(key).unsubscribe();
    this.subscriptionMap.set(key, stream.subscribe(handler.bind(this)));
  }

  public unsubscribeAll(): void {
    this.subscriptionMap.forEach((subscription) => subscription.unsubscribe());
  }

  public calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number, unit: string): number {
    const radlat1 = Math.PI * lat1 / 180;
    const radlat2 = Math.PI * lat2 / 180;
    const theta = lon1 - lon2;
    const radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * NAUTICAL_IN_MILE;
    if (unit === 'K') { dist = dist * MILE_IN_KILOMETRES; }
    if (unit === 'N') { dist = dist * MILE_IN_NAUTICAL; }
    return dist;
  }
}
