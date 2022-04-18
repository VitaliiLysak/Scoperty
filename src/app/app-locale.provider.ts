import {
  LOCALE_ID,
  ValueProvider,
} from '@angular/core';

export const GERMAN_LOCALE = 'de-DE';

export const AppLocaleProvider: ValueProvider = {
  provide: LOCALE_ID,
  useValue: GERMAN_LOCALE,
};
