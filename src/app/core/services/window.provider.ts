import {
  FactoryProvider,
  InjectionToken,
} from '@angular/core';

export const WINDOW = new InjectionToken<Window>('Window');

export const windowFactory = () => window;

export const WindowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: windowFactory,
};
