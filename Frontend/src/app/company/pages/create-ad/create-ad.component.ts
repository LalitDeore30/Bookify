import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrl: './create-ad.component.scss'
})
export class CreateAdComponent {
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private router: Router,
    private companyService: CompanyService
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      serviceName: [null, [Validators.required]],
      description: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]],
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.previewImage();
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
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

  postAd() {
    if (this.validateForm.valid && this.selectedFile) {
      const formData: FormData = new FormData();

      formData.append('img', this.selectedFile);
      formData.append('serviceName', this.validateForm.get('serviceName')?.value);
      formData.append('description', this.validateForm.get('description')?.value);
      formData.append('price', this.validateForm.get('price')?.value);

      this.companyService.postAd(formData).subscribe({
        next: (res) => {
          this.notification.success(
            'SUCCESS',
            'Ad Posted Successfully'
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
