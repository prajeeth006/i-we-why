import { TestBed } from '@angular/core/testing';

import { RugbyCdsService } from './rugby-cds.service';
import { MockRugbyCdsData } from '../mocks/mock-rugby-cds-data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { RugbyCdsTemplateResult } from '../models/rugby-cds-template.model';

describe('RubyCdsService', () => {
  let service: RugbyCdsService;
  let mockRugbyCdsData: MockRugbyCdsData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(RugbyCdsService);
    mockRugbyCdsData = new MockRugbyCdsData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  // Match Betting
  it('create rugby cds template result and check home team', () => {
    let rugbyCdsResult = new RugbyCdsTemplateResult();
    service.prepareMatchBetting(rugbyCdsResult, mockRugbyCdsData.matchBetting);
    if (rugbyCdsResult.games) {
      expect(rugbyCdsResult?.games[0]?.matchBetting?.homePlayer).toBe("Australia - TestQA1");
    }
  });

  it('create rugby cds template result and check draw team', () => {
    let rugbyCdsResult = new RugbyCdsTemplateResult();
    service.prepareMatchBetting(rugbyCdsResult, mockRugbyCdsData.matchBetting);
    if (rugbyCdsResult.games) {
      expect(rugbyCdsResult?.games[1]?.matchBetting?.drawPrice).toBe("23/4");
    }
  });

  it('create rugby cds template result and check away team', () => {
    let rugbyCdsResult = new RugbyCdsTemplateResult();
    service.prepareMatchBetting(rugbyCdsResult, mockRugbyCdsData.matchBetting);
    if (rugbyCdsResult.games) {
      expect(rugbyCdsResult?.games[2]?.matchBetting?.awayPlayer).toBe("England");
    }
  });

  // Handicap Betting

  it('create rugby cds template result and check handicap home team', () => {
    let rugbyCdsResult = new RugbyCdsTemplateResult();
    service.prepareHandicapBetting(rugbyCdsResult, mockRugbyCdsData.handicapBetting);
    if (rugbyCdsResult.games) {
      expect(rugbyCdsResult?.games[0]?.handicapBetting?.homePlayer).toBe("Australia -1.5");
    }
  });

  it('create rugby cds template result and check handicap away team', () => {
    let rugbyCdsResult = new RugbyCdsTemplateResult();
    service.prepareHandicapBetting(rugbyCdsResult, mockRugbyCdsData.handicapBetting);
    if (rugbyCdsResult.games) {
      expect(rugbyCdsResult?.games[0]?.handicapBetting?.awayPlayer).toBe("England +1.5");
    }
  });

   // Total Points Betting

   it('create rugby cds template result and check total points home team', () => {
    let rugbyCdsResult = new RugbyCdsTemplateResult();
    service.prepareTotalPointsBetting(rugbyCdsResult, mockRugbyCdsData.totalPointsBetting);
    if (rugbyCdsResult.games) {
      expect(rugbyCdsResult?.games[0]?.totalPointsBetting?.homePlayer).toBe("Under 54.5");
    }
  });

  it('create rugby cds template result and check total points away team', () => {
    let rugbyCdsResult = new RugbyCdsTemplateResult();
    service.prepareTotalPointsBetting(rugbyCdsResult, mockRugbyCdsData.totalPointsBetting);
    if (rugbyCdsResult.games) {
      expect(rugbyCdsResult?.games[0]?.totalPointsBetting?.awayPlayer).toBe("Over 54.5");
    }
  });

  //First Match HandicapBetting

  it('create rugby cds template result and check First Match HandicapBetting home team', () => {
    let rugbyCdsResult = new RugbyCdsTemplateResult();
    service.prepareFirstMatchHandicapBetting(rugbyCdsResult, mockRugbyCdsData.firstHalfHandicapBetting);
    if (rugbyCdsResult.games) {
      expect(rugbyCdsResult?.games[0]?.firstHanicapBetting?.homePlayer).toBe("Australia -4.5");
    }
  });

  it('create rugby cds template result and check First Match HandicapBetting away team', () => {
    let rugbyCdsResult = new RugbyCdsTemplateResult();
    service.prepareFirstMatchHandicapBetting(rugbyCdsResult, mockRugbyCdsData.firstHalfHandicapBetting);
    if (rugbyCdsResult.games) {
      expect(rugbyCdsResult?.games[0]?.firstHanicapBetting?.awayPlayer).toBe("England +4.5");
    }
  });
});
