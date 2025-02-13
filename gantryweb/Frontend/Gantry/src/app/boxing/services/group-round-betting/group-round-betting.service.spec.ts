import { TestBed } from '@angular/core/testing';

import { GroupRoundBettingService } from './group-round-betting.service';

describe('GroupRoundBettingService', () => {
  let service: GroupRoundBettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupRoundBettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
