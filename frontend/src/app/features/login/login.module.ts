import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { Routes } from '@angular/router';
import { CoreModule } from '../../core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { InitialResetPasswordComponent } from 'src/app/shared/components/initial-reset-password/initial-reset-password.component';
import { InitialResetPasswordFormComponent } from 'src/app/shared/components/initial-reset-password-form/initial-reset-password-form.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: '/reset-password', component: ResetPasswordComponent },
];

@NgModule({
  declarations: [
    LoginComponent,
    ResetPasswordComponent,
    InitialResetPasswordComponent,
    InitialResetPasswordFormComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    NgbAlertModule,
  ],
})
export class LoginModule {
  tester: number = 20;
}
