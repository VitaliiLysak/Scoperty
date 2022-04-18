import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { LandingPagesModule } from '../../../shared/components/landing-pages/landing-pages.module';

import { PropertySaleComponent } from './page/property-sale.component';
import { PropertySaleRoutingModule } from './property-sale-routing.module';

@NgModule({
  imports: [
    CommonModule,

    PropertySaleRoutingModule,
    LandingPagesModule,
    SharedModule,
  ],
  declarations: [
    PropertySaleComponent
  ]
})
export class PropertySaleModule { }
