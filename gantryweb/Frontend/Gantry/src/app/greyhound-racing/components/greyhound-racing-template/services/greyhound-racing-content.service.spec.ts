import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GreyhoundRacingContentService } from './greyhound-racing-content.service';

describe('GreyhoundRacingContentService', () => {
  let service: GreyhoundRacingContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
  });
    service = TestBed.inject(GreyhoundRacingContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
