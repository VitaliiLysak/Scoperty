import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControlOptions,
  FormControl,
  FormGroup,
} from '@angular/forms';

import {
  Observable,
  Subscription,
} from 'rxjs';

import { PropertyTypeValidators } from './property-type.validator';
import { templateStatusToFrontend } from '../../utils/deserializator.util';
import {
  AmountInputMask,
  InputMask,
  LivingAreaInputMask,
} from '../../utils/input-masks.util';
import { isNullOrUndefined } from '../../utils/null-or-undefined.util';
import { InputMaskValidators } from '../../validators/input-mask.validator';
import { FilterOptions } from '../../../core/models/filter-options.model';
import { SellingStatus } from '../../../core/models/selling-status.model';
import { QueryOptions } from '../../../core/models/properties-repository.model';
import { IHistogram} from '../../../core/models/marker.model';
import { PropertiesRepositoryService } from '../../../core/services/properties-repository.service';

import {
  FiltersForm,
  FiltersFormPropertyType,
  FiltersPosition,
} from './filters.model';
import { FiltersFormSerializer } from './filters.serializer';

export type FiltersMode = 'default' | 'inline';

const SELLING_STATUS_ITEMS: string[] = [
  SellingStatus.ForSale,
  SellingStatus.MakeMeMove,
];

const SELLING_STATUS_CONTROL_MAP: { [ sellingStatus: string ]: string } = {
  [ SellingStatus.ForSale ]: 'forSale',
  [ SellingStatus.MakeMeMove ]: 'makeMeMove',
};

const SELLING_STATUS_HINT_MAP: { [ sellingStatus: string ]: string } = {
  ForSale: 'Von Eigentümern oder Maklern angebotene, zum Verkauf stehende Immobilien.',
  MakeMeMove: `
    Eigentümer haben die Immobilie noch nicht zum Verkauf gestellt,
    sind aber offen für Gebote, die Du ihnen über Scoperty senden kannst.
  `,
};

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: [
    './filters.component.css',
  ],
})
export class FiltersComponent implements OnInit, OnChanges, OnDestroy {
  @Input() locationPrefix: string = '';
  @Input() mode: FiltersMode = 'default';
  @Input() filters: FilterOptions;
  // "defaultFilters" are used to reset the filters to a default value.
  @Input() defaultFilters: FilterOptions;
  @Input() position: FiltersPosition;

  @Output() filtersChange: EventEmitter<FilterOptions> = new EventEmitter<FilterOptions>();
  @Output() filtersInvalid: EventEmitter<boolean> = new EventEmitter<boolean>();

  filtersForm: FormGroup;

  budgetInputMask: InputMask = AmountInputMask.createMask(9);
  livingAreaInputMask: InputMask = LivingAreaInputMask.createMask(4);
  sellingStatusItems: string[] = SELLING_STATUS_ITEMS;
  averagePropertyPrice: number;
  isAveragePropertyPriceLoading: boolean = false;

  private subscriptions: Subscription = new Subscription();

  get isInlineMode(): boolean {
    return this.mode === 'inline';
  }

  get isDefaultMode(): boolean {
    return this.mode === 'default';
  }

  get containerCssClasses(): { [ cssClass: string ]: boolean } {
    return {
      [ 'app-filters__container' ]: true,
      [ `app-filters__container--mode-${ this.mode }` ]: true,
    };
  }

  get budgetGroup(): FormGroup {
    return this.filtersForm.get('budget') as FormGroup;
  }

  get livingAreaGroup(): FormGroup {
    return this.filtersForm.get('livingArea') as FormGroup;
  }

  get areAllPropertyTypesSelected(): boolean {
    const { house, apartment } = this.propertyTypeGroup.value as FiltersFormPropertyType;

    return house && apartment;
  }

  get propertyTypeGroup(): FormGroup {
    return this.filtersForm.get('propertyType') as FormGroup;
  }

