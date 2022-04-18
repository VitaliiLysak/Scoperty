import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NouisliderModule } from 'ng2-nouislider';
import { NgxMultiModalModule } from 'ngx-multi-modal';
import {MatSliderModule} from '@angular/material';

// tslint:disable-next-line:max-line-length
import { ScopertyPlusOnboardSecondStepComponent } from './components/scoperty-plus-onboard-second-step/scoperty-plus-onboard-second-step.component';
import { ScopertyPlusOnboardComponent } from './components/scoperty-plus-onboard/scoperty-plus-onboard.component';
import { ScopertyPlusNavbarComponent } from './components/scoperty-plus-navbar/scoperty-plus-navbar.component';
// tslint:disable-next-line:max-line-length
import { Substep7EmailFormComponent } from '../../features/scoperty-plus-onboard/components/scoperty-plus-onboard-second-step/subcomponents/substep7-email-form/substep7-email-form.component';
// tslint:disable-next-line:max-line-length
import { Substep8RegisterFormComponent } from '../../features/scoperty-plus-onboard/components/scoperty-plus-onboard-second-step/subcomponents/substep8-register-form/substep8-register-form.component';
// tslint:disable-next-line:max-line-length
import { Substep9LoginFormComponent } from '../../features/scoperty-plus-onboard/components/scoperty-plus-onboard-second-step/subcomponents/substep9-login-form/substep9-login-form.component';
import { ScopertyPlusEditFieldsNavComponent } from './components/scoperty-plus-edit-fields-nav/scoperty-plus-edit-fields-nav.component';
import {
  ScopertyPlusOnboardThirdStepComponent
} from './components/scoperty-plus-onboard-third-step/scoperty-plus-onboard-third-step.component';
import { SharedModule } from '../../shared/shared.module';
import {
  ScopertyPlusOnboardFirstStepComponent
} from './components/scoperty-plus-onboard-first-step/scoperty-plus-onboard-first-step.component';
import { CoreModule } from '../../core/core.module';
import { TextMaskModule } from 'angular2-text-mask';
import { ScopertyPlusOnboardService } from './scoperty-plus-onboard.service';

const COMPONENTS: any[] = [
  ScopertyPlusEditFieldsNavComponent,
  ScopertyPlusOnboardComponent,
  ScopertyPlusNavbarComponent,
  ScopertyPlusOnboardFirstStepComponent,
  ScopertyPlusOnboardSecondStepComponent,
  Substep7EmailFormComponent,
  Substep8RegisterFormComponent,
  Substep9LoginFormComponent,
  ScopertyPlusOnboardThirdStepComponent,
];

const ENTRY_COMPONENTS: any[] = [
    ScopertyPlusOnboardComponent,
];

const SERVICES: any[] = [
  ScopertyPlusOnboardService
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NouisliderModule,
    MatSliderModule,
    CoreModule,
    TextMaskModule,

    NgxMultiModalModule.forRoot({
      backdrop   : true,
      container  : 'body',
      windowClass: 'ngx-multi-modal',
    }),
  ],
  exports: [
    ...ENTRY_COMPONENTS,
  ],
  declarations: [
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
  ],
  providers: [
    ...SERVICES
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class ScopertyPlusOnboardModule {}
