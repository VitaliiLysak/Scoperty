import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertySaleComponent } from './page/property-sale.component';

const ROUTES: Routes = [
  {
    path: '',
    component: PropertySaleComponent
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
export class PropertySaleRoutingModule {}
