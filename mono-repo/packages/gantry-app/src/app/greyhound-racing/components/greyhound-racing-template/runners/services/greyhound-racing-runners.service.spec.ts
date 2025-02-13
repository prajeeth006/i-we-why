import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { GantryMock } from '../../../../../common/mocks/gantrymarkets.mock';
import { MockGreyhoundRacingRunnersData } from '../../mocks/mock-greyhound-racing-runners-data';
import { MockGreyhoundStaticContent } from '../../mocks/mock-greyhound-static-content';
import { GreyhoundRacingRunnersService } from './greyhound-racing-runners.service';

describe('GreyhoundRacingRunnersService', () => {
    let sutService: GreyhoundRacingRunnersService;
    let mockGreyhoundRacingRunnersData: MockGreyhoundRacingRunnersData;
    let mockGreyhoundStaticContent: MockGreyhoundStaticContent;
    let gantryMockData: GantryMock;
    let activatedRouteStub: Partial<ActivatedRoute>;
    beforeEach(() => {
        activatedRouteStub = {};

        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        sutService = TestBed.inject(GreyhoundRacingRunnersService);
        mockGreyhoundRacingRunnersData = new MockGreyhoundRacingRunnersData();
        mockGreyhoundStaticContent = new MockGreyhoundStaticContent();
        gantryMockData = new GantryMock();
    });

    it('should be created', () => {
        expect(sutService).toBeTruthy();
    });

    it('when createGreyhoundRacingRunnersResult with null parameters called it should throw error', () => {
        expect(function () {
            sutService.createGreyhoundRacingRunnersResult(null, null, null, 'Uk', gantryMockData.Data);
        }).toThrowError();
    });

    it('when createGreyhoundRacingRunnersResult with not null parameters called the result should not be null', () => {
        const horseRacingRunnersResult = sutService.createGreyhoundRacingRunnersResult(
            mockGreyhoundRacingRunnersData.sportBookResult,
            mockGreyhoundRacingRunnersData.racingGreyhoundContent,
            mockGreyhoundStaticContent.greyhoundRacingContent,
            'Uk',
            gantryMockData.Data,
        );

        expect(horseRacingRunnersResult).not.toBeNull();
    });

    it('when createGreyhoundRacingRunnersResult called, prices should be set correctly', () => {
        const horseRacingRunnersResult = sutService.createGreyhoundRacingRunnersResult(
            mockGreyhoundRacingRunnersData.sportBookResult,
            mockGreyhoundRacingRunnersData.racingGreyhoundContent,
            mockGreyhoundStaticContent.greyhoundRacingContent,
            'Uk',
            gantryMockData.Data,
        );
        expect(horseRacingRunnersResult.areCurrentPricesPresent).toBeTrue();
        expect(horseRacingRunnersResult.arePastPricesPresent).toBeFalse();
        expect(horseRacingRunnersResult.arePlus1MarketPricesPresent).toBeFalse();
        expect(horseRacingRunnersResult.arePlus2MarketPricesPresent).toBeFalse();
        expect(horseRacingRunnersResult.bettingFavouritePrice).toBe(1.375);
    });

    it('when createGreyhoundRacingRunnersResult called, race info should be set correctly', () => {
        const horseRacingRunnersResult = sutService.createGreyhoundRacingRunnersResult(
            mockGreyhoundRacingRunnersData.sportBookResult,
            mockGreyhoundRacingRunnersData.racingGreyhoundContent,
            mockGreyhoundStaticContent.greyhoundRacingContent,
            'Uk',
            gantryMockData.Data,
        );
        expect(horseRacingRunnersResult.eventName).toBe('11:16 HARLOW');
        expect(horseRacingRunnersResult.raceStage).toBe('O[Off]');
        expect(horseRacingRunnersResult.racingContent.distance).toBe('238m');
        expect(horseRacingRunnersResult.isRaceOff).toBe(true);
        expect(horseRacingRunnersResult.isUKEvent).toBe(true);
    });

    it('when createGreyhoundRacingRunnersResult called, markets should be set correctly', () => {
        const horseRacingRunnersResult = sutService.createGreyhoundRacingRunnersResult(
            mockGreyhoundRacingRunnersData.sportBookResult,
            mockGreyhoundRacingRunnersData.racingGreyhoundContent,
            mockGreyhoundStaticContent.greyhoundRacingContent,
            'Uk',
            gantryMockData.Data,
        );
        expect(horseRacingRunnersResult.markets.length).toBe(2);
        expect(horseRacingRunnersResult.markets[0].marketName).toBe('WIN OR EACH WAY');
        expect(horseRacingRunnersResult.markets[1].marketKey).toBe(82474318);
        expect(horseRacingRunnersResult.eventName).toBe('11:16 HARLOW');
        //expect(horseRacingRunnersResult.marketEachWayString).toBe('EACH-WAY: 1/4 ODDS, 2 PLACES');
    });

    it('when createGreyhoundRacingRunnersResult called, racing entries should be set correctly', () => {
        const horseRacingRunnersResult = sutService.createGreyhoundRacingRunnersResult(
            mockGreyhoundRacingRunnersData.sportBookResult,
            mockGreyhoundRacingRunnersData.racingGreyhoundContent,
            mockGreyhoundStaticContent.greyhoundRacingContent,
            'Uk',
            gantryMockData.Data,
        );
        expect(horseRacingRunnersResult.greyhoundRacingEntries.length).toBe(6);
        expect(horseRacingRunnersResult.greyhoundRacingEntries[0].comment).toBe('HEED ANY MARKET CONFIDENCE NOW DROPPED');
        expect(horseRacingRunnersResult.greyhoundRacingEntries[1].currentPrice).toBe(4.5);
        expect(horseRacingRunnersResult.greyhoundRacingEntries[2].greyhoundName).toBe('GIFTED CUSTOMER');
        expect(horseRacingRunnersResult.greyhoundRacingEntries[3].greyhoundNumber).toBe('4');
    });

    it('when createGreyhoundRacingRunnersResult called, duplicate runner number set correctly', () => {
        const horseRacingRunnersResult = sutService.createGreyhoundRacingRunnersResult(
            mockGreyhoundRacingRunnersData.sportBookResult,
            mockGreyhoundRacingRunnersData.racingGreyhoundContent,
            mockGreyhoundStaticContent.greyhoundRacingContent,
            'Uk',
            gantryMockData.Data,
        );
        expect(horseRacingRunnersResult.greyhoundRacingEntries.length).toBe(6);
        expect(horseRacingRunnersResult.greyhoundRacingEntries[0].greyhoundName).toBe('Duplicate N/R');
    });

    it('when createGreyhoundRacingRunnersResult called, racing post tips should be set correctly', () => {
        const horseRacingRunnersResult = sutService.createGreyhoundRacingRunnersResult(
            mockGreyhoundRacingRunnersData.sportBookResult,
            mockGreyhoundRacingRunnersData.racingGreyhoundContent,
            mockGreyhoundStaticContent.greyhoundRacingContent,
            'Uk',
            gantryMockData.Data,
        );
        expect(horseRacingRunnersResult.greyhoundRacingPostTip.length).toBe(3);
        expect(horseRacingRunnersResult.greyhoundRacingPostTip[0]).toBe(
            'https://scmedia.cms.test.env.works/$-$/a0509ce852074315aa65e6035a2fcda6.svg',
        );
        expect(horseRacingRunnersResult.hasAnyReservedRunner).toBe(false);
    });

    it('when fullScreenType present then show footer section for Footer', () => {
        const horseRacingRunnersResult = sutService.createGreyhoundRacingRunnersResult(
            mockGreyhoundRacingRunnersData.sportBookResult,
            mockGreyhoundRacingRunnersData.racingGreyhoundContent,
            mockGreyhoundStaticContent.greyhoundRacingContent,
            'Uk',
            gantryMockData.Data,
        );
        expect(horseRacingRunnersResult.greyHoundImageData.contentParameters.CoralFooter).toBe('CORAL RULES APPLY');
    });

    it('when reserve and vacant present in fullScreenType then show', () => {
        const horseRacingRunnersResult = sutService.createGreyhoundRacingRunnersResult(
            mockGreyhoundRacingRunnersData.sportBookResult,
            mockGreyhoundRacingRunnersData.racingGreyhoundContent,
            mockGreyhoundStaticContent.greyhoundRacingContent,
            'Uk',
            gantryMockData.Data,
        );
        expect(horseRacingRunnersResult.greyHoundImageData.contentParameters.ResandVacant).toBe(
            'DUE TO A VACANT TRAP OR RESERVE RUNNER, THE POST PICK IS NOT AVAILABLE FOR THIS RACE.',
        );
    });
});
