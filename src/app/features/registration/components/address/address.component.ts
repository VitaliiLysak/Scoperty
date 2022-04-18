import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { DialogService } from 'ng2-bootstrap-modal';

import { OpenModalService } from '../../../../core/services/open-modal.service';
import { StateManagerService } from '../../../../core/services/state-manager.service';
import { MapManagerService } from '../../../../core/services/map-manager.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { AddressSkipComponent } from '../address-skip/address-skip.component';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { Place, MapObject } from '../../../../core/models/location.model';
import { SearchPointData } from '../../../../core/models/search.model';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { PrefillAddressService } from '../../../../core/services/prefill-address.service';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';

import { IAddressData } from './address.model';

type Building = 'house' | 'apartment';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})

export class AddressComponent implements OnInit, OnDestroy {

  @Input() mode: string;
  @Input() role: string;
  @Input() page: string;
  @Input() markerId: string = null;
  @Input() needPrefillData: boolean = false;

  @Output() addressCompleted: EventEmitter<IAddressData> = new EventEmitter<IAddressData>();

  public _name: string = 'address';
  public selectedOption: Building = null;
  public initAddress: string = '';
  public propertyType: string = '';
  public prefillFloor: string = '';
  public prefillLocation: string = '';

  public address = null;
  public addressForm: FormGroup;

  public subscriptionMap: Map<string, Subscription> = new Map<string, Subscription>();

  public marker: ExtendedMarkerModel = this.stateManagerService.activeMarker;

  private async _initForm() {
    this._setSettings();

    this.addressForm = new FormGroup({});

    if (this.marker && this.marker.id) {
      this.needPrefillData = true;
    } else if (this.markerId) {
      this.stateManagerService.activeMarker = await this.propertiesRepository.getMarkerDetails(this.markerId);
      this.marker = this.stateManagerService.activeMarker;
      this.needPrefillData = true;
    }

    const prefillAddressFields = this.prefillAddressService.getAddressFields();
    if (prefillAddressFields && prefillAddressFields.floor) {
      this.prefillFloor = prefillAddressFields.floor;
      this.prefillLocation = prefillAddressFields.location;
      this.prefillAddressService.removeAddressFields();
    }

    if (this.needPrefillData) {
      if (this.marker.isPropertyOfTypeMFH) this.selectedOption = 'apartment';
      if (this.marker.isPropertyOfTypeETW) this.selectedOption = 'apartment';
      if (this.marker.isPropertyOfTypeEFH) this.selectedOption = 'house';
      this._prefillFormData();
    }
  }

  private _setSettings(): void {
    this.address = {
      floor: '',
      door: '',
      your_address: '',
    };
  }

  private _prefillFormData(): void {
    if (this.marker && this.marker != null) {
      this.initAddress = `${this.marker.Street} ${this.marker.HouseNumber}, ${this.marker.PostalCode} ${this.marker.County}, Deutschland`;
      this.address['your_address'] = this.initAddress;
    }
  }

  constructor(
    private dialogService: DialogService,
    private openModalService: OpenModalService,
    private stateManagerService: StateManagerService,
    private mapManager: MapManagerService,
    private propertiesRepository: PropertiesRepositoryService,
    private changeDetectorRef: ChangeDetectorRef,
    private analyticsService: AnalyticsService,
    private prefillAddressService: PrefillAddressService,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    // register mode should be default
    if (this.mode == null) {
      this.mode = 'registration';
    }

    await this._initForm();

    if (!this.selectedOption) {
      this.selectedOption = 'house';
    }
    if (this.mode === 'delete' && !this.marker) {
      this.marker = new ExtendedMarkerModel();
    }

    this.subscribeOn('searchPropertyActivated', this.mapManager.getSearchPropertyActivatedStream(), this.searchPropertyActivated);
    this.subscribeOn('searchPlace', this.mapManager.getPlaceChangesStream(), this.searchPlace);
    this.subscribeOn('searchProperty', this.mapManager.getSearchPropertyStream(), this.searchProperty);

    this.changeDetectorRef.detectChanges();
  }

