import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { STEP_ITEMS } from '../../../../core/models/scoperty-plus-onboard.model';
import { FormControl, FormGroup } from '@angular/forms';
import {
  PlaceDescription,
  SavedLocation,
  SearchPlaceComponent
} from '../../../../shared/components/search-place/search-place.component';
import { Point } from '../../../../core/models/location.model';
import { InputTextMask } from '../../../../core/models/input-text-mask.model';
import { SQUARE_INPUT_MASK_WITHOUT_PREFIX } from '../../../../shared/utils/square-input-mask.util';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import {
  FilterOptions,
  PropertiesListCounts,
  PropertyType,
  QueryOptions
} from '../../../../core/models/properties-repository.model';
import { QueryParamsService } from '../../../../core/services/query-params.service';
import { CITIES } from '../../../../main/main.constants';
import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { requestUserLocation } from '../../../../shared/utils/user-location.util';
import { SearchAlertMapComponent } from '../../../../shared/components/search-alert-map/search-alert-map.component';
import { isMobileDevice$ } from '../../../../shared/utils/responsive.util';
import { NoUISliderLivingAreaFormatter } from '../../../../shared/utils/no-u-i-slider-living-area-formatter';

@Component({
  selector: 'app-scoperty-plus-onboard-first-step',
  templateUrl: './scoperty-plus-onboard-first-step.component.html',
  styleUrls: ['./scoperty-plus-onboard-first-step.component.css']
})
export class ScopertyPlusOnboardFirstStepComponent implements OnInit {
  @ViewChild(SearchPlaceComponent) searchPlaceComponent: SearchPlaceComponent;
  @ViewChild(SearchAlertMapComponent) searchAlertMapComponent: SearchAlertMapComponent;

  @Input() parentForm: FormGroup;
  @Input() currentFormContent: any;
  @Input() countPropertyLoad = false;
  @Input() masterForm;

  private actStepIndx: number;
  @Input()
  set activeStepIndex(newStepIndex: number) {
    this.actStepIndx = newStepIndex;
    if (newStepIndex === 4) {
      this.retreiveMapLocation();
    }
    if (newStepIndex === 5) {
      this.timingDestroyCountingStep();
    }
  }

  get activeStepIndex() {
    return this.actStepIndx;
  }

  @Output() goToNextStep: EventEmitter<void> = new EventEmitter<void>();
  @Output() setCountProperties: EventEmitter<number> = new EventEmitter<number>();

  savedLocation: SavedLocation;
  searchPlaceControl: FormControl = new FormControl('');
  radius = 500;
  location: Point = {
    lat: CITIES.BERLIN.LATITUDE,
    lng: CITIES.BERLIN.LONGITUDE,
  };
  zoom = 14;
  sliderLivingArea: number = 100;
  inputLivingArea: number = 100;
  stepItems: any = STEP_ITEMS;
  sliderOverflow = false;
  squareInputMask: InputTextMask = SQUARE_INPUT_MASK_WITHOUT_PREFIX;
  isMobileDevice$ = isMobileDevice$;

  sliderFormatter = new NoUISliderLivingAreaFormatter();

  get currentFormGroup(): FormGroup {
    return this.parentForm[this.activeStepIndex];
  }

  get curentLivingArea() {
    if (this.inputLivingArea > 10000) {
      return 10000;
    } else {
      return this.inputLivingArea;
    }
  }

  constructor(
    private propertiesRepository: PropertiesRepositoryService,
    private queryParamsService: QueryParamsService,
    @Inject(LOGGER) private logger,
  ) {}

  ngOnInit() {
  }

  goToNewStep(): void {
    this.goToNextStep.emit();
  }

  changeSliderValue(value) {
    this.sliderLivingArea = value;
    if (!this.sliderOverflow) {
      this.inputLivingArea = value;
    }
    this.sliderOverflow = false;
  }

  changeInputSliderValue(value) {
    const inputValue = parseFloat(value.split(' ')[0]) || 0;
    this.inputLivingArea = inputValue;
    if (inputValue < 50) {
      this.sliderOverflow = true;
      this.sliderLivingArea = 50;
    } else if (inputValue > 500) {
      this.sliderOverflow = true;
      this.sliderLivingArea = 500;
    } else {
      this.sliderLivingArea = inputValue;
    }
  }

  setFormControl(controlFormName: string) {
    return this.currentFormGroup.controls[controlFormName];
  }

  getFormControl(controlFormName: string) {
    return this.currentFormGroup.get(controlFormName);
  }

