import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { LandingPagesModule } from '../../../shared/components/landing-pages/landing-pages.module';

import { HouseSaleComponent } from './page/house-sale.component';
import { HouseSaleRoutingModule } from './house-sale-routing.module';

@NgModule({
  imports: [
    CommonModule,

    HouseSaleRoutingModule,
    LandingPagesModule,
    SharedModule,
  ],
  declarations: [
    HouseSaleComponent
  ]
})
export class HouseSaleModule { }
