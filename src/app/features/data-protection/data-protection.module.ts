import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DataProtectionRoutingModule } from './data-protection-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { DataProtectionComponent } from './pages/data-protection/data-protection.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    DataProtectionRoutingModule,
    SharedModule
  ],
  declarations: [
    DataProtectionComponent
  ]
})
export class DataProtectionModule {
}
