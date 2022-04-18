import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataProtectionComponent } from './pages/data-protection/data-protection.component';

const ROUTES: Routes = [
  {
    path: '',
    component: DataProtectionComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(ROUTES) ],
  exports: [ RouterModule ]
})
export class DataProtectionRoutingModule {}
