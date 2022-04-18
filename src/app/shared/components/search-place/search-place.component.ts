import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  NgZone,
  ViewChild,
  ContentChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  FormControl,
  FormControlDirective,
} from '@angular/forms';

import { MapsAPILoader } from '@agm/core';
import { Subscription } from 'rxjs';

import { FormFieldInput } from '../form-field/form-field-input.model';
import { createFormFieldInputProvider } from '../form-field/form-field-input.provider';
import {
  InputComponent,
  InputSize,
} from '../input/input.component';
import { isEmptyArray } from '../../utils/empty-array.util';
import { GmapsUtils } from '../../utils/gmaps.util';
import { isNullOrUndefined } from '../../utils/null-or-undefined.util';
import { isCitySupported } from '../../../app.constants';
import { Point, Place, Address, PlaceType } from '../../../core/models/location.model';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { LOGGER } from '../../../core/services/logger/logger.provider';
import { isEmptyString } from '../../../shared/utils/empty-string.util';

export interface PlaceDescription {
  place: Place;
  zoom: number;
  locality?: google.maps.GeocoderAddressComponent;
  point?: Point;
  address?: Address;
}

export interface SavedLocation {
  fullAddress: string;
  city: string;
}

// ".pac-container" Element used by GMaps to host the autocomplete items
const GMAPS_AUTOCOMPLETE_CONTAINER = '.pac-container';
const GMAPS_EVENT_PLACE_CHANGED = 'place_changed';
const GMAPS_AUTO_COMPLETE_OPTIONS: google.maps.places.AutocompleteOptions = {
  componentRestrictions: {
    country: 'de',
  },
  fields: ['place_id', 'address_components', 'geometry', 'types']
};

type SearchPlaceMode = 'default' | 'search-alert';

@Component({
  selector: 'app-search-place',
  templateUrl: './search-place.component.html',
  styleUrls: [
    './search-place.component.css'
  ],
  providers: [
    createFormFieldInputProvider(SearchPlaceComponent),
  ],

})
export class SearchPlaceComponent implements OnInit, OnDestroy, FormFieldInput {
  @Input() locationPrefix: string = '';
  @Input() placeholder: string = '';
  @Input() size: InputSize = 'medium';
  @Input() mode: SearchPlaceMode = 'default';
  @Input() checkUnsupportedCity: boolean = false;
  @Input() placeTypes: PlaceType[] = null;
  @Input() fullWidthInput: boolean = false;

  @Output() placeChange: EventEmitter<PlaceDescription> = new EventEmitter<PlaceDescription>();
  @Output() placeSelect: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() setFullAddress: EventEmitter<SavedLocation> = new EventEmitter<SavedLocation>();

  @ContentChild(FormControlDirective) controlElement: FormControlDirective;

  @ViewChild('searchInput') searchInputComponent: InputComponent;

  name: string = 'search-place';

  autocomplete: google.maps.places.Autocomplete;
  geocoder: google.maps.Geocoder;
  place: PlaceDescription;
  placeSelectedFromList: boolean = false;
  ignoreNextGetAddressFromLatLng = false;

  private subscriptions: Subscription = new Subscription();
  private scrollBlock: HTMLElement;

  get searchString() {
    return this.searchInputComponent.nativeElement.value.replace('Deutschland', '');
  }

  constructor(
    private apiLoader: MapsAPILoader,
    private ngZone: NgZone,
    @Inject(LOGGER) private logger: LoggerService,
    @Inject(DOCUMENT) private document: Document,
  ) {
  }

  ngOnInit(): void {
    this.updateAutocompletePositionOnScroll();
    this.initializeAutocomplete();
    this.handleSearchControlValueChanges();
  }

  ngOnDestroy(): void {
    this.destroyAutocomplete();
    this.destroyScrollListener();
    this.subscriptions.unsubscribe();
  }

  resetValue(): void {
    google.maps.event.trigger(this.autocomplete, 'blur', {});
    const storedErrors = this.control.errors;
    this.control.patchValue('', { emitEvent: false });
    this.control.setErrors(storedErrors);
    this.searchInputComponent.focus();
  }

