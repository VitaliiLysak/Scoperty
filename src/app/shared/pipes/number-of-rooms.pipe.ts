import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberOfRooms',
})
export class NumberOfRoomsPipe implements PipeTransform {
  transform(value: any): string {
    return `${value} Zi.`;
  }
}
