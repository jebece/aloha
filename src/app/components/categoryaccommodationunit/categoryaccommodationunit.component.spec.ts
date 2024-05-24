import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryaccommodationunitComponent } from './categoryaccommodationunit.component';

describe('CategoryaccommodationunitComponent', () => {
  let component: CategoryaccommodationunitComponent;
  let fixture: ComponentFixture<CategoryaccommodationunitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryaccommodationunitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryaccommodationunitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
