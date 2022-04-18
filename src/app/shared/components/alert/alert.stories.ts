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

import { IconsModule } from '../../icons/icons.module';
import { PipesModule } from '../../pipes/pipes.module';

import { AlertComponent } from './alert.component';

const MODULE_METADATA = moduleMetadata({
  imports: [
    CommonModule,

    IconsModule,
    PipesModule,
  ],
  declarations: [
    AlertComponent,
  ],
});

storiesOf('Alert', module)
  .addDecorator(withKnobs)
  .addDecorator(MODULE_METADATA)
  .add('Styleguide', () => {
    return {
      props: {
        types: [
          'success',
          'error',
        ],
      },
      template: `
        <div class="sp-section">
          <h1>Type</h1>
          <table class="sp-layout-table" style="width: 640px;">
            <tr *ngFor="let type of types">
              <td>
                <app-alert [type]="type">
                  <div class="sp-capitalized">{{ type }}</div>
                </app-alert>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  })
  .add('Playground', () => {
    return {
      props: {
        type: select('Type', [ 'success', 'error' ], 'success'),
        content: text('Content', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'),
      },
      template: `
        <div class="sp-section">
          <h1>Playground</h1>
          <table class="sp-layout-table" style="width: 640px;">
            <tr>
              <td>
                <app-alert [type]="type">{{ content }}</app-alert>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  });
