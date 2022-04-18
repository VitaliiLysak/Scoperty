import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { cloneDeep } from 'lodash';
import { NgxActiveModal } from 'ngx-multi-modal';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SearchRequestSerializer } from '../map-filters/search-request-button/search-request.serializer';
import { markFormGroupControlsAsDirty } from '../../../../shared/utils/form-group.util';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { Point } from '../../../../core/models/location.model';
import { FilterOptions } from '../../../../core/models/filter-options.model';
import { SearchAlertsScheme } from '../../../../core/models/properties-repository.model';
import { MapFilterService } from '../../../../core/services/map-filter.service';
import { MapManagerService } from '../../../../core/services/map-manager.service';
import { QueryParamsService } from '../../../../core/services/query-params.service';
import { ScreenSize, ScreenSizeService, } from '../../../../core/services/screen-size.service';
import {
  PlaceDescription,
  SavedLocation,
  SearchPlaceComponent
} from '../../../../shared/components/search-place/search-place.component';
import { isMobileDevice$ } from '../../../../shared/utils/responsive.util';

const DIALOG_WIDTH_WITH_TWO_COLUMNS = 1180;

@Component({
  selector: 'app-save-search-alert-name',
  templateUrl: './save-search-alert-name.component.html',
  styleUrls: ['./save-search-alert-name.component.css'],
})
export class SaveSearchAlertNameComponent implements AfterViewInit, OnInit {
  @ViewChild('nameInput') nameInput: InputComponent;
  @ViewChild(SearchPlaceComponent) searchPlaceComponent: SearchPlaceComponent;

  name: string = 'search-alert';
  locationPrefix = 'map-search-alert';

  public alertDataForm: FormGroup;

  public location: Point;
  public radius = 500;
  public zoom = 14;
  savedLocation: SavedLocation;
  filters: FilterOptions;
  hasEnoughSpaceToDisplayTwoColumns$: Observable<boolean>;
  hasFilterErrors = false;
  isMobileDevice$ = isMobileDevice$;

  public get searchAlertName(): FormControl {
    return this.alertDataForm.get('name') as FormControl;
  }

  public get placeControl(): FormControl {
    return this.alertDataForm.get('place') as FormControl;
  }

  constructor(
    private activeModal: NgxActiveModal,
    private mapFilterService: MapFilterService,
    private mapManager: MapManagerService,
    private queryParamsService: QueryParamsService,
    private screenSizeService: ScreenSizeService,
  ) {
    this.filters = cloneDeep(this.mapFilterService.temporaryFilters);
    this.filters.PriceTo = null;
    this.filters.PriceFrom = null;
    this.hasEnoughSpaceToDisplayTwoColumns$ = this.screenSizeService.screenSize$
      .pipe(
        map(({ width }: ScreenSize) => {
          return width >= DIALOG_WIDTH_WITH_TWO_COLUMNS;
        }),
      );

    this.initForm();
  }

  public ngAfterViewInit(): void {
    this.nameInput.focus();
  }

  ngOnInit(): void {
    const queryParamsLocation = this.queryParamsService.getLocation();

    const mapCenter = queryParamsLocation || this.mapManager.getMapCenter() || {
      lat: this.mapManager.mapInitSettings.latitude,
      lng: this.mapManager.mapInitSettings.longitude,
    };

    this.location = {
      lat: mapCenter.lat,
      lng: mapCenter.lng,
    };

    this.zoom = (queryParamsLocation ? queryParamsLocation.zoom : this.mapManager.getMapZoom() || this.mapManager.mapInitSettings.zoom) - 2;
  }

  private initForm(): void {
    this.alertDataForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
      place: new FormControl(''),
    });
  }

  onLocationChange(newLocation: Point) {
    this.location = newLocation;
    this.searchPlaceComponent.getAddressFromLatLng(newLocation.lat, newLocation.lng, this.zoom);
  }

  onPlaceChange(placeDescription: PlaceDescription): void {
    this.location = (placeDescription && placeDescription.place.point) || this.location;
  }

  getFullSavedAddress(savedLocation: SavedLocation): void {
    this.savedLocation = savedLocation;
  }

  onFilterChange(filters: FilterOptions): void {
    this.filters = filters;
  }

  onFilterInvalid(isInvalid: boolean): void {
    this.hasFilterErrors = isInvalid;
  }

  public onDismiss(): void {
    this.activeModal.dismiss();
  }

  public saveAlert(): void {
    if (this.alertDataForm.invalid || this.hasFilterErrors) {
      markFormGroupControlsAsDirty(this.alertDataForm);
      return;
    }

    const resultBase: SearchAlertsScheme = {
      name: this.alertDataForm.value.name,
      coordinates: [this.location.lng, this.location.lat],
      radius: this.radius,
      address_line: this.searchPlaceComponent.searchString,
      city: this.savedLocation.city,
    };
    const result = SearchRequestSerializer.createSearchAlertsScheme(this.filters, resultBase);
    this.activeModal.close(result);
  }
}
