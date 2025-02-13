import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../common/mocks/event-feed-url-service.mock';
import { GreyhoundMeetingResultsService } from './greyhound-meeting-results.service';
import { MockMeetingResultsMapData } from '../mocks/greyhounds-meeting-results.service.mock'
import { RouterTestingModule } from '@angular/router/testing';

describe('GreyhoundMeetingResultsService', () => {
    let service: GreyhoundMeetingResultsService;
    let mockData: MockMeetingResultsMapData;

    beforeEach(() => {
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [MockContext.providers]
        });
        service = TestBed.inject(GreyhoundMeetingResultsService);
        mockData = new MockMeetingResultsMapData();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when prepareResult with not null parameters called the result should not be null', () => {
        let result = service.prepareResult(mockData);
        expect(result).not.toBeNull();
    });

    it('when prepareResult called eventname should be correct', () => {
        let result = service.prepareResult(mockData.meetingResultMap);
        expect(result.eventName).toBe('ROMFORD RESULTS');
    });

    it('when prepareResult called, eachWays, racestage, win, runner count and race off time should be correct', () => {
        let result = service.prepareResult(mockData.meetingResultMap);
        expect(result.greyhoundMeetingResultsTable[0].foreCast).toBe('56.15');
        expect(result.greyhoundMeetingResultsTable[0].triCast).toBe('695.10');
    });

    it('when prepareResult called prices and favourite tag for runners should be set correctly', () => {
        let result = service.prepareResult(mockData.meetingResultMap);
        expect(result.greyhoundMeetingResultsTable[0]?.runnerList[0]?.price).toBe('14');
        expect(result.greyhoundMeetingResultsTable[0]?.runnerList[1]?.price).toBe('20');
        expect(result.greyhoundMeetingResultsTable[0]?.runnerList[0]?.favourite).toBe('F');
        expect(result.greyhoundMeetingResultsTable[0]?.runnerList[1]?.favourite).toBeUndefined;
    });
        
    it("when Race is virtual then show the Category Title as Virtual Racing", () => {
        let result = service.prepareResult(mockData);
        expect(result.isVirtualRace).toBe(true);
    });
});
