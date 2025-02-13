import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { MockRugbyCdsData } from '../mocks/mock-rugby-cds-data';
import { RugbyCdsTemplateResult } from '../models/rugby-cds-template.model';
import { RugbyCdsService } from './rugby-cds.service';

describe('RubyCdsService', () => {
    let service: RugbyCdsService;
    let mockRugbyCdsData: MockRugbyCdsData;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(RugbyCdsService);
        mockRugbyCdsData = new MockRugbyCdsData();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // Match Betting
    describe('create rugby cds Match Betting template and check old & new designs', () => {
        it('[DARK_THEME] rugby cds Match Betting check home, draw & away details', () => {
            const rugbyCdsResult = new RugbyCdsTemplateResult();
            rugbyCdsResult.games = [];
            service.prepareMatchBetting(rugbyCdsResult, mockRugbyCdsData.matchBetting);
            expect(rugbyCdsResult.games[0]).toBeDefined();

            expect(rugbyCdsResult?.games[0]?.matchBetting?.homePlayer)
                .withContext('should return home player in title case')
                .toBe('Australia - TestQA1');

            expect(rugbyCdsResult?.games[0]?.matchBetting?.homePrice).withContext("should return home price with denominator '/1' ").toBe('13/1');

            expect(rugbyCdsResult?.games[0]?.matchBetting?.drawPrice).withContext('should return draw price').toBe('23/4');

            expect(rugbyCdsResult?.games[0]?.matchBetting?.awayPlayer).withContext('should return away player with title case').toBe('England');

            expect(rugbyCdsResult?.games[0]?.matchBetting?.awayPrice).withContext("should return away price with denominator '/1' ").toBe('7/1');
        });
    });

    // Handicap Betting
    describe('create rugby cds Handicap Betting template and check old & new designs', () => {
        it('[DARK_THEME] rugby cds Handicap Betting check home, draw & away details', () => {
            const rugbyCdsResult = new RugbyCdsTemplateResult();
            rugbyCdsResult.games = [];
            service.prepareHandicapBetting(rugbyCdsResult, mockRugbyCdsData.handicapBetting);
            expect(rugbyCdsResult.games).toBeDefined();

            expect(rugbyCdsResult?.games[0]?.handicapBetting?.homePlayer)
                .withContext('should return home player in title case')
                .toBe('Australia -1.5');

            expect(rugbyCdsResult?.games[0]?.handicapBetting?.homePrice).withContext('should return home price').toBe('13/2');

            expect(rugbyCdsResult?.games[0]?.handicapBetting?.awayPlayer).withContext('should return away player in title case').toBe('England +1.5');

            expect(rugbyCdsResult?.games[0]?.handicapBetting?.awayPrice).withContext('should return away price').toBe('15/2');
        });
    });

    // Total Points Betting
    describe('create rugby cds Total Points Betting template and check old & new designs', () => {
        it('[DARK_THEME] rugby cds Total Points Betting check home, draw & away details', () => {
            const rugbyCdsResult = new RugbyCdsTemplateResult();
            rugbyCdsResult.games = [];
            service.prepareTotalPointsBetting(rugbyCdsResult, mockRugbyCdsData.totalPointsBetting);
            expect(rugbyCdsResult.games[0]).toBeDefined();

            expect(rugbyCdsResult?.games[0]?.totalPointsBetting?.homePlayer).withContext('should return home player in title case').toBe('Over 54.5');

            expect(rugbyCdsResult?.games[0]?.totalPointsBetting?.homePrice).withContext('should return home price').toBe('14/1');

            expect(rugbyCdsResult?.games[0]?.totalPointsBetting?.awayPlayer)
                .withContext('should return away player in title case')
                .toBe('Under 54.5');

            expect(rugbyCdsResult?.games[0]?.totalPointsBetting?.awayPrice).withContext('should return away price').toBe('14/5');
        });
    });

    //First Match HandicapBetting
    describe('create rugby cds First Match Handicap Betting template and check old & new designs', () => {
        it('[DARK_THEME] rugby cds First Match Handicap Betting check home, draw & away details', () => {
            const rugbyCdsResult = new RugbyCdsTemplateResult();
            rugbyCdsResult.games = [];
            service.prepareFirstMatchHandicapBetting(rugbyCdsResult, mockRugbyCdsData.firstHalfHandicapBetting);
            expect(rugbyCdsResult.games[0]).toBeDefined();

            expect(rugbyCdsResult?.games[0]?.firstHanicapBetting?.homePlayer)
                .withContext('should return home player in title case')
                .toBe('Australia -4.5');

            expect(rugbyCdsResult?.games[0]?.firstHanicapBetting?.homePrice).withContext('should return home price').toBe('21/4');

            expect(rugbyCdsResult?.games[0]?.firstHanicapBetting?.awayPlayer)
                .withContext('should return away player in title case')
                .toBe('England +4.5');

            expect(rugbyCdsResult?.games[0]?.firstHanicapBetting?.awayPrice).withContext('should return away price').toBe('8/1');
        });
    });
});
