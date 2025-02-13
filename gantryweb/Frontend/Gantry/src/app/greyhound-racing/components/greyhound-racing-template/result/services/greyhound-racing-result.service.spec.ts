import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../../common/mocks/event-feed-url-service.mock';
import { GreyhoundRacingResultService } from './greyhound-racing-result.service';
import { MockGreyhoundRacingResultData } from '../../mocks/mock-greyhound-racing-results-data'
import { MockGreyhoundRacingResultTCData } from '../../mocks/mock-greyhound-racing-results-data-TC'
import { RouterTestingModule } from '@angular/router/testing';
import { GreyhoundRacingResultPage } from '../../../../models/greyhound-racing-template.model';

describe('GreyhoundRacingResultService', () => {
  let service: GreyhoundRacingResultService;
  let mockData: MockGreyhoundRacingResultData;
  let tcMockData: MockGreyhoundRacingResultTCData;

  beforeEach(() => {
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(GreyhoundRacingResultService);
    mockData = new MockGreyhoundRacingResultData();
    tcMockData = new MockGreyhoundRacingResultTCData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('when createGreyhoundRacingResultPage with null parameters called it should throw error', () => {
    expect(function () { service.createGreyhoundRacingResultPage(null, null, null) }).toThrowError();
  });

  it('when createGreyhoundRacingResultPage with not null parameters called the result should not be null', () => {
    let result = service.createGreyhoundRacingResultPage(mockData.racingContentResult, mockData.greyhoundRacingContent, mockData.eventResult);

    expect(result).not.toBeNull();
  });

  it('when createGreyhoundRacingResultPage called, eventname, distance and race off time should be correct', () => {
    let result = service.createGreyhoundRacingResultPage(mockData.racingContentResult, mockData.greyhoundRacingContent, mockData.eventResult);
    // expect(result.eventName).toBe('17:08 Romford Results');
    expect(result.distance).toBe('480m');
    // expect(result.raceOff).toBe('RACE OFF : 12:45:16');
  });

  it('when createGreyhoundRacingResultPage called, runner details should be set correctly', () => {
    let result = service.createGreyhoundRacingResultPage(mockData.racingContentResult, mockData.greyhoundRacingContent, mockData.eventResult);

    expect(result.runners[0].position).toBe("1");
    expect(result.runners[0].isJointFavourite).toBeTrue;
    expect(result.runners[1].isDeadHeat).toBeTrue;
    expect(result.runners[2].greyhoundName).toBe('SELECTION THREE');
    expect(result.runners[3].runnerNumber).toBe("5");
  });

  it('when createGreyhoundRacingResultPage called, forecast, tricast should be correct', () => {
    let result = service.createGreyhoundRacingResultPage(mockData.racingContentResult, mockData.greyhoundRacingContent, mockData.eventResult);
    expect(result.forecast).toBe('56.15');
    expect(result.tricast).toBe('695.10');
  });

  it('when createGreyhoundRacingResultPage called, runner count and each way should be correct', () => {
    let result = service.createGreyhoundRacingResultPage(mockData.racingContentResult, mockData.greyhoundRacingContent, mockData.eventResult);
    expect(result.runnerCount).toBe('3');
    expect(result.eachWay).toBe('EACH-WAY: 1/4 ODDS, 4 PLACES');
  });

  it('Third position should be TC even if one or more than one runner in third position.', () => {
    let result:GreyhoundRacingResultPage  = service.createGreyhoundRacingResultPage(tcMockData.racingContentResult, tcMockData.greyhoundRacingContent, tcMockData.eventResult);
    expect(result.runners[1].price).toBe('14');
    expect(result.runners[2].price).toBe('20');
  });

});
