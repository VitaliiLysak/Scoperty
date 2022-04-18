import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { FormControl } from '@angular/forms';

import { MapsAPILoader } from '@agm/core';
import { debounce } from 'lodash';
import { Subscription } from 'rxjs';

import { Address, Place, PlaceType, Point } from '../../../core/models/location.model';
import { ZOOM_CONSTANTS } from '../../../main/main.constants';
import { MapManagerService } from '../../../core/services/map-manager.service';
import { MapsAutoCompleteService } from '../../../core/services/maps-auto-complete.service';
import { isSmallMobileDevice$ } from '../../utils/responsive.util';
import { isNullOrUndefined } from '../../utils/null-or-undefined.util';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { LOGGER } from '../../../core/services/logger/logger.provider';
import { isEmptyString } from '../../utils/empty-string.util';
import { GmapsUtils } from '../../utils/gmaps.util';

type TypeOfSearch = 'withoutGoToMap';

const KEY_ENTER_NAME: string = 'Enter';
const KEY_ENTER_NUMBER: number = 13;

const GMAPS_AUTO_COMPLETE_OPTIONS: google.maps.places.AutocompleteOptions = {
  componentRestrictions: {
    country: 'de',
  },
  fields: ['place_id', 'address_components', 'geometry', 'types']
};

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: [
    './search-bar.component.css'
  ],
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() inputId: string = 'searchBarAutocompleteInput';
  @Input() mode: 'default' | 'disagreement' = 'default';
  @Input() focused: boolean;
  @Input() placeholderValue: string = '';
  @Input() searchClicked: string;
  @Input() typeOfSearch: TypeOfSearch;
  @Input() page: string;
  @Input() bigField: boolean = false;
  @Input() address: string = '';
  @Input() label: string = 'Suche nach deiner Adresse';

  @Output() placeChanged: EventEmitter<{}> = new EventEmitter<{}>();
  @Output() bigSearch: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('search') searchElement: ElementRef;

  name: string = 'search-bar';

  searchControl: FormControl;
  autocomplete: google.maps.places.Autocomplete;

  isSmallMobileDevice$ = isSmallMobileDevice$;

  scrollBlock: HTMLElement = null;
  autocompleteInput: HTMLElement = null;

  private subscriptions: Subscription = new Subscription();

  private blurAutocompleteInput(): void {
    if (this.document.activeElement === this.autocompleteInput) this.autocompleteInput.blur();
  }

  private blurSearchWhenScroll(): void {
    if (!isNullOrUndefined(this.scrollBlock)) {
      this.scrollBlock.addEventListener('scroll', () => this.blurAutocompleteInput());
    }
  }

  private initHTMLElements(): void {
    this.scrollBlock = this.document.getElementById('scrollBlock');
    this.autocompleteInput = this.document.getElementById('searchBarAutocompleteInput');
  }

  constructor(
    private apiLoader: MapsAPILoader,
    private ngZone: NgZone,
    private mapManager: MapManagerService,
    private mapsAutoCompleteService: MapsAutoCompleteService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    @Inject(LOGGER) private logger: LoggerService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.initHTMLElements = debounce(this.initHTMLElements.bind(this), 1000);
    this.blurSearchWhenScroll = debounce(this.blurSearchWhenScroll.bind(this), 2000);
  }

  ngOnInit(): void {
    this.searchControl = new FormControl();
    this.loadAutocomplete();

    this.subscriptions.add(
      this.mapManager.getCheckPropertyStream()
        .subscribe(this.checkProperty.bind(this))
    );

    this.initHTMLElements();

    if (!isEmptyString(this.address)) {
      this.textSearch();
    }

    if (this.focused) {
      this.focus();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  focus(): void {
    this.searchElement.nativeElement.focus();
  }

  private get isSearchInputNotEmpty(): boolean {
    return !isEmptyString(this.searchElement.nativeElement.value);
  }

  async checkProperty(validity: boolean): Promise<void> {
   if (!validity) {
     this.searchControl.markAsTouched();
     this.searchControl.setErrors({property: {valid: false}});
   } else {
     this.searchControl.setErrors(null);
   }
  }

  /* add 'filled' or 'empty state to input wrapper */
  onBlurHandler(event: FocusEvent): void {
    if (this.bigField) {
      let parentClass: string = '';
      let toRemoveClass: string = '';
      if (this.isSearchInputNotEmpty) {
        parentClass = 'search-bar__wrapper--state-filled';
        toRemoveClass = 'search-bar__wrapper--state-empty';
      } else {
        parentClass = 'search-bar__wrapper--state-empty';
        toRemoveClass = 'search-bar__wrapper--state-filled';
      }
      this.renderer.removeClass(this.searchElement.nativeElement.parentNode, toRemoveClass);
      this.renderer.addClass(this.searchElement.nativeElement.parentNode, parentClass);
    }

    this.bigSearch.emit(false);
  }

  searchHandler(state: boolean): void {
    if (this.bigField)  {
      this.bigSearch.emit(state);
    }
  }

  async loadAutocomplete(): Promise<void> {
    try {
      await this.apiLoader.load();
      this.mapsAutoCompleteService.setInstance(google);
      this.autocomplete = new google.maps.places.Autocomplete(
        this.searchElement.nativeElement,
        GMAPS_AUTO_COMPLETE_OPTIONS
      );
      this.autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          this.textSearch();
        });
      });
    } catch (error) {
      this.logger.error('SearchBarComponent::_loadAutocomplete:Error', error);
    }
  }

  async textSearch(place?: google.maps.places.PlaceResult): Promise<void> {
    const urlSegment: UrlSegment = this.activatedRoute.snapshot.url[0];

    if (urlSegment && urlSegment.path === 'home') {
      return this.goToMainWithData();
    }

    const placeObject = isNullOrUndefined(place)
      ? this.autocomplete.getPlace()
      : place;

    const newPlace = this.convertGoogleObjectToPlace(placeObject);

    if (isNullOrUndefined(newPlace)) {
      return;
    }

    this.handleAddressData(newPlace, newPlace.point, placeObject);
  }

  async onKeypressInput(event: KeyboardEvent): Promise<void> {
    if (
      event.key === KEY_ENTER_NAME ||
      event.code === KEY_ENTER_NAME ||
      event.keyCode === KEY_ENTER_NUMBER ||
      event.charCode === KEY_ENTER_NUMBER
    ) {
      await this.textSearch();
    }
  }

  // @FIXME: check should there be any data to be passed and processed before navigation to /map ?
  goToMainWithData(): void {
    this.router.navigate(['/map'], { queryParamsHandling: 'merge' });
  }

  convertGeometryToPoint(geometry: google.maps.places.PlaceGeometry): Point {
    return {
      lat: geometry.location.lat(),
      lng: geometry.location.lng(),
    };
  }

  collectAddressData(addressComponents: google.maps.GeocoderAddressComponent[]): Address {
    let street;
    let locality;
    let streetNumber;

    for (const addressComponent of addressComponents) {
      if (addressComponent.types.indexOf('locality') > -1) locality = addressComponent.long_name;
      if (addressComponent.types.indexOf('route') > -1) street = addressComponent.long_name;
      if (addressComponent.types.indexOf('street_number') > -1) streetNumber = addressComponent.long_name;
    }

    const address: Address = {
      street,
      locality,
      streetNumber,
    };

    if (this.isAddressValid(address)) {
      return address;
    }
    return null;
  }

  convertGoogleObjectToPlace(googleObject: google.maps.places.PlaceResult): Place {
    if (!googleObject || !googleObject.geometry || !googleObject.types.length) return null;
    const placePoint = this.convertGeometryToPoint(googleObject.geometry);
    const placeObject: Place = {
      placeType: googleObject.types[0] as PlaceType,
      point: placePoint,
    };
    return placeObject;
  }

  isAddressValid(address: Address): boolean {
    return address != null && address.street != null && address.locality != null && address.streetNumber != null;
  }

  emitNewPlace(place: Place, locality: google.maps.GeocoderAddressComponent): void {
    const zoom = GmapsUtils.getZoomLevelForPlace(place);

    this.placeChanged.emit({place, zoom});

    if (this.typeOfSearch == null || this.typeOfSearch !== 'withoutGoToMap') {
      this.mapManager.changePlace({place, zoom, name: locality.long_name});
    }
  }

  handleAddressData(placeObject: Place, placePoint: Point, place: google.maps.places.PlaceResult): void {
    this.searchHandler(false);
    const address: Address = this.collectAddressData(place.address_components);

    if (this.activatedRoute.snapshot.url[0] && this.activatedRoute.snapshot.url[0].path === 'home') {
      this.goToMainWithData();
    } else {
      if (address == null) {
        this.emitNewPlace(placeObject, place.address_components[0]);
      } else {
        this.askServerAboutAddressPoint(placePoint, address, placeObject);
      }
    }
  }

  askServerAboutAddressPoint(placePoint: Point, address: Address, placeObject: Place): void {
    const property = {
      mapTypeId: 'hybrid',
      latitude: placePoint.lat,
      longitude: placePoint.lng,
      activatedMarkerId: '',
      PropertyType: null,
      zoom: ZOOM_CONSTANTS.LEVELS.HIGH.UP_EDGE,
    };
    // @FIXME: temp solution until we dont have API for search items
    this.mapManager.setMapSettings(property);

    this.mapManager.searchProperty({placePoint, address, placeObject});
  }
}
