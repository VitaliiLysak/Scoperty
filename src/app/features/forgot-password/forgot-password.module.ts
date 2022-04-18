import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ConfirmPasswordComponent } from './components/confirm-password/confirm-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

import { SharedModule } from '../../shared/shared.module';

const ENTRY_COMPONENTS: any[] = [
  ConfirmPasswordComponent,
  ForgotPasswordComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    ForgotPasswordRoutingModule,
    SharedModule,
  ],
  declarations: [
    ...ENTRY_COMPONENTS,
    ChangePasswordComponent,
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
  exports: [
    ChangePasswordComponent,
    ForgotPasswordComponent,
  ],
})
export class ForgotPasswordModule {
}
