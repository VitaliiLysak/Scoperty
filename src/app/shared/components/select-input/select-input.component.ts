import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { SelectItem } from 'ng2-select';

import { FormFieldInput } from '../form-field/form-field-input.model';
import { createFormFieldInputProvider } from '../form-field/form-field-input.provider';
import { isEmptyString } from '../../utils/empty-string.util';
import { isNullOrUndefined } from '../../utils/null-or-undefined.util';

type SelectSize = 'large' | 'small';

const noop = () => {};

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: [
    './select-input.component.css',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInputComponent),
      multi: true,
    },
    createFormFieldInputProvider(SelectInputComponent),
  ],
})
export class SelectInputComponent implements ControlValueAccessor, FormFieldInput {
  @Input() id: string;
  @Input() items: Array<any> = [];
  @Input() active: Array<any> = [];
  @Input() allowClear: boolean = false;
  @Input() multiple: boolean = false;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() size: SelectSize = 'large';

  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  // FIXME: Find out why the css files used by this component is not used for styling.
  public _name: string = 'select';

  public filled: boolean = false;
  public invalid: boolean = false;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  public writeValue(value: any): void {
    if (isNullOrUndefined(value) || isEmptyString(value)) {
      this.active = [];
      return;
    }

    this.active = Array.isArray(value) ? [ ...value ] : [ value ];
  }

  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public onSelect(value: SelectItem): void {
    this.onChangeCallback(value.text);
    this.onTouchedCallback();
    this.select.emit(value);
  }

  onRemove(): void {
    this.onChangeCallback(null);
    this.onTouchedCallback();
    this.select.emit(null);
  }

  public get identifier(): string {
    return this.id;
  }

  public setInvalid(invalid: boolean): void {
    this.invalid = invalid;
  }

  public setFilled(filled: boolean): void {
    this.filled = filled;
  }

  public setPaddingRight(padding: number): void {
  }
}
