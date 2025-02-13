import { TestBed } from '@angular/core/testing';
import { TotalSixesService } from './total-sixes.service';
import { CricketSportBookMockDataT1 } from '../../mocks/mock-cricket-data';
import { CricketTemplateResult } from '../../models/cricket-template.model';
import { SportBookSelection } from '../../../common/models/data-feed/sport-bet-models';

describe('TotalSixesService', () => {
  let service: TotalSixesService;
  let cricketMockDataT1: CricketSportBookMockDataT1;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TotalSixesService);

    cricketMockDataT1 = new CricketSportBookMockDataT1();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('create cricket template in Total Sixes result and check home team Title', () => {
    let cricketTemplateResult = new CricketTemplateResult();
    let selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } } = {};
    selections["TOTAL SIXES"] = {};
    selections["TOTAL SIXES"]["OVER"] = cricketMockDataT1.totalSixesHomeS1;
    service.setTotalSixes("TOTAL SIXES", cricketMockDataT1.totalSixesM, cricketTemplateResult, selections);
    expect(cricketTemplateResult.totalSixes.homeTeamDetails.betName).toBe("OVER 11.5");
    expect(cricketTemplateResult.totalSixes.homeTeamDetails.betOdds).toBe("11/20");
  });

  it('create cricket template in Total Sixes result and check away team Title', () => {
    let cricketTemplateResult = new CricketTemplateResult();
    let selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } } = {};
    selections["TOTAL SIXES"] = {};
    selections["TOTAL SIXES"]["UNDER"] = cricketMockDataT1.totalSixesAwayS1;
    service.setTotalSixes("TOTAL SIXES", cricketMockDataT1.totalSixesM, cricketTemplateResult, selections);
    expect(cricketTemplateResult.totalSixes.awayTeamDetails.betName).toBe("UNDER 11.5");
    expect(cricketTemplateResult.totalSixes.awayTeamDetails.betOdds).toBe("5/13");
  });

});
