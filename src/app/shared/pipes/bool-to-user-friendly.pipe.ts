import { Pipe, PipeTransform } from '@angular/core';

const VALUES = ['Nein', 'Ja'];

@Pipe({
  name: 'boolToFriendly',
  pure: false
})
export class BooleanToUserFriendly implements PipeTransform {
  transform(value: boolean): string {
    return VALUES[Number(value)];
  }
}
