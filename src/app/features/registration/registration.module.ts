import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxActiveModal } from 'ngx-multi-modal';

import { SharedModule } from '../../shared/shared.module';

import { RegistrationRoutingModule } from './registration-routing.module';
import { AddressComponent } from './components/address/address.component';
import { LoginComponent } from './components/login/login.component';
import { OppositionComponent } from './components/opposition/opposition.component';
import { PhoneComponent } from './components/phone/phone.component';
import { RegistrationInfoComponent } from './components/registration-info/registration-info.component';
import { SignupComponent } from './components/signup/signup.component';
import { DissentPropertyComponent } from './pages/dissent-property/dissent-property.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { AddressSkipComponent } from './components/address-skip/address-skip.component';
import { ConfirmUserComponent } from './pages/confirm-user/confirm-user.component';
import { MsgDeleteDataComponent } from './components/msg-delete-data/msg-delete-data.component';
import { SignupModalComponent } from './components/signup-modal/signup-modal.component';
import { SignupMobileMenuComponent } from './components/signup-mobile-menu/signup-mobile-menu.component';
import { LoginPageComponent } from './pages/login-page/login-page.components';

const COMPONENTS: any[] = [
  AddressComponent,
  DissentPropertyComponent,
  OppositionComponent,
  PhoneComponent,
  SignupComponent,
  SignupPageComponent,
  LoginPageComponent,
];

const ENTRY_COMPONENTS: any[] = [
  RegistrationComponent,
  ConfirmUserComponent,
  MsgDeleteDataComponent,
  AddressSkipComponent,
  RegistrationInfoComponent,
  LoginComponent,
  SignupModalComponent,
  SignupMobileMenuComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,

    RegistrationRoutingModule,
    SharedModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...ENTRY_COMPONENTS,
    ConfirmUserComponent
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
  providers: [
    NgxActiveModal
  ]
})
export class RegistrationModule {
}
