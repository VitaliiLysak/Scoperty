import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImpressumComponent } from './pages/impressum/impressum.component';

const ROUTES: Routes = [
  {
    path: '',
    component: ImpressumComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(ROUTES) ],
  exports: [ RouterModule ]
})
export class ImpressumRoutingModule {}
