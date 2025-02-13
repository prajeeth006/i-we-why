import { TestBed } from '@angular/core/testing';

import { InterceptorToggleService } from './interceptor-toggle.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InterceptorToggleService', () => {
  let service: InterceptorToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(InterceptorToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