  onPlaceChange(placeDescription: PlaceDescription): void {
    this.location = (placeDescription && placeDescription.place.point) || this.location;
  }

  getFullSavedAddress(savedLocation: SavedLocation): void {
    this.savedLocation = savedLocation;
  }

  onLocationChange(newLocation: Point) {
    this.location = newLocation;
    this.searchPlaceComponent.getAddressFromLatLng(newLocation.lat, newLocation.lng, this.zoom);
  }

  setFormValueByClick(controlName: string, valueControl: string): void {
    this.parentForm.controls[controlName].setValue(valueControl);
    this.goToNewStep();
  }

  countListingProperty(): void {
    const livingArea = this.masterForm[1].get('living_area').value;
    const propertyType = this.masterForm[0].get('property_type').value  === 'apartment' ? PropertyType.ETW : PropertyType.EFH;

    const lat = this.masterForm[4].controls['coordinates_lat'].value;
    const lng = this.masterForm[4].controls['coordinates_lng'].value;
    const zoom = this.masterForm[4].controls['zoom'].value;

    const coordinates = {
      nwLatitude: lat,
      nwLongitude: lng,
      seLatitude: lat + 0.007,
      seLongitude: lng + 0.03,
    };

    const filterOptions: FilterOptions = {
      AreaSize: livingArea,
      AreaSize2: 0,
      PriceDevelopmentFrom: null,
      PriceDevelopmentTo: null,
      PriceFrom: null,
      PriceTo: null,
      PropertyType: propertyType,
      SellingStatus: {
        Active: false,
        ForSale: false,
        Idle: false,
        MakeMeMove: false
      }
    };

    const options: QueryOptions = {
      filterOptions,
      coordinates,
      zoom
    };

    this.propertiesRepository.getListingsCount(options).subscribe((count: PropertiesListCounts) => {
      let findProperties;
      let allProperties = count.all;
      const actualRadius = this.masterForm[4].get('radius').value;
      switch (true) {
        case actualRadius < 4000:
          allProperties = allProperties / 2;
          findProperties = allProperties <= 3 ? 3 : Math.round(allProperties);
          break;
        case actualRadius >= 4000 && actualRadius < 20000:
          allProperties = allProperties / 3;
          findProperties = allProperties <= 8 ? 8 : Math.round(allProperties);
          break;
        case actualRadius >= 20000:
          allProperties = allProperties / 5;
          findProperties = allProperties <= 20 ? 20 : Math.round(allProperties);
          break;
      }
      this.setCountProperties.emit(findProperties);
    });
  }

  retreiveMapLocation() {
    const mapLocation = this.queryParamsService.getLocation();

    if (
      this.masterForm[4]
      && this.masterForm[4].controls
      && this.masterForm[4].controls['coordinates_lng']
      && this.masterForm[4].controls['coordinates_lng'].value
    ) {
      this.location.lat = this.masterForm[4].controls['coordinates_lat'].value;
      this.location.lng = this.masterForm[4].controls['coordinates_lng'].value;
      this.radius = this.masterForm[4].controls['radius'].value;
      this.zoom = this.masterForm[4].controls['zoom'].value;

      return;
    }

    if (mapLocation) {
      this.location.lat = mapLocation.lat;
      this.location.lng = mapLocation.lng;
      this.zoom = mapLocation.zoom;
    } else {
      requestUserLocation()
        .subscribe(location => {
          if (location) {
            this.location.lat = location.latitude;
            this.location.lng = location.longitude;
            this.searchAlertMapComponent.location = this.location;
          }
        }, (error) => {
          this.logger.error(error);
        });
    }
  }

  timingDestroyCountingStep(): void {
    this.countListingProperty();
    setTimeout(() => {
      this.goToNewStep();
    }, 3000);
  }

  setSearchMapFormValue(): void {
    this.parentForm.controls['address_city'].setValue(this.savedLocation.city);
    this.parentForm.controls['address_line'].setValue(this.savedLocation.fullAddress);
    this.parentForm.controls['coordinates_lat'].setValue(this.location.lat);
    this.parentForm.controls['coordinates_lng'].setValue(this.location.lng);
    this.parentForm.controls['radius'].setValue(this.radius);
    this.parentForm.controls['zoom'].setValue(this.searchAlertMapComponent.zoom);

    this.searchPlaceComponent.validatePlace();
    if (this.searchPlaceControl.hasError('emptyString')) {
      return;
    } else {
      this.goToNewStep();
    }
  }
}
