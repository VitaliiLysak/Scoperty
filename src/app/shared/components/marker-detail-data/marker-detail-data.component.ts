import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, } from '@angular/core';
import { FormControl, Validators, } from '@angular/forms';

import {
  ExtendedMarkerModel,
  ExtendedMarkerModelKey,
  ExtendedMarkerModelMember
} from '../../../core/models/extended-marker.model';
import { StaticStorageService } from '../../../core/services/static-storage.service';
import { isNullOrUndefined } from '../../../core/ngx-multi-modal/util';
import { NumberInputComponent } from '../number-input/number-input.component';

enum PropertySubType {
  House = 'house',
  Apartment = 'apartment'
}

@Component({
  selector: 'app-marker-detail-data',
  templateUrl: './marker-detail-data.component.html',
  styleUrls: ['./marker-detail-data.component.css']
})
export class MarkerDetailDataComponent implements OnInit, OnChanges {
  @ViewChild('constructionYearNumberInput') constructionYearNumberInput: NumberInputComponent;
  @Input() model: ExtendedMarkerModel = null;
  @Input() mode: 'edit'|'show' = 'show';
  @Input() page: any = null;
  @Input() block: any = null;

  @Output() changeProperty = new EventEmitter<{key: ExtendedMarkerModelKey, value: ExtendedMarkerModelMember}>();
  @Output() inputed = new EventEmitter<{key: ExtendedMarkerModelKey, invalid: boolean}>();

  private maxYear: number = (new Date()).getFullYear();

  lastModernisationYear: FormControl;
  constructionYear: FormControl;

  activePropertyCondition: Array<any>;
  activePropertyFloor: Array<any>;
  activePropertySubHouseType: Array<any>;
  activePropertySubApartmentType: Array<any>;
  activeFloorLocation: Array<any>;

  PropertySubType: typeof PropertySubType = PropertySubType;
  noDataSymbol: string = '-';
  name: string = 'marker-detail-data';

  get areaUnits() {
    return `m${String.fromCharCode(0x00B2)}`;
  }

  get isOwned(): boolean {
    return this.model.isOwner;
  }

  get isPageMyProperties(): boolean {
    return this.page === 'myProperties';
  }

  constructor(
    public staticStorage: StaticStorageService,
  ) {}

  ngOnInit() {
    this.lastModernisationYear = new FormControl(
      '', [
        this.yearValidator,
        Validators.pattern('[0-9]{4}'),
      ]
    );

    this.constructionYear = new FormControl(
      '', [
        this.yearValidator,
        Validators.required,
        Validators.pattern('[0-9]{4}'),
      ]
    );

    this.activePropertyCondition = this.filterActive(this.staticStorage.propertyConditionGlossary, this.model.PropertyCondition);
    this.activePropertyFloor = this.filterActive(this.staticStorage.propertyFloorGlossary, this.model.Floor);
    this.activePropertySubHouseType = this.filterActive(this.staticStorage.propertySubHouseTypeGlossary, this.model.PropertySubType);
    // tslint:disable-next-line: max-line-length
    this.activePropertySubApartmentType = this.filterActive(this.staticStorage.propertySubApartmentTypeGlossary, this.model.PropertySubType);
    this.activeFloorLocation = this.filterActive(this.staticStorage.floorLocationGlossary, this.model.FloorLocation);
  }

  ngOnChanges() {
    this.activePropertyCondition = this.filterActive(this.staticStorage.propertyConditionGlossary, this.model.PropertyCondition);
    this.activePropertyFloor = this.filterActive(this.staticStorage.propertyFloorGlossary, this.model.Floor);
    this.activePropertySubHouseType = this.filterActive(this.staticStorage.propertySubHouseTypeGlossary, this.model.PropertySubType);
    // tslint:disable-next-line: max-line-length
    this.activePropertySubApartmentType = this.filterActive(this.staticStorage.propertySubApartmentTypeGlossary, this.model.PropertySubType);
    this.activeFloorLocation = this.filterActive(this.staticStorage.floorLocationGlossary, this.model.FloorLocation);
  }

  yearValidator(control: FormControl): {[s: string]: boolean} {

    if (((+control.value < 1900) || (+control.value > (new Date()).getFullYear())) && control.value !== '') {
      return {'yearErr': true};
    }
    return null;
  }

  revalidate() {
    this.constructionYearNumberInput.setDirty();
  }

  filterActive(array, value) {
    return array.filter((item) => item.textBe === value);
  }

  yearInputValidate({target}) {
    if (!/^\d{0,4}$/ig.test(target.value)) {
      target.value = target.dataset.prevval;
    } else if (Number(target.value) < Number(target.attributes.minvalue.value)) {
      // target.value = target.attributes.minvalue.value;
    } else if (Number(target.value) > Number(target.attributes.maxvalue.value)) {
      target.value = target.attributes.maxvalue.value;
    }
  }

