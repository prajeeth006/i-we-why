import { TestBed } from '@angular/core/testing';
import { DartCdsService } from './dart-cds.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { DartCdsTemplateResult } from '../models/dart-cds-template.model';
import { MockDartCdsData } from '../mocks/mock-dart-cds-data';

describe('DartCdsService', () => {
  let service: DartCdsService;
  let dartCdsMockdata: MockDartCdsData;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(DartCdsService);
    dartCdsMockdata = new MockDartCdsData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('create dart cds template result and check home team', () => {
    let dartCdsResult = new DartCdsTemplateResult();
    service.prepareMatchBetting(dartCdsResult, dartCdsMockdata.matchBetting);
    if (dartCdsResult.games) {
      expect(dartCdsResult?.games[0]?.matchBetting?.homePlayer).toBe("TURNER");
    }
  });

  it('create dart cds template result and check away team', () => {
    let dartCdsResult = new DartCdsTemplateResult();
    service.prepareMatchBetting(dartCdsResult, dartCdsMockdata.matchBetting);
    if (dartCdsResult.games) {
      expect(dartCdsResult?.games[1]?.matchBetting?.awayPlayer).toBe("LEWIS");
    }
  });

  it('create dart cds template result and check  total frames home team', () => {
    let dartCdsResult = new DartCdsTemplateResult();
    service.prepareTotalFramesBetting(dartCdsResult, dartCdsMockdata.totalFrameBetting);
    if (dartCdsResult.games) {
      expect(dartCdsResult?.games[0]?.totalFrames?.homePlayer).toBe("OVER 4.5");
    }
  });

  it('create dart cds template result and check  total frames away team', () => {
    let dartCdsResult = new DartCdsTemplateResult();
    service.prepareTotalFramesBetting(dartCdsResult, dartCdsMockdata.totalFrameBetting);
    if (dartCdsResult.games) {
      expect(dartCdsResult?.games[1]?.totalFrames?.awayPlayer).toBe("UNDER 4.5");
    }
  });

  it('create dart cds template result and check  match handicap home team', () => {
    let dartCdsResult = new DartCdsTemplateResult();
    service.prepareHandicapBetting(dartCdsResult, dartCdsMockdata.matchHandicap);
    if (dartCdsResult.games) {
      expect(dartCdsResult?.games[0]?.totalFrames?.homePlayer).toBe("ASJAD IQBAL +4.5");
    }
  });

  it('create dart cds template result and check  match handicap away team', () => {
    let dartCdsResult = new DartCdsTemplateResult();
    service.prepareHandicapBetting(dartCdsResult, dartCdsMockdata.matchHandicap);
    if (dartCdsResult.games) {
      expect(dartCdsResult?.games[1]?.totalFrames?.awayPlayer).toBe("THEPCHAIYA UN-NOOH -4.5");
    }
  });

  it('create dart cds template result and check  home correct scorer', () => {
    let dartCdsResult = new DartCdsTemplateResult();
    service.prepareFramesBetting(dartCdsResult, dartCdsMockdata.frameBetting);
    if (dartCdsResult.games) {
      expect(dartCdsResult?.games[0]?.correctScore?.homeTeamScorerList?.length).toBe(14);
    }
  });

  it('create dart cds template result and check  away correct scorer', () => {
    let dartCdsResult = new DartCdsTemplateResult();
    service.prepareFramesBetting(dartCdsResult, dartCdsMockdata.frameBetting);
    if (dartCdsResult.games) {
      expect(dartCdsResult?.games[1]?.correctScore?.awayTeamScorerList?.length).toBe(15);
    }
  });

});
