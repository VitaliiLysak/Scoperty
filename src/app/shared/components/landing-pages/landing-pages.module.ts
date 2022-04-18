import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';

import { NgxMultiModalModule } from 'ngx-multi-modal';

import { SharedModule } from '../../shared.module';

import {
  PropertyValuationAdvertisementMessageComponent
} from './property-valuation-advertisement-message/property-valuation-advertisement-message.component';
import {
  PropertyValuationAdvertisePropertyComponent
} from './property-valuation-advertise-property/property-valuation-advertise-property.component';
import {
  PropertyValuationDiscoverMarketValueComponent
} from './property-valuation-discover-market-value/property-valuation-discover-market-value.component';
import {
  PropertyValuationEasePropertySellComponent
} from './property-valuation-ease-property-sell/property-valuation-ease-property-sell.component';
import { PropertyValuationHowItWorksComponent } from './property-valuation-how-it-works/property-valuation-how-it-works.component';
import {
  PropertyValuationMarketValueDeterminationComponent
} from './property-valuation-market-value-determination/property-valuation-market-value-determination.component';
import { PropertyValuationRegisterNowComponent } from './property-valuation-register-now/property-valuation-register-now.component';
import { PropertyValuationSearchBrokerComponent } from './property-valuation-search-broker/property-valuation-search-broker.component';
import { PropertyValuationTeaserComponent } from './property-valuation-teaser/property-valuation-teaser.component';
import {
  PropertyValuationTransparencyWithScopertyComponent
} from './property-valuation-transparency-with-scoperty/property-valuation-transparency-with-scoperty.component';
import {
  PropertyValuationWePayPhotographComponent
} from './property-valuation-we-pay-photograph/property-valuation-we-pay-photograph.component';
import { FamousCompaniesSectionComponent } from './famous-companies-section/famous-companies-section.component';

const COMPONENTS: any[] = [
  PropertyValuationAdvertisementMessageComponent,
  PropertyValuationAdvertisePropertyComponent,
  PropertyValuationDiscoverMarketValueComponent,
  PropertyValuationEasePropertySellComponent,
  PropertyValuationHowItWorksComponent,
  PropertyValuationMarketValueDeterminationComponent,
  PropertyValuationRegisterNowComponent,
  PropertyValuationTeaserComponent,
  PropertyValuationTransparencyWithScopertyComponent,
  PropertyValuationWePayPhotographComponent,
  FamousCompaniesSectionComponent,
];

const ENTRY_COMPONENTS: any[] = [
  PropertyValuationSearchBrokerComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,

    NgxMultiModalModule.forRoot({
      backdrop: true,
      container: 'body',
      windowClass: 'ngx-multi-modal',
    }),

    SharedModule
  ],
  exports: [
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
  ],
  declarations: [
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
  ],
  entryComponents: [
    ENTRY_COMPONENTS,
  ],
})
export class LandingPagesModule {
}
