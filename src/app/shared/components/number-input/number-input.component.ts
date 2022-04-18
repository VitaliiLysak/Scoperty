import { Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';

import { FormControl, ValidationErrors, ValidatorFn, Validators, } from '@angular/forms';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import { MAX_LIVING_AREA, MIN_LIVING_AREA, } from '../../../core/models/living-area.model';
import { isNullOrUndefined } from '../../../shared/utils/null-or-undefined.util';
import { inputNumberMaskGenerator, InputNumberMaskGeneratorConfig } from '../../utils/input-number-mask-generator.util';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: [ './number-input.component.css' ]
})
export class NumberInputComponent implements OnInit {
  @Input() initialValue: number = null;
  @Input() label: string = '';
  @Input() prefix: string = '';
  @Input() postfix: string = '';
  @Input() placeholder: string = '';
  @Input() fieldMods: any = {};
  @Input() thousandsSeparatorSymbol: string = '';
  @Input() integerLimit: number = 9;
  @Input() clearZero: boolean = true;
  @Input() validatorNames: Array<string> = [];
  @Input() disabled: boolean = false;
  @Input() allowDecimal: boolean = false;
  @Input() decimalSymbol: string;
  @Input() decimalLimit: number;
  @Input() useOurMaskGenerator = false;
  @Input() requiredError: string = 'Bitte füllen Sie dieses Feld aus';

  @Output() blurred = new EventEmitter<number>();
  @Output() inputed = new EventEmitter<boolean>();
  @Output() valid = new EventEmitter<boolean>();

  public mask: any = null;
  public value: string = '';
  public inputFormControl: FormControl;
  public validatorsFn: Array<ValidatorFn> = [];
  public validators: any = {};

  public _name: string = 'input-int';

  private _createMask(): void {
    const options: InputNumberMaskGeneratorConfig = {
      prefix: this.prefix,
      allowDecimal: this.allowDecimal,
      suffix: this.postfix,
      thousandsSeparatorSymbol: this.thousandsSeparatorSymbol,
      integerLimit: this.integerLimit,
    };

    if (!isNullOrUndefined(this.decimalLimit)) {
      options.decimalLimit = this.decimalLimit;
    }

    if (!isNullOrUndefined(this.decimalSymbol)) {
      options.decimalSymbol = this.decimalSymbol;
    }
    this.mask = this.useOurMaskGenerator ? inputNumberMaskGenerator(options) : createNumberMask(options);
  }

  private _initValidators(): void {
    this.validators = {
      year: this.yearValidator,
      plz: this.plzValidator,
      livingArea: this.livingAreaValidator,
      percent: this.percentValidator,
      required: Validators.required,
    };

    this.validatorsFn = this.validatorNames.map((validatorName) => {
      if (validatorName in this.validators) {
        return this.validators[validatorName];
      }
    });
  }

  private _initFormControls(): void {
    this.inputFormControl = new FormControl(
      '', this.validatorsFn
    );

    this.inputFormControl.valueChanges.subscribe(() => this.valid.next(this.inputFormControl.valid));
  }

  private _deserialize(value: string): string {
    if (this.validatorNames[0] === 'percent') {
      return value;
    }

    value = value.replace(this.prefix, '');
    value = value.replace(this.postfix, '');

    if (this.clearZero) {
      return this.value === '0' ? '' : value;
    } else {
      return value;
    }
  }

  constructor() {
    this.yearValidator = this.yearValidator.bind(this);
    this.plzValidator = this.plzValidator.bind(this);
    this.percentValidator = this.percentValidator.bind(this);
  }

  public ngOnInit(): void {
    this._createMask();
    this._initValidators();
    this._initFormControls();
    this.value = String(this.initialValue);
    if (this.clearZero) {this.value = (this.value === '0') ? '' : this.value; }
  }

  setDirty() {
    this.inputFormControl.markAsDirty();
  }

  public onInput(event: any, invalid: boolean) {
    this.inputed.emit(invalid);
  }

  onBlur(event: any, isInvalid: boolean): void {
    if (isInvalid) {
      return;
    }

    const value = this._deserialize(this.value);

    if (this.validatorNames[0] === 'percent') {
      this.blurred.emit(parseFloat(value));
    } else {
      const cleanValue = value.replace(this.thousandsSeparatorSymbol, '').replace(this.decimalSymbol, '.');
      this.blurred.emit(Number(cleanValue));
    }
  }

  public get isFilled(): boolean {
    return this.value !== '';
  }

  yearValidator(control: FormControl): ValidationErrors {
    if (((+control.value < 1900) || (+control.value > (new Date()).getFullYear())) && control.value !== '') {
      return {'yearErr': true};
    }
    return null;
  }

  plzValidator(control: FormControl): ValidationErrors {
    if (control.value.length > 6) {
      return {'plzErr': true};
    }
    return null;
  }

  percentValidator(control: FormControl): ValidationErrors {
    const percentAsNumber = parseFloat(control.value);
    if (percentAsNumber < 0 || percentAsNumber > 100) {
      return {'percentErr': true};
    }
    return null;
  }

  livingAreaValidator({ value }: FormControl): ValidationErrors {
    const valueAsNumber = Number(value);
    if (valueAsNumber < MIN_LIVING_AREA) {
      return { livingAreaMinErr: true };
    }

    if (valueAsNumber > MAX_LIVING_AREA) {
      return { livingAreaMaxErr: true };
    }

    return null;
  }
}
