import {
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import { FormFieldInput } from '../../../components/form-field/form-field-input.model';
import { createFormFieldInputProvider } from '../../../components/form-field/form-field-input.provider';

const noop = () => {};

@Component({
  selector: 'app-input-volume',
  templateUrl: './input-volume.component.html',
  styleUrls: ['./input-volume.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputVolumeComponent),
      multi: true,
    },
    createFormFieldInputProvider(InputVolumeComponent),
  ],
})
export class InputVolumeComponent implements ControlValueAccessor, FormFieldInput {
  @Input() id: string;
  @Input() min: number = 0;
  @Input() max: number = +Infinity;

  public _name = 'input-volume';

  public value: number;
  public filled: boolean;

  public get identifier(): string {
    return this.id;
  }

  public get decrementEnabled(): boolean {
    return this.value > this.min;
  }

  public get incrementEnabled(): boolean {
    return this.value < this.max;
  }

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  private apply(): void {
    this.onChangeCallback(this.value);
    this.onTouchedCallback();
  }

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public decrement(): void {
    if (!this.decrementEnabled) {
      return;
    }
    this.value--;
    this.apply();
  }

  public increment(): void {
    if (!this.incrementEnabled) {
      return;
    }
    this.value++;
    this.apply();
  }

  public setInvalid(invalid: boolean): void {}

  public setFilled(filled: boolean): void {
    this.filled = filled;
  }

  public setPaddingRight(padding: number): void {}
}
