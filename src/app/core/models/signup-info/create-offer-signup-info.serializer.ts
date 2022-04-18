import { OfferPrice } from '../properties-repository.model';
import { isNullOrUndefined } from '../../../shared/utils/null-or-undefined.util';

import { CreateOfferSignupInfo } from './signup-info.model';

export class CreateOfferSignupInfoSerializer {
  static from(cognitoDto: OfferPrice): CreateOfferSignupInfo {
    if (isNullOrUndefined(cognitoDto)) {
      return null;
    }

    const {
      property,
      price,
      preferredTotalArea,
    } = cognitoDto;
    return new CreateOfferSignupInfo(
      property,
      price,
      preferredTotalArea,
    );
  }
}
