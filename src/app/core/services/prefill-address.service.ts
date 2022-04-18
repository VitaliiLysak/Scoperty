import { Inject, Injectable } from '@angular/core';

import { LOCAL_STORAGE } from './local-storage.provider';

const ADDRESS_FIELDS: string = 'prefillAddressFields';
const NEED_PREFILL_ADDRESS: string = 'prefillAddressFields';

interface AddressFields {
  floor: string;
  location: string;
}

interface NeedPrefillAddress {
  value: boolean;
  markerId: string;
}

@Injectable()
export class PrefillAddressService {

  constructor (
    @Inject(LOCAL_STORAGE) private localStorage: Storage,
  ) { }

  public setAddressFields(addressFields: AddressFields): void {
    this.localStorage.setItem(ADDRESS_FIELDS, JSON.stringify(addressFields));
  }

  public getAddressFields(): AddressFields {
    return JSON.parse(this.localStorage.getItem(ADDRESS_FIELDS));
  }

  public removeAddressFields(): void {
    this.localStorage.removeItem(ADDRESS_FIELDS);
  }
}
