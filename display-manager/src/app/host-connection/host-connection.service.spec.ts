import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HostConnectionService } from './host-connection.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('HostConnectionService', () => {
  let service: HostConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(HostConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
