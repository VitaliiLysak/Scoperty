import {
  AfterContentChecked,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  Input,
  Optional,
  QueryList,
} from '@angular/core';
import {
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
} from '@angular/forms';

import { isNullOrUndefined } from '../../utils/null-or-undefined.util';
import { isEmptyString } from '../../utils/empty-string.util';

import { FormFieldErrorMessageDirective } from './form-field-error-message.directive';
import { FormFieldSuffixDirective } from './form-field-suffix.directive';
import { FormFieldInput } from './form-field-input.model';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: [
    './form-field.component.css',
  ],
})
export class FormFieldComponent implements AfterContentChecked, DoCheck {
  @Input() label: string;
  // The validateFormGroupErrors Input is used to do additional validation based on the parent formGroup,
  // e.g. for password and repeat-password validation.
  @Input() validateFormGroupErrors: string[];
  @Input() fixedHeightErrorMessage: boolean = false;
  @Input() showValidation: boolean = true;

  @ContentChild(FormControlDirective) controlElement: FormControlDirective;
  @ContentChild(FormControlName) controlNameElement: FormControlName;
  @ContentChild(FormFieldInput) inputElement: FormFieldInput;
  @ContentChild(FormFieldSuffixDirective) suffixElement: FormFieldSuffixDirective;

  @ContentChildren(FormFieldErrorMessageDirective) errorElementList: QueryList<FormFieldErrorMessageDirective>;

  public _name = 'form-row';

  public get identifier(): string {
    return !isNullOrUndefined(this.inputElement) ? this.inputElement.identifier : null;
  }

  public get hasLabel(): boolean {
    return !isEmptyString(this.label);
  }

  public get hasSuffix(): boolean {
    return !isNullOrUndefined(this.suffixElement);
  }

  public get firstErrorElement(): FormFieldErrorMessageDirective {
    return this.errorElementList.find(errorElement => {
      return errorElement.error === this.firstErrorKey;
    });
  }

  public get hasErrors(): boolean {
    if (isNullOrUndefined(this.control)) {
      return false;
    }

    const { touched, dirty } = this.control;
    const touchedAndDirty = touched && dirty;
    const controlInvalid = touchedAndDirty && this.control.invalid;
    if (!this.validateFormGroupErrors) {
      return controlInvalid;
    }

    const validationFormGroupInvalid = touchedAndDirty && this.isValidationFormGroupInvalid;
    return controlInvalid || validationFormGroupInvalid;
  }

  private get isValidationFormGroupInvalid(): boolean {
    const hasErrors = this.validateFormGroupErrors
      ? this.validateFormGroupErrors
        .map(error => this.parentFormGroupElement.hasError(error))
        .filter(hasError => hasError)
      : [];

    return hasErrors.length > 0;
  }

  public get control(): FormControl {
    if (!isNullOrUndefined(this.controlNameElement)) {
      return this.controlNameElement.control;
    }

    if (!isNullOrUndefined(this.controlElement)) {
      return this.controlElement.control;
    }

    return null;
  }

  private get errorKeys(): string[] {
    const groupErrorKeys = this.validateFormGroupErrors
      ? Object.keys(this.parentFormGroupElement.errors || {})
      : [];
    const controlErrorKeys = this.control
      ? Object.keys(this.control.errors || {})
      : [];

    return [ ...groupErrorKeys, ...controlErrorKeys ];
  }

  private get firstErrorKey(): string {
    return this.errorKeys[0];
  }

  constructor(@Optional() private parentFormGroupElement: FormGroupDirective) {
  }

  public ngAfterContentChecked(): void {
    if (this.hasSuffix) {
      const paddingRight = this.suffixElement.width + (4 * 8);
      this.inputElement.setPaddingRight(paddingRight);
    }
  }

  public ngDoCheck(): void {
    this.applyStateToInputElement();
  }

  private applyStateToInputElement(): void {
    if (isNullOrUndefined(this.inputElement) || isNullOrUndefined(this.control)) {
      return;
    }

    const hasErrors = this.hasErrors;
    this.inputElement.setInvalid(hasErrors, this.showValidation);

    const isFilled = !isEmptyString(this.control.value);
    this.inputElement.setFilled(isFilled);
  }
}