  // FIXME: Find out why "changeDetectorRef" is necessary to keep the model and template state in sync.
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private propertiesRepository: PropertiesRepositoryService,
  ) {
    this.configureFiltersForm();
  }

  ngOnInit(): void {
    this.handleFiltersFormChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.applyFiltersToForm(changes.filters);
    this.updateAveragePropertyPrice(changes.position);
    this.applyPropertyTypeValidator();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleAllPropertyTypesSelection(allSelected: boolean): void {
    const propertyType: FiltersFormPropertyType = {
      house: allSelected,
      apartment: allSelected,
    };
    this.propertyTypeGroup.patchValue(propertyType);
  }

  getSellingStatusName(sellingStatus: string): string {
    return templateStatusToFrontend(sellingStatus);
  }

  getSellingStatusControlName(sellingStatus: string): string {
    return SELLING_STATUS_CONTROL_MAP[sellingStatus];
  }

  getSellingStatusHint(sellingStatus: string): string {
    return SELLING_STATUS_HINT_MAP[sellingStatus];
  }

  resetFilters(): void {
    const hasDefaultFilters = !isNullOrUndefined(this.defaultFilters);
    const filters = hasDefaultFilters ? FiltersFormSerializer.createFilterForm(this.defaultFilters) : {};
    this.filtersForm.reset(filters);
  }

  private configureFiltersForm(): void {
    const updateOnBlur: AbstractControlOptions = { updateOn: 'blur' };
    const form = new FormGroup({
      sellingStatus: new FormGroup({
        forSale: new FormControl(false),
        makeMeMove: new FormControl(false),
      }),
      propertyType: new FormGroup({
        house: new FormControl(false),
        apartment: new FormControl(false),
      }),
      budget: new FormGroup({
        min: new FormControl('', updateOnBlur),
        max: new FormControl('', updateOnBlur),
      }, InputMaskValidators.minLessThanOrEqualMax(AmountInputMask.unmaskValue)),
      livingArea: new FormGroup({
        min: new FormControl('', updateOnBlur),
        max: new FormControl('', updateOnBlur),
      }, InputMaskValidators.minLessThanOrEqualMax(LivingAreaInputMask.unmaskValue)),
    });
    this.filtersForm = form;
  }

  private handleFiltersFormChanges(): void {
    this.filtersForm.valueChanges
      .subscribe((formValue: FiltersForm) => {
        const result = FiltersFormSerializer.createFilterOptions(formValue);
        this.filtersChange.emit(result);
      });

    this.filtersForm.statusChanges
      .subscribe((state: string) => {
        const hasErrors = state === 'INVALID';
        this.filtersInvalid.emit(hasErrors);
      });
  }

  private applyFiltersToForm(filtersChange: SimpleChange): void {
    if (isNullOrUndefined(filtersChange)) {
      return;
    }

    const filtersForm = FiltersFormSerializer.createFilterForm(filtersChange.currentValue);
    this.filtersForm.patchValue(filtersForm, { emitEvent: false });
  }

  private updateAveragePropertyPrice(positionChange: SimpleChange): void {
    if (this.isInlineMode || isNullOrUndefined(positionChange)) {
      return;
    }

    this.isAveragePropertyPriceLoading = true;
    const subscription = this.getPricesStatistics(positionChange.currentValue)
      .subscribe((priceStatistics: IHistogram) => {
        if (isNullOrUndefined(priceStatistics)) {
          return;
        }

        this.averagePropertyPrice = priceStatistics.average;
      }, () => {
        this.averagePropertyPrice = 0;
      }, () => {
        this.isAveragePropertyPriceLoading = false;
        this.changeDetectorRef.detectChanges();
      });
    this.subscriptions.add(subscription);
  }

  private getPricesStatistics(position: FiltersPosition): Observable<IHistogram> {
    const filterOptions = FiltersFormSerializer.createFilterOptions(this.filtersForm.value);
    const { coordinates, zoom } = position;
    const options: QueryOptions = {
      filterOptions,
      coordinates,
      zoom,
    };

    return this.propertiesRepository.getPriceHistogram(options);
  }

  private applyPropertyTypeValidator(): void {
    if (this.isInlineMode) {
      this.propertyTypeGroup.setValidators(PropertyTypeValidators.nonEmpty);
    } else {
      this.propertyTypeGroup.setValidators(null);
    }
  }
}
