import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccoUnitsComponent } from './admin-acco-units.component';

describe('AdminAccoUnitsComponent', () => {
  let component: AdminAccoUnitsComponent;
  let fixture: ComponentFixture<AdminAccoUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAccoUnitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAccoUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
