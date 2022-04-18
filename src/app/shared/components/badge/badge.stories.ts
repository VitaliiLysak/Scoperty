import {
  storiesOf,
  moduleMetadata,
} from '@storybook/angular';
import {
  number,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';

import { PipesModule } from '../../pipes/pipes.module';

import { BadgeComponent } from './badge.component';

const MODULE_METADATA = moduleMetadata({
  imports: [
    PipesModule,
  ],
  declarations: [
    BadgeComponent,
  ],
});

storiesOf('Badge', module)
  .addDecorator(withKnobs)
  .addDecorator(MODULE_METADATA)
  .add('Playground', () => {
    return {
      props: {
        rotate: number('Rotate', 10, {
          range: true,
          min: -90,
          max: 90,
          step: 1,
        }),
        text: text('Text', 'Lorem ipsum dolor sit amet, consetetur sadipscing'),
        getRotate: (angle: number) => {
          return `${ angle }deg`;
        },
      },
      template: `
        <div class="sp-section">
          <h1>Playground</h1>
          <table class="sp-layout-table">
            <tr>
              <td>
                <app-badge [text]="text" [rotate]="getRotate(rotate)"></app-badge>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  });
