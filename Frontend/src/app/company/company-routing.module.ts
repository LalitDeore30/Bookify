import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company.component';
import { CompanyDashboardComponent } from './pages/company-dashboard/company-dashboard.component';
import { CreateAdComponent } from './pages/create-ad/create-ad.component';
import { AllAdsComponent } from './pages/all-ads/all-ads.component';
import { UpdateAdComponent } from './pages/update-ad/update-ad.component';
import { AdReviewsComponent } from './pages/ad-reviews/ad-reviews.component';
import { AuthGuard } from '../basic/guards/auth.guard';
import { RoleGuard } from '../basic/guards/role.guard';

const routes: Routes = [
  { path: '', component: CompanyComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'dashboard', component: CompanyDashboardComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'ad', component: CreateAdComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'ads', component: AllAdsComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'update/:id', component: UpdateAdComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'ad/:id/reviews', component: AdReviewsComponent, canActivate: [AuthGuard, RoleGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
