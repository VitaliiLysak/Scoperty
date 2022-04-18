import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localNumber',
})

export class LocaleNumberPipe implements PipeTransform {
  transform(value: number, defaultValue: string): string {
    if (value == null || value === 0) {
      if (defaultValue != null) return defaultValue;
      else return '0';
    } else {
      return value.toLocaleString('de-DE');
    }
  }
}
