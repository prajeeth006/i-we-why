import { TestBed } from '@angular/core/testing';

import { EpsTemplateService } from './eps-template.service';
import { EpsTemplateServiceMocksData } from '../mocks/mock-eps-data.mock';
import { EpsFavorite2ServiceMocksData } from '../mocks/mock-eps-favorite2-data.mock';
import { EpsFavorite3ServiceMocksData } from '../mocks/mock-eps-favorite3-data.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';

describe('EpsTemplateService', () => {
  let service: EpsTemplateService;
  let mockEPSData: EpsTemplateServiceMocksData;
  let mockEPS2FData: EpsFavorite2ServiceMocksData;
  let mockEPS3FData: EpsFavorite3ServiceMocksData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(EpsTemplateService);
    mockEPSData = new EpsTemplateServiceMocksData();
    mockEPS2FData = new EpsFavorite2ServiceMocksData();
    mockEPS3FData = new EpsFavorite3ServiceMocksData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Check eps typename', () => {
     expect(service.prepareResult(mockEPSData.sportBookResult).epsResultGroupedSorted[0]?.meetingName).toBe("OOTY");
  });

  it('Check eps show JF if 2 runners have same favorite prices.', () => {
      expect(service.prepareResult(mockEPS2FData.sportBookResult).epsResultGroupedSorted[0]?.events[0]?.allRunnerSelections[0]?.favourite).toBe("JF");
  });

  it('Check eps show CF if 3 or more runners have same favorite prices.', () => {
    expect(service.prepareResult(mockEPS3FData.sportBookResult).epsResultGroupedSorted[0]?.events[0]?.allRunnerSelections[0]?.favourite).toBe("CF");
  });


  it('set PhotoMessage', () => {
    mockEPSData.tricastResult.isPhotoFinish = true;
    let horseRacingEpsPage = service.prepareMeetingResult(mockEPSData.event2Tricast, mockEPSData.EpsHorseRacing);
    expect(horseRacingEpsPage.stewardsState).toBe("PHOTO");

  });

  it('set raceAbandoned Message', () => {
    mockEPSData.tricastResult.isAbandonedRace = true;
    let horseRacingEpsPage = service.prepareMeetingResult(mockEPSData.event2Tricast, mockEPSData.EpsHorseRacing);
    expect(horseRacingEpsPage.stewardsState).toBe("ABANDONED");

  });

  it('set voidRace Message', () => {
    mockEPSData.tricastResult.isVoidRace = true;
    let horseRacingEpsPage = service.prepareMeetingResult(mockEPSData.event2Tricast, mockEPSData.EpsHorseRacing);
    expect(horseRacingEpsPage.stewardsState).toBe("VOID RACE");

  });

  it('set marketSettled Message', () => {
    mockEPSData.tricastResult.isMarketSettled = true;
    let horseRacingEpsPage = service.prepareMeetingResult(mockEPSData.event2Tricast, mockEPSData.EpsHorseRacing);
    expect(horseRacingEpsPage.stewardsState).toBe("RESULT");

  });


  it('set isStewardEnquiry(S) Message', () => {
    mockEPSData.tricastResult.isStewardEnquiry = true;
    mockEPSData.tricastResult.stewardsState = "S";
    let horseRacingEpsPage = service.prepareMeetingResult(mockEPSData.event2Tricast, mockEPSData.EpsHorseRacing);
    expect(horseRacingEpsPage.stewardsState).toBe("STEWARDS' ENQUIRY");
  });

  it('set isStewardEnquiry(R) Message', () => {
    mockEPSData.tricastResult.isStewardEnquiry = true;
    mockEPSData.tricastResult.stewardsState = "R";
    let horseRacingEpsPage = service.prepareMeetingResult(mockEPSData.event2Tricast, mockEPSData.EpsHorseRacing);
    expect(horseRacingEpsPage.stewardsState).toBe("STEWARDS' ENQUIRY");
  });

  it('set isStewardEnquiry(V) Message', () => {
    mockEPSData.tricastResult.isStewardEnquiry = true;
    mockEPSData.tricastResult.stewardsState = "V";
    let horseRacingEpsPage = service.prepareMeetingResult(mockEPSData.event2Tricast, mockEPSData.EpsHorseRacing);
    expect(horseRacingEpsPage.stewardsState).toBe("RESULT STANDS");
  });

  it('set isStewardEnquiry(Z) Message', () => {
    mockEPSData.tricastResult.isStewardEnquiry = true;
    mockEPSData.tricastResult.stewardsState = "Z";
    let horseRacingEpsPage = service.prepareMeetingResult(mockEPSData.event2Tricast, mockEPSData.EpsHorseRacing);
    expect(horseRacingEpsPage.stewardsState).toBe("AMENDED RESULT");
  });

});
