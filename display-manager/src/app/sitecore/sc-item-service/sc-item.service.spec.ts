import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ScItemService } from './sc-item.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ScItemService', () => {
  let service: ScItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(ScItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
