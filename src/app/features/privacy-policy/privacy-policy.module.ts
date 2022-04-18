import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    PrivacyPolicyRoutingModule,
    SharedModule
  ],
  declarations: [
    PrivacyPolicyComponent
  ]
})
export class PrivacyPolicyModule {
}
