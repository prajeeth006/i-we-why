import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { EpsFavorite2ServiceMocksData } from '../../../../components/eps/mocks/mock-eps-favorite2-data.mock';
import { EpsFavorite3ServiceMocksData } from '../../../../components/eps/mocks/mock-eps-favorite3-data.mock';
import { DarkThemeEpsTemplateServiceMocksData } from '../mocks/dark-theme-mock-eps-data.mock';
import { DarkThemeEpsTemplateService } from './dark-theme-eps-template.service';

describe('DarkThemeEpsTemplateService', () => {
    let service: DarkThemeEpsTemplateService;
    let mockEPSData: DarkThemeEpsTemplateServiceMocksData;
    let mockEPS2FData: EpsFavorite2ServiceMocksData;
    let mockEPS3FData: EpsFavorite3ServiceMocksData;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(DarkThemeEpsTemplateService);
        mockEPSData = new DarkThemeEpsTemplateServiceMocksData();
        mockEPS2FData = new EpsFavorite2ServiceMocksData();
        mockEPS3FData = new EpsFavorite3ServiceMocksData();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('Check eps typename', () => {
        expect(service.prepareResult(mockEPSData.sportBookResult).epsResultGroupedSorted[0]?.meetingName).toBe('OOTY');
    });

    it('Check eps show JF if 2 runners have same favorite prices.', () => {
        expect(service.prepareResult(mockEPS2FData.sportBookResult).epsResultGroupedSorted[0]?.events[0]?.allRunnerSelections[0]?.favourite).toBe(
            'JF',
        );
    });

    it('Check eps show CF if 3 or more runners have same favorite prices.', () => {
        expect(service.prepareResult(mockEPS3FData.sportBookResult).epsResultGroupedSorted[0]?.events[0]?.allRunnerSelections[0]?.favourite).toBe(
            'CF',
        );
    });

    it('set PhotoMessage', () => {
        mockEPSData.tricastResult.isPhotoFinish = true;
        const horseRacingEpsPage = service.prepareMeetingResult(mockEPSData.event2Tricast, mockEPSData.EpsHorseRacing);
        expect(horseRacingEpsPage.stewardsState).toBe('PHOTO');
    });

    it('set raceAbandoned Message', () => {
        mockEPSData.tricastResult.isAbandonedRace = true;
        const horseRacingEpsPage = service.prepareMeetingResult(mockEPSData.event2Tricast, mockEPSData.EpsHorseRacing);
        expect(horseRacingEpsPage.stewardsState).toBe('ABANDONED');
    });

    it('set voidRace Message', () => {
        mockEPSData.tricastResult.isVoidRace = true;
        const horseRacingEpsPage = service.prepareMeetingResult(mockEPSData.event2Tricast, mockEPSData.EpsHorseRacing);
        expect(horseRacingEpsPage.stewardsState).toBe('VOID RACE');
    });

    it('set marketSettled Message', () => {
        mockEPSData.tricastResult.isMarketSettled = true;
        const horseRacingEpsPage = service.prepareMeetingResult(mockEPSData.event2Tricast, mockEPSData.EpsHorseRacing);
        expect(horseRacingEpsPage.stewardsState).toBe('RESULT');
    });

    it('set isStewardEnquiry(S) Message', () => {
        mockEPSData.tricastResult.isStewardEnquiry = true;
        mockEPSData.tricastResult.stewardsState = 'S';
        const horseRacingEpsPage = service.prepareMeetingResult(mockEPSData.event2Tricast, mockEPSData.EpsHorseRacing);
        expect(horseRacingEpsPage.stewardsState).toBe("STEWARDS' ENQUIRY");
    });

    it('set isStewardEnquiry(R) Message', () => {
        mockEPSData.tricastResult.isStewardEnquiry = true;
        mockEPSData.tricastResult.stewardsState = 'R';
        const horseRacingEpsPage = service.prepareMeetingResult(mockEPSData.event2Tricast, mockEPSData.EpsHorseRacing);
        expect(horseRacingEpsPage.stewardsState).toBe("STEWARDS' ENQUIRY");
    });

    it('set isStewardEnquiry(V) Message', () => {
        mockEPSData.tricastResult.isStewardEnquiry = true;
        mockEPSData.tricastResult.stewardsState = 'V';
        const horseRacingEpsPage = service.prepareMeetingResult(mockEPSData.event2Tricast, mockEPSData.EpsHorseRacing);
        expect(horseRacingEpsPage.stewardsState).toBe('RESULT STANDS');
    });

    it('set isStewardEnquiry(Z) Message', () => {
        mockEPSData.tricastResult.isStewardEnquiry = true;
        mockEPSData.tricastResult.stewardsState = 'Z';
        const horseRacingEpsPage = service.prepareMeetingResult(mockEPSData.event2Tricast, mockEPSData.EpsHorseRacing);
        expect(horseRacingEpsPage.stewardsState).toBe('AMENDED RESULT');
    });
});
