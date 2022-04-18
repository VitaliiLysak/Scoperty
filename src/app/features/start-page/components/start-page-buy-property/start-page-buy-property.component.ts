import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, } from '@angular/forms';

import { StaticDataFeBe, StaticStorageService, } from '../../../../core/services/static-storage.service';
import { FilterOptions } from '../../../../core/models/filter-options.model';
import { MapFilterService } from '../../../../core/services/map-filter.service';
import { MapManagerService } from '../../../../core/services/map-manager.service';
import { InputTextMask } from '../../../../core/models/input-text-mask.model';
import { AREA_INPUT_MASK } from '../../../../shared/utils/area-input-mask.util';
import { AMOUNT_INPUT_MASK } from '../../../../shared/utils/amount-input-mask.util';
import { transformFeBe } from '../../../../shared/utils/transform-fe-be.util';
import { getNumberFromString } from '../../../../shared/utils/number-from-string.util';
import { isEmptyString } from '../../../../shared/utils/empty-string.util';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import { Point } from '../../../../core/models/location.model';
import { CITIES } from '../../../../main/main.constants';

export type FilterOptionsType = 'PropertyType' | 'PriceTo' | 'AreaSize';

interface CitySelectionData {
  id: number;
  text: string;
  cityKey: string;
}

@Component({
  selector: 'app-start-page-buy-property',
  templateUrl: './start-page-buy-property.component.html',
  styleUrls: ['./start-page-buy-property.component.css']
})
export class StartPageBuyPropertyComponent implements OnInit {
  public _name: string = 'start-page-buy-property';

  cities: CitySelectionData[] = [{
    id: 1,
    text: 'Berlin',
    cityKey: 'BERLIN',
  }, {
    id: 2,
    text: 'Hamburg',
    cityKey: 'HAMBURG',
  }, {
    id: 3,
    text: 'München',
    cityKey: 'MUNICH',
  }, {
    id: 4,
    text: 'Köln',
    cityKey: 'KOLN',
  }, {
    id: 5,
    text: 'Frankfurt',
    cityKey: 'FRANKFURT',
  }, {
    id: 6,
    text: 'Nürnberg',
    cityKey: 'NURNBERG',
  }, {
    id: 7,
    text: 'Erlangen',
    cityKey: 'ERLANGEN',
  }, {
    id: 8,
    text: 'Fürth',
    cityKey: 'FURTH',
  }];

  public filters: FilterOptions;
  public descriptionTexts: Array<string> = [
    'Wir helfen dir richtige Entscheidungen zu treffen, durch volle Transparenz über Marktdynamiken und Bewertungen',
    'Die proaktive Suche unter allen Wohnimmobilien macht den Kauf so einfach wie nie zuvor',
    'Kontaktiere Eigentümer von Immobilien bevor sie auf den Markt kommen'
  ];

  public priceMask: InputTextMask = AMOUNT_INPUT_MASK(8);
  public areaMask: InputTextMask = AREA_INPUT_MASK;
  public linkToMap: string = SHARED_ROUTES_NAMES.MAP;

  public filterSettingsForm: FormGroup;

  public get priceMax(): FormControl {
    return this.filterSettingsForm.get('priceMax') as FormControl;
  }

  public get areaMin(): FormControl {
    return this.filterSettingsForm.get('areaMin') as FormControl;
  }

  public get propertyType(): FormControl {
    return this.filterSettingsForm.get('propertyType') as FormControl;
  }

  public get location(): FormControl {
    return this.filterSettingsForm.get('city') as FormControl;
  }

  public get typesOfProperty(): StaticDataFeBe[] {
    return this.staticStorage.typesOfProperty;
  }

  private selectedLocation: CitySelectionData;

  private initFilterSettingsForm(): void {
    this.filterSettingsForm = new FormGroup({
      'areaMin': new FormControl(''),
      'priceMax': new FormControl(''),
      'propertyType': new FormControl(''),
      'city': new FormControl(''),
    });
  }

  private setFilterOption(option: FilterOptionsType, value: string): void {
    if (option === 'PropertyType') {
      this.filters[option] = transformFeBe(this.staticStorage.typesOfProperty, value);
    } else {
      this.filters[option] = getNumberFromString(value);
    }
  }

  constructor(
    private staticStorage: StaticStorageService,
    private mapFilterService: MapFilterService,
    private mapManager: MapManagerService,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.mapFilterService.clearFilters();
    this.filters = this.mapFilterService.temporaryFilters;
    this.initFilterSettingsForm();
  }

  onLocationSelect(location: CitySelectionData): void {
    this.selectedLocation = location;
  }

  public applySearchSettings(): void {
    const { areaMin, priceMax, propertyType } = this.filterSettingsForm.value;

    if (!isEmptyString(areaMin)) this.setFilterOption('AreaSize', areaMin);
    if (!isEmptyString(priceMax)) this.setFilterOption('PriceTo', priceMax);
    if (!isEmptyString(propertyType)) this.setFilterOption('PropertyType', propertyType);

    if (!isEmptyString(areaMin || priceMax || propertyType)) {
      this.mapManager.saveSearchSettingsFromStartPage(this.filters);
    } else {
      this.mapManager.showFilteredMarkers = false;
    }

    const defaultLocation: Point = {lat: null, lng: null};

    const { LATITUDE, LONGITUDE } = isNullOrUndefined(this.selectedLocation) ?
      defaultLocation :
      CITIES[this.cities.find(city => city.id === this.selectedLocation.id).cityKey];
    const hasCoordinates = !isNullOrUndefined(LATITUDE) && !isNullOrUndefined(LONGITUDE);

    this.router.navigate([this.linkToMap], {
      queryParamsHandling: 'merge',
      queryParams: {
        search_alert_popup: 'true',
        lat: hasCoordinates ? LATITUDE : null,
        lng: hasCoordinates ? LONGITUDE : null,
        zoom: hasCoordinates ? 14 : null,
      }
    });
  }
}
