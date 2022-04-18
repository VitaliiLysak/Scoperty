import {
  Component,
  Input,
  forwardRef,
  ChangeDetectorRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import { FormFieldInput } from '../../form-field/form-field-input.model';
import { createFormFieldInputProvider } from '../../form-field/form-field-input.provider';

import { CheckboxInputButtonSize } from './checkbox-input.model';

const noop = () => {};

@Component({
  selector: 'app-checkbox-input',
  templateUrl: './checkbox-input.component.html',
  styleUrls: [
    './checkbox-input.component.css',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxInputComponent),
      multi: true,
    },
    createFormFieldInputProvider(CheckboxInputComponent),
  ],
})
export class CheckboxInputComponent implements ControlValueAccessor, FormFieldInput {
  private static fields = 0;
  @Input() inputId: string;
  @Input() id: string;
  @Input() name: string = '';
  @Input() size: CheckboxInputButtonSize = 'large';
  @Input() checkboxType: string = 'default';

  _name: string = 'checkbox-input';
  readonly uniqueCheckboxId: string;

  model: boolean;

  filled: boolean = false;
  invalid: boolean = false;

  get identifier(): string {
    return this.id;
  }

  get idForInput(): string {
    return this.inputId || this.uniqueCheckboxId;
  }

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  // FIXME: Find out why "changeDetectorRef" is necessary to keep the model and template state in sync.
  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.uniqueCheckboxId = (CheckboxInputComponent.fields++).toString();
  }

  writeValue(value: any): void {
    this.model = value;
    this.changeDetectorRef.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  changeModel(value: boolean): void {
    this.model = value;
    this.onChangeCallback(value);
    this.onTouchedCallback();
  }

  setInvalid(invalid: boolean): void {
    this.invalid = invalid;
  }

  setFilled(filled: boolean): void {
    this.filled = filled;
  }

  setPaddingRight(padding: number): void {}
}
