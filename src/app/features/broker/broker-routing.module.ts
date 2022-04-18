import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrokerComponent } from './pages/broker/broker.component';

const ROUTES: Routes = [
  {
    path: '',
    component: BrokerComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(ROUTES) ],
  exports: [ RouterModule ]
})
export class BrokerRoutingModule {}
