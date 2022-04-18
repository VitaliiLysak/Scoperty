import { SearchAlertsScheme } from '../properties-repository.model';
import { isNullOrUndefined } from '../../../shared/utils/null-or-undefined.util';

import { CreateSearchAlertsSignupInfo } from './signup-info.model';

export class CreateSearchAlertsSignupInfoSerializer {
  static from(cognitoDto: SearchAlertsScheme): CreateSearchAlertsSignupInfo {
    if (isNullOrUndefined(cognitoDto)) {
      return null;
    }

    const {
      name,
      city,
      radius,
      address_line,
      coordinates,
      priceMin,
      priceMax,
      livingAreaMin,
      livingAreaMax,
      propertyTypes,
      sellingStatuses
    } = cognitoDto;
    return new CreateSearchAlertsSignupInfo(
      name,
      coordinates,
      radius,
      address_line,
      city,
      priceMin,
      priceMax,
      livingAreaMin,
      livingAreaMax,
      propertyTypes,
      sellingStatuses
    );
  }
}
