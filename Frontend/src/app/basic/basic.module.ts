import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DemoNgZorroAntdModule } from '../DemoNgZorroAntdModule';

import { LoginComponent } from './components/login/login.component';
import { SignupClientComponent } from './components/signup-client/signup-client.component';
import { SignupCompanyComponent } from './components/signup-company/signup-company.component';
import { SignupComponent } from './components/signup/signup.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupClientComponent,
    SignupCompanyComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    DemoNgZorroAntdModule
  ],
  exports: [
    LoginComponent,
    SignupClientComponent,
    SignupCompanyComponent,
    SignupComponent
  ]
})
export class BasicModule { }