  validatePlace(): void {
    if (isEmptyString(this.control.value)) {
      this.setEmptyStringError();
      return;
    }

    if (!this.placeSelectedFromList && isNullOrUndefined(this.place)) {
      this.setPlaceError();
      return;
    }

    const controlErrors = this.control.errors;
    const searchControlErrors = !isNullOrUndefined(controlErrors) ? controlErrors : {};
    if (!isEmptyArray(Object.keys(searchControlErrors))) {
      return;
    }

    this.resetErrors();
  }

  get identifier(): string {
    return this.locationPrefix + '-search-place-input';
  }

  setInvalid(invalid: boolean, showValidation: boolean): void {
    this.searchInputComponent.setInvalid(invalid, showValidation);
  }

  setFilled(filled: boolean): void {
    this.searchInputComponent.setFilled(filled);
  }

  setPaddingRight(padding: number): void {
    this.searchInputComponent.setPaddingRight(padding);
  }

  get control(): FormControl {
    if (!isNullOrUndefined(this.controlElement)) {
      return this.controlElement.control;
    }

    return null;
  }

  private async initializeAutocomplete(): Promise<void> {
    // FIXME: Find a way to implement GMaps autocomplete in a reusable and better way, maybe by using a custom component.
    try {
      await this.apiLoader.load();
      this.autocomplete = new google.maps.places.Autocomplete(
        this.searchInputComponent.nativeElement as HTMLInputElement,
        this.placeTypes ? {...GMAPS_AUTO_COMPLETE_OPTIONS, types: this.placeTypes} : GMAPS_AUTO_COMPLETE_OPTIONS
      );
      this.geocoder = new google.maps.Geocoder();
      this.autocomplete.addListener(GMAPS_EVENT_PLACE_CHANGED, () => {
        this.ngZone.run(() => {
          this.addressSearch();
        });
      });
    } catch (error) {
      this.logger.error('SearchPlaceComponent::loadAutocomplete:Error', error);
    }
  }

  private destroyAutocomplete(): void {
    google.maps.event.clearListeners(this.autocomplete, GMAPS_EVENT_PLACE_CHANGED);
    google.maps.event.clearInstanceListeners(this.autocomplete);
  }

  private addressSearch(): void {
    this.ignoreNextGetAddressFromLatLng = true;
    const placeResult: google.maps.places.PlaceResult = this.autocomplete.getPlace();

    if (isNullOrUndefined(placeResult) || isNullOrUndefined(placeResult.address_components)) {
      this.setPlaceError();
      return;
    }

    this.setPlaceSelectedFromList();

    if (this.checkUnsupportedCity) {
      const cityName = GmapsUtils.findCityName(placeResult.address_components);
      if (!isCitySupported(cityName)) {
        this.resetErrors();
        this.setUnsupportedCityError();
        return;
      }
    }

    this.resetErrors();
    this.handleAddressData(placeResult);
  }

  setPlaceError(): void {
    this.control.markAsTouched();
    this.control.markAsDirty();
    this.control.setErrors({ place: true });
  }

  private setEmptyStringError(): void {
    this.control.markAsTouched();
    this.control.markAsDirty();
    this.control.setErrors({ emptyString: true });
  }

  private resetErrors(): void {
    this.control.setErrors(null);
  }

  private setGetPlaceError(): void {
    this.control.markAsTouched();
    this.control.markAsDirty();
    this.control.setErrors({ getPlace: true });
  }

  private setUnsupportedCityError(): void {
    this.control.markAsTouched();
    this.control.markAsDirty();
    this.control.setErrors({ unsupportedCity: true });
  }

  private handleSearchControlValueChanges() {
    const valueChangesSubscription = this.control.valueChanges.subscribe(() => {
      this.resetPlaceSelectedFromList();
      this.resetPlaceData();
      this.resetErrors();
    });
    this.subscriptions.add(valueChangesSubscription);
  }

  private setPlaceSelectedFromList(): void {
    this.placeSelectedFromList = true;
    this.placeSelect.emit(this.placeSelectedFromList);
  }

