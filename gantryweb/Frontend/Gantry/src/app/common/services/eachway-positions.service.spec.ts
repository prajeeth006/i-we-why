import { TestBed } from '@angular/core/testing';

import { EachwayPositionsService } from './eachway-positions.service';

describe('EachwayPositionsService', () => {
  let service: EachwayPositionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EachwayPositionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('when setEachWay called, each way with odds and places should be correct', () => {
    let result = service.setEachWay("EACH-WAY 1/4 1-2-3-4", "WIN ONLY", "ODDS", "PLACES");
    expect(result).toBe('EACH-WAY: 1/4 ODDS, 4 PLACES');
  });

  it('when setEachWay called, each way with win only should be correct', () => {
    let result = service.setEachWay("EACH-WAY 1/1 1-2-3-4", "WIN ONLY", "ODDS", "PLACES");
    expect(result).toBe('WIN ONLY');
  });

  it('when setEachWay called, each way with win only comes feed should be correct', () => {
    let result = service.setEachWay("WIN ONLY", "WIN ONLY", "ODDS", "PLACES");
    expect(result).toBe('WIN ONLY');
  });
});
