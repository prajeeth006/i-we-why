import { TitleCasePipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { PrepareEvsPipe } from '../../../../common/pipes/prepare-evs.pipe';
import { MockBoxingCdsData } from '../mocks/mock-boxing-cds-data';
import { BoxingCdsContent } from '../models/boxing-cds-content.model';
import { BoxingCdsService } from './boxing-cds.service';

describe('BoxingCdsService', () => {
    let service: BoxingCdsService;
    let boxingCdsMockdata: MockBoxingCdsData;
    let titleCasePipe: TitleCasePipe;
    let prepareEvsPipe: PrepareEvsPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                MockContext.providers,
                TitleCasePipe,
                PrepareEvsPipe,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(BoxingCdsService);
        titleCasePipe = TestBed.inject(TitleCasePipe);
        prepareEvsPipe = TestBed.inject(PrepareEvsPipe);
        boxingCdsMockdata = new MockBoxingCdsData();
        service.boxingCdsContent = new BoxingCdsContent();
        service.boxingCdsContent.content = boxingCdsMockdata.boxingContent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('[DARK_THEME] should be created title case pipe', () => {
        expect(titleCasePipe).toBeTruthy();
    });

    describe('create Boxing cds for getIndividualRoundBettingData old & new designs', () => {
        it('[DARK_THEME] should get getIndividualRoundBettingData for Boxing cds and validate data like home & away details', () => {
            const roundBetting = service.getIndividualRoundBettingData(boxingCdsMockdata.roundBetting);
            expect(roundBetting).toBeDefined();

            expect(roundBetting?.homeTeamListDetails?.length).withContext('getIndividualRoundBettingData should return 14 selection object').toBe(14);

            expect(titleCasePipe.transform(roundBetting?.homeTeamListDetails?.[0]?.betName))
                .withContext('should have valid betname in homeTeam')
                .toBe('Round 1');

            expect(roundBetting?.homeTeamListDetails?.[0]?.betOdds).withContext('should have valid betOdds in homeTeam').toBe('33/1');

            expect(roundBetting?.awayTeamListDetails?.length).withContext('getIndividualRoundBettingData should return 14 selection object').toBe(14);

            expect(titleCasePipe.transform(roundBetting?.awayTeamListDetails?.[0].betName))
                .withContext('should have valid betname in homeTeam')
                .toBe('Round 1');

            expect(roundBetting?.awayTeamListDetails?.[0].betOdds).withContext('should have valid betOdds in homeTeam').toBe('125/1');
        });
    });

    describe('create Boxing cds for getFightBettingData new designs', () => {
        it('[DARK_THEME] should get getFightBettingData for Boxing cds and validate data like home & away details', () => {
            const matchBetting = service.getFightBettingData(boxingCdsMockdata.matchBetting);
            expect(matchBetting).toBeDefined();

            expect(matchBetting?.selections?.length).withContext('getFightBettingData should return 1 selection object').toBe(1);

            expect(matchBetting?.selections?.[0].homePrice).withContext('should have valid homePrice').toBe('2/7');

            expect(matchBetting?.selections?.[0].homeSelectionTitle).withContext('should have valid homeSelectionTitle').toBe('N. Inoue');

            expect(matchBetting?.selections?.[0].drawPrice).withContext('should have valid drawPrice').toBe('16/1');

            expect(matchBetting?.selections?.[0].awayPrice).withContext('should have valid awayPrice').toBe('11/4');

            expect(matchBetting?.selections?.[0].awaySelectionTitle).withContext('should have valid awaySelectionTitle').toBe('S. Fulton');
        });
    });

    describe('create Boxing cds for getRoundGroupBetting old & new designs', () => {
        it('[DARK_THEME] should get getRoundGroupBetting for Boxing cds and validate data like home & away details', () => {
            const groupBetting = service.getRoundGroupBetting(boxingCdsMockdata.roundGroupBetting);
            expect(groupBetting).toBeDefined();

            expect(groupBetting?.selections?.length).withContext('getRoundGroupBetting should return 4 selection object').toBe(4);

            expect(groupBetting?.selections?.[0].homePrice).withContext('should have valid homePrice').toBe('9/1');

            expect(groupBetting?.selections?.[0].name).withContext('should have valid name').toBe('1-3');

            expect(groupBetting?.selections?.[0].awayPrice).withContext('should have valid awayPrice').toBe('40/1');
        });
    });

    describe('create Boxing cds for getMethodOfVictory old & new designs', () => {
        it('[DARK_THEME] should get getMethodOfVictory for Boxing cds and validate data like home & away details', () => {
            const groupBetting = service.getMethodOfVictory(boxingCdsMockdata.methodOfVictory);
            expect(groupBetting).toBeDefined();

            expect(groupBetting?.selections?.length).withContext('getMethodOfVictory should return 2 selection object').toBe(2);

            expect(prepareEvsPipe.transform(groupBetting?.selections?.[0].homePrice)).withContext('should have valid homePrice').toBe('2/1');

            expect(groupBetting?.selections?.[0].name).withContext('should have valid name').toBe('On Points (Full Distance)');

            expect(groupBetting?.selections?.[0].awayPrice).withContext('should have valid awayPrice').toBe('9/2');

            expect(prepareEvsPipe.transform(groupBetting?.selections?.[1].homePrice)).withContext('should have valid homePrice').toBe('EVS');

            expect(groupBetting?.selections?.[1].name)
                .withContext('should have valid homeSelectionTitle')
                .toBe('KO / TKO / Technical Decision or DQ');

            expect(groupBetting?.selections?.[1].awayPrice).withContext('should have valid awayPrice').toBe('8/1');
        });
    });
});
