import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fallbackValue',
})

export class FallbackValuePipe implements PipeTransform {
  transform(value: any, defaultValue: string = null): string {
    if (typeof value === 'number') {
      if (isNaN(value) || value === 0) {
        if (defaultValue != null) return defaultValue;
        else return '-';
      }
    } else {
      if (value == null || value === `${void 0}` || value === `null` || value === '') {
        if (defaultValue != null) return defaultValue;
        else return '-';
      }
    }
    return value;
  }
}
