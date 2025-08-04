
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';

import { AppRoutingModule } from './app-routing.module'; // Make sure this exists
import { AppComponent } from './app.component';

// Your shared NgZorro module (created separately)
import { SignupCompanyComponent } from './basic/components/signup-company/signup-company.component';
import { SignupClientComponent } from './basic/components/signup-client/signup-client.component';
import { LoginComponent } from './basic/components/login/login.component';
import { SignupComponent } from './basic/components/signup/signup.component';
import { DemoNgZorroAntdModule } from './DemoNgZorroAntdModule';
import { ReactiveFormsModule } from '@angular/forms';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    SignupCompanyComponent,
    SignupClientComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    DemoNgZorroAntdModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
