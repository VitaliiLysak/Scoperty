import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
} from '@angular/forms';

import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import {
  createFloors,
  Floor,
} from '../../../../core/models/floor.model';
import { InputTextMask } from '../../../../core/models/input-text-mask.model';
import { LIVING_AREA_INPUT_MASK } from '../../../../shared/utils/living-area-input-mask.util';

export interface AddApartmentResult {
  property: ExtendedMarkerModel;
  floor: string;
  livingArea: string;
}

@Component({
  selector: 'app-property-detail-add-apartment',
  templateUrl: './property-detail-add-apartment.component.html',
  styleUrls: [
    './property-detail-add-apartment.component.css',
  ],
})
export class AddApartmentComponent implements OnInit {
  @Input() marker: ExtendedMarkerModel;

  @Output() addApartment: EventEmitter<AddApartmentResult> = new EventEmitter<AddApartmentResult>();

  public _name: string = 'property-detail-add-apartment';

  public claimingForm: FormGroup;
  public floors: Array<Floor> = createFloors();
  public inputAreaMask: InputTextMask = LIVING_AREA_INPUT_MASK;

  public get floor(): FormControl {
    return this.claimingForm.get('floor') as FormControl;
  }

  public get livingArea(): FormControl {
    return this.claimingForm.get('livingArea') as FormControl;
  }

  public ngOnInit(): void {
    this.initClaimingForm();
  }

  public addApartmentToProperty(): void {
    const property = this.marker;
    const { floor, livingArea } = this.claimingForm.value;
    const result: AddApartmentResult = {
      property,
      floor,
      livingArea,
    };
    this.addApartment.emit(result);
  }

  private initClaimingForm(): void {
    this.claimingForm = new FormGroup({
      floor: new FormControl(''),
      livingArea: new FormControl(''),
    });
  }
}
