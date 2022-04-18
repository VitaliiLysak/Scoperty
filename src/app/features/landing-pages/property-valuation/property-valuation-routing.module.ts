import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
} from '@angular/router';

import { PropertyValuationComponent } from './pages/property-valuation/property-valuation.component';

const ROUTES: Routes = [
  {
    path: '',
    component: PropertyValuationComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
  ],
  exports: [
    RouterModule,
  ],
})
export class PropertyValuationRoutingModule {
}
