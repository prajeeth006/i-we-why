import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SportBookService } from './sport-book.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SportBookServiceService', () => {
  let service: SportBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(SportBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
