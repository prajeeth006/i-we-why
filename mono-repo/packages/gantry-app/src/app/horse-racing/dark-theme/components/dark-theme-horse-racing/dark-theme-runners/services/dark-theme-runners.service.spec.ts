import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { StringHelper } from '../../../../../../common/helpers/string.helper';
import { HorseRacingEntry, HorseRacingRunnersResult } from '../../../../../models/horse-racing-template.model';
import { MockDarkThemeHorseRacingRunnersData } from '../../mocks/mock-dark-theme-horse-racing-runners-data';
import { DarkThemeRunnersService } from './dark-theme-runners.service';

describe('DarkThemeRunnersService', () => {
    let sutService: DarkThemeRunnersService;
    let mockDarkThemHorseRacingData: MockDarkThemeHorseRacingRunnersData;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        sutService = TestBed.inject(DarkThemeRunnersService);
        mockDarkThemHorseRacingData = new MockDarkThemeHorseRacingRunnersData();
    });

    it('should be created', () => {
        expect(sutService).toBeTruthy();
    });

    it('when createHorseRacingRunnersResult with null parameters called it should throw error', () => {
        expect(function () {
            sutService.createHorseRacingRunnersResult(null, null, null);
        }).toThrowError();
    });

    it('when createHorseRacingRunnersResult with not null parameters called the result should not be null', () => {
        const horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(
            mockDarkThemHorseRacingData.sportBookResult,
            mockDarkThemHorseRacingData.racingContentResult,
            mockDarkThemHorseRacingData.horseRacingContent,
        );

        expect(horseRacingRunnersResult).not.toBeNull();
    });

    it('when createHorseRacingRunnersResult the prices should be set correctly', () => {
        const horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(
            mockDarkThemHorseRacingData.sportBookResult,
            mockDarkThemHorseRacingData.racingContentResult,
            mockDarkThemHorseRacingData.horseRacingContent,
        );

        expect(horseRacingRunnersResult.areCurrentPricesPresent).toBeTrue();
        expect(horseRacingRunnersResult.arePastPricesPresent).toBeFalse();
        expect(horseRacingRunnersResult.arePlus1MarketPricesPresent).toBeTrue();
        expect(horseRacingRunnersResult.bettingFavouritePrice).toBe(1.2);
    });

    it('when createHorseRacingRunnersResult called the race info should be set correctly', () => {
        const horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(
            mockDarkThemHorseRacingData.sportBookResult,
            mockDarkThemHorseRacingData.racingContentResult,
            mockDarkThemHorseRacingData.horseRacingContent,
        );

        expect(!!horseRacingRunnersResult.isRaceOff).toBeFalse();
        expect(horseRacingRunnersResult.eventName).toBe('15:30 PLUMPTON');
        //expect(horseRacingRunnersResult.marketEachWayString).toBe('EACH-WAY: 1/5 ODDS, 3 PLACES');
        expect(horseRacingRunnersResult.raceStage).toBe('');
        expect(horseRacingRunnersResult.spotlightHorseName).toBe('HEY FRANKIE');
    });

    it('when createHorseRacingRunnersResult called, markets and selections', () => {
        const horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(
            mockDarkThemHorseRacingData.sportBookResult,
            mockDarkThemHorseRacingData.racingContentResult,
            mockDarkThemHorseRacingData.horseRacingContent,
        );

        expect(horseRacingRunnersResult.markets.length).toBe(3);
        expect(horseRacingRunnersResult.horseRacingEntries.length).toBe(11);
        expect(horseRacingRunnersResult.horseRacingEntries[0].horseName).toBe('FAIRY GEM');
        expect(horseRacingRunnersResult.horseRacingEntries[0].horseNumber).toBe('2');
        expect(horseRacingRunnersResult.horseRacingEntries[0].currentPrice).toBe(1.2);
        expect(horseRacingRunnersResult.horseRacingEntries[0].nonRunner).toBeFalse();
    });

    it('when createHorseRacingRunnersResult the racingContentAddendum Status for WithDraw', () => {
        const horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(
            mockDarkThemHorseRacingData.sportBookResult,
            mockDarkThemHorseRacingData.racingContentResult,
            mockDarkThemHorseRacingData.horseRacingContent,
        );
        expect(horseRacingRunnersResult.racingContent.sisData.selectionStatus[2].status).toBe('W');
    });

    it('when createHorseRacingRunnersResult the racingContent Status for JC', () => {
        const horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(
            mockDarkThemHorseRacingData.sportBookResult,
            mockDarkThemHorseRacingData.racingContentResult,
            mockDarkThemHorseRacingData.horseRacingContent,
        );
        expect(horseRacingRunnersResult.horseRacingContent.contentParameters.JC).toBe('JC');
    });

    it('when createHorseRacingRunnersResult called, racingposttip should be set correctly at footersection', () => {
        const horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(
            mockDarkThemHorseRacingData.sportBookResult,
            mockDarkThemHorseRacingData.racingContentResult,
            mockDarkThemHorseRacingData.horseRacingContent,
        );
        expect(horseRacingRunnersResult.horseRacingContent.racingPostImage?.src).toBe(
            'https://scmedia.cms.test.env.works/$-$/62461d8ebe87448cab3fc58c48951c56.png',
        );
    });

    it('should not set the spotlight selection incorrectly in HorseRacingRunnersResult when createHorseRacingRunnersResult is called', () => {
        const horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(
            mockDarkThemHorseRacingData.sportBookResult,
            mockDarkThemHorseRacingData.racingContentResult,
            mockDarkThemHorseRacingData.horseRacingContent,
        );
        expect(horseRacingRunnersResult.racingContent.newspapers[2].selection).not.toBe('Hey Frankiee');
    });

    it('should correctly set the spotlight selection in HorseRacingRunnersResult when createHorseRacingRunnersResult is called', () => {
        const horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(
            mockDarkThemHorseRacingData.sportBookResult,
            mockDarkThemHorseRacingData.racingContentResult,
            mockDarkThemHorseRacingData.horseRacingContent,
        );
        expect(horseRacingRunnersResult.racingContent.newspapers[2].selection).toBe('Hey Frankie');
    });
    it('should correctly set the diomed field in HorseRacingRunnersResult when createHorseRacingRunnersResult is called', () => {
        const horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(
            mockDarkThemHorseRacingData.sportBookResult,
            mockDarkThemHorseRacingData.racingContentResult,
            mockDarkThemHorseRacingData.horseRacingContent,
        );
        expect(horseRacingRunnersResult.racingContent.diomed).toBe(
            'This might go to HEY FRANKIE, who ran well in defeat on her debut at Taunton in October. Peerless Beauty is second choice.',
        );
    });

    it('should not set the diomed field incorrectly in HorseRacingRunnersResult when createHorseRacingRunnersResult is called', () => {
        const horseRacingRunnersResult: HorseRacingRunnersResult = sutService.createHorseRacingRunnersResult(
            mockDarkThemHorseRacingData.sportBookResult,
            mockDarkThemHorseRacingData.racingContentResult,
            mockDarkThemHorseRacingData.horseRacingContent,
        );
        expect(horseRacingRunnersResult.racingContent.diomed).not.toBe(
            'This might go to HEY FRANKIE, who ran well in defeat on her debut at Taunton in October. Peerless Beauty is second choiceeeee.',
        );
    });

    it('should set the diomedStart field correctly in HorseRacingRunnersResult when setSpotlightHorseName is called', () => {
        const mockRacingContentResult = mockDarkThemHorseRacingData.racingContentResult;
        const mockHorseRacingRunnersResult = mockDarkThemHorseRacingData.horseRacingRunnersResult;
        sutService.setSpotlightHorseName(mockRacingContentResult, mockHorseRacingRunnersResult);
        expect(mockHorseRacingRunnersResult.diomedStart).toBe('This might go to');
    });

    it('should set the diomedEnd field correctly in HorseRacingRunnersResult when setSpotlightHorseName is called', () => {
        const mockRacingContentResult = mockDarkThemHorseRacingData.racingContentResult;
        const mockHorseRacingRunnersResult = mockDarkThemHorseRacingData.horseRacingRunnersResult;
        sutService.setSpotlightHorseName(mockRacingContentResult, mockHorseRacingRunnersResult);
        expect(mockHorseRacingRunnersResult.diomedEnd).toBe(
            ', who ran well in defeat on her debut at Taunton in October. Peerless Beauty is second choice.',
        );
    });

    it('should return 16 when derive market and longer selection with RP & Back prices ', () => {
        sutService.horseRacingEntry = new HorseRacingEntry();
        let formattedSelectionName = 'Newtown Duke WCTHMN';
        sutService.spotlightHorseName = 'Newtown Duke WCTHMN';
        sutService.screenTypeService.isHalfScreenType = false;
        sutService.hasBackPrice = true;
        sutService.hasMultiMarket = true;
        let maxCharacters = sutService.getMaxCharacterLength(formattedSelectionName);
        expect(maxCharacters).toBe(16);
        sutService.horseRacingEntry.horseName = StringHelper.selectionNameLengthAndTrimEnd(formattedSelectionName, maxCharacters);
        expect(sutService.horseRacingEntry.horseName).toBe("Newtown Duke WC'");
    });

    it('trim end of horse runner name when name is more than 18 characters long', () => {
        sutService.horseRacingEntry = new HorseRacingEntry();
        let formattedSelectionName = 'Newtown Duke WCTHMN';
        sutService.spotlightHorseName = 'Newtown Duke WCTHMN';
        sutService.screenTypeService.isHalfScreenType = true;
        sutService.hasBackPrice = true;
        sutService.hasMultiMarket = true;
        let maxCharacters = sutService.getMaxCharacterLength(formattedSelectionName);
        expect(maxCharacters).toBe(18);
        sutService.horseRacingEntry.horseName = StringHelper.selectionNameLengthAndTrimEnd(formattedSelectionName, maxCharacters);
        expect(sutService.horseRacingEntry.horseName).toBe("Newtown Duke WCTH'");
    });
});
