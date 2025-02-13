import { TestBed } from '@angular/core/testing';

import { RacingContentService } from './racing-content.service';

describe('RacingContentService', () => {
  let service: RacingContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RacingContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
