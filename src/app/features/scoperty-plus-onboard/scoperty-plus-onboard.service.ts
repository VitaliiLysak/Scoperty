import { Inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  fromEvent
} from 'rxjs';
import { LOCAL_STORAGE } from '../../core/services/local-storage.provider';
import {
  SCOPERTY_PLUS_ONBOARD_FORM_DATA_LOCAL_STORAGE_KEY,
  HTTP_Settings,
  SCOPERTY_PLUS_MORTGAGE_CERTIFICATE_STORE
} from '../../app.constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoggerService } from '../../core/services/logger/logger.service';
import { LOGGER } from '../../core/services/logger/logger.provider';
import { map, switchMap, take } from 'rxjs/operators';
import { IndexedDBService } from '../../core/services/indexeddb.service';

@Injectable()
export class ScopertyPlusOnboardService {
  static LOCAL_STORAGE_KEY = SCOPERTY_PLUS_ONBOARD_FORM_DATA_LOCAL_STORAGE_KEY;

  private presetFormContentsBS = new BehaviorSubject<ScopertyPlusOnboardService.SavedFormData>(null);
  private GLOBAL_URL_V1: string = HTTP_Settings.host;

  readonly presetFormContents$ = this.presetFormContentsBS.asObservable();

  get hasSavedForm() {
    return !!this.localStorage.getItem(ScopertyPlusOnboardService.LOCAL_STORAGE_KEY);
  }

  constructor(
    private httpClient: HttpClient,
    private indexedDBService: IndexedDBService,
    @Inject(LOGGER) private logger: LoggerService,
    @Inject(LOCAL_STORAGE) private localStorage: Storage
  ) {
    this.checkFormContents();
  }

  checkFormContents() {
    const form = this.localStorage.getItem(ScopertyPlusOnboardService.LOCAL_STORAGE_KEY);
    if (form) {
      if (!this.indexedDBService.indexedDBAvailible) {
        this.presetFormContentsBS.next(JSON.parse(form));
      } else {
        const parsedForm: ScopertyPlusOnboardService.SavedFormData = JSON.parse(form);
        this.indexedDBService.dbReference$
          .pipe(
            take(1),
            switchMap(db => this.getSavedMortgageCertificate(db)),
          )
          .subscribe(data => {
            parsedForm.formData.mortgage_certificate = data;
            this.presetFormContentsBS.next(parsedForm);
          });
      }
    } else {
      this.presetFormContentsBS.next(null);
    }
  }

  getSavedMortgageCertificate(db: IDBDatabase) {
    const { store } = this.indexedDBService.getStore(db, SCOPERTY_PLUS_MORTGAGE_CERTIFICATE_STORE);

    return fromEvent<{target: {result: any}}>(store.getAll(), 'success')
      .pipe(map(event => event.target.result[0]));
  }

  saveMortgageCertificate(certificate: ArrayBuffer) {
    this.indexedDBService.dbReference$
      .pipe(
        switchMap(db => {
          const { store } = this.indexedDBService.getStore(db, SCOPERTY_PLUS_MORTGAGE_CERTIFICATE_STORE);

          return fromEvent<{target: {result: any}}>(store.clear(), 'success')
            .pipe(map(() => store));
        }),
        switchMap((store: IDBObjectStore) =>
          fromEvent<{target: {result: any}}>(store.put(certificate, '1'), 'success')
        )
      )
      .subscribe();
  }

  saveFormContents(form: ScopertyPlusOnboardService.SavedFormData) {
    this.localStorage.setItem(ScopertyPlusOnboardService.LOCAL_STORAGE_KEY, JSON.stringify(form));

    if (form.formData.mortgage_certificate) {
      this.saveMortgageCertificate(form.formData.mortgage_certificate);
    }
  }

  purgeFormContents() {
    this.localStorage.removeItem(ScopertyPlusOnboardService.LOCAL_STORAGE_KEY);
    this.presetFormContentsBS.next(null);
  }

  sendFormData(body): Promise<Object> {
    const headers: HttpHeaders = new HttpHeaders({'Content-Type': 'default'});

    try {
      return this.httpClient.post(`${this.GLOBAL_URL_V1}/onboard-scoperty-plus`, body, { headers }).toPromise();
    } catch (error) {
      this.logger.error('ScopertyPlusOnboard::sendFormData:Error', error);
      throw new Error('ScopertyPlusOnboard::sendFormData:Error');
    }
  }
}

export namespace ScopertyPlusOnboardService {
  export interface SavedFormData {
    formData: any;
    activeStepIndex: number;
    fallbackStepIndex: number;
  }
}
