import { TestBed } from '@angular/core/testing';
import { BetDetails, Market } from '../../../models/football.model';
import { FootballMarketService } from './football-market.service';
import { MockFootballData } from '../../../mocks/mock-football-data';
import { SportBookSelectionHelper } from '../../../../common/helpers/sport-book-selection-helper';
import { SportBookMarketHelper } from '../../../../common/helpers/sport-book-market.helper';

describe('FootballMarketService', () => {
  let service: FootballMarketService;
  let mockdata: MockFootballData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FootballMarketService);
    mockdata = new MockFootballData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('match result market should set home bet', () => {
    let market = new Market();
    let selection = [...mockdata.matchResultSelections][1][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareMatchResult(selection, teamDetail, market, mockdata.marketResult);
    expect(market?.leftBetList?.length).toBe(1);
  });

  it('match result market should set draw bet', () => {
    let market = new Market();
    let selection = [...mockdata.matchResultSelections][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareMatchResult(selection, teamDetail, market, mockdata.marketResult);
    expect(market?.drawBetList?.length).toBe(1);
  });

  it('match result market should set away bet', () => {
    let market = new Market();
    let selection = [...mockdata.matchResultSelections][2][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareMatchResult(selection, teamDetail, market, mockdata.marketResult);
    expect(market?.rightBetList?.length).toBe(1);
  });

  it('half time full time market result should set home bet', () => {
    let market = new Market();
    let selection = [...mockdata.halfTimeFullTimeSelections][1][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareHalfTimeFullTime(selection, teamDetail, market, mockdata.marketResult);
    expect(market.leftBetList.length).toBe(1);
  });

  it('half time full time market result should set awy bet', () => {
    let market = new Market();
    let selection = [...mockdata.halfTimeFullTimeSelections][7][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareHalfTimeFullTime(selection, teamDetail, market, mockdata.marketResult);
    expect(market.rightBetList.length).toBe(1);
  });

  it('first goal scorer result should set home bet', () => {
    let market = new Market();
    let selection = [...mockdata.firstGoalScorerSelections][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareFirstGoalScorer(selection, teamDetail, market);
    expect(market.rightBetList.length).toBe(1);
  });

  it('correct score market should set home bet', () => {
    let market = new Market();
    let selection = [...mockdata.correctScoreSelections][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareCorrectScore(selection, teamDetail, market, mockdata.marketResult);
    expect(market.leftBetList.length).toBe(1);
  });

  it('correct score market should set away bet', () => {
    let market = new Market();
    let selection = [...mockdata.correctScoreSelections][18][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareCorrectScore(selection, teamDetail, market, mockdata.marketResult);
    expect(market.rightBetList.length).toBe(1);
  });


  it('Both Teams To Score should set Yes bet', () => {
    let market = new Market();
    let selection = [...mockdata.bothTeamsToScore][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareBothTeamsToScore(selection, teamDetail, market);
    expect(market.rightBetList.length).toBe(1);
  });


  it('Match Result and Both Teams should set Home bet', () => {
    let market = new Market();
    let selection = [...mockdata.matchResultAndBothTeamsToScore][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareMatchResultBothTeamsToScore(selection, teamDetail, market, mockdata.marketResult);
    expect(market.leftBetList.length).toBe(1);
  });


  it('Total Goals In the Match should set Over bet', () => {
    let market = new Market();
    let selection = [...mockdata.totalGoalsInTheMatch][0][1];
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    let teamDetail = new BetDetails(selection.selectionName, odds);
    service.prepareTotalGloasInTheMatch("", 0.5, selection, teamDetail, market);
    expect(market.leftBetList.length).toBe(1);
  });

});
