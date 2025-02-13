import { TestBed } from '@angular/core/testing';
import { CricketCdsService } from './cricket-cds.service';
import { MockCricketCdsData } from '../mocks/mock-cricket-cds-data';
import { MockContext } from 'moxxi';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CricketCdsTemplateResult } from '../models/cricket-cds-template.model';

describe('CricketCdsService', () => {
  let service: CricketCdsService;
  let cricketCdsMockdata: MockCricketCdsData;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(CricketCdsService);
    cricketCdsMockdata = new MockCricketCdsData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Match Betting
  it('create cricket cds template result and check home team', () => {
    let cricketCdsResult = new CricketCdsTemplateResult();
    service.prepareMatchBetting(cricketCdsResult, cricketCdsMockdata.matchBetting);
    if (cricketCdsResult.games) {
      expect(cricketCdsResult?.games[0]?.matchBetting?.homePlayer).toBe("DURHAM");
    }
  });

  it('create cricket cds template result and check away team', () => {
    let cricketCdsResult = new CricketCdsTemplateResult();
    service.prepareMatchBetting(cricketCdsResult, cricketCdsMockdata.matchBetting);
    if (cricketCdsResult.games) {
      expect(cricketCdsResult?.games[1]?.matchBetting?.awayPlayer).toBe("ESSEX");
    }
  });

  it('create cricket cds template result and check  total six home team', () => {
    let cricketCdsResult = new CricketCdsTemplateResult();
    service.prepareTotalSixes(cricketCdsResult, cricketCdsMockdata.totalSixes);
    if (cricketCdsResult.games) {
      expect(cricketCdsResult?.games[0]?.totalSixes?.homePlayer).toBe("Over 5.6");
    }
  });

  it('create cricket cds template result and check  total six away team', () => {
    let cricketCdsResult = new CricketCdsTemplateResult();
    service.prepareTotalSixes(cricketCdsResult, cricketCdsMockdata.totalSixes);
    if (cricketCdsResult.games) {
      expect(cricketCdsResult?.games[1]?.totalSixes?.awayPlayer).toBe("Under 5.6");
    }
  });

  it('create cricket cds template result and check  homeTopRunScorer', () => {
    let cricketCdsResult = new CricketCdsTemplateResult();
    service.prepareHomeTopRunScorer(cricketCdsResult, cricketCdsMockdata.homeTopRunScorer);
    if (cricketCdsResult.games) {
      expect(cricketCdsResult?.games[0]?.topRunScorer?.homeTeamTopRunScorerList?.length).toBe(4);
    }
  });

  it('create cricket cds template result and check  awayTopRunScorer', () => {
    let cricketCdsResult = new CricketCdsTemplateResult();
    service.prepareAwayTopRunScorer(cricketCdsResult, cricketCdsMockdata.awayTopRunScorer);
    if (cricketCdsResult.games) {
      expect(cricketCdsResult?.games[1]?.topRunScorer?.awayTeamTopRunScorerList?.length).toBe(5);
    }
  });
});
