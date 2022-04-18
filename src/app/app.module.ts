import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { NouisliderModule } from 'ng2-nouislider';
import { NguCarouselModule } from '@ngu/carousel';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { TextMaskModule } from 'angular2-text-mask';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { ModalModule } from 'ngx-bootstrap';
import { MomentModule } from 'ngx-moment';
import { NgxMultiModalModule } from 'ngx-multi-modal';
import { NgxPopperModule } from 'ngx-popper';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { GOOGLE_MAPS_API_KEY } from './app.constants';
import {
  AppLocaleProvider,
  GERMAN_LOCALE,
} from './app-locale.provider';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AuthenticationModule } from './features/authentication/authentication.module';
import { ForgotPasswordModule } from './features/forgot-password/forgot-password.module';
import { RegistrationModule } from './features/registration/registration.module';
import { SharedModule } from './shared/shared.module';
import { ScopertyPlusOnboardModule } from './features/scoperty-plus-onboard/scoperty-plus-onboard.module';

registerLocaleData(localeDe, GERMAN_LOCALE);

const FEATURE_MODULES: any[] = [
  AuthenticationModule,
  ForgotPasswordModule,
  RegistrationModule,
  ScopertyPlusOnboardModule,
];

@NgModule({
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BootstrapModalModule.forRoot({container: document.body}),
    ModalModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: GOOGLE_MAPS_API_KEY, // enter your apiKey
      libraries: ['places', 'geometry'],
      language: 'de'
    }),
    AgmSnazzyInfoWindowModule,
    AgmJsMarkerClustererModule,
    // NgxMultiModalModule import necessary for services using providedIn "root" which are opening dialogs.
    NgxMultiModalModule.forRoot({
      backdrop: true,
      container: 'body',
      windowClass: 'ngx-multi-modal',
    }),
    NgxPopperModule,
    NouisliderModule,
    NguCarouselModule,
    MomentModule.forRoot(),
    ScrollToModule.forRoot(),
    TextMaskModule,

    CoreModule,
    SharedModule,
    ...FEATURE_MODULES,

    // AppRoutingModule have to be the last import in order to match the wildcard route properly
    AppRoutingModule,
  ],
  providers: [
    GoogleMapsAPIWrapper,
    AppLocaleProvider,
    CookieService,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
