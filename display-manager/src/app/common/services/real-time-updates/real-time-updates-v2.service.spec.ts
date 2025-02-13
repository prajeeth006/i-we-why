import { TestBed } from '@angular/core/testing';

import { RealTimeUpdatesV2Service } from './real-time-updates-v2.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RealTimeUpdatesV2Service', () => {
  let service: RealTimeUpdatesV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(RealTimeUpdatesV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
