import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { debounce } from 'lodash';
import { Subscription } from 'rxjs';

import { SHARED_ROUTES_NAMES } from '../../../app.constants';
import { MapObject } from '../../../core/models/location.model';
import { MapSettings } from '../../../core/models/map-settings.model';
import { MapsAutoCompleteService } from '../../../core/services/maps-auto-complete.service';
import { MapManagerService } from '../../../core/services/map-manager.service';
import { PropertiesRepositoryService } from '../../../core/services/properties-repository.service';
import { PlaceDescription, SearchPlaceComponent } from '../../../shared/components/search-place/search-place.component';
import { isEmptyString } from '../../utils/empty-string.util';
import { isNullOrUndefined } from '../../../shared/utils/null-or-undefined.util';
import { isMobileDevice, isMobileDevice$ } from '../../../shared/utils/responsive.util';

@Component({
  selector: 'app-find-property',
  templateUrl: './find-property.component.html',
  styleUrls: [
    './find-property.component.css',
  ],
})
export class FindPropertyComponent implements OnInit, OnDestroy {
  @Input() buttonTitle: string;
  @Input() buttonTitleMobile: string;
  @Input() inputLabel: string;
  @Input() checkUnsupportedCity: boolean = false;

  @Output() unsupportedCity: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('searchPlace') searchPlaceComponent: SearchPlaceComponent;

  public name: string = 'find-property';
  searchControl: FormControl = new FormControl('');
  public isMobileDevice$ = isMobileDevice$;
  public linkToMap: string[] = [ `/${SHARED_ROUTES_NAMES.MAP}` ];
  public isLoading: boolean = false;

  private placeDescription: PlaceDescription;
  private placeSelectedFromList: boolean = false;
  private subscriptions: Subscription = new Subscription();

  get searchButtonLabel(): string {
    if (isEmptyString(this.buttonTitleMobile )) {
      return this.buttonTitle;
    }

    return isMobileDevice() ? this.buttonTitleMobile : this.buttonTitle;
  }

  get nativeElement(): HTMLDivElement {
    return this.elementRef.nativeElement;
  }

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private mapManager: MapManagerService,
    private propertiesRepository: PropertiesRepositoryService,
    private mapsAutocompleteService: MapsAutoCompleteService,
  ) {
    this.initAutocompleteService = debounce(this.initAutocompleteService.bind(this), 1000);
  }

  public ngOnInit(): void {
    this.initAutocompleteService();
    this.getSearch();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public search(): void {
    this.searchPlaceComponent.validatePlace();

    if (this.searchControl.hasError('emptyString')) {
      return;
    }

    if (this.searchControl.hasError('getPlace')) {
      this.searchPlaceComponent.resetValue();
      return;
    }

    if (this.searchControl.hasError('unsupportedCity')) {
      this.unsupportedCity.emit();
      return;
    }

    if (!this.hasValidPlaceData) {
      this.searchPlaceComponent.resetValue();
      return;
    }

    this.searchControl.setErrors(null);
    this.mapManager.searchProperty(null);
    this.searchProperty(this.placeDescription);
  }

  private get hasValidPlaceData(): boolean {
    return !isNullOrUndefined(this.placeDescription) &&
      !isNullOrUndefined(this.placeDescription.address) &&
      !isNullOrUndefined(this.placeDescription.point);
  }

  private searchProperty(placeDescription: PlaceDescription): void {
    if (
      !isNullOrUndefined(placeDescription.address.street) &&
      !isNullOrUndefined(placeDescription.address.streetNumber)
    ) {
      this.propertiesRepository.getPropertyIdFromPlaceDescription(placeDescription).subscribe(
        propertyId => {
          if (!isNullOrUndefined(propertyId)) {
            this.goToPropertyOnMap(propertyId);
          } else {
            this.goToLocationOnMap(placeDescription);
          }
        },
        () => this.goToLocationOnMap(placeDescription),
        () => this.isLoading = true
      );
    } else {
      this.goToLocationOnMap(placeDescription);
    }
  }

  placeSelectedFromListChange(placeSelectedFromList: boolean): void {
    this.placeSelectedFromList = placeSelectedFromList;
  }

  onPlaceChange(placeDescription: PlaceDescription): void {
    this.placeDescription = placeDescription;
  }

  private goToPropertyOnMap(propertyId: string): void {
    this.router.navigate(
      [ ...this.linkToMap, propertyId ],
      { queryParamsHandling: 'merge' }
    );
  }

  private goToLocationOnMap(placeDescription: PlaceDescription): void {
    this.router.navigate([ ...this.linkToMap ], {
      queryParamsHandling: 'merge',
      queryParams: {
        zoom: placeDescription.zoom,
        lng: placeDescription.point.lng,
        lat: placeDescription.point.lat
      }
    });
  }

  private async initAutocompleteService(): Promise<void> {
    await this.mapManager.loadGoogleMapSDK();
    this.mapsAutocompleteService.setInstance(google);
  }

  private getSearch(): void {
    this.getSearchPlace();
    this.getSearchBuilding();
  }

  private getSearchPlace(): void {
    const subscription = this.mapManager.placeChanger$
      .subscribe((mapObject: MapObject) => {
        this.mapManager.placeChangerData = mapObject;
      });
    this.subscriptions.add(subscription);
  }

  private getSearchBuilding(): void {
    const subscription = this.mapManager.settingsUpdate$
      .subscribe((mapSettings: MapSettings) => {
        this.mapManager.mapSettingsData = mapSettings;
      });
    this.subscriptions.add(subscription);
  }
}
