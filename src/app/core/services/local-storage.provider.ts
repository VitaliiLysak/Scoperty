import {
  FactoryProvider,
  InjectionToken,
} from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage>('LocalStorage');

export const localStorageFactory = () => localStorage;

export const LocalStorageProvider: FactoryProvider = {
  provide: LOCAL_STORAGE,
  useFactory: localStorageFactory
};
