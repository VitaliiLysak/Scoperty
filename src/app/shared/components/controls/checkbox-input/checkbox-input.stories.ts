import {
  storiesOf,
  moduleMetadata,
} from '@storybook/angular';
import {
  text,
  select,
  withKnobs,
} from '@storybook/addon-knobs/angular';

import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { PipesModule } from '../../../pipes/pipes.module';
import { IconsModule } from '../../../icons/icons.module';
import { ButtonComponent } from '../../../components/button/button.component';
import { IconButtonComponent } from '../../../components/icon-button/icon-button.component';

import { CheckboxInputComponent } from './checkbox-input.component';

const MODULE_METADATA = moduleMetadata({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    IconsModule,
    PipesModule,
  ],
  declarations: [
    CheckboxInputComponent,
    ButtonComponent,
    IconButtonComponent,
  ],
});

storiesOf('CheckboxInput/Playground', module)
  .addDecorator(withKnobs)
  .addDecorator(MODULE_METADATA)
  .add('NgModel', () => {
    return {
      props: {
        model: false,
        size: select('Size', [ 'large', 'small', 'mini' ], 'large'),
        content: text('Content', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
      },
      template: `
        <div class="sp-section">
          <h1>NgModel</h1>
          <table class="sp-layout-table" style="width: 640px;">
            <tr>
              <td>
                <app-checkbox-input
                [(ngModel)]="model"
                [size]="size"
                >
                  {{ content }}
                </app-checkbox-input>
              </td>
            </tr>
            <tr>
              <td>
                <pre class="sp-code">{{ model }}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  app-button
                  size="medium"
                  color="secondary-green"
                  (click)="model = false"
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
        formControl: new FormControl(false),
        size: select('Size', [ 'large', 'small', 'mini' ], 'large'),
        content: text('Content', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
      },
      template: `
        <div class="sp-section">
          <h1>FormControl</h1>
          <table class="sp-layout-table" style="width: 640px;">
            <tr>
              <td>
                <app-checkbox-input
                [formControl]="formControl"
                [size]="size"
                >
                  {{ content }}
                </app-checkbox-input>
              </td>
            </tr>
            <tr>
              <td>
                <pre class="sp-code">{{ formControl.value }}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  app-button
                  size="medium"
                  color="secondary-green"
                  (click)="formControl.reset(false)"
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
          formControlName: new FormControl(false),
        }),
        size: select('Size', [ 'large', 'small', 'mini' ], 'large'),
        content: text('Content', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
      },
      template: `
        <div class="sp-section">
          <h1>FormControlName (FormControl inside FormGroup)</h1>
          <table class="sp-layout-table" style="width: 640px;">
            <tr>
              <td>
                <form [formGroup]="formGroup">
                  <app-checkbox-input
                    formControlName="formControlName"
                    [size]="size"
                   >
                    {{ content }}
                   </app-checkbox-input>
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
                  (click)="formGroup.reset({ formControlName: false })"
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

