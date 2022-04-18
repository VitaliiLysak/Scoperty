import {
  Pipe,
  PipeTransform,
} from '@angular/core';

import { GROUND_FLOOR } from '../../app.constants';

@Pipe({
  name: 'floor',
})
export class FloorPipe implements PipeTransform {
  transform(floor: number): string {
    if (floor === 0) {
      return GROUND_FLOOR;
    }

    return `${ floor } St.`;
  }
}
