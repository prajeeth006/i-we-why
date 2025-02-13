import { TestBed } from '@angular/core/testing';

import { GantryMarketsService } from './gantry-markets.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GantryMarketsService', () => {
  let service: GantryMarketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [HttpClientTestingModule]
    });
    service = TestBed.inject(GantryMarketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
