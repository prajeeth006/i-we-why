import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../common/mocks/activated-route.mock';
import { StewardsStatus } from '../../common/models/general-codes-model';
import { EventFeedUrlServiceMock } from '../mocks/event-feed-url-service.mock';
import { MockLatestResultsMapData } from '../mocks/latest-results-service.mock';
import { MockLatestResultsMapData1 } from '../mocks/latest-results-template.data';
import { LatestResultsTemplate } from '../models/latest-results.model';
import { LatestResultsService } from './latest-results.service';

describe('LatestResultsService', () => {
    let service: LatestResultsService;
    let mockData: MockLatestResultsMapData;
    let mock: MockLatestResultsMapData1;

    beforeEach(() => {
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(LatestResultsService);
        mockData = new MockLatestResultsMapData();
        mock = new MockLatestResultsMapData1();
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

    it('set VoidraceMessage', () => {
        mock.latestResult.isVoidRace = true;
        const horseRacingResultPage: LatestResultsTemplate = service.setLatestResultsTemplate([mock.latestResultContent]);
        expect(horseRacingResultPage.latestResultsTable[0].stewardsState).toBe(StewardsStatus.voidRace);
    });

    it('set PhotoMessage', () => {
        mock.latestResult.isPhotoFinish = true;
        const horseRacingResultPage: LatestResultsTemplate = service.setLatestResultsTemplate([mock.latestResultContent]);
        expect(horseRacingResultPage.latestResultsTable[0].stewardsState).toBe(StewardsStatus.photo);
    });

    it('set isStewardEnquiry(S) Message', () => {
        mock.latestResult.isStewardEnquiry = true;
        mock.latestResult.stewardsState = 'S';
        const horseRacingResultPage: LatestResultsTemplate = service.setLatestResultsTemplate([mock.latestResultContent]);
        expect(horseRacingResultPage.latestResultsTable[0].stewardsState).toBe(StewardsStatus.stewardsEnquiry);
    });
    it('set isStewardEnquiry(R) Message', () => {
        mock.latestResult.isStewardEnquiry = true;
        mock.latestResult.stewardsState = 'R';
        const horseRacingResultPage: LatestResultsTemplate = service.setLatestResultsTemplate([mock.latestResultContent]);
        expect(horseRacingResultPage.latestResultsTable[0].stewardsState).toBe(StewardsStatus.stewardsEnquiry);
    });

    it('set isStewardEnquiry(V) Message', () => {
        mock.latestResult.isStewardEnquiry = true;
        mock.latestResult.stewardsState = 'V';
        const horseRacingResultPage: LatestResultsTemplate = service.setLatestResultsTemplate([mock.latestResultContent]);
        expect(horseRacingResultPage.latestResultsTable[0].stewardsState).toBe(StewardsStatus.resultStands);
    });

    it('set isStewardEnquiry(Z) Message', () => {
        mock.latestResult.isStewardEnquiry = true;
        mock.latestResult.stewardsState = 'Z';
        const horseRacingResultPage: LatestResultsTemplate = service.setLatestResultsTemplate([mock.latestResultContent]);
        expect(horseRacingResultPage.latestResultsTable[0].stewardsState).toBe(StewardsStatus.amendedResult);
    });

    it('when prepareResult called, display status should be displayed', () => {
        const result = service.prepareResult(mockData.meetingResultMap);
        expect(result.latestResultsTable[0].displayStatus).not.toEqual('NotDisplayed');
    });
});
