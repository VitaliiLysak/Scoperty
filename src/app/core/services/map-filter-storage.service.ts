import {
  Inject,
  Injectable,
} from '@angular/core';

import { FilterOptions } from '../models/filter-options.model';

import { LOCAL_STORAGE } from './local-storage.provider';

const LOCAL_STORAGE_KEY = 'filterData';

@Injectable({
  providedIn: 'root',
})
export class MapFilterStorageService {
  constructor(@Inject(LOCAL_STORAGE) private localStorage: Storage) {
  }

  getFilters(): FilterOptions {
    const rawFilters = this.localStorage.getItem(LOCAL_STORAGE_KEY);
    const filters: FilterOptions = JSON.parse(rawFilters);

    return filters;
  }

  saveFilters(filters: FilterOptions): void {
    const rawFilters = JSON.stringify(filters);
    this.localStorage.setItem(LOCAL_STORAGE_KEY, rawFilters);
  }

  clearFilters(): void {
    this.localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}
