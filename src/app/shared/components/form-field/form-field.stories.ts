import {
  storiesOf,
  moduleMetadata,
} from '@storybook/angular';
import {
  boolean,
  withKnobs,
} from '@storybook/addon-knobs/angular';

import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { SelectModule } from 'ng2-select';

import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input.component';
import { PasswordInputDirective } from '../input/password-input.directive';
import { SelectInputComponent } from '../select-input/select-input.component';
import { PipesModule } from '../../pipes/pipes.module';
import { EmailValidators } from '../../validators/email.validator';

import { FormFieldComponent } from './form-field.component';
import { FormFieldErrorMessageDirective } from './form-field-error-message.directive';
import { FormFieldSuffixDirective } from './form-field-suffix.directive';

const MODULE_METADATA = moduleMetadata({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    SelectModule,

    PipesModule,
  ],
  declarations: [
    ButtonComponent,
    FormFieldComponent,
    FormFieldErrorMessageDirective,
    FormFieldSuffixDirective,
    FormFieldErrorMessageDirective,
    InputComponent,
    PasswordInputDirective,
    SelectInputComponent,
  ],
});

storiesOf('FormField', module)
  .addDecorator(withKnobs)
  .addDecorator(MODULE_METADATA)
  .add('Input', () => {
    return {
      props: {
        form: new FormGroup({
          email: new FormControl('', [
            Validators.required,
            EmailValidators.pattern,
          ]),
        }, {
          updateOn: 'blur',
        }),
        showValidation: boolean('Sow Validation', [ true, false ], true),
      },
      template: `
        <div class="sp-section">
          <h1>Input</h1>
          <table class="sp-layout-table" style="width: 30%;">
            <tr>
              <td>
                <form [formGroup]="form">
                  <div class="sp-form-field">
                    <app-form-field label="E-Mail-Adresse" [showValidation]="showValidation">
                      <input
                        app-input
                        formControlName="email"
                        type="email"
                      >

                      <ng-template app-form-field-error-message error="required">
                        Bitte eine E-Mail-Adresse eingeben
                      </ng-template>
                      <ng-template app-form-field-error-message error="pattern">
                        Falsche E-Mail-Adresse
                      </ng-template>
                    </app-form-field>
                  </div>
                </form>
              </td>
            </tr>
            <tr>
              <td>
                <pre class="sp-code">{{ form.value | json }}</pre>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  })
  .add('PasswordInput', () => {
    return {
      props: {
        form: new FormGroup({
          password: new FormControl('', [
            Validators.required,
          ]),
        }, {
          updateOn: 'blur',
        }),
        showValidation: boolean('Sow Validation', [ true, false ], true),
      },
      template: `
        <div class="sp-section">
          <h1>Password input</h1>
          <table class="sp-layout-table" style="width: 30%;">
            <tr>
              <td>
                <form [formGroup]="form">
                  <div class="sp-form-field">
                    <app-form-field label="Password" [showValidation]="showValidation">
                      <input
                        app-input
                        appPasswordInput
                        formControlName="password"
                        #passwordInput="appPasswordInput"
                      >
                      <button
                        app-button
                        buttonStyle="link"
                        size="small"
                        color="green"
                        appFormFieldSuffix
                        (click)="passwordInput.toggleVisibility()"
                      >
                        {{ passwordInput.visible ? 'Verbergen' : 'Zeigen' }}
                      </button>

                      <ng-template app-form-field-error-message error="required">
                        Bitte ein Password eingeben
                      </ng-template>
                    </app-form-field>
                   </div>
                </form>
              </td>
            </tr>
            <tr>
              <td>
                <pre class="sp-code">{{ form.value | json }}</pre>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  })
  .add('SelectInput', () => {
    return {
      props: {
        form: new FormGroup({
          floor: new FormControl(''),
        }, {
          updateOn: 'blur',
        }),
        floors: Array.from({ length: 5 }, (value: number, key: number) => {
          return {
            id: key + 1,
            text: `${ key + 1 }`,
          };
        }),
        showValidation: boolean('Sow Validation', [ true, false ], true),
      },
      template: `
        <div class="sp-section">
          <h1>Select input</h1>
          <table class="sp-layout-table" style="width: 30%;">
            <tr>
              <td>
                <form [formGroup]="form">
                  <div class="sp-form-field">
                    <app-form-field label="Stockwerk" [showValidation]="showValidation">
                      <app-select-input
                        placeholder="Auswählen"
                        [items]="floors"
                        formControlName="floor"
                      ></app-select-input>
                    </app-form-field>
                  </div>
                </form>
              </td>
            </tr>
            <tr>
              <td>
                <pre class="sp-code">{{ form.value | json }}</pre>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  });
