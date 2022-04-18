import {
  FactoryProvider,
  InjectionToken,
} from '@angular/core';

export const LOCATION = new InjectionToken<Location>('Location');

export const locationFactory = () => location;

export const LocationProvider: FactoryProvider = {
  provide: LOCATION,
  useFactory: locationFactory,
};
