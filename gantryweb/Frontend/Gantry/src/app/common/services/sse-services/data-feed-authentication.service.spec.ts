import { TestBed } from '@angular/core/testing';

import { DataFeedAuthenticationService } from './data-feed-authentication.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DataFeedAuthenticationService', () => {
  let service: DataFeedAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DataFeedAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
