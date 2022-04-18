import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metersToKilometers',
})
export class MetersToKilometersPipe implements PipeTransform {
  transform(meters: number, useSpace = true): string {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(0)}${useSpace ? ' ' : ''}km`;
    }
    return `${meters.toFixed(0)}${useSpace ? ' ' : ''}m`;
  }
}
