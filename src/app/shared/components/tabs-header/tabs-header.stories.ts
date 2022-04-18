import { action } from '@storybook/addon-actions';
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

import { TabsHeaderComponent } from './tabs-header.component';
import { TabsHeaderTabDirective } from './tabs-header-tab.directive';
import { TabsHeaderTabComponent } from './tabs-header-tab/tabs-header-tab.component';

const MODULE_METADATA = moduleMetadata({
  imports: [
    PipesModule,
  ],
  declarations: [
    TabsHeaderComponent,
    TabsHeaderTabDirective,
    TabsHeaderTabComponent,
  ],
});

type Tab = 'tab1' | 'tab2';
const state = {
  activeTab: 'tab2',
};

storiesOf('TabsHeader', module)
  .addDecorator(withKnobs)
  .addDecorator(MODULE_METADATA)
  .add('Playground', () => {
    return {
      theme: null,
      props: {
        state,
        theme: select('Theme', [ 'light', 'dark' ], 'light'),
        tab1Content: text('Tab #1 content', 'Lorem ipsum'),
        tab2Content: text('Tab #2 content', 'Dolor sit amet'),
        activeTabChange: (tabName: Tab) => {
          state.activeTab = tabName;
        },
      },
      template: `
        <div class="sp-section">
          <h1>Playground</h1>
          <table class="sp-layout-table">
            <tr>
              <td style="width: 480px;">
                <app-tabs-header
                  [theme]="theme"
                  [activeTab]="state.activeTab"
                  (activeTabChange)="activeTabChange($event)"
                  style="width: 100%;"
                >
                  <ng-template appTabsHeaderTab name="tab1">
                    {{ tab1Content }}
                  </ng-template>
                  <ng-template appTabsHeaderTab name="tab2">
                    {{ tab2Content }}
                  </ng-template>
                </app-tabs-header>

                <div style="padding: 16px;">
                  <p *ngIf="state.activeTab === 'tab1'">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <p *ngIf="state.activeTab === 'tab2'">
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  });
