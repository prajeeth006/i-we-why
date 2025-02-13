import { TestBed } from '@angular/core/testing';
import { DartTemplateService } from './dart-template.service';
import { MockDartData } from '../mocks/mocks-dart-data.mock';
import { MockDartNoDrawData } from '../mocks/mocks-dart-nodraw-data.mock';
import { MockContext } from 'moxxi';
import { EventFeedUrlServiceMock } from '../../common/mocks/event-feed-url-service.mock';
import { ActivatedRouteMock } from '../../common/mocks/activated-route.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GantryMock } from '../../common/mocks/gantrymarkets.mock';

describe('DartTemplateService', () => {
  let service: DartTemplateService;
  let mockDartData: MockDartData;
  let mockDartNoDrawData: MockDartNoDrawData;
  let gantryMockData: GantryMock;

  beforeEach(() => {
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(DartTemplateService);
    mockDartData = new MockDartData();
    mockDartNoDrawData = new MockDartNoDrawData();
    gantryMockData = new GantryMock();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Dart: set event key and market keys', () => {
    expect(service.setEvenKeyAndMarketKeys(mockDartData.eventId, mockDartData.marketIds)).toBe();
  });

  it('Check dart for match betting market and check home team bet name', () => {
    expect(service.prepareResult(mockDartData.sportBookResult, mockDartData.dartMockDataContent, gantryMockData.Data).mainEventInfoPanel.homeTeamDetails.betName).toBe("Ken Mather");
  });

  it('Check dart for match betting market and check away team bet name', () => {
    expect(service.prepareResult(mockDartData.sportBookResult, mockDartData.dartMockDataContent, gantryMockData.Data).mainEventInfoPanel.awayTeamDetails.betName).toBe("Beau Anderson");
  });

  it('DRAW : Check dart for match betting market and check DRAW bet name', () => {
    expect(service.prepareResult(mockDartData.sportBookResult, mockDartData.dartMockDataContent, gantryMockData.Data).mainEventInfoPanel.drawDetails.betName).toBe("DRAW");
  });

  it('Check dart for match betting market and check away team bet name', () => {
    expect(service.prepareResult(mockDartNoDrawData.sportBookResult, mockDartNoDrawData.dartMockDataContent, gantryMockData.Data).mainEventInfoPanel.awayTeamDetails.betName).toBe("Beau Anderson");
  });

  it('mockDartNoDrawData Draw team bet name should be empty', () => {
    expect(service.prepareResult(mockDartNoDrawData.sportBookResult, mockDartNoDrawData.dartMockDataContent, gantryMockData.Data).mainEventInfoPanel.drawDetails).toBeUndefined();
  });

  it('Check dart for handicap betting market and check home team bet name', () => {
    expect(service.prepareResult(mockDartData.sportBookResult, mockDartData.dartMockDataContent, gantryMockData.Data).handicapBettingInfoPanel?.homeTeamDetails.betName).toContain("Ken Mather");
  });

  it('Check dart for handicap betting market and check away team bet name', () => {
    expect(service.prepareResult(mockDartData.sportBookResult, mockDartData.dartMockDataContent, gantryMockData.Data).handicapBettingInfoPanel?.awayTeamDetails.betName).toContain("Beau Anderson");
  });

  it('Check dart for total 180s betting market and check home team bet name', () => {
    expect(service.prepareResult(mockDartData.sportBookResult, mockDartData.dartMockDataContent, gantryMockData.Data).most180SBettingInfoPanel?.homeTeamDetails.betName).toBe("Ken Mather");
  });

  it('Check dart for total 180s betting market and check away team bet name', () => {
    expect(service.prepareResult(mockDartData.sportBookResult, mockDartData.dartMockDataContent, gantryMockData.Data).most180SBettingInfoPanel?.awayTeamDetails.betName).toBe("Beau Anderson");
  });

  it('Check dart for  correct score betting market and check home team bet name', () => {
    expect(service.prepareResult(mockDartData.sportBookResult, mockDartData.dartMockDataContent, gantryMockData.Data).correctScoreBettingInfoPanel.homeTeamListDetails[0].betName).toBe("6-7");
  });

  it('Check dart for correct score betting market and check away team bet name', () => {
    expect(service.prepareResult(mockDartData.sportBookResult, mockDartData.dartMockDataContent, gantryMockData.Data).correctScoreBettingInfoPanel?.awayTeamListDetails[0].betName).toBe("6-7");
  });

});
