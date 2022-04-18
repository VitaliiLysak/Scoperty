import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LandingPagesModule } from '../../../shared/components/landing-pages/landing-pages.module';

import { PropertyValuationRoutingModule } from './property-valuation-routing.module';
import { PropertyValuationComponent } from './pages/property-valuation/property-valuation.component';

@NgModule({
  imports: [
    CommonModule,

    PropertyValuationRoutingModule,
    LandingPagesModule,
  ],
  declarations: [
    PropertyValuationComponent,
  ],
})
export class PropertyValuationModule {}