  public _blurred(key: string, value: string): void {
    this.address[key] = value;
  }

  public _created(formControlName: string, formControl: FormControl): void {
    this.addressForm.addControl(formControlName, formControl);
  }

  public async searchPlace({ place }: MapObject): Promise<void> {
    await this.deleteMarker(place);
  }

  public async searchPropertyActivated(propertyId: string): Promise<void> {
    await this.updateMarker(propertyId);
    this.updateForm();
  }

  public async searchProperty(searchPlace: SearchPointData): Promise<void> {
    if (!isNullOrUndefined(searchPlace)) {
      const {address, placePoint} = searchPlace;
      await this.createNullMarker(address, placePoint);
    }
  }

  public subscribeOn(key: string, stream: Observable<any>, handler: (data: any) => void): void {
    if (this.subscriptionMap.has(key)) this.subscriptionMap.get(key).unsubscribe();
    this.subscriptionMap.set(key, stream.subscribe(handler.bind(this)));
  }

  public unsubscribeAll(): void {
    this.subscriptionMap.forEach((subscription) => subscription.unsubscribe());
  }

  public ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  public get floor() {
    return this.addressForm.get('floor');
  }

  public get door() {
    return this.addressForm.get('door');
  }

  public selectOption(option: Building): void {
    if (option === this.selectedOption) return;
    this.selectedOption = option;
    this.addressForm.reset();
    this.changeDetectorRef.detectChanges();
  }

  public async updateMarker(markerId: any): Promise<void> {
    this.marker.hide();
    this.marker = await this.propertiesRepository.getMarkerDetails(markerId);
    this._prefillFormData();
  }

  public async createMarker(address, placePoint): Promise<void> {
    this.marker.hide();
    this.marker = new ExtendedMarkerModel();
    this.marker.Street = address.street;
    this.marker.County = address.locality;
    this.marker.HouseNumber = address.streetNumber;
    this.marker.Longitude = placePoint.lng;
    this.marker.Latitude = placePoint.lat;
    this.marker.PropertyId = 'some_id';
  }

  public async createNullMarker(address, placePoint): Promise<void> {
    this.marker.hide();
    this.marker = new ExtendedMarkerModel();
    this.marker.Street = address.street;
    this.marker.County = address.locality;
    this.marker.HouseNumber = address.streetNumber;
    this.marker.Longitude = placePoint.lng;
    this.marker.Latitude = placePoint.lat;
  }

  public async deleteMarker(place: Place): Promise<void> {
    this.marker.hide();
    this.marker = new ExtendedMarkerModel();
    this.marker.Longitude = place.point.lng;
    this.marker.Latitude = place.point.lat;
  }

  public showAddressSkipModal(): void {
    this.openModalService.open();
    this.dialogService.addDialog(AddressSkipComponent)
      .subscribe((message) => {
        this.openModalService.close();
        if (message === 'activatePhoneTab') {
          this.addressCompleted.emit();
        }
      });
  }

  public updateForm(): void {
    if (!isNullOrUndefined(this.marker) && !isNullOrUndefined(this.marker.PropertyId)) {
      this.marker.isPropertyOfTypeEFH ? this.selectOption('house') : this.selectOption('apartment');
    }
  }

  public apply(): void {
    Object.keys(this.addressForm.controls).forEach(key => {
      this.addressForm.get(key).markAsTouched();
      this.addressForm.get(key).markAsDirty();
    });

    this.mapManager.checkProperty(!!this.marker.PropertyId);

    // if (this.addressForm.invalid || (this.marker && !this.marker.PropertyId)) return;

    this.analyticsService.triggerFormSubmissionSuccess('addressForm', `${this.page}-address-tab`);

    this.addressCompleted.emit({address: this.address, propertyId: this.marker.PropertyId});
  }
}
