import { Component } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-ads',
  templateUrl: './all-ads.component.html',
  styleUrls: ['./all-ads.component.scss']
})
export class AllAdsComponent {

  ads: any;

  constructor(
    private companyService: CompanyService,
    private notification: NzNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllAdsByUserId();
  }

  getAllAdsByUserId() {
    this.companyService.getAllAdsByUserId().subscribe({
      next: (res) => {
        this.ads = res;
      },
      error: (error) => {
        console.error('Error fetching ads:', error);
        if (error.status === 403) {
          this.notification.error(
            'Authentication Error',
            'Please login again to access this page.',
            { nzDuration: 5000 }
          );
          // Redirect to login
          this.router.navigate(['/login']);
        } else {
          this.notification.error(
            'Error',
            'Failed to load ads. Please try again.',
            { nzDuration: 5000 }
          );
        }
      }
    });
  }

  updateImg(img: string): string {
    return 'data:image/jpeg;base64,' + img;
  }
  deletedAd(adId: any) {
    this.companyService.deleteAd(adId).subscribe({
      next: (res) => {
        this.notification.success(
          'SUCCESS',
          'Ad Deleted Successfully',
          { nzDuration: 5000 }
        );
        this.getAllAdsByUserId();
      },
      error: (error) => {
        console.error('Error deleting ad:', error);
        if (error.status === 403) {
          this.notification.error(
            'Authentication Error',
            'Please login again to access this page.',
            { nzDuration: 5000 }
          );
          this.router.navigate(['/login']);
        } else {
          this.notification.error(
            'Error',
            'Failed to delete ad. Please try again.',
            { nzDuration: 5000 }
          );
        }
      }
    });
  }
}