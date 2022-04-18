import {
  storiesOf,
  moduleMetadata,
} from '@storybook/angular';
import {
  boolean,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';

import { CommonModule } from '@angular/common';

import { AlertComponent } from '../alert/alert.component';
import { ButtonComponent } from '../button/button.component';
import { MobileNavbarComponent } from '../mobile-navbar/mobile-navbar.component';
import { LogoComponent } from '../logo/logo.component';
import { DirectivesModule } from '../../directives/directives.module';
import { IconsModule } from '../../icons/icons.module';
import { PipesModule } from '../../pipes/pipes.module';

import { BaseModalComponent } from './base-modal.component';
import {
  BaseModalActionsAlign,
  BaseModalActionsComponent,
} from './base-modal-actions/base-modal-actions.component';
import { BaseModalBodyDirective } from './base-modal-body.directive';
import { BaseModalFooterDirective } from './base-modal-footer.directive';
import { BaseModalHeaderDirective } from './base-modal-header.directive';
import { BaseModalIconDirective } from './base-modal-icon.directive';
import { BaseModalMessageDirective } from './base-modal-message.directive';
import { BaseModalTitleDirective } from './base-modal-title.directive';

const MODULE_METADATA = moduleMetadata({
  imports: [
    CommonModule,

    IconsModule,
    DirectivesModule,
    PipesModule,
  ],
  declarations: [
    AlertComponent,
    BaseModalComponent,
    BaseModalActionsComponent,
    BaseModalBodyDirective,
    BaseModalFooterDirective,
    BaseModalHeaderDirective,
    BaseModalIconDirective,
    BaseModalMessageDirective,
    BaseModalTitleDirective,
    ButtonComponent,
    MobileNavbarComponent,
    LogoComponent,
  ],
});

function createLayout4(actionsAlign: BaseModalActionsAlign) {
  return `
    <app-base-modal>
      <ng-container app-base-modal-body>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </ng-container>

      <ng-container app-base-modal-footer theme="dark">
        <app-base-modal-actions [align]="'${ actionsAlign }'">
          <button
            app-button
            color="secondary-green"
            size="medium"
          >
            Cancel
          </button>

          <button
            app-button
            color="primary-green"
            size="medium"
          >
            Submit
          </button>
        </app-base-modal-actions>
      </ng-container>
    </app-base-modal>
  `;
}

storiesOf('Modals/BaseModal', module)
  .addDecorator(withKnobs)
  .addDecorator(MODULE_METADATA)
  .add('Styleguide', () => {
    return {
      template: `
        <div class="sp-section">
          <h1>Layout 1</h1>
          <table class="sp-layout-table" style="width: 800px;">
            <tr>
              <td>
                <div style="padding: 20px 24px; background-color: rgba(0, 0, 0, 0.15);">
                  <app-base-modal>
                    <ng-container app-base-modal-header>
                      Lorem ipsum dolor sit amet
                    </ng-container>

                    <ng-container app-base-modal-title>
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr
                    </ng-container>

                    <ng-container app-base-modal-body>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </ng-container>

                    <ng-container app-base-modal-footer>
                      <app-base-modal-actions>
                        <button
                          app-button
                          color="primary-green"
                          size="medium"
                          [stretch]="true"
                        >
                          Submit
                        </button>

                        <button
                          app-button
                          color="secondary-green"
                          size="medium"
                          [stretch]="true"
                        >
                          Cancel
                        </button>
                      </app-base-modal-actions>
                    </ng-container>
                  </app-base-modal>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div class="sp-section">
          <h1>Layout 2</h1>
          <table class="sp-layout-table" style="width: 800px;">
            <tr>
              <td>
                <div style="padding: 20px 24px; background-color: rgba(0, 0, 0, 0.15);">
                  <app-base-modal>
                    <ng-container app-base-modal-header align="left">
                      Lorem ipsum dolor sit amet
                    </ng-container>

                    <ng-container app-base-modal-title align="left">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr
                    </ng-container>

                    <ng-container app-base-modal-body>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </ng-container>

                    <ng-container app-base-modal-footer>
                      <app-base-modal-actions>
                        <button
                          app-button
                          color="primary-green"
                          size="medium"
                          [stretch]="true"
                        >
                          Submit
                        </button>

                        <button
                          app-button
                          color="secondary-green"
                          size="medium"
                          [stretch]="true"
                        >
                          Cancel
                        </button>
                      </app-base-modal-actions>
                    </ng-container>
                  </app-base-modal>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div class="sp-section">
          <h1>Layout 3</h1>
          <table class="sp-layout-table" style="width: 800px;">
            <tr>
              <td>
                <div style="padding: 20px 24px; background-color: rgba(0, 0, 0, 0.15);">
                  <app-base-modal>
                    <ng-container app-base-modal-title>
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr
                    </ng-container>

                    <ng-container app-base-modal-body>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </ng-container>

                    <ng-container app-base-modal-footer>
                      <app-base-modal-actions>
                        <button
                          app-button
                          color="secondary-green"
                          size="medium"
                        >
                          Submit
                        </button>
                      </app-base-modal-actions>
                    </ng-container>
                  </app-base-modal>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div class="sp-section">
          <h1>Layout 4</h1>
          <table class="sp-layout-table" style="width: 800px;">
            <tr>
              <td>
                <div style="padding: 20px 24px; background-color: rgba(0, 0, 0, 0.15);">
                  ${ createLayout4('center') }
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div class="sp-section">
          <h1>Layout 4 - Actions <strong>align="space-between"</strong></h1>
          <table class="sp-layout-table" style="width: 800px;">
            <tr>
              <td>
                <div style="padding: 20px 24px; background-color: rgba(0, 0, 0, 0.15);">
                  ${ createLayout4('space-between') }
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div class="sp-section">
          <h1>Layout 4 - Actions <strong>align="left"</strong></h1>
          <table class="sp-layout-table" style="width: 800px;">
            <tr>
              <td>
                <div style="padding: 20px 24px; background-color: rgba(0, 0, 0, 0.15);">
                  ${ createLayout4('left') }
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div class="sp-section">
          <h1>Layout 4 - Actions <strong>align="right"</strong></h1>
          <table class="sp-layout-table" style="width: 800px;">
            <tr>
              <td>
                <div style="padding: 20px 24px; background-color: rgba(0, 0, 0, 0.15);">
                  ${ createLayout4('right') }
                </div>
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
        narrowSpacings: boolean('Narrow spacings', false),

        hasHeader: boolean('Header', true),
        headerAlign: select('Header align', [ 'left', 'center' ], 'center'),
        headerContent: text('Header content', 'Lorem ipsum dolor sit amet'),

        hasMessage: boolean('Message', true),
        messageType: select('Message type', [ 'success', 'error' ], 'success'),
        messageContent: text('Title content', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr'),

        hasTitle: boolean('Title', true),
        titleAlign: select('Title align', [ 'left', 'center' ], 'center'),
        titleContent: text('Title content', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr'),

        hasIcon: boolean('Icon', true),
        svgIcon: select('SVG icon', [ 'tick', 'add', 'favorite_outline' ], 'tick'),

        bodyContent: text('Body content', `
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        `),

        hasFooter: boolean('Footer', true),
        footerTheme: select('Footer theme', [ 'light', 'dark' ], 'light'),
        actionsStretched: boolean('Actions stretched', true),
        actionsAlign: select('Actions align', [ 'left', 'center', 'right', 'space-between' ], 'center'),
        action1Content: text('Action1 content', 'Submit'),
        action2Content: text('Action2 content', 'Cancel'),
      },
      template: `
        <div class="sp-section">
          <h1>Playground</h1>
          <table class="sp-layout-table" style="width: 800px;">
            <tr>
              <td>
                <div style="padding: 20px 24px; background-color: rgba(0, 0, 0, 0.15);">
                  <app-base-modal [narrowSpacings]="narrowSpacings">
                    <ng-container *ngIf="hasHeader" app-base-modal-header [align]="headerAlign">
                      {{ headerContent }}
                    </ng-container>

                    <ng-container *ngIf="hasMessage" app-base-modal-message>
                      <app-alert [type]="messageType">
                        {{ messageContent }}
                      </app-alert>
                    </ng-container>

                    <ng-container *ngIf="hasTitle" app-base-modal-title [align]="titleAlign">
                      {{ titleContent }}
                    </ng-container>

                    <ng-container *ngIf="hasIcon" app-base-modal-icon>
                      <mat-icon [svgIcon]="svgIcon" appSvgSize="48px" [style.color]="'hsl(174, 92%, 36%)'"></mat-icon>
                    </ng-container>

                    <ng-container app-base-modal-body>
                      {{ bodyContent }}
                    </ng-container>

                    <ng-container *ngIf="hasFooter" app-base-modal-footer [theme]="footerTheme">
                      <app-base-modal-actions [align]="actionsAlign">
                        <button
                          app-button
                          color="primary-green"
                          size="medium"
                          [stretch]="actionsStretched"
                        >
                          {{ action1Content }}
                        </button>

                        <button
                          app-button
                          color="secondary-green"
                          size="medium"
                          [stretch]="actionsStretched"
                        >
                          {{ action2Content }}
                        </button>
                      </app-base-modal-actions>
                    </ng-container>
                  </app-base-modal>
                </div>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  });
