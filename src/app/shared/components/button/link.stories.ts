import {
  storiesOf,
  moduleMetadata,
} from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { ApplyCssClassesService } from '../../services/apply-css-classes.service';

import {
  AnchorComponent,
  ButtonComponent,
} from './button.component';

const MODULE_METADATA = moduleMetadata({
  imports: [
    CommonModule,
  ],
  providers: [
    ApplyCssClassesService,
  ],
  declarations: [
    AnchorComponent,
    ButtonComponent,
  ],
});

storiesOf('Link', module)
  .addDecorator(MODULE_METADATA)
  .add('Styleguide', () => {
    return {
      props: {
        sections: [
          {
            title: 'Dark',
            color: 'dark',
          },
          {
            title: 'Green',
            color: 'green',
          },
          {
            title: 'Light blue',
            color: 'light-blue',
          },
        ],
        fontSizes: [
          '12px',
          '16px',
          '24px',
          '32px',
        ],
      },
      template: `
        <div *ngFor="let section of sections; index as i" class="sp-section">
          <h1>{{ section.title }}</h1>
          <table class="sp-layout-table">
            <tr>
              <th>Default</th>
              <th>Disabled</th>
            </tr>
            <tr>
              <td>
                <button app-button buttonStyle="link" [color]="section.color" size="small">Small</button>
              </td>
              <td>
                <button app-button buttonStyle="link" [color]="section.color" size="small" [disabled]="true">Small</button>
              </td>
            </tr>
            <tr>
              <td>
                <button app-button buttonStyle="link" [color]="section.color" size="medium">Medium</button>
              </td>
              <td>
                <button app-button buttonStyle="link" [color]="section.color" size="medium" [disabled]="true">Medium</button>
              </td>
            </tr>
            <tr>
              <td>
                <button app-button buttonStyle="link" [color]="section.color" size="large">Large</button>
              </td>
              <td>
                <button app-button buttonStyle="link" [color]="section.color" size="large" [disabled]="true">Large</button>
              </td>
            </tr>
          </table>
        </div>

        <div class="sp-section">
          <h1>Inline green</h1>
          <table class="sp-layout-table">
            <tr *ngFor="let fontSize of fontSizes">
              <td [style.fontSize]="fontSize">
                Es gelten unsere <a app-button buttonStyle="link" color="inline-green">Nutzungsbedingungen</a>
                und <a app-button buttonStyle="link" color="inline-green">Datenschutzerklärung</a>.
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  });
