import { TestBed } from '@angular/core/testing';
import { SportBookMarketStructured, SportBookSelection } from '../../../common/models/data-feed/sport-bet-models';
import { TennisContent } from '../../models/tennis.model';

import { MatchBettingService } from './match-betting.service';

describe('MatchBettingService', () => {
  let service: MatchBettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchBettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be return correct home player',()=>{
    let market = new SportBookMarketStructured();
    let tennisContent = new TennisContent();
    let selection = new SportBookSelection();
    selection.outcomeMeaningMinorCode = 'H';
    selection.selectionName = 'Sania';
    market.selections.set(1, selection);
    tennisContent = service.getMatchBettingDetails(market,tennisContent);

    expect(tennisContent.homePlayer).toBe('Sania');
  });

  it('should be return correct away player',()=>{
    let market = new SportBookMarketStructured();
    let tennisContent = new TennisContent();
    let selection = new SportBookSelection();
    selection.outcomeMeaningMinorCode = 'A';
    selection.selectionName = 'Sania';
    market.selections.set(1,selection);
    tennisContent = service.getMatchBettingDetails(market,tennisContent);

    expect(tennisContent.awayPlayer).toBe('Sania');
  });
});
