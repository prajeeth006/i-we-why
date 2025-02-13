import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../mocks/event-feed-url-service.mock';
import { MockLatestResultsMapData } from '../../mocks/latest-results-service.mock';
import { DarkThemeLatestFourResultsService } from './dark-theme-latest-four-results.service';

describe('LatestResultsService', () => {
    let service: DarkThemeLatestFourResultsService;
    let mockData: MockLatestResultsMapData;

    beforeEach(() => {
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(DarkThemeLatestFourResultsService);
        mockData = new MockLatestResultsMapData();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when prepareResult with not null parameters called the result should not be null', () => {
        const result = service.prepareResult(mockData);
        expect(result).not.toBeNull();
    });

    it('when prepareResult called, eventname should be correct', () => {
        const result = service.prepareResult(mockData.meetingResultMap);
        expect(result.latestResultsTable[0].eventName).toBe('HOT BALLOON');
    });

    it('when prepareResult called, eachWays should be correct', () => {
        const result = service.prepareResult(mockData.meetingResultMap);
        expect(result.latestResultsTable[0].eachWays).toBe('EACH-WAY 1/4 1-2-3');
    });

    it('when prepareResult called, result market - forecast, tricast should be set correctly', () => {
        const result = service.prepareResult(mockData.meetingResultMap);
        expect(result.latestResultsTable[0].foreCast).toBe('568.26');
        expect(result.latestResultsTable[0].triCast).toBe('695.10');
    });

    it('when prepareResult called, horse details should be correct', () => {
        const result = service.prepareResult(mockData.meetingResultMap);
        expect(result.latestResultsTable[0].runnerList[0].selectionName).toBe('DUMPY DAVE');
        expect(result.latestResultsTable[0].runnerList[0].position).toBe('1');
        expect(result.latestResultsTable[0].runnerList[0].selectionRunnerNumber).toBe('2');
        expect(result.latestResultsTable[0].runnerList[0].isDeadHeat).toBeFalse;
        expect(result.latestResultsTable[0].runnerList[0].jointFavorite).toBe('F');
    });

    it('when prepareResult called, display status should be displayed', () => {
        const result = service.prepareResult(mockData.meetingResultMap);
        expect(result.latestResultsTable[0].displayStatus).not.toEqual('NotDisplayed');
    });
});
