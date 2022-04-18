import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertyAdvertisementComponent } from './page/property-advertisement.component';

const ROUTES: Routes = [
  {
    path: '',
    component: PropertyAdvertisementComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
  ],
  exports: [
    RouterModule,
  ],
})
export class PropertyAdvertisementRoutingModule {}
