import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';

const ROUTES: Routes = [
  {
    path: '',
    component: HowItWorksComponent
  },
];

@NgModule({
  imports: [ RouterModule.forChild(ROUTES) ],
  exports: [ RouterModule ]
})
export class HowItWorksRoutingModule {}
