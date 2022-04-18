import {
  ClassProvider,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { NgxMultiModalModule } from 'ngx-multi-modal';

import { SharedModule } from '../shared/shared.module';

import { HeaderMenuComponent } from './components/header/header-menu/header-menu.component';
import { HeaderComponent } from './components/header/header.component';
import { LayoutFooterComponent } from './components/layout-footer/layout-footer.component';
import { CookiesLawComponent } from './components/cookies-law/cookies-law.component';
import { StartPageNavbarComponent } from './components/start-page-navbar/start-page-navbar.component';
import { StartPageNavbarMobileMenuComponent } from './components/start-page-navbar-mobile-menu/start-page-navbar-mobile-menu.component';
import { StartPageNavbarLoginComponent } from './components/start-page-navbar-login/start-page-navbar-login.component';
import { ErrorUnconfirmedEmailComponent } from './components/registration/error-unconfirmed-email/error-unconfirmed-email.component';
import {
  StartPageNavbarLoginMobileMenuComponent
} from './components/start-page-navbar-login-mobile-menu/start-page-navbar-login-mobile-menu.component';
import { AuthGuardService } from './guards/auth.guard';
import { IsFirstTimeGuardService } from './guards/is-first-time.guard';
import { CanDeactivateGuardService } from './guards/can-deactivate.guard';
import { IsActiveMarkerExistGuardService } from './guards/property-detail.guard';
import { AuthInterceptor } from './services/auth.interceptor';
import { AuthService } from './services/auth.service';
import { BrowserService } from './services/browser.service';
import { ExtendedMarkerModelValidatorService } from './services/extended-marker-model-validator.service';
import { FeatureToggleService } from './services/feature-toggle/feature-toggle.service';
import { MessagingFeatureToggleGuard } from './services/feature-toggle/messaging-feature-toggle.guard';
import { UserService } from './services/user.service';
import { CacheClustersService } from './services/cache-clusters.service';
import { SentryErrorHandlerProvider } from './services/error-handler/sentry-error-handler.provider';
import { LocalStorageProvider } from './services/local-storage.provider';
import { MapManagerService } from './services/map-manager.service';
import { MapsAutoCompleteService } from './services/maps-auto-complete.service';
import { NavigatorProvider } from './services/navigator.provider';
import { OverlayService } from './services/overlay.service';
import { OpenModalService } from './services/open-modal.service';
import { MapFilterService } from './services/map-filter.service';
import { PropertiesRepositoryService } from './services/properties-repository.service';
import { StateManagerService } from './services/state-manager.service';
import { SchedulerService } from './services/scheduler.service';
import { StaticStorageService } from './services/static-storage.service';
import { WebpAssetService } from './services/webp-asset.service';
import { WindowProvider } from './services/window.provider';
import { LoggerProvider } from './services/logger/logger.provider';
import { CookiesService } from './services/cookies.service';
import { PrefillAddressService } from './services/prefill-address.service';
import { AnalyticsService } from './services/analytics/analytics.service';
import { HookProfileService } from './services/hook-profile.service';
import { LocationProvider } from './services/location.provider';
import { ScriptsLoaderService } from './services/scripts-loader.service';
import { BlankComponent } from './components/blank-component/blank.component';
import { ScopertyPlusAdComponent } from './components/scoperty-plus-ad/scoperty-plus-ad.component';
import { ScopertyPlusAdService } from './services/scoperty-plus-ad.service';
import { SignUpComponent } from './components/registration/sign-up/sign-up.component';
import { SignInComponent } from './components/registration/sign-in/sign-in.component';
import { IndexedDBService } from './services/indexeddb.service';

const AuthInterceptorProvider: ClassProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};

const COMPONENTS: any[] = [
  CookiesLawComponent,
  HeaderMenuComponent,
  HeaderComponent,
  LayoutFooterComponent,
  StartPageNavbarComponent,
  StartPageNavbarMobileMenuComponent,
  StartPageNavbarLoginComponent,
  StartPageNavbarLoginMobileMenuComponent,
  BlankComponent,
  ScopertyPlusAdComponent,
  ErrorUnconfirmedEmailComponent,
  SignUpComponent,
  SignInComponent
];

const GUARDS: any[] = [
  AuthGuardService,
  IsFirstTimeGuardService,
  CanDeactivateGuardService,
  IsActiveMarkerExistGuardService,
];

const SERVICES: any[] = [
  AuthInterceptorProvider,
  AuthService,
  BrowserService,
  UserService,
  CacheClustersService,
  ScriptsLoaderService,
  ExtendedMarkerModelValidatorService,
  FeatureToggleService,
  MessagingFeatureToggleGuard,
  LocalStorageProvider,
  MapManagerService,
  MapsAutoCompleteService,
  NavigatorProvider,
  SentryErrorHandlerProvider,
  OverlayService,
  OpenModalService,
  MapFilterService,
  PropertiesRepositoryService,
  SchedulerService,
  StateManagerService,
  StaticStorageService,
  WebpAssetService,
  WindowProvider,
  LoggerProvider,
  LocationProvider,
  CookiesService,
  PrefillAddressService,
  AnalyticsService,
  HookProfileService,
  ScopertyPlusAdService,
  IndexedDBService,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,

    NgxMultiModalModule.forRoot({
      backdrop: true,
      container: 'body',
      windowClass: 'ngx-multi-modal',
    }),
  ],
  exports: [
    ...COMPONENTS,
  ],
  providers: [
    ...GUARDS,
    ...SERVICES,
  ],
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}
