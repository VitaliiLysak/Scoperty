import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HouseSaleComponent } from './page/house-sale.component';

const ROUTES: Routes = [
  {
    path: '',
    component: HouseSaleComponent
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
export class HouseSaleRoutingModule {
}
