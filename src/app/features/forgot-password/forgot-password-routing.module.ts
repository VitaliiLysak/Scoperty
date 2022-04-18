import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
} from '@angular/router';

import { ChangePasswordComponent } from './pages/change-password/change-password.component';

import { SHARED_ROUTES_NAMES } from '../../app.constants';

const ROUTES: Routes = [
  {
    path: SHARED_ROUTES_NAMES.CHANGEPASSWORD,
    component: ChangePasswordComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
  ],
  exports: [
    RouterModule,
  ],
})
export class ForgotPasswordRoutingModule {
}
