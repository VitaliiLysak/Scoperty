import {
  Component,
  Input, Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { SelectItem } from 'ng2-select';

type SelectSize = 'large' | 'small';

// FIXME: Replace all occurencies with select-input component, then remove this component.
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() items: Array<any> = [];
  @Input() active: Array<any> = [];
  @Input() allowClear: boolean = false;
  @Input() multiple: boolean = false;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() size: SelectSize = 'large';

  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  public _name: string = 'select';

  public get isFilled(): boolean {
    return !!this.active.length;
  }

  propagateChange = (_: any) => {};

  writeValue(value: any): void {}

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  onSelect(value: SelectItem): void {
    this.propagateChange(value.text);
    this.select.emit(value);
  }

  registerOnTouched(fn: any): void {}
}
