import { TestBed } from '@angular/core/testing';

import { RacingTabService } from './racing-tab.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RacingTabService', () => {
  let service: RacingTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(RacingTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
