import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SportBookMarketHelper } from '../../../common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from '../../../common/helpers/sport-book-selection-helper';
import { MockSnookerData } from '../../mocks/mock-snooker-data.mock';
import { BetDetails, Market } from '../../models/snooker.model';

import { SnookerMarketService } from './snooker-market.service';

describe('SnookerMarketService', () => {
  let service: SnookerMarketService;
  let mockdata: MockSnookerData;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(SnookerMarketService);
    mockdata = new MockSnookerData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('match result leftBetList betting', () => {
    let market = new Market();
    let selection = [...mockdata.matchResultSelections][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareMatchResult(selection, teamDetail, market, mockdata.marketResult);
    expect(market.leftBetList.length).toBe(1);
  });

  it('match result rightBetList betting', () => {
    let market = new Market();
    let selection = [...mockdata.matchResultSelections][1][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareMatchResult(selection, teamDetail, market, mockdata.marketResult);
    expect(market.rightBetList.length).toBe(1);
  });

  it('correct score betting', () => {
    let market = new Market();
    let selection = [...mockdata.correctScoreSelections][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareCorrectScore(selection, teamDetail, market, mockdata.marketResult);
    expect(market.leftBetList.length).toBe(1);
  });

  it('handicap leftBetList score betting', () => {
    let market = new Market();
    let selection = [...mockdata.handicapSelections][1][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareHandicapBetting(selection, teamDetail, market, [...mockdata.markets][2][1]);
    expect(market.leftBetList.length).toBe(1);
  });

  it('handicap rightBetList score betting', () => {
    let market = new Market();
    let selection = [...mockdata.handicapSelections][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareHandicapBetting(selection, teamDetail, market, [...mockdata.markets][2][1]);
    expect(market.rightBetList.length).toBe(1);
  });

  it('total frames leftBetList betting', () => {
    let market = new Market();
    let selection = [...mockdata.totalFramesSelections][1][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareTotalFramesBetting(selection, teamDetail, market, [...mockdata.markets][3][1]);
    expect(market.leftBetList.length).toBe(1);
  });

  it('total frames rightBetList betting', () => {
    let market = new Market();
    let selection = [...mockdata.totalFramesSelections][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareTotalFramesBetting(selection, teamDetail, market, [...mockdata.markets][3][1]);
    expect(market.rightBetList.length).toBe(1);
  });

  it('first frame betting', () => {
    let market = new Market();
    let selection = [...mockdata.matchResultSelections][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareFirstFrameBetting(selection, teamDetail, market, mockdata.marketResult);
    expect(market.leftBetList.length).toBe(1);
  });

});
