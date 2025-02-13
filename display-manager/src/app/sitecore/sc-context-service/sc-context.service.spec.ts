import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ScContextService } from './sc-context.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ScContextService', () => {
  let service: ScContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(ScContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
