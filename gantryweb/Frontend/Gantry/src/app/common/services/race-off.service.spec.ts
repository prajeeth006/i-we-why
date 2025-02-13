import { TestBed } from '@angular/core/testing';

import { RaceOffService } from './race-off.service';

describe('RaceOffService', () => {
  let service: RaceOffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaceOffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
