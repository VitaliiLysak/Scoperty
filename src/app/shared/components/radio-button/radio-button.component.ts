import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import {
  Observable,
  Subject,
} from 'rxjs';

import { RadioButtonSize } from './radio-button.model';

const noop = () => {};

@Component({
  selector: 'app-radio-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-button.component.html',
  styleUrls: [
    './radio-button.component.css',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true,
    },
  ],
})
export class RadioButtonComponent implements ControlValueAccessor {
  @Input() id: string;
  @Input() name: string;
  @Input() size: RadioButtonSize = 'large';
  @Input() value: string;
  @Input() radioButtonType: string = 'default';

  public _name: string = 'radio-button';

  public model: string;
  private selectSubject: Subject<RadioButtonComponent> = new Subject<RadioButtonComponent>();
  public select$: Observable<RadioButtonComponent> = this.selectSubject.asObservable();

  public get identifier(): string {
    return this.id;
  }

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  public writeValue(value: any): void {
    this.model = value;
  }

  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public changeModel(value: string): void {
    this.onChangeCallback(value);
    this.onTouchedCallback();
    this.model = value;
    this.selectSubject.next(this);
  }

  public markForCheck(): void {
    this.changeDetectorRef.markForCheck();
  }
}
