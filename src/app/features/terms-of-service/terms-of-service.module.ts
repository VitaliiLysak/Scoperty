import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { TermsOfServiceRoutingModule } from './terms-of-service-routing.module';

import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    SharedModule,
    TermsOfServiceRoutingModule,
  ],
  declarations: [
    TermsOfServiceComponent,
  ]
})
export class TermsOfServiceModule {
}
