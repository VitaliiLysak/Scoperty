import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
  PreloadAllModules,
} from '@angular/router';

import { SHARED_ROUTES_NAMES } from './app.constants';
import { AuthGuardService } from './core/guards/auth.guard';
import { BlankComponent } from './core/components/blank-component/blank.component';
import { RedirectGuard } from './core/guards/redirect.guard';

export const ROUTES: Routes = [
  {
    path: SHARED_ROUTES_NAMES.ABOUT,
    loadChildren: './features/about/about.module#AboutModule',
  },
  {
    path: SHARED_ROUTES_NAMES.IMPRESSUM,
    loadChildren: './features/impressum/impressum.module#ImpressumModule',
  },
  {
    path: SHARED_ROUTES_NAMES.DATAPROTECTION,
    loadChildren: './features/data-protection/data-protection.module#DataProtectionModule',
  },
  {
    path: SHARED_ROUTES_NAMES.HOWITWORKS,
    loadChildren: './features/how-it-works/how-it-works.module#HowItWorksModule',
  },
  {
    path: SHARED_ROUTES_NAMES.PRIVACY,
    loadChildren: './features/privacy-policy/privacy-policy.module#PrivacyPolicyModule',
  },
  {
    path: SHARED_ROUTES_NAMES.PROFESSIONALS,
    loadChildren: './features/professionals/professionals.module#ProfessionalsModule',
  },
  {
    path: SHARED_ROUTES_NAMES.SEARCHBROKER,
    loadChildren: './features/search-broker/search-broker.module#SearchBrokerModule',
  },
  {
    path: SHARED_ROUTES_NAMES.BROKER,
    loadChildren: './features/broker/broker.module#BrokerModule',
  },
  {
    path: SHARED_ROUTES_NAMES.MORTGAGE_REQUEST,
    loadChildren: './features/mortgage-request/mortgage-request.module#MortgageRequestModule',
  },
  {
    path: SHARED_ROUTES_NAMES.PROPERTY_VALUATION,
    loadChildren: './features/landing-pages/property-valuation/property-valuation.module#PropertyValuationModule',
  },
  {
    path: SHARED_ROUTES_NAMES.PROPERTY_VALUATION_DUPLICATE,
    loadChildren: './features/landing-pages/property-valuation/property-valuation.module#PropertyValuationModule',
  },
  {
    path: SHARED_ROUTES_NAMES.ADVERTISE_PROPERTY,
    loadChildren: './features/landing-pages/property-advertisement/property-advertisement.module#PropertyAdvertisementModule',
  },
  {
    path: SHARED_ROUTES_NAMES.SELL_PROPERTY,
    loadChildren: './features/landing-pages/property-sale/property-sale.module#PropertySaleModule',
  },
  {
    path: SHARED_ROUTES_NAMES.SELL_HOUSE,
    loadChildren: './features/landing-pages/house-sale/house-sale.module#HouseSaleModule',
  },
  {
    path: SHARED_ROUTES_NAMES.SELL_APARTMENT,
    loadChildren: './features/landing-pages/apartment-sale/apartment-sale.module#ApartmentSaleModule',
  },
  {
    path: SHARED_ROUTES_NAMES.TERMS_OF_SERVICE,
    loadChildren: './features/terms-of-service/terms-of-service.module#TermsOfServiceModule',
  },
  {
    path: SHARED_ROUTES_NAMES.MAP,
    loadChildren: './features/property-search/property-search.module#PropertySearchModule',
  },
  {
    path: SHARED_ROUTES_NAMES.PROFILE,
    loadChildren: './features/profile/profile.module#ProfileModule',
    canLoad: [AuthGuardService],
  },
  {
    path: SHARED_ROUTES_NAMES.PROPERTY_DETAIL_QUERY,
    loadChildren: './features/property-detail/property-detail.module#PropertyDetailModule',
  },
  {
    path: '',
    loadChildren: './features/start-page/start-page.module#StartPageModule',
  },
  {
    path: SHARED_ROUTES_NAMES.SCOPERTY_PLUS_ANMELDUNG,
    component: BlankComponent,
    canActivate: [RedirectGuard],
    data: {
      externalUrl: 'https://form.jotformeu.com/92892924245366'
    },
  },
  {
    path: '**',
    redirectTo: SHARED_ROUTES_NAMES.SELL,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    RedirectGuard,
  ]
})
export class AppRoutingModule {
}
