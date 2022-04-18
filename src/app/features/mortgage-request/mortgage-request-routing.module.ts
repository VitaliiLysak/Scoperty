import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MortgageRequestComponent } from './pages/mortgage-request/mortgage-request.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MortgageRequestComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(ROUTES) ],
  exports: [ RouterModule ]
})
export class MortgageRequestRoutingModule { }
