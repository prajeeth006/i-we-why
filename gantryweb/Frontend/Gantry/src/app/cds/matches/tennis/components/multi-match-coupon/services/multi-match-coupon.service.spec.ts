import { TestBed } from '@angular/core/testing';

import { MultiMatchCouponService } from './multi-match-coupon.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('MultiMatchCouponService', () => {
  let service: MultiMatchCouponService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(MultiMatchCouponService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
