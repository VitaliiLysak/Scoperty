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

import { OptionComponent } from './option.component';

const MODULE_METADATA = moduleMetadata({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    IconsModule,
    PipesModule,
  ],
  declarations: [
    OptionComponent,
    ButtonComponent,
    IconButtonComponent,
  ],
});

storiesOf('Option/Playground', module)
  .addDecorator(withKnobs)
  .addDecorator(MODULE_METADATA)
  .add('NgModel', () => {
    return {
      props: {
        modelLeft: false,
        modelRight: false,
        labelLeft: text('Left Label', 'Lorem ipsum'),
        labelRight: text('Right Label', 'Dolor sit amet'),
        size: select('Size', [ 'large', 'small' ], 'large'),
      },
      template: `
        <div class="sp-section">
          <h1>NgModel</h1>
          <table class="sp-layout-table">
            <tr>
              <td>
                <app-option
                  [(ngModel)]="modelLeft"
                  [label]="labelLeft"
                  [size]="size"
                ></app-option>
              </td>
              <td>
                <app-option
                  [(ngModel)]="modelRight"
                  [label]="labelRight"
                  [size]="size"
                ></app-option>
              </td>
            </tr>
            <tr>
              <td>
                <pre class="sp-code">{{ modelLeft }}</pre>
              </td>
              <td>
                <pre class="sp-code">{{ modelRight }}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  app-button
                  size="medium"
                  color="secondary-green"
                  (click)="modelLeft = false; modelRight = false"
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
        formControlLeft: new FormControl(false),
        formControlRight: new FormControl(false),
        labelLeft: text('Left Label', 'Lorem ipsum'),
        labelRight: text('Right Label', 'Dolor sit amet'),
        size: select('Size', [ 'large', 'small' ], 'large'),
      },
      template: `
        <div class="sp-section">
          <h1>FormControl</h1>
          <table class="sp-layout-table">
            <tr>
              <td>
                <app-option
                  [formControl]="formControlLeft"
                  [label]="labelLeft"
                  [size]="size"
                ></app-option>
              </td>
              <td>
                <app-option
                  [formControl]="formControlRight"
                  [label]="labelRight"
                  [size]="size"
                ></app-option>
              </td>
            </tr>
            <tr>
              <td>
                <pre class="sp-code">{{ formControlLeft.value }}</pre>
              </td>
              <td>
                <pre class="sp-code">{{ formControlRight.value }}</pre>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  app-button
                  size="medium"
                  color="secondary-green"
                  (click)="formControlLeft.reset(false); formControlRight.reset(false)"
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
          formControlNameLeft: new FormControl(false),
          formControlNameRight: new FormControl(false),
        }),
        labelLeft: text('Left Label', 'Lorem ipsum'),
        labelRight: text('Right Label', 'Dolor sit amet'),
        size: select('Size', [ 'large', 'small' ], 'large'),
      },
      template: `
        <div class="sp-section">
          <form [formGroup]="formGroup">
            <h1>FormControlName (FormControl inside FormGroup)</h1>
            <table class="sp-layout-table">
              <tr>
                <td>
                   <app-option
                      formControlName="formControlNameLeft"
                      [label]="labelLeft"
                      [size]="size"
                    ></app-option>
                </td>
                <td>
                   <app-option
                      formControlName="formControlNameRight"
                      [label]="labelRight"
                      [size]="size"
                    ></app-option>
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
                    (click)="formGroup.reset({ formControlNameLeft: false, formControlNameRight: false })"
                  >
                    Reset
                  </button>
                </td>
              </tr>
            </table>
          </form>
        </div>
      `,
    };
  });
