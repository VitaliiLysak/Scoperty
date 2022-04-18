import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

const ROUTES: Routes = [
  {
    path: '',
    component: PrivacyPolicyComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(ROUTES) ],
  exports: [ RouterModule ]
})
export class PrivacyPolicyRoutingModule {}
