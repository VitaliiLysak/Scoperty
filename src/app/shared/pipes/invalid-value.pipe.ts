import { Pipe, PipeTransform } from '@angular/core';

import { isNullOrUndefined } from '../utils/null-or-undefined.util';

@Pipe({
  name: 'invalidValue',
})
export class InvalidValuePipe implements PipeTransform {
  transform(value: string | number, defaultValue: string = null): string | number {
    if (isNullOrUndefined(value)) {
      return defaultValue || '-';
    } else {
      return value;
    }
  }
}
