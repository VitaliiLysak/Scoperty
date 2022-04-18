import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { TextMaskModule } from 'angular2-text-mask';
import { NgxMultiModalModule } from 'ngx-multi-modal';

import { SharedModule } from '../../shared/shared.module';

import { AuthenticationComponent } from './components/authentication/authentication.component';
import { AuthenticationEnterCodeComponent } from './components/authentication-enter-code/authentication-enter-code.component';
import { AuthenticationPhoneNumberComponent } from './components/authentication-phone-number/authentication-phone-number.component';

const COMPONENTS: any[] = [
  AuthenticationPhoneNumberComponent,
];

const ENTRY_COMPONENTS: any[] = [
  AuthenticationComponent,
  AuthenticationEnterCodeComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    NgxMultiModalModule.forRoot({
      backdrop: true,
      container: 'body',
      windowClass: 'ngx-multi-modal',
    }),
    TextMaskModule,

    SharedModule,
  ],
  exports: [
    ...ENTRY_COMPONENTS,
  ],
  declarations: [
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class AuthenticationModule {
}
