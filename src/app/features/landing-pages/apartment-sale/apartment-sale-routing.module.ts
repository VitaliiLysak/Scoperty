import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApartmentSaleComponent } from './page/apartment-sale.component';

const ROUTES: Routes = [
  {
    path: '',
    component: ApartmentSaleComponent
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
export class ApartmentSaleRoutingModule {}
