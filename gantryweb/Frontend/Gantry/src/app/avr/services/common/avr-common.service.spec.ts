import { TestBed } from '@angular/core/testing';

import { AvrCommonService } from './avr-common.service';

describe('AvrCommonService', () => {
  let service: AvrCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvrCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
