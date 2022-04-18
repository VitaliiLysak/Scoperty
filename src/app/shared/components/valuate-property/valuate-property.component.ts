import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { isEmptyString } from '../../utils/empty-string.util';
import {
  ConstructionYearInputMask,
  LivingAreaInputMask,
} from '../../utils/input-masks.util';
import { isNullOrUndefined } from '../../utils/null-or-undefined.util';
import { ExtendedMarkerModel } from '../../../core/models/extended-marker.model';
import { InputTextMask } from '../../../core/models/input-text-mask.model';

import { ValuateProperty } from './valuate-property.model';
import { ValuatePropertySerializer } from './valuate-property.serializer';

@Component({
  selector: 'app-valuate-property',
  templateUrl: './valuate-property.component.html',
  styleUrls: [
    './valuate-property.component.css',
  ],
})
export class ValuatePropertyComponent implements OnChanges {
  @Input() heading: string;
  @Input() property: ExtendedMarkerModel;
  @Input() buttonLabel: string;
  @Input() buttonStretch: boolean;
  @Input() userLoggedIn: boolean = false;
  @Input() inlineEditable: boolean = false;

  @Output() buttonClick: EventEmitter<ValuateProperty> = new EventEmitter<ValuateProperty>();

  name: string = 'valuate-property';

  livingAreaInputMask: InputTextMask = LivingAreaInputMask.createMask(4);
  constructionYearInputMask: InputTextMask = ConstructionYearInputMask.createMask();
  propertyValuationForm: FormGroup;

  get hasHeading(): boolean {
    return !isEmptyString(this.heading);
  }

  get shouldStretchButton(): boolean {
   if (this.inlineEditable) {
     return true;
   }

    return this.buttonStretch;
  }

  constructor() {
    this.configurePropertyValuationForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.applyPropertyValuationFormValue(changes.property);
  }

  clickButton(): void {
    if (!this.inlineEditable || this.propertyValuationForm.invalid) {
      this.buttonClick.emit(null);
      return;
    }

    const result = ValuatePropertySerializer.createValuateProperty(this.propertyValuationForm.value);
    this.buttonClick.emit(result);
  }

  private configurePropertyValuationForm(): void {
    const form = new FormGroup({
      livingArea: new FormControl('', Validators.required),
      constructionYear: new FormControl('', Validators.required),
    }, { updateOn: 'blur' });
    this.propertyValuationForm = form;
  }

  private applyPropertyValuationFormValue(propertyChange: SimpleChange): void {
    if (!isNullOrUndefined(propertyChange)) {
      const formValue = ValuatePropertySerializer.createValuatePropertyForm(propertyChange.currentValue);
      this.propertyValuationForm.patchValue(formValue);
    }
  }
}
