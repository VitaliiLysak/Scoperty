import {
  storiesOf,
  moduleMetadata,
} from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import {
  boolean,
  select,
  text,
  withKnobs,
} from '@storybook/addon-knobs/angular';

import { ButtonComponent } from '../button/button.component';
import { PipesModule } from '../../pipes/pipes.module';
import { AppLocaleProvider } from '../../../app-locale.provider';
import { ExtendedMarkerModel } from '../../../core/models/extended-marker.model';
import { IImage } from '../../../core/models/image.model';
import { ExtendedMarkerModelValidatorService } from '../../../core/services/extended-marker-model-validator.service';
import { LoggerProvider } from '../../../core/services/logger/logger.provider';

import { ValuatePropertyGaugeComponent } from './valuate-property-gauge.component';

const MODULE_METADATA = moduleMetadata({
  imports: [
    PipesModule,
  ],
  providers: [
    AppLocaleProvider,
    ExtendedMarkerModelValidatorService,
    LoggerProvider,
  ],
  declarations: [
    ButtonComponent,
    ValuatePropertyGaugeComponent,
  ],
});

function createProperty1(): ExtendedMarkerModel {
  const property: ExtendedMarkerModel = new ExtendedMarkerModel();
  property.RoomsNumber = 3;
  property.FloorNumber = 2;

  return property;
}

function createProperty2(): ExtendedMarkerModel {
  const property: ExtendedMarkerModel = new ExtendedMarkerModel();
  property.Title = 'Title';
  property.RoomsNumber = 2;
  property.LastModernisationYear = '1920';
  property.Floor = 1;
  property.FloorNumber = 10;
  property.Rented = true;
  property.OldProperty = false;
  property.LeaseHold = false;
  property.HistoricalProperty = true;
  property.EstimatedPrice = 123000;

  return property;
}

function createProperty3(): ExtendedMarkerModel {
  const property: ExtendedMarkerModel = new ExtendedMarkerModel();
  property.LivingSurface = 100;
  property.ConstructionYear = '1890';
  property.RoomsNumber = 2;
  property.Images = [ {} as IImage, {} as IImage ];
  property.Garden = false;
  property.TotalArea = 1000;
  property.LastModernisationYear = '1920';
  property.PropertyCondition = 'Erstbezug';
  property.PropertySubType = 'SubType';
  property.Floor = 1;
  property.FloorNumber = 10;
  property.Rented = true;
  property.OldProperty = false;
  property.LeaseHold = false;
  property.HistoricalProperty = true;
  property.Title = 'Title';
  property.EnergyCertificateStatus = 'Energieausweis liegt vor';
  property.EnergyCertificateType = 'Bedarfsausweis';
  property.EnergyConsumptionClass = 'D';
  property.EstimatedPrice = 1100071;

  return property;
}

enum Properties {
  Property1 = 'Property #1',
  Property2 = 'Property #2',
  Property3 = 'Property #3',
}

const propertiesMap: { [ key: string ]: ExtendedMarkerModel } = {
  [ Properties.Property1 ]: createProperty1(),
  [ Properties.Property2 ]: createProperty2(),
  [ Properties.Property3 ]: createProperty3(),
};

storiesOf('ValuateProperty', module)
  .addDecorator(withKnobs)
  .addDecorator(MODULE_METADATA)
  .add('Playground', () => {
    return {
      props: {
        hasHeading: boolean('Heading', true),
        heading: text('Heading content', 'Lorem ipsum dolor sit amet'),
        getHeading: (hasHeading: boolean, heading: string): string => {
          return hasHeading ? heading : '';
        },
        property: select('Property', [ ...Object.values(Properties) ], Properties.Property1),
        getProperty(key: string): ExtendedMarkerModel {
          return propertiesMap[key];
        },
        buttonLabel: text('Button label', 'Consetetur sadipscing'),
        buttonStretch: boolean('Button stretch', false),
        buttonClick: action('buttonClick()'),
      },
      template: `
        <div class="sp-section">
          <h1>Playground</h1>
          <table class="sp-layout-table">
            <tr>
              <td style="width: 480px;">
                <app-valuate-property
                  [heading]="getHeading(hasHeading, heading)"
                  [property]="getProperty(property)"
                  [buttonLabel]="buttonLabel"
                  [buttonStretch]="buttonStretch"
                  (buttonClick)="buttonClick()"
                 ></app-valuate-property>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  });
