import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import {
  merge,
  Subscription,
} from 'rxjs';

import { FormFieldInput } from '../form-field/form-field-input.model';
import { RadioButtonComponent } from '../radio-button/radio-button.component';
import { RadioButtonSize } from '../radio-button/radio-button.model';
import { isNullOrUndefined } from '../../utils/null-or-undefined.util';

const noop = () => {};

@Component({
  selector: 'app-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-group.component.html',
  styleUrls: [
    './radio-group.component.css',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
})
export class RadioGroupComponent implements AfterContentInit, OnDestroy, OnChanges, ControlValueAccessor, FormFieldInput {
  @Input() id: string;
  @Input() name: string;
  @Input() size: RadioButtonSize = 'large';

  @ContentChildren(forwardRef(() => RadioButtonComponent), { descendants: true })
  radioButtonElementList: QueryList<RadioButtonComponent>;

  private subscriptions: Subscription = new Subscription();

  public _name: string = 'radio-group';

  public model: string;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  public ngAfterContentInit(): void {
    this.configureRadioButtons();
    this.handleRadioButtonModelChanges();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const size = changes.size ? changes.size.currentValue : null;
    if (!isNullOrUndefined(size)) {
      this.resizeRadioButtons(size);
    }
  }

  public writeValue(value: any): void {
    this.model = value;
    this.updateRadioButtonModels(value);
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
  }

  public get identifier(): string {
    return this.id;
  }

  public setInvalid(invalid: boolean): void {
  }

  public setFilled(filled: boolean): void {
  }

  public setPaddingRight(padding: number): void {
  }

  private configureRadioButtons(): void {
    this.radioButtonElementList.forEach(radioButton => {
      radioButton.name = this.name;
      radioButton.size = this.size;
      radioButton.markForCheck();
    });
  }

  private resizeRadioButtons(size: RadioButtonSize): void {
    if (isNullOrUndefined(this.radioButtonElementList)) {
      return;
    }

    this.radioButtonElementList.forEach(radioButton => {
      radioButton.size = size;
      radioButton.markForCheck();
    });
  }

  private handleRadioButtonModelChanges(): void {
    const radioButtonModelChanges$ = merge(
      ...this.radioButtonElementList.map(radioButton => radioButton.select$),
    );
    const radioButtonModelChangesSubscription = radioButtonModelChanges$
      .subscribe((radioButton: RadioButtonComponent) => {
        return this.changeModel(radioButton.model);
      });
    this.subscriptions.add(radioButtonModelChangesSubscription);
  }

  private updateRadioButtonModels(model: string): void {
    if (isNullOrUndefined(this.radioButtonElementList)) {
      return;
    }

    this.radioButtonElementList.forEach(radioButton => {
      radioButton.writeValue(model === radioButton.value ? model : '');
      radioButton.markForCheck();
    });
  }
}
