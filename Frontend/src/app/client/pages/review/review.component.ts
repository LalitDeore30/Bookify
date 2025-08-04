import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ClientService } from '../../services/client.service';
import { UserStorageService } from '../../../basic/services/storage/user-storage.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  bookingId: number = 0;
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private router: Router,
    private clientService: ClientService,
    private activatedRoute: ActivatedRoute,
    private userStorageService: UserStorageService
  ) {}

  ngOnInit() {
    // Initialize form
    this.validateForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      review: [null, [Validators.required, Validators.minLength(10)]]
    });

    // Get booking ID from route parameter
    const routeId = this.activatedRoute.snapshot.params['id'];
    this.bookingId = routeId ? parseInt(routeId, 10) : 0;
    
    console.log('Review component - Booking ID from route:', this.bookingId);
    console.log('Route params:', this.activatedRoute.snapshot.params);
    
    // Validate user and booking ID
    if (!this.userStorageService.isClientLoggedIn()) {
      this.notification.error('Authentication Required', 'Please login to post a review');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.bookingId || this.bookingId <= 0) {
      this.notification.error('Invalid Request', 'Invalid booking ID. Please try again.');
      this.router.navigate(['/client/bookings']);
      return;
    }
  }

  submitReview() {
    if (!this.validateForm.valid) {
      this.notification.warning('Incomplete Form', 'Please fill in all required fields correctly');
      return;
    }

    const reviewData = {
      bookingId: this.bookingId,
      userId: this.userStorageService.getUserId(),
      rating: this.validateForm.get('rating')?.value,
      review: this.validateForm.get('review')?.value
    };

    console.log('Submitting review:', reviewData);

    this.clientService.submitReview(reviewData).subscribe({
      next: (response) => {
        this.notification.success('SUCCESS', 'Review posted successfully');
        this.router.navigateByUrl('/client/bookings');
      },
      error: (error) => {
        console.error('Error posting review:', error);
        this.notification.error('ERROR', 'Failed to post review. Please try again.');
      }
    });
  }
}
