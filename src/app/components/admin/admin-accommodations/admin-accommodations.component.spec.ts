import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccommodationsComponent } from './admin-accommodations.component';

describe('AdminAccommodationsComponent', () => {
  let component: AdminAccommodationsComponent;
  let fixture: ComponentFixture<AdminAccommodationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAccommodationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAccommodationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
