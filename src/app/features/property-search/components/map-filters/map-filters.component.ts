import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';
import { concatMap, distinctUntilChanged, filter, skip } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { QueryParamsFilters, QueryParamsService, } from '../../../../core/services/query-params.service';
import { PropertyStatus, PropertyType, QueryOptions } from '../../../../core/models/properties-repository.model';
import { MapFilterService } from '../../../../core/services/map-filter.service';
import { FilterOptions } from '../../../../core/models/filter-options.model';
import { MapManagerService } from '../../../../core/services/map-manager.service';
import { IHistogram } from '../../../../core/models/marker.model';
import { FILTER_MAX_PRICE, FILTER_MIN_PRICE, SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { templateStatusToFrontend } from '../../../../shared/utils/deserializator.util';
import { isSmallDevice$ } from '../../../../shared/utils/responsive.util';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';
import { MAP_CLUSTERS_CONFIG } from '../../../../main/main.constants';
import { CoordinatesDescription } from '../../../../core/models/coordinates.model';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';

const FILTER_MAX_PRICE_UPDATE = FILTER_MAX_PRICE;
const FILTER_MIN_PRICE_UPDATE = FILTER_MIN_PRICE;
const FILTER_PRICES_INITIAL_VALUES = [FILTER_MIN_PRICE_UPDATE, FILTER_MAX_PRICE_UPDATE];

const PRICE_SELECT_CONFIG = {
  connect: true,
  start: [FILTER_MIN_PRICE, FILTER_MAX_PRICE],
  step: 10000,
  pageSteps: 10,  // number of page steps, defaults to 10
  range: {
    min: FILTER_MIN_PRICE,
    max: FILTER_MAX_PRICE,
  },
};

const SELLING_STATUS_ITEMS: string[] = [
  'ForSale',
  'MakeMeMove',
  'Active',
];

const SELLING_STATUS_HINT_MAP: { [ sellingStatus: string ]: string } = {
  ForSale: 'Von Eigentümern oder Maklern angebotene, zum Verkauf stehende Immobilien.',
  MakeMeMove: 'Eigentümer haben die Immobilie noch nicht zum Verkauf gestellt, '
    + 'sind aber offen für Gebote, die Du ihnen über Scoperty senden kannst.',
  Active: 'Immobilien mit Schätzwerten, deren Eigentümer noch nicht auf Scoperty aktiv sind.',
};

export type MapFiltersMode = 'default' | 'inline';

@Component({
  selector: 'app-map-filters',
  templateUrl: './map-filters.component.html',
  styleUrls: ['./map-filters.component.css'],
})
export class MapFiltersComponent implements OnInit, OnDestroy {
  // If mode is set to "inline" the filters configuration will not be stores in the mapFilterService.
  // Instead the filter values will be propagated via "filtersChange" @Output.
  @Input() mode: MapFiltersMode = 'default';

  @Output() filtersChange: EventEmitter<FilterOptions> = new EventEmitter<FilterOptions>();

  name: string = 'map-filters';

  public averagePrice = null;
  public filterPrices = [...FILTER_PRICES_INITIAL_VALUES];
  public filters: FilterOptions = {PriceFrom: FILTER_MIN_PRICE_UPDATE, PriceTo: FILTER_MAX_PRICE_UPDATE} as FilterOptions;
  public priceSelectConfig: any = PRICE_SELECT_CONFIG;
  public priceSlider: FormGroup;
  public PropertyType: typeof PropertyType = PropertyType;

  public priceFromStr: string;
  public priceToStr: string;
  public areaSize1Str: string;
  public areaSize2Str: string;

  filterUpdateFromSliderEnabled: boolean = false;
  isRangeUpdate: boolean = false;
  isBudgetLoaded: boolean = false;
  isHighZoomLevel: boolean = null;
  isSubscriptionsActive: boolean = false;

  public histogramColumns: Array<any> = [];

  public filterMinPriceUpdateOld = 0;

  public isSmallDevice$ = isSmallDevice$;

  public sellingStatusItems: string[] = SELLING_STATUS_ITEMS;

  private zoomSubscription: Subscription;
  private subscriptions: Subscription = new Subscription();
  private priceStatisticsSubscription: Subscription;

  get isInline(): boolean {
    return this.mode === 'inline';
  }

  get isDefault(): boolean {
    return this.mode === 'default';
  }

  public get isFilterShown(): boolean {
    return this.mapFilterService.filtersShown;
  }

  private initFormGroup(): void {
    this.priceSlider = this.formBuilder.group({'range': [[null, null]]});
    this.priceSlider.controls['range'].statusChanges.pipe(skip(1)).subscribe((() => {
      this.enableFilterUpdateFromSlider();
    }));
  }

  public get isPropertyTypeNotExist(): boolean {
    return this.filters.PropertyType == null;
  }

  public get isPropertyTypeEFH(): boolean {
    return this.filters.PropertyType === 'EFH';
  }

  public get isPropertyTypeETW(): boolean {
    return this.filters.PropertyType === 'ETW';
  }

  public get isEFHChecked(): boolean {
    return this.isPropertyTypeNotExist || this.isPropertyTypeEFH;
  }

  public get isETWChecked(): boolean {
    return this.isPropertyTypeNotExist || this.isPropertyTypeETW;
  }

  private checkFilterQueryParams(): void {
    const filtersSubscription = this.queryParamsService.filters$
      .subscribe((queryParamsFilters: QueryParamsFilters) => {
        if (!(isNullOrUndefined(queryParamsFilters))) {
          this.changeFilter(queryParamsFilters);
        }
      });
    this.subscriptions.add(filtersSubscription);
  }

  private handlePriceStatisticsChanges(): void {
    this.priceStatisticsSubscription = this.mapFilterService.coordinatesDescription$.pipe(
      filter(({ coordinates, zoom }: CoordinatesDescription) => !isNullOrUndefined(coordinates) && !isNullOrUndefined(zoom)),
      concatMap(
        ({ coordinates, zoom }: CoordinatesDescription) => {
          this.isBudgetLoaded = false;
          const options: QueryOptions = {
            filterOptions: this.mapFilterService.filters as FilterOptions,
            coordinates: coordinates,
            zoom: zoom
          };

          return this.propertiesRepository.getPriceHistogram(options);
        }
      )
    ).subscribe(
      (priceStatistics: IHistogram) => {
        if (!isNullOrUndefined(priceStatistics)) {
          if (priceStatistics.average) {
            this.averagePrice = priceStatistics.average.toLocaleString('de-DE');
          } else {
            this.averagePrice = '- ';
          }

          if (priceStatistics.minimum && priceStatistics.maximum) {
            this.updateHistogram(priceStatistics);
          }
          this.isBudgetLoaded = true;
        }
      },
      error => {
        this.updateHistogram([{ count: 0, intervalLowerLimit: 0, intervalUpperLimit: 1 }]);
        this.isBudgetLoaded = true;
      },
      () => this.changeDetectorRef.detectChanges()
    );
  }

  constructor(
    private elementRef: ElementRef,
    private mapManagerService: MapManagerService,
    private propertiesRepository: PropertiesRepositoryService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private mapFilterService: MapFilterService,
    private router: Router,
    private queryParamsService: QueryParamsService,
  ) {
    this.filters = cloneDeep(mapFilterService.temporaryFilters);

    this.initFormGroup();

    this.priceFromStr = '';
    this.priceToStr = '';
    this.areaSize1Str = this.filters.AreaSize ? this.filters.AreaSize.toLocaleString('de-DE') : '';
    this.areaSize2Str = this.filters.AreaSize2 ? this.filters.AreaSize2.toLocaleString('de-DE') : '';
  }

  ngOnInit(): void {
    this.zoomSubscription = this.mapManagerService.mapZoom$
      .pipe(
        distinctUntilChanged(),
        filter(zoom => (zoom <= MAP_CLUSTERS_CONFIG.maxZoom) !== this.isHighZoomLevel)
      )
      .subscribe(zoom => this.onZoomChange(zoom));

    // later add logic to check navigation with non-null params for filters
    if (!this.isInline && !this.mapManagerService.showFilteredMarkers) {
      this.clearFilters();
    }

    this.checkFilterQueryParams();

    this.changeDetectorRef.detach();

    this.initSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.zoomSubscription.unsubscribe();
    this.priceStatisticsSubscription.unsubscribe();
  }

  onZoomChange(zoom: number): void {
    const isHighZoomLevel = zoom <= MAP_CLUSTERS_CONFIG.maxZoom;
    this.isHighZoomLevel = isHighZoomLevel;

    if (isHighZoomLevel) {
      this.subscriptions.unsubscribe();
      if (this.priceStatisticsSubscription) {
        this.priceStatisticsSubscription.unsubscribe();
      }
      this.isSubscriptionsActive = false;
      this.updateHistogram([{ count: 0, intervalLowerLimit: 0, intervalUpperLimit: 1 }]);
      this.isBudgetLoaded = true;
    } else if (!this.isSubscriptionsActive) {
      this.initSubscriptions();
    }
    this.changeDetectorRef.detectChanges();
  }

  private confirmFilters(): void {
    if (this.isInline) {
      this.filtersChange.emit(this.filters);
      return;
    }

    this.mapFilterService.confirmFilters();

    this.changeDetectorRef.detectChanges();
  }

  initSubscriptions(): void {
    this.isSubscriptionsActive = true;
    this.handlePriceStatisticsChanges();
  }

  public changePropertyType(value: PropertyType): void {
    if (this.filters.PropertyType === value) {
      this.filters.PropertyType = PropertyType.PropertyTypeWhereReturnZeroProperties;
    } else if (this.filters.PropertyType === null) {
      if (value === PropertyType.EFH) this.filters.PropertyType = PropertyType.ETW;
      else if (value === PropertyType.ETW) this.filters.PropertyType = PropertyType.EFH;
    } else if (this.filters.PropertyType === PropertyType.EFH || this.filters.PropertyType === PropertyType.ETW) {
      this.filters.PropertyType = null;
    } else if (this.filters.PropertyType === PropertyType.PropertyTypeWhereReturnZeroProperties) {
      this.filters.PropertyType = value;
    }
    this.confirmFilters();
  }

  public _openFilter(): void {
    this.mapFilterService.toggleFiltersShown(true);
    this.changeDetectorRef.detectChanges();
  }

  public _closeFilter(): void {
    this.mapFilterService.toggleFiltersShown(false);
    this.changeDetectorRef.detectChanges();
  }

  public changeSellingStatus(value): void {
    if (value === 'all') {
      const statuses = (<any>Object).keys(this.filters.SellingStatus);
      const values = (<any>Object).values(this.filters.SellingStatus);
      const newValue = !values.every((isChecked) => isChecked);
      statuses.forEach((status) => {
        this.filters.SellingStatus[status] = newValue;
      });
    } else this.filters.SellingStatus[value] = !this.filters.SellingStatus[value];

    this.confirmFilters();
  }

  enableFilterUpdateFromSlider() {
    this.filterUpdateFromSliderEnabled = true;
  }

  public changeFilterPrice(event: FocusEvent): void {
    if (!this.filterUpdateFromSliderEnabled) {
      return;
    }
    this.blurAllInputs();
    // this check is needed to avoid initial log and duplicate with direct input
    this.filters.PriceFrom = event[0];
    this.filters.PriceTo = event[1];
    this.priceFromStr = this.filters.PriceFrom.toLocaleString('de-DE');
    this.priceToStr = this.filters.PriceTo.toLocaleString('de-DE');
    if (this.isRangeUpdate) return;

    this.confirmFilters();
  }

  public changeFilter(queryParamsFilters: QueryParamsFilters): void {
    const sellingStatus: PropertyStatus = queryParamsFilters.sellingStatus;
    const propertyType: PropertyType = queryParamsFilters.propertyType;

    if (isNullOrUndefined(sellingStatus) && isNullOrUndefined(PropertyType)) {
      this.router.navigate([`/${SHARED_ROUTES_NAMES.MAP}`]);
      return null;
    }

    if (!isNullOrUndefined(sellingStatus)) {
      if (sellingStatus === 'All') {
        this.filters.SellingStatus.ForSale = true;
        this.filters.SellingStatus.MakeMeMove = true;
      } else {
        this.filters.SellingStatus[sellingStatus] = true;
      }
    }

    if (!isNullOrUndefined(propertyType)) {
      if (propertyType === 'All') {
        this.filters.PropertyType = null;
      } else {
        this.filters.PropertyType = propertyType;
      }
    }

    this.confirmFilters();
  }

  public blurAllInputs(): void {
    const  inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].blur();
    }
  }

  public changeFilterPriceFrom(event: FocusEvent): void {
    this.filters.PriceFrom = Number(this.priceFromStr.replace(/\.?\,?/ig, ''));
    const newValues = [...this.filterPrices];
    newValues[0] = this.filters.PriceFrom;

    this.priceSlider.controls['range'].setValue(newValues);

    this.confirmFilters();

    this.formatInputNumber(event);
  }

  public changeFilterPriceTo(event: FocusEvent): void {
    this.filters.PriceTo = Number(this.priceToStr.replace(/\.?\,?/ig, ''));
    if (this.filters.PriceTo === 0) {
      this.filters.PriceTo = FILTER_PRICES_INITIAL_VALUES[1];
    }
    const newValues = [...this.filterPrices];
    newValues[1] = this.filters.PriceTo;
    if (this.filters.PriceFrom <= newValues[1]) {
      this.priceSlider.controls['range'].setValue(newValues);
    }

    this.confirmFilters();

    this.formatInputNumber(event);
  }

  public checkInputValues(event: any): void {
    const key = event.key || String.fromCharCode(event.which || event.code || event.keyCode);
    const checkArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '', 'Backspace', 'Delete', 'Control', 'ArrowRight', 'ArrowLeft'];
    if (checkArr.indexOf(key) === -1) event.preventDefault();
  }

  public inputNumberFilter(event: any, variableInput: string): void {
    const regexp = new RegExp('^\\d*$');
    if (regexp.test(event.target.value)) this[variableInput] = event.target.value;
    else event.target.value = this[variableInput];
  }

  public cancelMouseDown(): boolean {
    return false;
  }

  public handleFocusFilterPrice(event: any): void {
    const thisValue: number = Number(event.target.value.replace(/\.?\,?/ig, ''));
    if (thisValue === FILTER_PRICES_INITIAL_VALUES[1] || thisValue === 0) event.target.value = '';
    else event.target.value = thisValue;
  }

  public handleFocusAreaSize(event: any): void {
    if (event.target.value) event.target.value = Number(event.target.value.replace(/\.?\,?/ig, ''));
  }

  public formatInputNumber(event: any): boolean {
    const value = Number(event.target.value.replace(/\.?\,?/ig, ''));
    if (value > 0) event.target.value = value.toLocaleString('de');
    else event.target.value = '';
    return true;
  }

  public changeFilterArea(event: FocusEvent): void {
    this.filters.AreaSize = Number(this.areaSize1Str.replace(/\.?\,?/ig, ''));
    this.filters.AreaSize2 = Number(this.areaSize2Str.replace(/\.?\,?/ig, ''));
    this.confirmFilters();
    this.formatInputNumber(event);
  }

  public updateHistogram({histogram: hist, minimum: priceFrom, maximum: priceTo}: any): void {
    this.histogramColumns = [];
    if (hist == null) return;
    const filteredHist = hist;
    const maxCount = filteredHist.reduce((max, column) => max < column.count ? column.count : max, 0);
    const maxColumnHeight = 34;
    const minColumnHeight = 0;
    const pixelNumberPerProperty = maxColumnHeight / maxCount;

    for (const column of filteredHist) {
      const columnHeight = pixelNumberPerProperty * column.count;
      this.histogramColumns.push({
        style: {
          'position': 'absolute',
          'bottom': '0px',
          'left': `${column.intervalLowerLimit / 20000}%`,
          'width': '1%',
          'height': `${column.count > 0 && columnHeight < minColumnHeight ? minColumnHeight : columnHeight}px`,
          'border': '0px',
          // coefficient is for better accuracy because of 1% width
          'background': `${
            column.intervalLowerLimit * 1.23 > this.filters.PriceFrom &&
            column.intervalUpperLimit * 1.23 < this.filters.PriceTo
              ? 'hsl(0, 0%, 28%)'
              : 'grey'
          }`,
        }
      });
    }
  }

  public isInvalidValues(valFrom: number, valTo: number): boolean {
    return valTo && (valTo !== 0) && (valFrom > valTo);
  }

  public clearFilters(): void {
    this.priceFromStr = '';
    this.priceToStr = '';
    this.mapFilterService.clearFilters();
    this.filters = this.mapFilterService.temporaryFilters;
    this.filterPrices = [...FILTER_PRICES_INITIAL_VALUES];
    this.areaSize1Str = this.filters.AreaSize ? this.filters.AreaSize.toLocaleString('de-DE') : '';
    this.areaSize2Str = this.filters.AreaSize2 ? this.filters.AreaSize2.toLocaleString('de-DE') : '';
  }

  public getSellingStatusName(sellingStatus: string): string {
    return templateStatusToFrontend(sellingStatus);
  }

  public getSellingStatusHint(sellingStatus: string): string {
    return SELLING_STATUS_HINT_MAP[sellingStatus];
  }

  public isStatusActive(status: string): boolean {
    return status === 'Active';
  }

  // added handler for scroll to make search alert popup sticky to the button "Suchauftrag"
  public scrollContent(): void {}
}
