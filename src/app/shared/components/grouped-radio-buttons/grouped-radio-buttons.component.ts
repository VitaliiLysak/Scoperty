import { Component, OnInit, Output, EventEmitter, forwardRef, Input } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { runtimeUniqueId } from '../../utils/genarator-unique-id.util';

@Component({
  selector: 'app-grouped-radio-buttons',
  templateUrl: './grouped-radio-buttons.component.html',
  styleUrls: ['./grouped-radio-buttons.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GroupedRadioButtonsComponent),
      multi: true
    }
  ]
})
export class GroupedRadioButtonsComponent implements OnInit, ControlValueAccessor {

  @Input() label: string = '';
  @Input() name: string = '';
  @Input() checked: boolean;

  @Output() changeValue: EventEmitter<void> = new EventEmitter<void>();

  input: FormControl = new FormControl();
  falseRadioId: string = runtimeUniqueId();
  trueRadioId: string = runtimeUniqueId();

  constructor() { }

  ngOnInit() { }

  onModelChange: Function = () => {};
  onModelTouched: Function = () => { };

  writeValue(value: any): void { }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
    this.input.valueChanges.subscribe((val) => {
      fn(val);
      this.changeValue.emit();
    });
  }

  registerOnTouched(fn: any): void {}
}
