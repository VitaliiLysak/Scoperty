import {
  storiesOf,
  moduleMetadata,
} from '@storybook/angular';
import {
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';

import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { ButtonComponent } from '../button/button.component';
import { IconsModule } from '../../icons/icons.module';
import { PipesModule } from '../../pipes/pipes.module';

import { RadioButtonComponent } from './radio-button.component';

const MODULE_METADATA = moduleMetadata({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    IconsModule,
    PipesModule,
  ],
  declarations: [
    ButtonComponent,
    RadioButtonComponent,
  ],
});

storiesOf('Radio/RadioButton/Playground', module)
  .addDecorator(withKnobs)
  .addDecorator(MODULE_METADATA)
  .add('NgModel', () => {
    return {
      props: {
        model: '',
        value: text('Value', 'RadioButtonValue'),
        size: select('Size', [ 'large', 'small' ], 'large'),
        content: text('Content', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
      },
      template: `
        <div class="sp-section">
          <h1>NgModel</h1>
          <table class="sp-layout-table" style="width: 640px;">
            <tr>
              <td>
                <app-radio-button
                  [(ngModel)]="model"
                  [size]="size"
                  [value]="value"
                >
                  {{ content }}
                </app-radio-button>
              </td>
            </tr>
            <tr>
              <td>
                <pre class="sp-code">{{ model || '&nbsp;' }}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  app-button
                  size="medium"
                  color="secondary-green"
                  (click)="model = ''"
                >
                  Reset
                </button>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  })
  .add('FormControl', () => {
    return {
      props: {
        formControl: new FormControl(''),
        value: text('Value', 'RadioButtonValue'),
        size: select('Size', [ 'large', 'small' ], 'large'),
        content: text('Content', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
      },
      template: `
        <div class="sp-section">
          <h1>FormControl</h1>
          <table class="sp-layout-table" style="width: 640px;">
            <tr>
              <td>
                <app-radio-button
                  [formControl]="formControl"
                  [size]="size"
                  [value]="value"
                >
                  {{ content }}
                </app-radio-button>
              </td>
            </tr>
            <tr>
              <td>
                <pre class="sp-code">{{ formControl.value || '&nbsp;' }}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  app-button
                  size="medium"
                  color="secondary-green"
                  (click)="formControl.reset('')"
                >
                  Reset
                </button>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  })
  .add('FormControlName', () => {
    return {
      props: {
        formGroup: new FormGroup({
          formControlName: new FormControl(''),
        }),
        value: text('Value', 'RadioButtonValue'),
        size: select('Size', [ 'large', 'small' ], 'large'),
        content: text('Content', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
      },
      template: `
        <div class="sp-section">
          <h1>FormControlName (FormControl inside FormGroup)</h1>
          <table class="sp-layout-table" style="width: 640px;">
            <tr>
              <td>
                <form [formGroup]="formGroup">
                  <app-radio-button
                    formControlName="formControlName"
                    [size]="size"
                    [value]="value"
                  >
                    {{ content }}
                  </app-radio-button>
                </form>
              </td>
            </tr>
            <tr>
              <td>
                <pre class="sp-code">{{ formGroup.value | json }}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  app-button
                  size="medium"
                  color="secondary-green"
                  (click)="formGroup.reset({ formControlName: '' })"
                >
                  Reset
                </button>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  });
