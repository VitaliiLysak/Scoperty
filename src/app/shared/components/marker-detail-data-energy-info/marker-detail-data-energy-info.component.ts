import {
  Component,
  Input, Output,
  OnChanges,
  EventEmitter,
} from '@angular/core';

import { PropertiesRepositoryService } from '../../../core/services/properties-repository.service';
import { StaticStorageService } from '../../../core/services/static-storage.service';
import { isNullOrUndefined } from '../../../shared/utils/null-or-undefined.util';
import { isEmptyString } from '../../utils/empty-string.util';
import { ExtendedMarkerModel } from '../../../core/models/extended-marker.model';

@Component({
  selector: 'app-marker-detail-data-energy-info',
  templateUrl: './marker-detail-data-energy-info.component.html',
  styleUrls: ['./marker-detail-data-energy-info.component.css']
})
export class MarkerDetailDataEnergyInfoComponent implements OnChanges {
  @Input() model: ExtendedMarkerModel = null;
  @Input() mode: 'edit'|'show' = 'show';

  @Output() changeProperty: EventEmitter<any> = new EventEmitter<any>();
  @Output() certificateChange: EventEmitter<File> = new EventEmitter<File>();

  name: string = 'marker-detail-data-energy-info';
  actives: Map<string, Array<any>> = new Map<string, Array<any>>();

  get isEnergyCertificationNotSubject(): boolean {
    return this.model.EnergyCertificateStatus !== 'not_a_subject_of_enev';
  }

  get isEnergyCertificateStatusHasValue(): boolean {
    if (this.actives.has('EnergyCertificateStatus')) {
      const value = this.actives.get('EnergyCertificateStatus');
      return value.length > 0;
    } else {
      return false;
    }
  }

  get labelEnergyCertificationValue(): string {
    return this.model.EnergyCertificateType === 'usage' ? 'Energieverbrauch' : 'Energiebedarf';
  }

  get selectEnergyCertificateDate(): boolean {
    return this.model.EnergyCertificateDate === 'from_01_05_2014';
  }

  get isDisabledEnergyCertificateValue(): boolean {
    return isNullOrUndefined(this.model.EnergyCertificateType);
  }

  get isShowWaterHeatingIncluded(): boolean {
    return this.model.EnergyCertificateType === 'usage' && this.model.EnergyCertificateDate === 'till_30_04_2014';
  }

  constructor(
    private propertiesRepository: PropertiesRepositoryService,
    public staticStorage: StaticStorageService,
  ) {}

  ngOnChanges(): void {
    this.actives.set(
      'EnergyCertificateStatus',
      this.filterActive(this.staticStorage.energyCertificateStatusGlossary, this.model.EnergyCertificateStatus)
    );
    this.actives.set(
      'EnergyCertificateType',
      this.filterActive(this.staticStorage.energyCertificateTypeGlossary, this.model.EnergyCertificateType)
    );
    this.actives.set(
      'EnergySource',
      this.filterActive(this.staticStorage.energySourceGlossary, this.model.EnergySource)
    );
    this.actives.set(
      'EnergyConsumptionClass',
      this.filterActive(this.staticStorage.energyConsumptionClassGlossary, this.model.EnergyConsumptionClass)
    );
    this.actives.set(
      'HeatingType',
      this.filterActive(this.staticStorage.heatingTypeGlossary, this.model.HeatingType)
    );
    this.actives.set(
      'FacilitiesQuality',
      this.filterActive(this.staticStorage.facilitiesQualityGlossary, this.model.FacilitiesQuality)
    );
    this.actives.set(
      'EnergyCertificateDate',
      this.filterActive(this.staticStorage.energyCertificateDateGlossary, this.model.EnergyCertificateDate)
    );
  }

  onCertificateChange(file: File): void {
    this.certificateChange.emit(file);
  }

  savePropertyBoolean(value, key): void {
    this.changeProperty.emit({key, value});
  }

  saveProperty(key, value) {
    this.changeProperty.emit({key, value});
  }

  filterActive(array, value: string) {
    return array.filter((item) => item.textBe === value);
  }

  savePropertyFromSelect(item, key, glossary): void {
    let selectedItem;
    if (isNullOrUndefined(item.text)) {
      item = this.actives;
    } else {
      selectedItem = item;
    }
    const {text: value} = selectedItem;
    this.actives.set(key, [selectedItem]);
    this.changeProperty.emit({key, value: this.transformFeBe(glossary, value)});
  }

  async loadEnergySertificate() {
    if (isNullOrUndefined(this.model.EnergyCertificateFileId)) {
      return;
    }

    await this.propertiesRepository.getEnergyCertificate(this.model.id).toPromise();
  }

  transformFeBe(arr, text): string {
    return arr.find(item => item.text === text).textBe;
  }

  transformBeFe(arr, text): string {
    if (isEmptyString(text)) {
      return '-';
    } else {
      return arr.find(item => item.textBe === text).text;
    }
  }

  transformCertificateStatus(arr, text): string {
    if (isEmptyString(text)) {
      return '-';
    } else {
      return arr.find(item => item.textBe === text).shortText;
    }
  }
}
