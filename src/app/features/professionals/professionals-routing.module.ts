import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfessionalsComponent } from './pages/professionals/professionals.component';

const ROUTES: Routes = [
  {
    path: '',
    component: ProfessionalsComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(ROUTES) ],
  exports: [ RouterModule ]
})
export class ProfessionalsRoutingModule {}
