import { TestBed } from '@angular/core/testing';

import { HorseRacingRunnersService } from './horse-racing-runners.service';
import { MockHorseRacingRunnersData } from '../../mocks/mock-horse-racing-runners-data';
import { HorseRacingRunnersResult } from "../../../../models/horse-racing-template.model";
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HorseRacingRunnersService', () => {
  let sutService: HorseRacingRunnersService;
  let mockHorseRacingRunnersData: MockHorseRacingRunnersData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    sutService = TestBed.inject(HorseRacingRunnersService);
    mockHorseRacingRunnersData = new MockHorseRacingRunnersData();
  });

  it('should be created', () => {
    expect(sutService).toBeTruthy();
  });

  it('when createHorseRacingRunnersResult with null parameters called it should throw error', () => {
    expect(function () { sutService.createHorseRacingRunnersResult(null, null, null) }).toThrowError();
  });

  it('when createHorseRacingRunnersResult with not null parameters called the result should not be null', () => {
    let horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(mockHorseRacingRunnersData.sportBookResult, mockHorseRacingRunnersData.racingContentResult, mockHorseRacingRunnersData.horseRacingContent);

    expect(horseRacingRunnersResult).not.toBeNull();
  });

  it('when createHorseRacingRunnersResult the prices should be set correctly', () => {
    let horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(mockHorseRacingRunnersData.sportBookResult, mockHorseRacingRunnersData.racingContentResult, mockHorseRacingRunnersData.horseRacingContent);

    expect(horseRacingRunnersResult.areCurrentPricesPresent).toBeTrue();
    expect(horseRacingRunnersResult.arePastPricesPresent).toBeFalse();
    expect(horseRacingRunnersResult.arePlus1MarketPricesPresent).toBeTrue();
    expect(horseRacingRunnersResult.arePlus2MarketPricesPresent).toBeTrue();
    expect(horseRacingRunnersResult.bettingFavouritePrice).toBe(1.2);
    //expect(horseRacingRunnersResult.defaultPriceColumn).toBe('CORAL PRICE');
  });

  it('when createHorseRacingRunnersResult called the race info should be set correctly', () => {
    let horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(mockHorseRacingRunnersData.sportBookResult, mockHorseRacingRunnersData.racingContentResult, mockHorseRacingRunnersData.horseRacingContent);

    expect(!!horseRacingRunnersResult.isRaceOff).toBeFalse();
    expect(horseRacingRunnersResult.eventName).toBe('15:30 PLUMPTON');
    //expect(horseRacingRunnersResult.marketEachWayString).toBe('EACH-WAY: 1/5 ODDS, 3 PLACES');
    expect(horseRacingRunnersResult.raceStage).toBe('');
    expect(horseRacingRunnersResult.spotlightHorseName).toBe('HEY FRANKIE');
  });

  it('when createHorseRacingRunnersResult called, markets and selections', () => {
    let horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(mockHorseRacingRunnersData.sportBookResult, mockHorseRacingRunnersData.racingContentResult, mockHorseRacingRunnersData.horseRacingContent);

    expect(horseRacingRunnersResult.markets.length).toBe(3);
    expect(horseRacingRunnersResult.horseRacingEntries.length).toBe(11);
    expect(horseRacingRunnersResult.horseRacingEntries[0].horseName).toBe('FAIRY GEM');
    expect(horseRacingRunnersResult.horseRacingEntries[0].horseNumber).toBe('2');
    if (horseRacingRunnersResult.markets.length == 1) {
      expect(horseRacingRunnersResult.horseRacingEntries[0].jockeyName).toBe('SEAN BOWEN');
      expect(horseRacingRunnersResult.horseRacingEntries[0].jockeyName).not.toBeNull();
    }

    expect(horseRacingRunnersResult.horseRacingEntries[0].currentPrice).toBe(1.2);
    expect(horseRacingRunnersResult.horseRacingEntries[0].nonRunner).toBeFalse();
  });

  it('when createHorseRacingRunnersResult the racingContentAddendum Status for WithDraw', () => {
    let horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(mockHorseRacingRunnersData.sportBookResult, mockHorseRacingRunnersData.racingContentResult, mockHorseRacingRunnersData.horseRacingContent);
    expect(horseRacingRunnersResult.racingContent.sisData.selectionStatus[2].status).toBe('W');
  });

  it('when createHorseRacingRunnersResult the racingContent Status for JC', () => {
    let horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(mockHorseRacingRunnersData.sportBookResult, mockHorseRacingRunnersData.racingContentResult, mockHorseRacingRunnersData.horseRacingContent);
    expect(horseRacingRunnersResult.horseRacingContent.contentParameters.JC).toBe('JC');
  });

  it('when createHorseRacingRunnersResult called, racingposttip should be set correctly at footersection', () => {
    let horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(mockHorseRacingRunnersData.sportBookResult, mockHorseRacingRunnersData.racingContentResult, mockHorseRacingRunnersData.horseRacingContent);
    expect(horseRacingRunnersResult.horseRacingContent.racingPostImage?.src).toBe("https://scmedia.cms.test.env.works/$-$/62461d8ebe87448cab3fc58c48951c56.png");
  });
  it('when createGreyhoundRacingRunnersResult called, set screentype half', () => {
    let horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(mockHorseRacingRunnersData.sportBookResult, mockHorseRacingRunnersData.racingContentResult, mockHorseRacingRunnersData.horseRacingContent);
    expect(horseRacingRunnersResult.racingContent.diomed).toBe("This might go to HEY FRANKIE, who ran well in defeat on her debut at Taunton in October. Peerless Beauty is second choice.");
  });

});
