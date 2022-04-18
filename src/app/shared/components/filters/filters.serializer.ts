import { convertStringToInt } from '../../utils/convert-string.util';
import {
  AmountInputMask,
  LivingAreaInputMask,
} from '../../utils/input-masks.util';
import { isNullOrUndefined } from '../../utils/null-or-undefined.util';
import { isZero } from '../../utils/zero.util';
import { SellingStatus } from '../../../app.constants';
import { FilterOptions } from '../../../core/models/filter-options.model';
import { PropertyType } from '../../../core/models/properties-repository.model';

import {
  FiltersForm,
  FiltersFormPropertyType,
  FiltersFormRange,
  FiltersFormSellingStatus,
} from './filters.model';

export class FiltersFormSerializer {
  static createFilterOptions(filtersForm: FiltersForm): FilterOptions {
    const propertyType: PropertyType = FiltersFormSerializer.createPropertyType(filtersForm.propertyType);
    const priceFrom = convertStringToInt(AmountInputMask.unmaskValue(filtersForm.budget.min));
    const priceTo = convertStringToInt(AmountInputMask.unmaskValue(filtersForm.budget.max));
    const areaSize = convertStringToInt(LivingAreaInputMask.unmaskValue(filtersForm.livingArea.min));
    const areaSize2 = convertStringToInt(LivingAreaInputMask.unmaskValue(filtersForm.livingArea.max));
    const sellingStatus: SellingStatus = {
      Idle: false,
      MakeMeMove: filtersForm.sellingStatus.makeMeMove,
      ForSale: filtersForm.sellingStatus.forSale,
      Active: false,
    };

    return {
      PropertyType: propertyType,
      PriceFrom: !isZero(priceFrom) ? priceFrom : null,
      PriceTo: !isZero(priceTo) ? priceTo : null,
      PriceDevelopmentFrom: null,
      PriceDevelopmentTo: null,
      AreaSize: !isZero(areaSize) ? areaSize : null,
      AreaSize2: !isZero(areaSize2) ? areaSize2 : null,
      SellingStatus: sellingStatus,
    };
  }

  static createFilterForm(filters: FilterOptions): FiltersForm {
    const filterSellingStatus = isNullOrUndefined(filters.SellingStatus)
      ? { ForSale: false, MakeMeMove: false } as SellingStatus
      : filters.SellingStatus;
    const sellingStatus: FiltersFormSellingStatus = {
      forSale: filterSellingStatus.ForSale,
      makeMeMove: filterSellingStatus.MakeMeMove,
    };
    const propertyType = FiltersFormSerializer.createFiltersFormPropertyType(filters.PropertyType);
    const budget: FiltersFormRange = {
      min: !isZero(filters.PriceFrom) ? `${ filters.PriceFrom }` : null,
      max: !isZero(filters.PriceTo) ? `${ filters.PriceTo }` : null,
    };
    const livingArea: FiltersFormRange = {
      min: !isZero(filters.AreaSize) ? `${ filters.AreaSize }` : null,
      max: !isZero(filters.AreaSize2) ? `${ filters.AreaSize2 }` : null,
    };

    return {
      sellingStatus,
      propertyType,
      budget,
      livingArea,
    };
  }

  static createPropertyType({ apartment, house }: FiltersFormPropertyType): PropertyType {
    if (apartment && house) {
      return null;
    } else if (apartment) {
      return PropertyType.ETW;
    } else if (house) {
      return PropertyType.EFH;
    }

    return PropertyType.PropertyTypeWhereReturnZeroProperties;
  }

  static createFiltersFormPropertyType(propertyType: PropertyType): FiltersFormPropertyType {
    if (isNullOrUndefined(propertyType)) {
      return {
        apartment: true,
        house: true,
      };
    }

    if (propertyType === PropertyType.ETW) {
      return {
        apartment: true,
        house: false,
      };
    }

    if (propertyType === PropertyType.EFH) {
      return {
        apartment: false,
        house: true,
      };
    }

    return {
      apartment: false,
      house: false,
    };
  }
}
