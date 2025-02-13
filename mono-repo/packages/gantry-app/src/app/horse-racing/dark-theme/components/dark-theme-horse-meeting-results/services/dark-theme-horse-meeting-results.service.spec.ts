import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../../common/mocks/event-feed-url-service.mock';
import { HorseRacingMeetingResultsTemplate } from '../../../../../horse-racing/models/horse-racing-meeting-results.model';
import { MockMeetingResultsMapData } from '../mocks/dark-theme-horse-meeting-results-service.mock';
import { MockMeetingResultsMapData1 } from '../mocks/dark-theme-horse-racestages.mock';
import { DarkThemeHorseMeetingResultsService } from './dark-theme-horse-meeting-results.service';

describe('DarkThemeHorseRacingMeetingResultsService', () => {
    let service: DarkThemeHorseMeetingResultsService;
    let mockData: MockMeetingResultsMapData;
    let mock: MockMeetingResultsMapData1;
    beforeEach(() => {
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(DarkThemeHorseMeetingResultsService);
        mockData = new MockMeetingResultsMapData();
        mock = new MockMeetingResultsMapData1();
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
        expect(result.eventName).toBe('Romford Results');
    });
    it('when prepareResult called, jackPot,placePot and quadPot should be correct', () => {
        const result = service.prepareResult(mockData.meetingResultMap);
        expect(result.jackPot).toBe('1004.56');
        expect(result.placePot).toBe('472.16');
        expect(result.quadPot).toBe('32.17');
    });

    it('when prepareResult called, eachWays, racestage, win, runner count and race off time should be correct', () => {
        const result = service.prepareResult(mockData.meetingResultMap);
        expect(result.horseRacingMeetingResultsTable[0].raceOffTime).toBe('OFF: 12:45:16');
        expect(result.horseRacingMeetingResultsTable[0].eachWays).toBe('EACH-WAY 1/4 1-2-3-4');
        expect(result.horseRacingMeetingResultsTable[0].isStewardEnquiry).toBeTrue;
        expect(result.horseRacingMeetingResultsTable[0].isVoidRace).toBeFalse;
        expect(result.horseRacingMeetingResultsTable[0].runnerCount).toBe('3');
        expect(result.horseRacingMeetingResultsTable[0].win).toBe('20.40');
    });

    it('when prepareResult called, result market - forecast, tricast, exacta, trifecta should be set correctly', () => {
        const result = service.prepareResult(mockData.meetingResultMap);
        expect(result.horseRacingMeetingResultsTable[0].foreCast).toBe('56.15');
        expect(result.horseRacingMeetingResultsTable[0].triCast).toBe('695.10');
        expect(result.horseRacingMeetingResultsTable[0].totes.exacta).toBe('77.10');
        expect(result.horseRacingMeetingResultsTable[0].totes.trifecta).toBe('77.70');
        expect(result.horseRacingMeetingResultsTable[0].placeList[0]).toBe('5.10');
        expect(result.horseRacingMeetingResultsTable[0]?.placeDividends[0]?.dividend).toBe('9.34');
    });

    it('when prepareResult called, horse details should be correct', () => {
        const result = service.prepareResult(mockData.meetingResultMap);
        expect(result.horseRacingMeetingResultsTable[0].runnerList[0].horseName.toUpperCase()).toBe('HORSE1');
        expect(result.horseRacingMeetingResultsTable[0].runnerList[0].position).toBe('1');
        expect(result.horseRacingMeetingResultsTable[0].runnerList[0].horseRunnerNumber).toBe('5');
        expect(result.horseRacingMeetingResultsTable[0].runnerList[0].isDeadHeat).toBeFalse;
        expect(result.horseRacingMeetingResultsTable[0].runnerList[0].favourite).toBe('F');
    });

    it('when Race is virtual then show the Category Title as Virtual Racing', () => {
        const result: HorseRacingMeetingResultsTemplate = service.prepareResult(mockData.meetingResultTricastMap);
        expect(result.isVirtualRace).toBe(true);
    });

    it('set PhotoMessage', () => {
        mock.meetingResultResultingContent.isPhotoFinish = true;
        const horseRacingResultPage = service.setRaceStages(mock.horseRacingMeetingResultsTemplate, mock.horseRacingContent);
        expect(horseRacingResultPage.horseRacingStaticContent.contentParameters.Photo).toBe('PHOTO');
    });

    it('set raceAbandoned Message', () => {
        mock.meetingResultResultingContent.isAbandonedRace = true;
        const horseRacingResultPage = service.setRaceStages(mock.horseRacingMeetingResultsTemplate, mock.horseRacingContent);
        expect(horseRacingResultPage.horseRacingStaticContent.contentParameters.RaceAbandoned).toBe('RACE ABANDONED');
    });

    it('set voidRace Message', () => {
        mock.meetingResultResultingContent.isVoidRace = true;
        const horseRacingResultPage = service.setRaceStages(mock.horseRacingMeetingResultsTemplate, mock.horseRacingContent);
        expect(horseRacingResultPage.horseRacingStaticContent.contentParameters.VoidRace).toBe('VOID RACE');
    });

    it('set isStewardEnquiry(S) Message', () => {
        mock.meetingResultResultingContent.isStewardEnquiry = true;
        mock.meetingResultResultingContent.stewardsState = 'S';
        const horseRacingResultPage = service.setRaceStages(mock.horseRacingMeetingResultsTemplate, mock.horseRacingContent);
        expect(horseRacingResultPage.horseRacingStaticContent.contentParameters.StewardsEnquiry).toBe("STEWARDS' ENQUIRY");
    });

    it('set isStewardEnquiry(R) Message', () => {
        mock.meetingResultResultingContent.isStewardEnquiry = true;
        mock.meetingResultResultingContent.stewardsState = 'R';
        const horseRacingResultPage = service.setRaceStages(mock.horseRacingMeetingResultsTemplate, mock.horseRacingContent);
        expect(horseRacingResultPage.horseRacingStaticContent.contentParameters.StewardsEnquiry).toBe("STEWARDS' ENQUIRY");
    });

    it('set isStewardEnquiry(V) Message', () => {
        mock.meetingResultResultingContent.isStewardEnquiry = true;
        mock.meetingResultResultingContent.stewardsState = 'V';
        const horseRacingResultPage = service.setRaceStages(mock.horseRacingMeetingResultsTemplate, mock.horseRacingContent);
        expect(horseRacingResultPage.horseRacingStaticContent.contentParameters.ResultStands).toBe('RESULT STANDS');
    });

    it('set isStewardEnquiry(Z) Message', () => {
        mock.meetingResultResultingContent.isStewardEnquiry = true;
        mock.meetingResultResultingContent.stewardsState = 'Z';
        const horseRacingResultPage = service.setRaceStages(mock.horseRacingMeetingResultsTemplate, mock.horseRacingContent);
        expect(horseRacingResultPage.horseRacingStaticContent.contentParameters.AmendedResult).toBe('AMENDED RESULT');
    });
});
