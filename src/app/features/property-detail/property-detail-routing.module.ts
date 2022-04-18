import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IsActiveMarkerExistGuardService } from '../../core/guards/property-detail.guard';

import { PropertyDetailComponent } from './pages/property-detail/property-detail.component';

const ROUTES: Routes = [
  {
    path: '',
    component: PropertyDetailComponent,
    canActivate: [IsActiveMarkerExistGuardService],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(ROUTES) ],
  exports: [ RouterModule ]
})
export class PropertyDetailRoutingModule {}
