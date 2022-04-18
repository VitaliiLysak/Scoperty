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
import { RadioButtonComponent } from '../radio-button/radio-button.component';
import { IconsModule } from '../../icons/icons.module';
import { PipesModule } from '../../pipes/pipes.module';

import { RadioGroupComponent } from './radio-group.component';

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
    RadioGroupComponent,
  ],
});

storiesOf('Radio/RadioGroup/Playground', module)
  .addDecorator(withKnobs)
  .addDecorator(MODULE_METADATA)
  .add('NgModel', () => {
    return {
      props: {
        model: '',
        value1: text('Value1', 'RadioGroupValue #1'),
        value2: text('Value2', 'RadioGroupValue #2'),
        value3: text('Value3', 'RadioGroupValue #3'),
        size: select('Size', [ 'large', 'small' ], 'large'),
        content1: text('Content1', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
        content2: text('Content2', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
        content3: text('Content3', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
      },
      template: `
        <div class="sp-section">
          <h1>NgModel</h1>
          <table class="sp-layout-table" style="width: 640px;">
            <tr>
              <td>
                <app-radio-group [(ngModel)]="model" [size]="size">
                  <app-radio-button [value]="value1">
                    {{ content1 }}
                  </app-radio-button>

                  <app-radio-button [value]="value2">
                    {{ content2 }}
                  </app-radio-button>

                  <app-radio-button [value]="value3">
                    {{ content3 }}
                  </app-radio-button>
                </app-radio-group>
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
        value1: text('Value1', 'RadioGroupValue #1'),
        value2: text('Value2', 'RadioGroupValue #2'),
        value3: text('Value3', 'RadioGroupValue #3'),
        size: select('Size', [ 'large', 'small' ], 'large'),
        content1: text('Content1', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
        content2: text('Content2', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
        content3: text('Content3', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
      },
      template: `
        <div class="sp-section">
          <h1>FormControl</h1>
          <table class="sp-layout-table" style="width: 640px;">
            <tr>
              <td>
                <app-radio-group [formControl]="formControl" [size]="size">
                  <app-radio-button [value]="value1">
                    {{ content1 }}
                  </app-radio-button>

                  <app-radio-button [value]="value2">
                    {{ content2 }}
                  </app-radio-button>

                  <app-radio-button [value]="value3">
                    {{ content3 }}
                  </app-radio-button>
                </app-radio-group>
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
        value1: text('Value1', 'RadioGroupValue #1'),
        value2: text('Value2', 'RadioGroupValue #2'),
        value3: text('Value3', 'RadioGroupValue #3'),
        size: select('Size', [ 'large', 'small' ], 'large'),
        content1: text('Content1', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
        content2: text('Content2', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
        content3: text('Content3', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
      },
      template: `
        <div class="sp-section">
          <h1>FormControlName (FormControl inside FormGroup)</h1>
          <table class="sp-layout-table" style="width: 640px;">
            <tr>
              <td>
                <form [formGroup]="formGroup">
                  <app-radio-group formControlName="formControlName" [size]="size">
                    <app-radio-button [value]="value1">
                      {{ content1 }}
                    </app-radio-button>
  
                    <app-radio-button [value]="value2">
                      {{ content2 }}
                    </app-radio-button>
  
                    <app-radio-button [value]="value3">
                      {{ content3 }}
                    </app-radio-button>
                  </app-radio-group>
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
