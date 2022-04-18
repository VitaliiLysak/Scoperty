import {
  storiesOf,
  moduleMetadata,
} from '@storybook/angular';
import {
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';

import { IconButtonComponent } from '../icon-button/icon-button.component';
import { DirectivesModule } from '../../directives/directives.module';
import { IconsModule } from '../../icons/icons.module';
import { PipesModule } from '../../pipes/pipes.module';

import { ExpandablePanelComponent } from './expandable-panel.component';

const MODULE_METADATA = moduleMetadata({
  imports: [
    IconsModule,
    DirectivesModule,
    PipesModule,
  ],
  declarations: [
    IconButtonComponent,
    ExpandablePanelComponent,
  ],
});

storiesOf('ExpandablePanel', module)
  .addDecorator(withKnobs)
  .addDecorator(MODULE_METADATA)
  .add('Playground', () => {
    return {
      props: {
        heading: text('Heading', 'Lorem ipsum dolor sit amet'),
      },
      template: `
        <div class="sp-section">
          <h1>Playground</h1>
          <table class="sp-layout-table">
            <tr>
              <td style="width: 640px;">
                <app-expandable-panel [heading]="heading">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </app-expandable-panel>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  });
