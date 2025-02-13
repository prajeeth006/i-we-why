import { TestBed } from '@angular/core/testing';

import { FightBettingService } from './fight-betting.service';

describe('FightBettingService', () => {
  let service: FightBettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FightBettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
