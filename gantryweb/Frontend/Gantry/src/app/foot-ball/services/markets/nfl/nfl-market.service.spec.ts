import { TestBed } from '@angular/core/testing';

import { NflMarketService } from './nfl-market.service';
import { BetDetails, Market } from '../../../models/football.model';
import { MockNFLData } from '../../../mocks/mock-nfl-data';
import { SportBookSelectionHelper } from '../../../../common/helpers/sport-book-selection-helper';
import { SportBookMarketHelper } from '../../../../common/helpers/sport-book-market.helper';

describe('NflMarketService', () => {
  let service: NflMarketService;
  let mockdata: MockNFLData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NflMarketService);
    mockdata = new MockNFLData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('match result market should set away bet', () => {
    let market = new Market();
    let selection = [...mockdata.firstTouchdownScorerSelections][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareFirstTouchdownScorer(selection, teamDetail, market);
    expect(market.rightBetList.length).toBe(1);
  });

  it('handicap betting market should set away bet', () => {
    let market = new Market();
    let selection = [...mockdata.handicapSelections][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareHandicapBetting(selection, teamDetail, market, [...mockdata.markets][1][1]);
    expect(market.leftBetList.length).toBe(1);
  });

  it('handicap betting market should set home bet', () => {
    let market = new Market();
    let selection = [...mockdata.handicapSelections][1][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareHandicapBetting(selection, teamDetail, market, [...mockdata.markets][1][1]);
    expect(market.rightBetList.length).toBe(1);
  });

  it('match result market should set away bet', () => {
    let market = new Market();
    let selection = [...mockdata.multilineSelections][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareMoneyLine(selection, teamDetail, market, mockdata.marketResult);
    expect(market.leftBetList.length).toBe(1);
  });

  it('prepare Winning Margin market should set home bet', () => {
    let market = new Market();
    let selection = [...mockdata.winningMarginSelections][2][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    spyOn(service, "updateTeamDetails").and.returnValue(teamDetail);
    service.prepareWinningMargin(selection, teamDetail, market, mockdata.marketResult);
    expect(market.rightBetList[0].betName).toBe("OHIO STATE TO WIN BY 7-12");
    expect(market.rightBetList[0].betOdds).toBe("1/50");
    expect(market.rightBetList.length).toBe(1);
    expect(service.updateTeamDetails).toHaveBeenCalled();
  });

  it('prepare Winning Margin market should set away bet', () => {
    let market = new Market();
    let selection = [...mockdata.winningMarginSelections][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    spyOn(service, "updateTeamDetails").and.returnValue(teamDetail);
    service.prepareWinningMargin(selection, teamDetail, market, mockdata.marketResult);
    expect(market.leftBetList[0].betName).toBe("UTAH TO WIN BY 7-12");
    expect(market.leftBetList[0].betOdds).toBe("1/50");
    expect(market.leftBetList.length).toBe(1);
    expect(service.updateTeamDetails).toHaveBeenCalled();
  });

  it('prepare First Half Handicap market should set away bet', () => {
    let market = new Market();
    let selection = [...mockdata.handicapSelections][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareHandicapBetting(selection, teamDetail, market, [...mockdata.markets][1][1]);
    expect(market.leftBetList.length).toBe(1);
  });

  it('prepare First Half Handicap market should set home bet', () => {
    let market = new Market();
    let selection = [...mockdata.handicapSelections][1][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareHandicapBetting(selection, teamDetail, market, [...mockdata.markets][1][1]);
    expect(market.rightBetList.length).toBe(1);
  });

  it('prepare prepare Total MatchPoints market should set away bet', () => {
    let market = new Market();
    let selection = [...mockdata.totalPointsSelections][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareTotalMatchPoints(selection, teamDetail, market, [...mockdata.markets][4][1]);
    expect(market.leftBetList.length).toBe(1);
  });

  it('prepare prepare Total MatchPoints market should set home bet', () => {
    let market = new Market();
    let selection = [...mockdata.totalPointsSelections][1][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareTotalMatchPoints(selection, teamDetail, market, [...mockdata.markets][4][1]);
    expect(market.rightBetList.length).toBe(1);
  });

});
