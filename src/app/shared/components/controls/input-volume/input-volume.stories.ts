import {
  storiesOf,
  moduleMetadata,
} from '@storybook/angular';
import {
  number,
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

import { InputVolumeComponent } from './input-volume.component';

const MODULE_METADATA = moduleMetadata({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    IconsModule,
    PipesModule,
  ],
  declarations: [
    InputVolumeComponent,
    ButtonComponent,
    IconButtonComponent,
  ],
});

storiesOf('InputVolume/Playground', module)
  .addDecorator(withKnobs)
  .addDecorator(MODULE_METADATA)
  .add('NgModel', () => {
    return {
      props: {
        model: 7,
        min: number('Min', 0),
        max: number('Max', 10),
      },
      template: `
        <div class="sp-section">
          <h1>NgModel</h1>
          <table class="sp-layout-table">
            <tr>
              <td>
                <app-input-volume
                  [(ngModel)]="model"
                  [min] = "min"
                  [max] = "max"
                ></app-input-volume>
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
                  (click)="model = 0"
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
        formControl: new FormControl(7),
        min: number('Min', 0),
        max: number('Max', 10),
      },
      template: `
        <div class="sp-section">
          <h1>FormControl</h1>
          <table class="sp-layout-table">
            <tr>
              <td>
                <app-input-volume
                  [formControl]="formControl"
                  [min] = "min"
                  [max] = "max"
                ></app-input-volume>
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
                  (click)="formControl.reset(0)"
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
          formControlName: new FormControl(7),
        }),
        min: number('Min', 0),
        max: number('Max', 10),
      },
      template: `
        <div class="sp-section">
          <h1>FormControlName (FormControl inside FormGroup)</h1>
          <table class="sp-layout-table">
            <tr>
              <td>
                <form [formGroup]="formGroup">
                  <app-input-volume
                    formControlName="formControlName"
                    [min] = "+min"
                    [max] = "+max"
                  ></app-input-volume>
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
                  (click)="formGroup.reset({ formControlName: 0 })"
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

