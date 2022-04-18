import {
  FactoryProvider,
  InjectionToken,
} from '@angular/core';

export const NAVIGATOR = new InjectionToken<Navigator>('Navigator');

export const navigatorFactory = () => navigator;

export const NavigatorProvider: FactoryProvider = {
  provide: NAVIGATOR,
  useFactory: navigatorFactory,
};
