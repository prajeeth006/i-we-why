import { TitleCasePipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { PrepareEvsPipe } from '../../../../../common/pipes/prepare-evs.pipe';
import { MockFootBallCdsData } from '../mocks/mock-football-cds-data';
import { FootBallCdsTemplateService } from './foot-ball-cds-template.service';

describe('FootBallCdsTemplateService', () => {
    let service: FootBallCdsTemplateService;
    let footBallCdsMockdata: MockFootBallCdsData;
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
        service = TestBed.inject(FootBallCdsTemplateService);
        titleCasePipe = TestBed.inject(TitleCasePipe);
        prepareEvsPipe = TestBed.inject(PrepareEvsPipe);
        footBallCdsMockdata = new MockFootBallCdsData();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('[DARK_THEME] should be created title case pipe', () => {
        expect(titleCasePipe).toBeTruthy();
    });

    describe('create FootBall cds for matchResult old & new designs', () => {
        it('[DARK_THEME] should get matchResult for FootBall cds and validate data like home & away details', () => {
            const finalResult = service.getMatchResult(footBallCdsMockdata.finalResult);
            expect(finalResult).toBeDefined();

            expect(finalResult?.selections?.length).withContext('getMatchResult should return 1 selection object').toBe(1);

            const homeSelectionTitle = finalResult?.selections?.[0].homeSelectionTitle;
            expect(homeSelectionTitle).toBeDefined();

            expect(titleCasePipe.transform(homeSelectionTitle)).withContext('should have homeSelectionTitle').toBe('Gandhinagar Fc');

            const awaySelectionTitle = finalResult?.selections?.[0].awaySelectionTitle;
            expect(awaySelectionTitle).toBeDefined();

            expect(titleCasePipe.transform(awaySelectionTitle)).withContext('should have awaySelectionTitle').toBe('Fc Legnago Salus Ssd');

            expect(finalResult?.selections?.[0].drawPrice).withContext('should have valid drawPrice').toBe('78/100');

            expect(finalResult?.selections?.[0].awayPrice).withContext('should have valid awayPrice').toBe('7/10');
        });
    });

    describe('create FootBall cds for getBothTeamToScore new designs', () => {
        it('[DARK_THEME] should get Both Team To Score for FootBall cds and validate data like home & away details', () => {
            const bothTeamsToScore = service.getBothTeamToScoreData(footBallCdsMockdata.bothTeamsToScore);
            expect(bothTeamsToScore).toBeDefined();

            expect(titleCasePipe.transform(bothTeamsToScore?.selections?.[0]?.homeSelectionTitle))
                .withContext('should return `Yes` in title case')
                .toBe('Yes');

            expect(bothTeamsToScore?.selections?.[0]?.homePrice).withContext('should have homePrice').toBe('68/100');

            expect(titleCasePipe.transform(bothTeamsToScore?.selections?.[0]?.awaySelectionTitle))
                .withContext('should return `No` in title case')
                .toBe('No');

            expect(bothTeamsToScore?.selections?.[0]?.awayPrice).withContext('should return `1/1`').toBe('1/1');

            expect(prepareEvsPipe.transform(bothTeamsToScore?.selections?.[0]?.awayPrice))
                .withContext('should return EVS as we have 1/1 as awayPrice')
                .toBe('EVS');
        });
    });

    describe('create FootBall cds for getMatchResultAndBothTeamToScore old & new designs', () => {
        it('[DARK_THEME] should get Match Result And Both Team To Score for FootBall cds and validate data like home & away details', () => {
            const matchResultBothTeamtoScore = service.getMatchResultAndBothTeamToScoreData(footBallCdsMockdata.matchResultBothTeamtoScore);
            expect(matchResultBothTeamtoScore).toBeDefined();

            expect(matchResultBothTeamtoScore?.selections?.[0]?.homeSelectionTitle)
                .withContext('should return home selection title in titlecase')
                .toBe('Nagoya Grampus');

            expect(matchResultBothTeamtoScore?.selections?.[0]?.awaySelectionTitle)
                .withContext('should return away selection title in titlecase')
                .toBe('Stevenage FC');
            expect(matchResultBothTeamtoScore?.selections?.[0]?.homePrice).withContext('should return home price').toBe('13/5');

            expect(matchResultBothTeamtoScore?.selections?.[0]?.awayPrice).withContext('should return away price').toBe('87/100');
        });
    });

    describe('create FootBall cds for TotalGoals old & new designs', () => {
        it('should get Total Goals for FootBall cds and validate data like home & away details', () => {
            const TotalGoals = service.getTotalGoals(footBallCdsMockdata.TotalScore1);
            expect(TotalGoals).toBeDefined();

            expect(TotalGoals?.homePrice).withContext('should return home price').toBe('19/100');

            expect(TotalGoals?.name).withContext('should return name').toBe('1.5');

            expect(TotalGoals?.awayPrice).withContext('should return away price').toBe('3/1');
        });

        it('should get Total Goals for FootBall cds and validate data like home & away details totalScore2', () => {
            const TotalGoals = service.getTotalGoals(footBallCdsMockdata.totalScore2);
            expect(TotalGoals).toBeDefined();

            expect(TotalGoals?.homePrice).withContext('should return home price').toBe('3/5');

            expect(TotalGoals?.name).withContext('should return name').toBe('2.5');

            expect(TotalGoals?.awayPrice).withContext('should return away price').toBe('11/10');
        });

        it('should get Total Goals for FootBall cds and validate data like home & away details totlaScore3', () => {
            const TotalGoals = service.getTotalGoals(footBallCdsMockdata.totlaScore3);
            expect(TotalGoals).toBeDefined();

            expect(TotalGoals?.homePrice).withContext('should return home price').toBe('29/20');

            expect(TotalGoals?.name).withContext('should return name').toBe('3.5');
        });
    });

    describe('create FootBall cds for FirstGoalScorer old & new designs', () => {
        it('[DARK_THEME] should get First Goal Scorer for FootBall cds and validate data like home & away details', () => {
            const goalScorer = service.getFirstGoalScorer(footBallCdsMockdata.goalScorer, 6);
            expect(goalScorer).toBeDefined();

            expect(goalScorer?.selections[0]?.homeSelectionTitle)
                .withContext('should return home selection title in titlecase')
                .toBe('Alfie Williams');

            expect(goalScorer?.selections[0]?.homePrice).withContext('should return home price with denominator /1').toBe('2/1');

            expect(goalScorer?.selections[0]?.awaySelectionTitle)
                .withContext('should return away selection title in titlecase')
                .toBe('Battocchio, Cristian');
        });
    });

    describe('create FootBall cds for CorrectScorer old & new designs', () => {
        it('[DARK_THEME] should get Correct Scorer for FootBall cds and validate data like home & away details', () => {
            const correctScore = service.getCorrectScore(footBallCdsMockdata.correctScore, 8);
            expect(correctScore).toBeDefined();

            expect(correctScore?.selections.length).withContext('should return 8 selections for correct scorer').toBe(8);

            expect(correctScore?.selections?.[0]?.homeSelectionTitle).withContext('should return 1-0 for home selection title').toEqual('1-0');

            expect(correctScore?.selections?.[0]?.awaySelectionTitle).withContext('should return 1-0 for home selection title').toEqual('1-0');

            expect(correctScore?.selections?.[0]?.homePrice).withContext('should return home price').toEqual('23/2');

            expect(correctScore?.selections?.[0]?.awayPrice).withContext('should return away price with /1 if no denominator').toEqual('6/1');
        });
    });
});
