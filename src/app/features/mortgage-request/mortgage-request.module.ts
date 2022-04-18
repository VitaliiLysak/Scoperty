import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';

import { MortgageRequestRoutingModule } from './mortgage-request-routing.module';
import { MortgageRequestComponent } from './pages/mortgage-request/mortgage-request.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    MortgageRequestRoutingModule,
    SharedModule,
  ],
  declarations: [
    MortgageRequestComponent
  ]
})
export class MortgageRequestModule { }
