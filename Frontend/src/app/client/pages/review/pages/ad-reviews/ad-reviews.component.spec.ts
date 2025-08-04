import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdReviewsComponent } from './ad-reviews.component';

describe('AdReviewsComponent', () => {
  let component: AdReviewsComponent;
  let fixture: ComponentFixture<AdReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdReviewsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
