import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchBrokerComponent } from './pages/search-broker/search-broker.component';

const ROUTES: Routes = [
  {
    path: '',
    component: SearchBrokerComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(ROUTES) ],
  exports: [ RouterModule ]
})
export class SearchBrokerRoutingModule {}
