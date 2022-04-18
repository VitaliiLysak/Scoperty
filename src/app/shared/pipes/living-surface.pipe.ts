import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'livingSurface',
})
export class LivingSurfacePipe implements PipeTransform {
  transform(value: any): string {
    return `${value || 0} m²`;
  }
}
