import {
  storiesOf,
  moduleMetadata,
} from '@storybook/angular';
import {
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';

import { PipesModule } from '../../pipes/pipes.module';

import { TagComponent } from './tag.component';

const MODULE_METADATA = moduleMetadata({
  imports: [
    PipesModule,
  ],
  declarations: [
    TagComponent,
  ],
});

storiesOf('Tag', module)
  .addDecorator(withKnobs)
  .addDecorator(MODULE_METADATA)
  .add('Styleguide', () => {
    return {
      template: `
        <div class="sp-section">
          <h1>Color</h1>
          <table class="sp-layout-table">
            <tr>
              <td>
                <app-tag color="light">Light</app-tag>
              </td>
            </tr>
            <tr>
              <td>
                <app-tag color="dark">Dark</app-tag>
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
        color: select('Color', [ 'light', 'dark' ], 'light'),
        content: text('Content', 'Tag'),
      },
      template: `
        <div class="sp-section">
          <h1>Playground</h1>
          <table class="sp-layout-table">
            <tr>
              <td>
                <app-tag [color]="color">{{ content }}</app-tag>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  });
