import { TestBed } from '@angular/core/testing';
import { HorseRacingResultPage } from '../../../../models/horse-racing-template.model';
import { MockHorseRacingRunnersData } from '../../mocks/mock-horse-racing-runners-data';
import { HorseRacingResultService } from './horse-racing-result.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Addendum } from '../../../../../common/models/general-codes-model';

describe('HorseRacingResultService', () => {
    let sutService: HorseRacingResultService;
    let mockHorseRacingRunnersData: MockHorseRacingRunnersData;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
        });
        sutService = TestBed.inject(HorseRacingResultService);
        mockHorseRacingRunnersData = new MockHorseRacingRunnersData();
    });

    it('should be created', () => {
        expect(sutService).toBeTruthy();
    });

    it('set prepareEventResult', () => {
        let horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage).not.toBeNull();
    });

    it('set setEventResult', () => {
        let horseRacingResultPage: HorseRacingResultPage = sutService.setEventResult(mockHorseRacingRunnersData.eventResult, mockHorseRacingRunnersData.racingContentResult, mockHorseRacingRunnersData.horseRacingContent);
        expect(horseRacingResultPage).not.toBeNull();
    });


    // it('set TC for 3rd position when Tricast available in each way 2 places', () => {
    //     let horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
    //     expect(horseRacingResultPage.runners[2].horseOdds).toBe("TC");
    // });

    it('set PhotoMessage', () => {
        mockHorseRacingRunnersData.resultingContent.isPhotoFinish = true;
        let horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage.addendumMessageKey).toBe(Addendum.photo);
    });

    it('set raceAbandoned Message', () => {
        mockHorseRacingRunnersData.resultingContent.isAbandonedRace = true;
        let horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage.addendumMessageKey).toBe(Addendum.raceAbandoned);
    });

    it('set voidRace Message', () => {
        mockHorseRacingRunnersData.resultingContent.isVoidRace = true;
        let horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage.addendumMessageKey).toBe(Addendum.voidRace);
    });

    it('set isStewardEnquiry(S) Message', () => {
        mockHorseRacingRunnersData.resultingContent.isStewardEnquiry = true;
        mockHorseRacingRunnersData.resultingContent.stewardsState = "S";
        let horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage.addendumMessageKey).toBe(Addendum.stewardsEnquiry);
    });

    it('set isStewardEnquiry(R) Message', () => {
        mockHorseRacingRunnersData.resultingContent.isStewardEnquiry = true;
        mockHorseRacingRunnersData.resultingContent.stewardsState = "R";
        let horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage.addendumMessageKey).toBe(Addendum.stewardsEnquiry);
    });

    it('set isStewardEnquiry(V) Message', () => {
        mockHorseRacingRunnersData.resultingContent.isStewardEnquiry = true;
        mockHorseRacingRunnersData.resultingContent.stewardsState = "V";
        let horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage.addendumMessageKey).toBe(Addendum.resultStands);
    });

    it('set isStewardEnquiry(Z) Message', () => {
        mockHorseRacingRunnersData.resultingContent.isStewardEnquiry = true;
        mockHorseRacingRunnersData.resultingContent.stewardsState = "Z";
        let horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage.addendumMessageKey).toBe(Addendum.amendedResult);
    });

    it('Show nonRunners on Footer Section', () => {
        let horseRacingResultPage: HorseRacingResultPage = sutService.prepareEventResult(mockHorseRacingRunnersData.eventResultMap);
        expect(horseRacingResultPage.horseRaceNonRunnerList).toBe('1, 4, 7');
    });
});
