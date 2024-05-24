import { TestBed } from '@angular/core/testing';

import { CategoryaccommodationunitService } from './categoryaccommodationunit.service';

describe('CategoryaccommodationunitService', () => {
  let service: CategoryaccommodationunitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryaccommodationunitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