  private resetPlaceSelectedFromList(): void {
    this.placeSelectedFromList = false;
    this.placeSelect.emit(this.placeSelectedFromList);
  }

  private setPlaceData(place: PlaceDescription): void {
    this.place = place;
    this.placeChange.emit(this.place);
  }

  private resetPlaceData(): void {
    this.place = null;
    this.placeChange.emit(this.place);
  }

  private isValidAddress(address: Address): boolean {
    return isNullOrUndefined(address) &&
      isNullOrUndefined(address.street) &&
      isNullOrUndefined(address.locality) &&
      isNullOrUndefined(address.streetNumber);
  }

  private handleAddressData(placeResult: google.maps.places.PlaceResult): void {
    const place: Place = GmapsUtils.convertPlaceResultToPlace(placeResult);
    if (isNullOrUndefined(place)) {
      this.setGetPlaceError();
      return;
    }

    const zoom: number = GmapsUtils.getZoomLevelForPlace(place);
    const locality: google.maps.GeocoderAddressComponent = placeResult.address_components[0];
    const address: Address = GmapsUtils.getAddressFromComponents(placeResult.address_components);
    if (isNullOrUndefined(address)) {
      const placeDescription: PlaceDescription = {
        place,
        zoom,
        locality,
      };
      this.setPlaceData(placeDescription);
    } else {
      const placeDescription: PlaceDescription = {
        place,
        zoom,
        locality,
        point: place.point,
        address,
      };
      this.setPlaceData(placeDescription);
    }
  }

  private updateAutocompletePositionOnScroll(): void {
    this.scrollBlock = this.document.getElementById('scrollBlock');
    if (!isNullOrUndefined(this.scrollBlock)) {
      this.scrollBlock.addEventListener('scroll', () => this.updateAutocompletePosition());
    }
  }

  private updateAutocompletePosition(): void {
    const autocompleteInput = this.searchInputComponent.nativeElement;
    if (this.document.activeElement === autocompleteInput) {
      const gmapsAutocompleteContainer: HTMLDivElement = this.document.querySelector(GMAPS_AUTOCOMPLETE_CONTAINER);
      if (!isNullOrUndefined(gmapsAutocompleteContainer)) {
        const { top, height } = autocompleteInput.getBoundingClientRect();
        const autocompleteTop = top + height;
        gmapsAutocompleteContainer.style.top = `${ autocompleteTop }px`;
      }
    }
  }

  private destroyScrollListener(): void {
    if (!isNullOrUndefined(this.scrollBlock)) {
      this.scrollBlock.removeEventListener('scroll', () => this.updateAutocompletePosition());
    }
  }

  getAddressFromLatLng(lat: number, lng: number, currentZoomLevel: number): void {
    if (this.ignoreNextGetAddressFromLatLng) {
      return;
    }

    let shownAddress: string = '';
    const latlng: google.maps.GeocoderRequest = {'location' : {
      lat: lat,
      lng: lng
    }};

    this.geocoder.geocode(latlng, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus): void => {
      const savedLocation: SavedLocation = {
        fullAddress: '',
        city: ''
      };

      if (status === google.maps.GeocoderStatus.OK) {
        if (!isNullOrUndefined(results[0])) {
          if (results[0].formatted_address.includes('Unnamed')) {
            savedLocation.fullAddress = (results[1].formatted_address).replace('Deutschland', '');
          } else {
            savedLocation.fullAddress = (results[0].formatted_address).replace('Deutschland', '');
          }

          for (const element of results[0].address_components) {
            if (element.types.includes('route') && currentZoomLevel >= 12) {
              shownAddress += `${element.long_name}, `;
            }

            if (element.types.includes('locality')) {
              savedLocation.city = `${element.long_name}`;
              shownAddress += `${element.long_name}`;
            }

            if (element.types.includes('postal_code')) {
              shownAddress +=  ` ${element.long_name}`;
            }
          }
          this.setFullAddress.emit(savedLocation);
        }
      } else {
        this.logger.error('Geocoder failed due to:', status);
      }

      this.control.setValue(shownAddress);
    });
  }
}
