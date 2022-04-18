import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';

const ROUTES: Routes = [
  {
    path: '',
    component: TermsOfServiceComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(ROUTES) ],
  exports: [ RouterModule ]
})
export class TermsOfServiceRoutingModule {}
