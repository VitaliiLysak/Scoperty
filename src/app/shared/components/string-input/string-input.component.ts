import {
  Component,
  Input, Output,
  OnChanges, OnInit, OnDestroy,
  EventEmitter,
} from '@angular/core';
import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { PhoneNumberValidators } from '../../validators/phone-number.validator';
import { FloorValidators } from '../../validators/floor.validator';

@Component({
  selector: 'app-string-input',
  templateUrl: './string-input.component.html',
  styleUrls: ['./string-input.component.css']
})

export class StringInputComponent implements OnInit, OnChanges, OnDestroy {
  @Input() inputId: string = '';
  @Input() initialValue: string = '';
  @Input() placeholder: string = '';
  @Input() label: string = 'Label';
  @Input() prefix: string = '';
  @Input() fieldMods: any = {};
  @Input() postfix: string = '';
  @Input() validatorNames: Array<string> = [];
  @Input() maxLength: string;
  @Input() validError: boolean = false;
  @Input() isDisableControl: boolean = false;
  @Input() errorPositioning: 'absolute' | 'blocky' = 'absolute';

  @Output() blurred: EventEmitter<string> = new EventEmitter<string>();
  @Output() blur: EventEmitter<string> = new EventEmitter<string>();
  @Output() inputed: EventEmitter<any> = new EventEmitter<any>();
  @Output() created: EventEmitter<FormControl> = new EventEmitter<FormControl>();

  value: string = '';
  inputFormControl: FormControl;
  validatorsFn: Array<ValidatorFn> = [];
  validators: any = {};

  name: string = 'input-str';

  get isFilled() {
    return (this.value !== '' && this.value !== null);
  }

  get isInvalid(): boolean {
    return this.inputFormControl.invalid && (this.inputFormControl.dirty && this.inputFormControl.touched);
  }

  get isValid() {
    return !this.isInvalid;
  }

  constructor() {
    this.nameLengthValidator = this.nameLengthValidator.bind(this);
    this.nameRequiredValidator = this.nameRequiredValidator.bind(this);
    this.surnameRequiredValidator = this.surnameRequiredValidator.bind(this);
    this.emailRequiredValidator = this.emailRequiredValidator.bind(this);
    this.emailPatternValidator = this.emailPatternValidator.bind(this);
    this.codeRequiredValidator = this.codeRequiredValidator.bind(this);
  }

  validate() {
    this.inputFormControl.markAsTouched();
    this.inputFormControl.markAsDirty();
  }

  private initValidators(): void {
    this.validators = {
      nameLength: this.nameLengthValidator,
      nameRequired: this.nameRequiredValidator,
      surnameRequired: this.surnameRequiredValidator,
      emailRequired: this.emailRequiredValidator,
      emailPattern: this.emailPatternValidator,
      phoneRequired: PhoneNumberValidators.phoneRequired,
      phonePattern: PhoneNumberValidators.phonePattern,
      codeRequired: this.codeRequiredValidator,
      floorRequired: FloorValidators.floorRequired,
      floorNumber: FloorValidators.floorNumber,
    };

    this.validatorsFn = this.validatorNames.map((validatorName) => {
      if (validatorName in this.validators) return this.validators[validatorName];
    });
  }

  private initFormControls(): void {
    this.inputFormControl = new FormControl(
      '', this.validatorsFn
    );
    this.created.emit(this.inputFormControl);
  }

  ngOnInit(): void {
    this.initValidators();
    this.initFormControls();
    this.value = String(this.initialValue);
  }

  ngOnChanges(): void {
    this.value = String(this.initialValue);
  }

  ngOnDestroy(): void {
  }

  onInput(event: any, invalid: boolean) {
    this.inputed.emit(invalid);
  }

  onBlur(event: any, invalid: boolean): void {
    this.blur.emit();
    if (invalid) return;
    this.blurred.emit(String(this.value));
  }

  nameLengthValidator(control: FormControl): ValidationErrors {
    if (control.value.length < 2) {
      return {'nameLengthErr': true};
    }
    return null;
  }

  nameRequiredValidator(control: FormControl): ValidationErrors {
    if (control.value === '') {
      return {'nameRequiredErr': true};
    }
    return null;
  }

  surnameRequiredValidator(control: FormControl): ValidationErrors {
    if (control.value === '') {
      return {'surnameRequiredErr': true};
    }
    return null;
  }

  emailRequiredValidator(control: FormControl): ValidationErrors {
    if (control.value === '') {
      return {'emailRequiredErr': true};
    }
    return null;
  }

  codeRequiredValidator(control: FormControl): ValidationErrors {
    if (control.value === '') {
      return {'codeRequiredErr': true};
    }
    return null;
  }

  emailPatternValidator(control: FormControl): ValidationErrors {
    const regexp = new RegExp('[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+)*' +
                             '@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?');
    if (!regexp.test(control.value)) {
      return {'emailPatternErr': true};
    }
    return null;
  }
}
