import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Addendum } from '../../../../../../common/models/general-codes-model';
import { HorseRacingResultPage } from '../../../../../models/horse-racing-template.model';
import { MockDarkThemeHorseRacingRunnersData } from '../../mocks/mock-dark-theme-horse-racing-runners-data';
import { DarkThemeResultService } from './dark-theme-result.service';

describe('DarkThemeResultService', () => {
    let sutService: DarkThemeResultService;
    let mockHorseRacingRunnersData: MockDarkThemeHorseRacingRunnersData;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        sutService = TestBed.inject(DarkThemeResultService);
        mockHorseRacingRunnersData = new MockDarkThemeHorseRacingRunnersData();
    });

    it('should be created', () => {
        expect(sutService).toBeTruthy();
    });

    it('set prepareEventResult', () => {
        const horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage).not.toBeNull();
    });

    it('set setEventResult', () => {
        const horseRacingResultPage: HorseRacingResultPage = sutService.setEventResult(
            mockHorseRacingRunnersData.eventResult,
            mockHorseRacingRunnersData.racingContentResult,
            mockHorseRacingRunnersData.horseRacingContent,
        );
        expect(horseRacingResultPage).not.toBeNull();
    });

    it('set PhotoMessage', () => {
        mockHorseRacingRunnersData.resultingContent.isPhotoFinish = true;
        const horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage.addendumMessageKey).toBe(Addendum.photo);
    });

    it('set raceAbandoned Message', () => {
        mockHorseRacingRunnersData.resultingContent.isAbandonedRace = true;
        const horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage.addendumMessageKey).toBe(Addendum.raceAbandoned);
    });

    it('set voidRace Message', () => {
        mockHorseRacingRunnersData.resultingContent.isVoidRace = true;
        const horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage.addendumMessageKey).toBe(Addendum.voidRace);
    });

    it('set isStewardEnquiry(S) Message', () => {
        mockHorseRacingRunnersData.resultingContent.isStewardEnquiry = true;
        mockHorseRacingRunnersData.resultingContent.stewardsState = 'S';
        const horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage.addendumMessageKey).toBe(Addendum.stewardsEnquiry);
    });

    it('set isStewardEnquiry(R) Message', () => {
        mockHorseRacingRunnersData.resultingContent.isStewardEnquiry = true;
        mockHorseRacingRunnersData.resultingContent.stewardsState = 'R';
        const horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage.addendumMessageKey).toBe(Addendum.stewardsEnquiry);
    });

    it('set isStewardEnquiry(V) Message', () => {
        mockHorseRacingRunnersData.resultingContent.isStewardEnquiry = true;
        mockHorseRacingRunnersData.resultingContent.stewardsState = 'V';
        const horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage.addendumMessageKey).toBe(Addendum.resultStands);
    });

    it('set isStewardEnquiry(Z) Message', () => {
        mockHorseRacingRunnersData.resultingContent.isStewardEnquiry = true;
        mockHorseRacingRunnersData.resultingContent.stewardsState = 'Z';
        const horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage.addendumMessageKey).toBe(Addendum.amendedResult);
    });

    it('Show nonRunners on Footer Section', () => {
        const horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage.horseRaceNonRunnerList).toBe('1, 4, 7');
    });
});
