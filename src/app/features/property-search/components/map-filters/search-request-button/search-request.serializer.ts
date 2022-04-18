import { SellingStatus } from '../../../../../app.constants';
import { FilterOptions } from '../../../../../core/models/filter-options.model';
import {
  PropertyStatus,
  PropertyStatusDto,
  PropertyType,
  PropertyTypeDto,
  SearchAlertsScheme,
} from '../../../../../core/models/properties-repository.model';
import {
  propTypeToBackEnd,
  statusToBackEnd,
} from '../../../../../shared/utils/deserializator.util';
import { isEmptyString } from '../../../../../shared/utils/empty-string.util';
import { isNullOrUndefined } from '../../../../../shared/utils/null-or-undefined.util';

export class SearchRequestSerializer {
  static createSearchAlertsScheme(filters: FilterOptions, base?: SearchAlertsScheme): SearchAlertsScheme {
    let sellingStatuses: Array<PropertyStatusDto> = SearchRequestSerializer.sellingStatusToParams(filters.SellingStatus);
    if (SearchRequestSerializer.propertyTypesToParams(filters.PropertyType).length === 0) {
      return;
    }

    if (sellingStatuses.length === 0) {
      sellingStatuses = [
        PropertyStatusDto.MakeMeMove,
        PropertyStatusDto.ForSale,
      ];
    }

    return {
      name: base.name,
      coordinates: base.coordinates,
      radius: base.radius,
      address_line: base.address_line,
      city: base.city,
      priceMin: filters.PriceFrom,
      priceMax: filters.PriceTo,
      livingAreaMin: filters.AreaSize,
      livingAreaMax: filters.AreaSize2,
      propertyTypes: SearchRequestSerializer.propertyTypesToParams(filters.PropertyType),
      sellingStatuses,
    };
  }

  private static propertyTypesToParams(propertyType: PropertyType): Array<PropertyTypeDto> {
    if (propertyType === PropertyType.PropertyTypeWhereReturnZeroProperties) {
      return [];
    }

    if (isEmptyString(propertyType)) {
      return [
        PropertyTypeDto.Apartment,
        PropertyTypeDto.SingleFamilyHouse,
      ];
    }

    return [ propTypeToBackEnd(propertyType) ];
  }

  private static sellingStatusToParams(sellingStatus: SellingStatus): Array<PropertyStatusDto> {
    if (isNullOrUndefined(sellingStatus) || !Object.keys(sellingStatus).length) {
      return [];
    }

    const statuses = Object.keys(sellingStatus);
    const options: Array<PropertyStatusDto> = statuses
      .filter(option => sellingStatus[option] && option !== 'Idle')
      .map(status => statusToBackEnd(status as PropertyStatus));

    return options;
  }
}
