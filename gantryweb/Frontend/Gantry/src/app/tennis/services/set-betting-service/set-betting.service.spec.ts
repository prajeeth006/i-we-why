import { TestBed } from '@angular/core/testing';
import { SportBookMarketStructured, SportBookSelection } from '../../../common/models/data-feed/sport-bet-models';
import { TennisContent } from '../../models/tennis.model';

import { SetBettingService } from './set-betting.service';

describe('SetBettingService', () => {
  let service: SetBettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetBettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be return correct home player bets', () => {
    let market = new SportBookMarketStructured();
    let tennisContent = new TennisContent;
    tennisContent.homePlayer = 'Sania';
    tennisContent.awayPlayer = 'Ashleigh';
    let selection = new SportBookSelection();
    selection.selectionName = 'Sania 2-0';
    
    market.selections.set(1,selection);

    tennisContent = service.setBettingDetails(market, tennisContent);
    
    expect(tennisContent.sets.size).toBe(1);
  });

  it('should be return correct away player bets', () => {
    let market = new SportBookMarketStructured();
    let tennisContent = new TennisContent();
    tennisContent.homePlayer = 'Sania';
    tennisContent.awayPlayer = 'Ashleigh';
    let selection = new SportBookSelection();
    selection.selectionName = 'Ashleigh 2-0';
    market.selections.set(1,selection);

    tennisContent = service.setBettingDetails(market, tennisContent);
    
    expect(tennisContent.sets.size).toBe(1);
  });
});
