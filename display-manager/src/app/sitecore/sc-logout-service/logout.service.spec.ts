import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LogoutService } from './logout.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LogoutService', () => {
  let service: LogoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(LogoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
