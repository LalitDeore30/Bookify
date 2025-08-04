import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-update-ad',
  templateUrl: './update-ad.component.html',
  styleUrl: './update-ad.component.scss'
})
export class UpdateAdComponent {
  adId: any;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  validateForm!: FormGroup;
  existingImage: string | null = null;
  imgChanged = false;

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private router: Router,
    private companyService: CompanyService,
    private activatedroute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.adId = this.activatedroute.snapshot.params['id'];
    this.validateForm = this.fb.group({
      serviceName: [null, [Validators.required]],
      description: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
    });
    this.loadAdData();
  }

  loadAdData() {
    this.companyService.getAdById(this.adId).subscribe({
      next: (res) => {
        this.validateForm.patchValue({
          serviceName: res.serviceName,
          description: res.description,
          price: res.price
        });
        this.existingImage = res.img;
      },
      error: (error) => {
        this.notification.error('ERROR', 'Failed to load ad data');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.imgChanged = true;
      this.previewImage();
    }
  }

  removeNewImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.imgChanged = false;
  }

  previewImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  updateAd() {
    if (this.validateForm.valid) {
      const formData: FormData = new FormData();

      if (this.selectedFile) {
        formData.append('img', this.selectedFile);
      }

      formData.append('serviceName', this.validateForm.get('serviceName')?.value);
      formData.append('description', this.validateForm.get('description')?.value);
      formData.append('price', this.validateForm.get('price')?.value);

      this.companyService.updateAd(this.adId, formData).subscribe({
        next: (res) => {
          this.notification.success(
            'SUCCESS',
            'Ad Updated Successfully'
          );
          this.router.navigateByUrl('/company/ads');
        },
        error: (error) => {
          this.notification.error(
            'ERROR',
            `${error.error}`,
            { nzDuration: 5000 }
          );
        }
      });
    }
  }
}
