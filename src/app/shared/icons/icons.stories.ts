import {
  storiesOf,
  moduleMetadata,
} from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { DirectivesModule } from '../directives/directives.module';

import { SVG_ICONS } from './icons';
import { IconsModule } from './icons.module';

const MODULE_METADATA = moduleMetadata({
  imports: [
    CommonModule,

    IconsModule,
    DirectivesModule,
  ],
});

function arrayTo2DArray<T>(array: T[], length: number): T[][] {
  const result = [];
  for (let i = 0; i < (array.length / length); i++) {
    result.push(array.slice(i * length, (i * length) + length));
  }

  return result;
}

const NUMBER_OF_COLUMNS = 6;

storiesOf('Icon', module)
  .addDecorator(MODULE_METADATA)
  .add('Icons', () => {
    return {
      props: {
        iconGroups: arrayTo2DArray(SVG_ICONS, NUMBER_OF_COLUMNS),
        cellWidth: `${ 100 / NUMBER_OF_COLUMNS }%`,
      },
      template: `
        <div class="sp-section">
          <h1>Icons</h1>
          <table class="sp-table" style="width: 80%;">
            <tr *ngFor="let iconGroup of iconGroups">
              <td
                *ngFor="let icon of iconGroup"
                align="center"
                [style.width]="cellWidth"
                style="flex-direction: column;"
              >
                <mat-icon [svgIcon]="icon" appSvgSize="64px"></mat-icon>
                <div style="margin-top: 8px;">
                  {{ icon }}
                </div>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  })
  .add('Styleguide', () => {
    return {
      props: {
        icons: SVG_ICONS,
        sections: [
          {
            title: 'Red 24px',
            color: 'red',
            size: '24px',
          },
          {
            title: 'Blue 48px',
            color: 'blue',
            size: '48px',
          },
          {
            title: 'Green 96px',
            color: 'green',
            size: '96px',
          },
        ],
      },
      template: `
        <div *ngFor="let section of sections" class="sp-section">
          <h1>{{ section.title }}</h1>
          <ul class="sp-layout-list" style="width: 80%;">
            <li *ngFor="let icon of icons" [style.color]="section.color">
              <mat-icon
                [svgIcon]="icon"
                [appSvgSize]="section.size"
                class="sp-bounding-box"
              ></mat-icon>
            </li>
          </ul>
        </div>
      `,
    };
  });
