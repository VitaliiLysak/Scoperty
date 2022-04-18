import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import { isEmptyString } from './empty-string.util';

export interface InputMask {
  prefix?: string;
  suffix?: string;
  thousandsSeparatorSymbol?: string;
  integerLimit?: number;
  allowDecimal?: boolean;
  decimalLimit?: number;
  decimalSymbol?: string;
}

export class AmountInputMask {
  static suffix = ' €';

  static createMask(integerLimit: number): InputMask {
    return createNumberMask({
      prefix: '',
      suffix: AmountInputMask.suffix,
      thousandsSeparatorSymbol: '.',
      integerLimit,
    });
  }

  static unmaskValue(maskedValue: string): string {
    if (isEmptyString(maskedValue)) {
      return maskedValue;
    }

    return maskedValue
      .replace(AmountInputMask.suffix, '')
      .replace(/\./g, '');
  }
}

export class LivingAreaInputMask {
  static suffix = ' m\u00B2';

  static createMask(integerLimit: number): InputMask {
    return createNumberMask({
      prefix: '',
      suffix: LivingAreaInputMask.suffix,
      thousandsSeparatorSymbol: '.',
      integerLimit,
    });
  }

  static unmaskValue(maskedValue: string): string {
    if (isEmptyString(maskedValue)) {
      return maskedValue;
    }

    return maskedValue
      .replace(LivingAreaInputMask.suffix, '')
      .replace(/\./g, '');
  }
}

export class ConstructionYearInputMask {
  static createMask(): InputMask {
    return createNumberMask({
      prefix: '',
      suffix: '',
      thousandsSeparatorSymbol: '',
      integerLimit: 4,
    });
  }
}
