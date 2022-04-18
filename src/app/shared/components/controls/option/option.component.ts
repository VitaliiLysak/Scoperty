import {
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { FormFieldInput } from '../../../components/form-field/form-field-input.model';
import { createFormFieldInputProvider } from '../../../components/form-field/form-field-input.provider';

type OptionButtonSize = 'large' | 'small';
type OptionButtonState = 'checked' | 'default';

const noop = () => {};

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: [
    './option.component.css',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OptionComponent),
      multi: true,
    },
    createFormFieldInputProvider(OptionComponent),
  ],
})
export class OptionComponent implements ControlValueAccessor, FormFieldInput {
  @Input() id: string;
  @Input() label: string;
  @Input() size: OptionButtonSize = 'large';

  public name: string = 'option';

  public model: boolean;

  public filled: boolean;

  public get identifier(): string {
    return this.id;
  }

  public get state(): OptionButtonState {
    return this.model ? 'checked' : 'default';
  }

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  public writeValue(value: any): void {
    this.model = value;
  }

  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public changeModel(value: boolean): void {
    this.onChangeCallback(value);
    this.onTouchedCallback();
    this.model = value;
  }

  public setInvalid(invalid: boolean): void {}

  public setFilled(filled: boolean): void {
    this.filled = filled;
  }

  public setPaddingRight(padding: number): void {}
}
