import { GROUND_FLOOR, CognitoUserFields } from '../../../../app.constants';
import { ApartmentData } from '../../../../core/models/properties-repository.model';
import { UserObjectAttributes } from '../../../../core/models/user.model';
import { getNumberFromString } from '../../../../shared/utils/number-from-string.util';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';

import {
  AuthenticationFormValue,
  AuthenticationUserInfoModel,
} from './authentication.model';

function fromCognitoStringBoolToBool(value: string): boolean {
  return !isNullOrUndefined(value) && value === 'true';
}

export class ApartmentDataSerializer {
  static from(formValue: AuthenticationFormValue): ApartmentData {
    const { floor, livingArea, role } = formValue;
    return {
      floor: floor === GROUND_FLOOR ? 0 : Number(floor),
      livingArea: getNumberFromString(livingArea),
      userRole: role,
    };
  }
}

export class AuthenticationUserInfoModelSerializer {
  static from(userAttributes: UserObjectAttributes): AuthenticationUserInfoModel {
    return {
      givenName: userAttributes[CognitoUserFields.GivenName],
      familyName: userAttributes[CognitoUserFields.FamilyName],
      phoneNumber: userAttributes.phone_number,
      phoneNumberVerified: fromCognitoStringBoolToBool(userAttributes.phone_number_verified),
    };
  }
}
