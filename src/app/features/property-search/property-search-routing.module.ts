import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertySearchComponent } from './pages/property-search/property-search.component';

export const PROPERTY_SEARCH_ROUTE_PARAMS: Readonly<Dictionary<string>> = {
  PROPERTY_ID: 'propertyId'
};

const ROUTES: Routes = [
  {
    path: `:${PROPERTY_SEARCH_ROUTE_PARAMS.PROPERTY_ID}`,
    component: PropertySearchComponent,
    data: { isFirstFooter: true },
  },
  {
    path: '',
    component: PropertySearchComponent,
    data: { isFirstFooter: true },
  },
];

@NgModule({
  imports: [ RouterModule.forChild(ROUTES) ],
  exports: [ RouterModule ]
})
export class PropertySearchRoutingModule {}
