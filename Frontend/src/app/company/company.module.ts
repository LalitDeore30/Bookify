import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { DemoNgZorroAntdModule } from '../DemoNgZorroAntdModule';
import { CompanyDashboardComponent } from './pages/company-dashboard/company-dashboard.component';
import { CreateAdComponent } from './pages/create-ad/create-ad.component';
import { AllAdsComponent } from './pages/all-ads/all-ads.component';
import { UpdateAdComponent } from './pages/update-ad/update-ad.component';
import { AdReviewsComponent } from './pages/ad-reviews/ad-reviews.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CompanyComponent,
    CompanyDashboardComponent,
    CreateAdComponent,
    AllAdsComponent,
    UpdateAdComponent,
    AdReviewsComponent,
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    DemoNgZorroAntdModule,
    ReactiveFormsModule
  ]
})
export class CompanyModule { }
