import { TestBed } from '@angular/core/testing';

import { GolfCdsService } from './golf-cds.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { MockGolfCdsData } from '../mocks/mock-golf-cds-data';
import { GameDetails, GolfCdsTemplateResult, GolfData } from '../models/golf-cds-template.model';

describe('GolfCdsService', () => {
  let service: GolfCdsService;
  let golfCdsMockdata: MockGolfCdsData;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(GolfCdsService);
    golfCdsMockdata = new MockGolfCdsData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('to check golf cds template sport name', () => {
    let golfCdsResult = new GolfCdsTemplateResult();
    service.getGolfRunnersDetails(golfCdsMockdata.GolfEventData, golfCdsResult);
    if (golfCdsResult?.sportName) {
      expect(golfCdsResult?.sportName).toBe("GOLF");
    }
  });

  it('to check golf cds template competition name', () => {
    let golfCdsResult = new GolfCdsTemplateResult();
    service.getGolfRunnersDetails(golfCdsMockdata.GolfEventData, golfCdsResult);
    if (golfCdsResult?.competitionName) {
      expect(golfCdsResult?.competitionName).toBe("BRITISH OPEN CHAMPIONSHIP");
    }
  });

  it('to check golf cds template market name', () => {
    let golfCdsResult = new GolfCdsTemplateResult();
    service.getGolfRunnersDetails(golfCdsMockdata.GolfEventData, golfCdsResult);
    if (golfCdsResult?.title) {
      expect(golfCdsResult?.title).toBe("1ST ROUND 3-BALLS");
    }
  });

  it('to check golf cds template event date range', () => {
    let golfCdsResult = new GolfCdsTemplateResult();
    service.getGolfRunnersDetails(golfCdsMockdata.GolfEventData, golfCdsResult);
    if (golfCdsResult?.eventDateTimeInputValue) {
      expect(golfCdsResult?.eventDateTimeInputValue).toBe("TUESDAY 31 OCTOBER");
    }
  });

  it('to check golf cds template event selections count', () => {
    let golfCdsResult = new GolfCdsTemplateResult();
    golfCdsResult.golfData = new GolfData();
    golfCdsResult.golfData.gameDetails = new Array<GameDetails>();
    service.getGolfRunnersDetails(golfCdsMockdata.GolfEventData, golfCdsResult);
    if (!!golfCdsResult.golfData) {
      golfCdsResult.golfData.gameDetails.forEach((runners: GameDetails) => {
        expect(runners.runnerDetails?.length).toBe("3");
      })
    }

  });

  it('to check golf cds template event selections names', () => {
    let golfCdsResult = new GolfCdsTemplateResult();
    golfCdsResult.golfData = new GolfData();
    golfCdsResult.golfData.gameDetails = new Array<GameDetails>();
    service.getGolfRunnersDetails(golfCdsMockdata.GolfEventData, golfCdsResult);
    if (!!golfCdsResult.golfData) {
      golfCdsResult.golfData.gameDetails.forEach((runners: GameDetails) => {
        if (!!runners.runnerDetails) {
          expect(runners.runnerDetails[0].betName).toBe("IAN POULTER");
          expect(runners.runnerDetails[0].betOdds).toBe("20");
        }

      })
    }

  });

});