  updateMarkerValidity(valid: boolean) {
    this.model.propertyEditValid = valid;
  }

  get markerConstructionYear() {
    return this.model.ConstructionYear ? this.model.ConstructionYear.slice(0, 4) : '';
  }

  get markerModernisationYear() {
    return this.model.LastModernisationYear ? this.model.LastModernisationYear.slice(0, 4) : '';
  }

  get markerTotalArea() {
    return this.model.TotalArea > 0 ? this.model.TotalArea : '-';
  }

  yearInputOnKeydown = (e) => {
    const {keyCode, target} = e;
    target.dataset.prevval = target.value;
    if (keyCode === 38 && Number(target.value) < Number(target.attributes.maxvalue.value)) {
      target.value = Number(target.value) + 1;
      e.preventDefault();
    }
    if (keyCode === 40 && Number(target.value) > Number(target.attributes.minvalue.value)) {
      target.value = Number(target.value) - 1;
      e.preventDefault();
    }
  }

  areaInputValidate({target}) {
    // if (!/^\d*\sqm$/ig.test(target.value)) {
    if (!/^\d*\sm\u00b2$/ig.test(target.value)) {
      target.value = target.dataset.prevval;
    }
  }

  areaInputValueToNumber(target) {
    // const matched = /^(-?\d*)\sqm$/ig.exec(target.value) || [];
    const matched = /^(-?\d*)\sm\u00b2$/ig.exec(target.value) || [];
    const extracted = matched[1] || 0;
    const numbered = Number(extracted);
    if (isNaN(numbered)) return 0;
    else return numbered;
  }

  areaInputIncrement(target, value = 1) {
    target.value = `${this.areaInputValueToNumber(target) + 1} ${this.areaUnits}`;
  }

  areaInputDecrement(target, value = 1) {
    if (Number(target.attributes.minvalue.value) < this.areaInputValueToNumber(target))
      target.value = `${this.areaInputValueToNumber(target) - 1} ${this.areaUnits}`;
  }

  areaInputOnKeydown = (e) => {
    const {keyCode, target} = e;
    target.dataset.prevval = target.value;
    if (keyCode === 38) {
      this.areaInputIncrement(target);
      e.preventDefault();
    }
    if (keyCode === 40) {
      this.areaInputDecrement(target);
      e.preventDefault();
    }
  }

  anyInputOnFocus({target}) {
    target.labels.forEach((item) => item.dataset.isFocused = '');
  }

  decrement(key, step = 1, min = -Infinity) {
    if (this.model[key] <= min) return;
    const value = this.model[key] - step;
    this.changeProperty.emit({key, value});
  }

  increment(key, step = 1, max = +Infinity) {
    if (this.model[key] >= max) return;
    const value = this.model[key] + step;
    this.changeProperty.emit({key, value});
  }

  saveProperty(key, value) {
    this.changeProperty.emit({key, value});
  }

  yearStrToNum(year: string): number {
    return (year === null) ? 0 : parseInt(year, 10);
  }

  yearNumToStr(year: number): string {
    return (year === 0) ? null : year + '-01-01';
  }

  saveInputedValue(key: keyof ExtendedMarkerModel, invalid: boolean) {
   this.inputed.emit({key, invalid});
  }

  savePropertyArea(key, value) {
    this.changeProperty.emit({key, value});
  }

  savePropertyBoolean(value, key) {
    this.changeProperty.emit({key, value});
  }

  savePropertyFromSelect(item, key,  glossary) {
    let selectedItem;
    if (isNullOrUndefined(item.text)) {
      item = this.activePropertyCondition;
    } else {
      selectedItem = item;
    }
    const {text: value} = selectedItem;
    this.activePropertyCondition = [selectedItem];
    this.changeProperty.emit({key, value: this.transformFeBe(glossary, value)});
  }

  savePropertySubTypeFromSelect(item, key, glossary, type) {
    let selectedItem;
    if (isNullOrUndefined(item.text)) {
      if (type === PropertySubType.House) {
        item = this.activePropertySubHouseType;
      } else {
        item = this.activePropertySubApartmentType;
      }
    } else {
      selectedItem = item;
    }
    const {text: value} = selectedItem;
    this.activePropertySubHouseType = [selectedItem];
    this.activePropertySubApartmentType = [selectedItem];
    this.changeProperty.emit({key, value: this.transformFeBe(glossary, value)});
  }

  savePropertyFloorFromSelect(item, key) {
    let selectedItem;
    if (isNullOrUndefined(item.text)) {
      item = this.activePropertyFloor;
    } else {
      selectedItem = item;
    }
    const {text: value} = selectedItem;
    this.activePropertyFloor = [selectedItem];
    this.changeProperty.emit({key, value});
  }

  transformFeBe(arr, text) {
    return arr.find(item => item.text === text).textBe;
  }

  transformBeFe(arr, text) {
    if (!text) return '-';
    else return arr.find(item => item.textBe === text).text;
  }
}
