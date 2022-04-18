import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ImpressumRoutingModule } from './impressum-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { ImpressumComponent } from './pages/impressum/impressum.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    ImpressumRoutingModule,
    SharedModule
  ],
  declarations: [
    ImpressumComponent
  ]
})
export class ImpressumModule {
}
