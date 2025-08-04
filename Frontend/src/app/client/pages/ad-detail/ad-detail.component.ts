import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserStorageService } from '../../../basic/services/storage/user-storage.service';

@Component({
  selector: 'app-ad-detail',
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.scss']
})
export class AdDetailComponent implements OnInit {

  adId = this.activatedroute.snapshot.params['adId'];
  avatarUrl: any;
  ad: any;
  reviews: any[] = [];

  validateForm!: FormGroup;

constructor(private clientService: ClientService,
            private activatedroute: ActivatedRoute,
            private notification: NzNotificationService,
            private router: Router,
            private fb: FormBuilder,
            private userStorageService: UserStorageService) {}

ngOnInit() {
    this.validateForm = this.fb.group({
        bookDate: [null, [Validators.required]]
    })
    this.getAdDetailsByAdId();
}

getAdDetailsByAdId() {
    this.clientService.getAdDetailsByAdId(this.adId).subscribe(res => {
        console.log(res);
        this.avatarUrl = 'data:image/jpeg;base64,' + res.adDTO.returnedImg;
        this.ad = res.adDTO;
        this.reviews = res.reviewDTOList || [];
    })
}

bookService() {
    const bookServiceDTO = {
        bookDate: this.validateForm.get(['bookDate']).value,
        adId: this.adId,
        userId: this.userStorageService.getUserId()
    }

    this.clientService.bookService(bookServiceDTO).subscribe(res => {
        this.notification
            .success(
                'SUCCESS',
                'Request posted successfully',
                { nzDuration: 5000 }
            );
        this.router.navigateByUrl('/client/bookings');
    });
}

trackByReviewId(index: number, review: any): any {
    return review.id || index;
}

getInitials(name: string): string {
    if (!name) return 'U';
    return name.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

disabledDate = (current: Date): boolean => {
    // Disable past dates
    return current && current < new Date(new Date().setHours(0, 0, 0, 0));
}

}
