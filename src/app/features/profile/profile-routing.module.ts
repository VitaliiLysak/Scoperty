import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatComponent } from './pages/chat/chat.component';
import { ProfilesFavoritesComponent } from './pages/profile-favorites/profile-favorites.component';
import { MyPropertiesComponent } from './pages/my-properties/my-properties.component';
import { OffersComponent } from './pages/offers/offers.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PropertySearchAlertsComponent } from './pages/property-search-alerts/property-search-alerts.component';

import { MessagingFeatureToggleGuard } from '../../core/services/feature-toggle/messaging-feature-toggle.guard';
import { AuthGuardService } from '../../core/guards/auth.guard';
import { CanDeactivateGuardService } from '../../core/guards/can-deactivate.guard';
import { SHARED_ROUTES_NAMES } from '../../app.constants';

export const PROFILE_ROUTE_PARAMS: Readonly<Dictionary<string>> = {
  PROPERTY_ID: 'propertyId'
};

const ROUTES: Routes = [
  {
    path: '',
    component: ProfileComponent,
    data: { isFirstFooter: false },
    canActivate: [AuthGuardService],
    children: [
      {
        path: `${SHARED_ROUTES_NAMES.PROPERTY}/:${PROFILE_ROUTE_PARAMS.PROPERTY_ID}`,
        component: MyPropertiesComponent,
        canDeactivate: [CanDeactivateGuardService]
      },
      { path: `${SHARED_ROUTES_NAMES.PROPERTY}`, component: MyPropertiesComponent, canDeactivate: [CanDeactivateGuardService]},
      { path: SHARED_ROUTES_NAMES.OFFERS, component: OffersComponent },
      { path: SHARED_ROUTES_NAMES.SEARCH, component: PropertySearchAlertsComponent },
      { path: SHARED_ROUTES_NAMES.FAVORITES, component: ProfilesFavoritesComponent },
      {
        path: SHARED_ROUTES_NAMES.CHAT,
        component: ChatComponent,
        canActivate: [ MessagingFeatureToggleGuard ],
      },
    ]
  },
];

@NgModule({
  imports: [ RouterModule.forChild(ROUTES) ],
  exports: [ RouterModule ]
})
export class ProfileRoutingModule {}
