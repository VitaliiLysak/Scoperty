import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SHARED_ROUTES_NAMES } from '../../app.constants';

import { ConfirmUserComponent } from './pages/confirm-user/confirm-user.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.components';

const ROUTES: Routes = [
  {
    path: SHARED_ROUTES_NAMES.CONFIRMUSER,
    component: ConfirmUserComponent,
  },
  {
    path: SHARED_ROUTES_NAMES.SIGNUP,
    component: SignupPageComponent,
    outlet: 'modal',
  },
  {
    path: SHARED_ROUTES_NAMES.LOGIN,
    component: LoginPageComponent,
    outlet: 'modal',
  },
];

@NgModule({
  imports: [ RouterModule.forChild(ROUTES) ],
  exports: [ RouterModule ]
})
export class RegistrationRoutingModule {}
