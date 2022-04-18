import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { LandingPagesModule } from '../../../shared/components/landing-pages/landing-pages.module';

import { PropertyAdvertisementComponent } from './page/property-advertisement.component';
import { PropertyAdvertisementRoutingModule } from './property-advertisement-routing.module';

@NgModule({
  imports: [
    CommonModule,

    PropertyAdvertisementRoutingModule,
    LandingPagesModule,
    SharedModule,
  ],
  declarations: [
    PropertyAdvertisementComponent,
  ],
})
export class PropertyAdvertisementModule {}
