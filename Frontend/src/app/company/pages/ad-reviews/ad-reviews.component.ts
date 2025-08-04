import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-ad-reviews',
  templateUrl: './ad-reviews.component.html',
  styleUrls: ['./ad-reviews.component.scss']
})
export class AdReviewsComponent implements OnInit {
  adId: number = 0;
  adDetails: any = {};
  reviews: any[] = [];
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.adId = parseInt(this.route.snapshot.params['id'], 10);
    this.loadAdDetails();
    this.loadReviews();
  }

  loadAdDetails() {
    this.loading = true;
    this.companyService.getAdById(this.adId).subscribe({
      next: (response) => {
        this.adDetails = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading ad details:', error);
        this.loading = false;
      }
    });
  }

  loadReviews() {
    this.companyService.getAdReviews(this.adId).subscribe({
      next: (response) => {
        this.reviews = response;
        console.log('Reviews loaded:', this.reviews);
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
