import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SHARED_ROUTES_NAMES } from '../../app.constants';

import { StartPageSellPropertyComponent } from './components/start-page-sell-property/start-page-sell-property.component';
import { StartPageBuyPropertyComponent } from './components/start-page-buy-property/start-page-buy-property.component';
import { StartPageComponent } from './pages/start-page/start-page.component';

const ROUTES: Routes = [
  {
    path: '',
    component: StartPageComponent,
    children: [
      { path: SHARED_ROUTES_NAMES.BUY, component: StartPageBuyPropertyComponent },
      { path: SHARED_ROUTES_NAMES.SELL, component: StartPageSellPropertyComponent },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: SHARED_ROUTES_NAMES.SELL,
      },
    ]
  },
];

@NgModule({
  imports: [ RouterModule.forChild(ROUTES) ],
  exports: [ RouterModule ],
})
export class StartPageRoutingModule {
}
