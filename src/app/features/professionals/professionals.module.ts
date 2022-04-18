import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProfessionalsRoutingModule } from './professionals-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { ProfessionalsComponent } from './pages/professionals/professionals.component';
import { ProfessionalsBenefitsComponent } from './components/professionals-benefits/professionals-benefits.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    ProfessionalsRoutingModule,
    SharedModule
  ],
  declarations: [
    ProfessionalsComponent,
    ProfessionalsBenefitsComponent
  ]
})
export class ProfessionalsModule {
}
