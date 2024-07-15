/**
 * Title: security.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
*/

// imports statements
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityRoutingModule } from './security-routing.module';
import { SecurityComponent } from './security.component';
import { SigninComponent } from './signin/signin.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegistrationComponent } from './registration/registration.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { VerifySecurityQuestionsComponent } from './verify-security-questions/verify-security-questions.component';

@NgModule({
  declarations: [
    SecurityComponent,
    SigninComponent,
    ResetPasswordComponent,
    RegistrationComponent,
    VerifyEmailComponent,
    VerifySecurityQuestionsComponent
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
  /*exports: [
    SigninComponent,
    RegistrationComponent,
    ResetPasswordComponent
  ]*/
})
export class SecurityModule { }
