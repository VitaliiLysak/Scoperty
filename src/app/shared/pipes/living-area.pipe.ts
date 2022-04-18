import { Pipe, PipeTransform } from '@angular/core';

import { isNullOrUndefined } from '../utils/null-or-undefined.util';

import { LivingSurfacePipe } from './living-surface.pipe';

export interface LivingArea {
  min: number;
  max: number;
}

@Pipe({
  name: 'livingArea',
})
export class LivingAreaPipe implements PipeTransform {
  constructor (private livingSurfacePipe: LivingSurfacePipe) {}

  public transform({ min, max }: LivingArea): string {
    if (
      (isNullOrUndefined(min) && isNullOrUndefined(max)) ||
      (min === 0 && max === 0)
    ) {
      return 'egal';
    } else {
      return `${this.transformLivingAreaMin(min)} bis ${this.transformLivingAreaMax(max)}`;
    }
  }

  private transformLivingAreaMin(value: number): string {
    return `${value > 0 ? 'ab ' : ''}${this.transformArea(value)}`;
  }

  private transformLivingAreaMax(value: number): string {
    return this.transformArea(value);
  }

  private transformArea(area: number): string {
    return area > 0
      ? this.livingSurfacePipe.transform(area)
      : 'egal';
  }
}
