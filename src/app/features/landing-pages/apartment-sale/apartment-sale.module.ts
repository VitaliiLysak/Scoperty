import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { LandingPagesModule } from '../../../shared/components/landing-pages/landing-pages.module';

import { ApartmentSaleComponent } from './page/apartment-sale.component';
import { ApartmentSaleRoutingModule } from './apartment-sale-routing.module';

@NgModule({
  imports: [
    CommonModule,

    ApartmentSaleRoutingModule,
    LandingPagesModule,
    SharedModule,
  ],
  declarations: [
    ApartmentSaleComponent
  ]
})
export class ApartmentSaleModule { }
