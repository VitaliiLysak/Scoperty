import {
  Component,
  Input, Output,
  EventEmitter,
  OnChanges
} from '@angular/core';

import { StaticStorageService } from '../../../core/services/static-storage.service';
import { isNullOrUndefined } from '../../utils/null-or-undefined.util';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-marker-detail-data-equipment',
  templateUrl: './marker-detail-data-equipment.component.html',
  styleUrls: ['./marker-detail-data-equipment.component.css']
})
export class MarkerDetailDataEquipmentComponent implements OnChanges {
  @Input() model: any = null;
  @Input() mode: 'edit'|'show' = 'show';
  @Input() page: any = null;

  @Output() changeProperty: EventEmitter<any> = new EventEmitter<any>();
  @Output() changePropertyFromEquipment: EventEmitter<any> = new EventEmitter<any>();

  actives: Map<string, any[]> = new Map<string, any[]>();
  activeTooglePropertyForm: FormGroup;
  name: string = 'marker-detail-data-equipment';

  get isActiveToogleProperty(): boolean {
    return !this.model.Garden &&
      !this.model.VisitorsWC &&
      !this.model.Cellar &&
      !this.model.Balcony &&
      !this.model.Kitchen &&
      !this.model.SecondaryEntrance &&
      !this.model.AirConditioned &&
      !this.model.Elevator &&
      !this.model.Chimney &&
      !this.model.Sauna  &&
      !this.model.SwimmingPool &&
      !this.model.Furnished &&
      !this.model.BarrierFree;
  }

  constructor(
    public staticStorage: StaticStorageService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createActiveTooglePropertyForm();
  }

  ngOnChanges(): void {
    this.actives.set(
      'FacilitiesQuality',
      this.filterActive(this.staticStorage.facilitiesQualityGlossary, this.model.FacilitiesQuality)
    );
    this.actives.set(
      'RoofCovering',
      this.filterActive(this.staticStorage.roofCoveringGlossary, this.model.RoofCovering)
    );
    this.actives.set(
      'Windows',
      this.filterActive(this.staticStorage.windowsGlossary, this.model.Windows)
    );
    this.actives.set(
      'Flooring',
      this.filterActive(this.staticStorage.flooringGlossary, this.model.Flooring)
    );
  }

  createActiveTooglePropertyForm() {
    this.activeTooglePropertyForm = this.fb.group({
      Garden: [this.model.Garden, []],
      VisitorsWC: [this.model.VisitorsWC, []],
      Cellar: [this.model.Cellar, []],
      Balcony: [this.model.Balcony, []],
      Kitchen: [this.model.Kitchen, []],
      SecondaryEntrance: [this.model.SecondaryEntrance, []],
      AirConditioned: [this.model.AirConditioned, []],
      Elevator: [this.model.Elevator, []],
      Chimney: [this.model.Chimney, []],
      Sauna: [this.model.Sauna, []],
      SwimmingPool: [this.model.SwimmingPool, []],
      Furnished: [this.model.Furnished, []],
      BarrierFree: [this.model.BarrierFree, []]
    });
  }

  tooglePropertyFormControls(nameControl: string): boolean {
    return this.activeTooglePropertyForm.controls[nameControl].value;
  }

  toggleProperty(value): void {
    this.changePropertyFromEquipment.emit(this.activeTooglePropertyForm.value);
  }

  filterActive(array, value): [] {
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

  transformFeBe(arr, text): string {
    return arr.find(item => item.text === text).textBe;
  }
}
