import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  fromEvent
} from 'rxjs';
import {
  SCOPERTY_INDEXEDDB_NAME,
  INDEXEDDB_STORES
} from '../../app.constants';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

@Injectable()
export class IndexedDBService {

  private readonly indexedDB: IDBFactory;

  private readonly dbReferenceBS = new BehaviorSubject<IDBDatabase>(null);
  readonly dbReference$ = this.dbReferenceBS.asObservable()
    .pipe(filter(db => !!db));

  get indexedDBAvailible() {
    return !!this.indexedDB;
  }

  constructor() {
    const detypedWindow = window as any;
    this.indexedDB = detypedWindow.indexedDB || detypedWindow.mozIndexedDB || detypedWindow.webkitIndexedDB || detypedWindow.msIndexedDB;

    if (this.indexedDB) {
      const request = this.indexedDB.open(SCOPERTY_INDEXEDDB_NAME, 1);
      request.onupgradeneeded = () => {
        INDEXEDDB_STORES.forEach(store => request.result.createObjectStore(store, {autoIncrement: true}));
      };

      fromEvent(request, 'success')
        .subscribe((event) => {
          this.dbReferenceBS.next(request.result);
        });
    }
  }

  getStore(db: IDBDatabase, storeName: string) {
    const transaction = db
      .transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

    return {
      transaction,
      store
    };
  }
}
