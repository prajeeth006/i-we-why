import { TestBed } from '@angular/core/testing';

import { SnookerCdsService } from './snooker-cds.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { MockSnookerCdsData } from '../mocks/mock-snooker-cds-data';
import { SnookerCdsTemplateResult } from '../models/snooker-cds-template.model';

describe('SnookerCdsService', () => {
  let service: SnookerCdsService;
  let snookerCdsMockdata: MockSnookerCdsData;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(SnookerCdsService);
    snookerCdsMockdata = new MockSnookerCdsData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('create snooker cds template result and check home team', () => {
    let snookerCdsResult = new SnookerCdsTemplateResult();
    service.prepareMatchBetting(snookerCdsResult, snookerCdsMockdata.matchBetting);
    if (snookerCdsResult.games) {
      expect(snookerCdsResult?.games[0]?.matchBetting?.homePlayer).toBe("A. IQBAL");
    }
  });

  it('create snooker cds template result and check away team', () => {
    let snookerCdsResult = new SnookerCdsTemplateResult();
    service.prepareMatchBetting(snookerCdsResult, snookerCdsMockdata.matchBetting);
    if (snookerCdsResult.games) {
      expect(snookerCdsResult?.games[1]?.matchBetting?.awayPlayer).toBe("T. UN-NOOH");
    }
  });

  it('create snooker cds template result and check  total frames home team', () => {
    let snookerCdsResult = new SnookerCdsTemplateResult();
    service.prepareTotalFramesBetting(snookerCdsResult, snookerCdsMockdata.totalFrameBetting);
    if (snookerCdsResult.games) {
      expect(snookerCdsResult?.games[0]?.totalFrames?.homePlayer).toBe("Over 5.5");
    }
  });

  it('create snooker cds template result and check  total frames away team', () => {
    let snookerCdsResult = new SnookerCdsTemplateResult();
    service.prepareTotalFramesBetting(snookerCdsResult, snookerCdsMockdata.totalFrameBetting);
    if (snookerCdsResult.games) {
      expect(snookerCdsResult?.games[1]?.totalFrames?.awayPlayer).toBe("Under 5.5");
    }
  });

  it('create snooker cds template result and check  match handicap home team', () => {
    let snookerCdsResult = new SnookerCdsTemplateResult();
    service.prepareHandicapBetting(snookerCdsResult, snookerCdsMockdata.matchHandicap);
    if (snookerCdsResult.games) {
      expect(snookerCdsResult?.games[0]?.totalFrames?.homePlayer).toBe("ASJAD IQBAL +4.5");
    }
  });

  it('create snooker cds template result and check  match handicap away team', () => {
    let snookerCdsResult = new SnookerCdsTemplateResult();
    service.prepareHandicapBetting(snookerCdsResult, snookerCdsMockdata.matchHandicap);
    if (snookerCdsResult.games) {
      expect(snookerCdsResult?.games[1]?.totalFrames?.awayPlayer).toBe("THEPCHAIYA UN-NO' -4.5");
    }
  });

  it('create snooker cds template result and check  home correct scorer', () => {
    let snookerCdsResult = new SnookerCdsTemplateResult();
    service.prepareFramesBetting(snookerCdsResult, snookerCdsMockdata.frameBetting);
    if (snookerCdsResult.games) {
      expect(snookerCdsResult?.games[0]?.correctScore?.homeTeamScorerList?.length).toBe(3);
    }
  });

  it('create snooker cds template result and check  away correct scorer', () => {
    let snookerCdsResult = new SnookerCdsTemplateResult();
    service.prepareFramesBetting(snookerCdsResult, snookerCdsMockdata.frameBetting);
    if (snookerCdsResult.games) {
      expect(snookerCdsResult?.games[1]?.correctScore?.awayTeamScorerList?.length).toBe(3);
    }
  });
});
