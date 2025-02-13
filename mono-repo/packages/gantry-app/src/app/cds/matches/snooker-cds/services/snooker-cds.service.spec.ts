import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { MockSnookerCdsData } from '../mocks/mock-snooker-cds-data';
import { BetDetails, SnookerCdsTemplateResult } from '../models/snooker-cds-template.model';
import { SnookerCdsService } from './snooker-cds.service';

describe('SnookerCdsService', () => {
    let service: SnookerCdsService;
    let snookerCdsMockdata: MockSnookerCdsData;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(SnookerCdsService);
        snookerCdsMockdata = new MockSnookerCdsData();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('Should check snooker cds template result for home & away team', () => {
        const snookerCdsResult = new SnookerCdsTemplateResult();
        snookerCdsResult.games = [];

        service.prepareMatchBetting(snookerCdsResult, snookerCdsMockdata.matchBetting);

        expect(snookerCdsResult.games).toBeDefined();

        expect(snookerCdsResult?.games[0]?.matchBetting?.homePlayer)
            .withContext('Should check snooker cds template result for home team')
            .toBe('A. Iqbal');

        expect(snookerCdsResult?.games[0]?.matchBetting?.awayPlayer)
            .withContext('Should check snooker cds template result for home away team')
            .toBe('T. Un-Nooh');
    });

    it('Should check snooker cds template result of total frames for home & away team', () => {
        const snookerCdsResult = new SnookerCdsTemplateResult();
        snookerCdsResult.games = [];

        service.prepareTotalFramesBetting(snookerCdsResult, snookerCdsMockdata.totalFrameBetting);
        expect(snookerCdsResult.games).toBeDefined();

        expect(snookerCdsResult?.games[0]?.totalFrames?.homePlayer)
            .withContext('Should check snooker cds template result of total frames for home team')
            .toBe('Over 5.5');

        expect(snookerCdsResult?.games[0]?.totalFrames?.awayPlayer)
            .withContext('Should check snooker cds template result of total frames for away team')
            .toBe('Under 5.5');
    });

    it('Should check snooker cds template result of match handicap for home & away team', () => {
        const snookerCdsResult = new SnookerCdsTemplateResult();
        snookerCdsResult.games = [];

        service.prepareHandicapBetting(snookerCdsResult, snookerCdsMockdata.matchHandicap);
        expect(snookerCdsResult.games).toBeDefined();

        expect(snookerCdsResult?.games[0]?.matchHanicap?.homePlayer)
            .withContext('Should check snooker cds template result of match handicap for home team')
            .toBe('Asjad Iqbal +4.5');

        expect(snookerCdsResult?.games[0]?.matchHanicap?.awayPlayer)
            .withContext('Should check snooker cds template result of match handicap for away team')
            .toBe('Thepchaiya Un -4.5');
    });

    it('Should check snooker cds template result of correct scorer for home and & away team', () => {
        const snookerCdsResult = new SnookerCdsTemplateResult();
        snookerCdsResult.games = [];
        snookerCdsResult.homeName = 'Iqbal';
        snookerCdsResult.awayName = 'Un-Nooh';

        service.prepareFramesBetting(snookerCdsResult, snookerCdsMockdata.frameBetting);
        expect(snookerCdsResult.games).toBeDefined();

        expect(snookerCdsResult?.games[0]?.correctScore?.homeTeamScorerList?.length)
            .withContext('Should check snooker cds template result of correct scorer for home team')
            .toBe(5);

        expect(snookerCdsResult?.games[0]?.correctScore?.awayTeamScorerList?.length)
            .withContext('Should check snooker cds template result of correct scorer for away team')
            .toBe(5);
    });

    it('Should return selection name as upper case and as it is for new designs', () => {
        expect(service.getSelectionName('tie', 'Player 2')).withContext('Should return player name as it is for latest designs').toBe('Player 2');
        expect(service.getSelectionName('Player 1', 'Player 2'))
            .withContext('Should return player name as it is for latest designs')
            .toBe('Player 1');
        expect(service.getSelectionName('tie', '')).withContext('Should return player name as empty for latest designs').toBe('');
        expect(service.getSelectionName('', '')).withContext('Should return player name as empty for latest designs').toBe('');
        expect(service.getSelectionName(null, null)).withContext('Should return player name as empty for latest designs').toBe('');
        expect(service.getSelectionName(undefined, undefined)).withContext('Should return player name as empty for latest designs').toBe('');
    });

    it('Should remove all the charecters from betname and return only numbers', () => {
        const betDetails = new BetDetails();

        betDetails.betName = 'Neil Robertson 10-2';
        expect(service.updateSelectionDetails(betDetails)?.betName)
            .withContext('Should remove all the charecters from betname and return only numbers')
            .toBe('10-2');

        betDetails.betName = '';
        expect(service.updateSelectionDetails(betDetails)?.betName)
            .withContext('Should remove all the charecters from betname and return empty result')
            .toBe('');

        betDetails.betName = null;
        expect(service.updateSelectionDetails(betDetails)?.betName)
            .withContext('Should remove all the charecters from betname and return undefined result')
            .toBe(undefined);
    });
});
