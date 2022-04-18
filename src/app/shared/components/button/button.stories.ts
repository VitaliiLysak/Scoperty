import {
  storiesOf,
  moduleMetadata,
} from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { ApplyCssClassesService } from '../../services/apply-css-classes.service';

import { ButtonComponent } from './button.component';

const MODULE_METADATA = moduleMetadata({
  imports: [
    CommonModule,
  ],
  providers: [
    ApplyCssClassesService,
  ],
  declarations: [
    ButtonComponent,
  ],
});

storiesOf('Button', module)
  .addDecorator(MODULE_METADATA)
  .add('Styleguide', () => {
    return {
      props: {
        sections: [
          {
            title: 'Primary dark',
            color: 'primary-dark',
          },
          {
            title: 'Primary green',
            color: 'primary-green',
          },
          {
            title: 'Secondary dark',
            color: 'secondary-dark',
          },
          {
            title: 'Secondary dark',
            color: 'secondary-green',
          },
          {
            title: 'Primary red',
            color: 'primary-red',
          },
          {
            title: 'Delete',
            color: 'delete',
          },
          {
            title: 'Light blue',
            color: 'light-blue',
          },
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
                <button app-button [color]="section.color" size="small">Small</button>
              </td>
              <td>
                <button app-button [color]="section.color" size="small" [disabled]="true">Small</button>
              </td>
            </tr>
            <tr>
              <td>
                <button app-button [color]="section.color" size="medium">Medium</button>
              </td>
              <td>
                <button app-button [color]="section.color" size="medium" [disabled]="true">Medium</button>
              </td>
            </tr>
            <tr>
              <td>
                <button app-button [color]="section.color" size="large">Large</button>
              </td>
              <td>
                <button app-button [color]="section.color" size="large" [disabled]="true">Large</button>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  });
