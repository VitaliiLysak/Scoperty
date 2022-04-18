import {
  ValidatorFn,
  Validators,
} from '@angular/forms';

export class EmailValidators {
  static pattern: ValidatorFn = Validators.pattern(
    '[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+)*' +
    '@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?',
  );
}
