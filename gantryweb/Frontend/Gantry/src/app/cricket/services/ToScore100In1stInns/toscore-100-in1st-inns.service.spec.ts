import { TestBed } from '@angular/core/testing';
import { CricketContentMockData, CricketSportBookMockDataT3 } from '../../mocks/mock-cricket-data';
import { SportBookSelection } from '../../../common/models/data-feed/sport-bet-models';
import { BetDetails, CricketTemplateResult } from '../../models/cricket-template.model';
import { Toscore100In1stInnsService } from './toscore-100-in1st-inns.service';

describe('Toscore100In1stInnsService', () => {
  let service: Toscore100In1stInnsService;
  let cricketContentMockdata: CricketContentMockData;
  let cricketMockDataT3: CricketSportBookMockDataT3;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new Toscore100In1stInnsService();
    cricketMockDataT3 = new CricketSportBookMockDataT3();
    cricketContentMockdata = new CricketContentMockData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('create cricket template in To Score 100 in 1st Inning result and check away team Title', () => {
    let cricketTemplateResult = new CricketTemplateResult();
    cricketTemplateResult.cricketCountries = cricketContentMockdata.cricketCountriesMockData
    cricketTemplateResult.toScore100in1stInns = new Array<BetDetails>();

    let selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } } = {};
    selections["TO SCORE 100 IN 1ST INNS - JOE ROOT"] = {};
    selections["TO SCORE 100 IN 1ST INNS - JOE ROOT"]["YES"] = cricketMockDataT3.playerToScore100M1S2;

    cricketTemplateResult.toScore100in1stInns = service.setScore100In1stInning("TO SCORE 100 IN 1ST INNS - JOE ROOT", cricketTemplateResult, cricketTemplateResult.toScore100in1stInns, selections);
    expect(cricketTemplateResult.toScore100in1stInns[0].betName).toBe("JOE ROOT");
    expect(cricketTemplateResult.toScore100in1stInns[0].betOdds).toBe("12/13");
  });


});
