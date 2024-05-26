import { TestBed } from '@angular/core/testing';

import { AccommodationunitserviceserviceService } from './accommodationunitserviceservice.service';

describe('AccommodationunitserviceserviceService', () => {
  let service: AccommodationunitserviceserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccommodationunitserviceserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
