import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NouisliderModule } from 'ng2-nouislider';
import { TextMaskModule } from 'angular2-text-mask';

import { SharedModule } from '../../shared/shared.module';

import { StartPageRoutingModule } from './start-page-routing.module';
import { StartPageFindBrokerComponent } from './components/start-page-find-broker/start-page-find-broker.component';
import { StartPagePromoComponent } from './components/start-page-promo/start-page-promo.component';
import { StartPageCalculateMortgageComponent } from './components/start-page-calculate-mortgage/start-page-calculate-mortgage.component';
import { StartPageHeaderComponent } from './components/start-page-header/start-page-header.component';
import { StartPageHowItWorksComponent } from './components/start-page-how-it-works/start-page-how-it-works.component';
import { StartPageBuyPropertyComponent } from './components/start-page-buy-property/start-page-buy-property.component';
import { StartPageSloganComponent } from './components/start-page-slogan/start-page-slogan.component';
import { StartPageOwnerBenefitsComponent } from './components/start-page-owner-benefits/start-page-owner-benefits.component';
import { StartPageOwnerBenefitsItemComponent } from './components/start-page-owner-benefits-item/start-page-owner-benefits-item.component';
import { StartPageSellPropertyComponent } from './components/start-page-sell-property/start-page-sell-property.component';
import { StartPageTabsDescriptionComponent } from './components/start-page-tabs-description/start-page-tabs-description.component';
import { StartPageComponent } from './pages/start-page/start-page.component';
import { StartPageCitiesComponent } from './components/start-page-cities/start-page-cities.component';

const COMPONENTS: any[] = [
  StartPagePromoComponent,
  StartPageCalculateMortgageComponent,
  StartPageComponent,
  StartPageFindBrokerComponent,
  StartPageHeaderComponent,
  StartPageHowItWorksComponent,
  StartPageSloganComponent,
  StartPageOwnerBenefitsComponent,
  StartPageOwnerBenefitsItemComponent,
  StartPageSellPropertyComponent,
  StartPageBuyPropertyComponent,
  StartPageTabsDescriptionComponent,
  StartPageCitiesComponent,
];

const ENTRY_COMPONENTS: any[] = [
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NouisliderModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,

    SharedModule,
    StartPageRoutingModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ]
})
export class StartPageModule {
}
