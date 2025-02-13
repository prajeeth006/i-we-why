import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { TitleCaseExceptPipePipe } from '../../../../common/pipes/title-case-except-pipe.pipe';
import { MockDartCdsData } from '../mocks/mock-dart-cds-data';
import { DartCdsTemplateResult } from '../models/dart-cds-template.model';
import { DartCdsService } from './dart-cds.service';

describe('DartCdsService', () => {
    const titleCaseExceptPipe = new TitleCaseExceptPipePipe();
    let service: DartCdsService;
    let dartCdsMockdata: MockDartCdsData;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(DartCdsService);
        dartCdsMockdata = new MockDartCdsData();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('[DARK_THEME] create dart cds template result and check home team', () => {
        const dartCdsResult = new DartCdsTemplateResult();
        dartCdsResult.games = [];
        service.prepareMatchBetting(dartCdsResult, dartCdsMockdata.matchBetting);
        expect(dartCdsResult.games).toBeDefined();
        if (dartCdsResult.games) {
            const homePlayer = titleCaseExceptPipe.transform(dartCdsResult?.games[0]?.matchBetting?.homePlayer);
            expect(homePlayer).toBe('Turner');
        }
    });

    it('[DARK_THEME] create dart cds template result and check away team', () => {
        const dartCdsResult = new DartCdsTemplateResult();
        dartCdsResult.games = [];
        service.prepareMatchBetting(dartCdsResult, dartCdsMockdata.matchBetting);
        expect(dartCdsResult.games).toBeDefined();
        if (dartCdsResult.games) {
            const awayPlayer = titleCaseExceptPipe.transform(dartCdsResult?.games[0]?.matchBetting?.awayPlayer);
            expect(awayPlayer).toBe('Lewis');
        }
    });

    it('[DARK_THEME] create dart cds template result and check  total frames home team', () => {
        const dartCdsResult = new DartCdsTemplateResult();
        dartCdsResult.games = [];
        service.prepareTotalFramesBetting(dartCdsResult, dartCdsMockdata.totalFrameBetting);
        expect(dartCdsResult.games).toBeDefined();
        if (dartCdsResult.games) {
            const homePlayer = titleCaseExceptPipe.transform(dartCdsResult?.games[0]?.totalFrames?.homePlayer);
            expect(homePlayer).toBe('Over 4.5');
        }
    });

    it('[DARK_THEME] create dart cds template result and check  total frames away team', () => {
        const dartCdsResult = new DartCdsTemplateResult();
        dartCdsResult.games = [];
        service.prepareTotalFramesBetting(dartCdsResult, dartCdsMockdata.totalFrameBetting);
        expect(dartCdsResult.games).toBeDefined();
        if (dartCdsResult.games) {
            const awayPlayer = titleCaseExceptPipe.transform(dartCdsResult?.games[0]?.totalFrames?.awayPlayer);
            expect(awayPlayer).toBe('Under 4.5');
        }
    });

    it('[DARK_THEME] create dart cds template result and check  match handicap home team', () => {
        const dartCdsResult = new DartCdsTemplateResult();
        dartCdsResult.games = [];
        service.prepareHandicapBetting(dartCdsResult, dartCdsMockdata.matchHandicap);
        expect(dartCdsResult.games).toBeDefined();
        if (dartCdsResult.games) {
            const homePlayer = titleCaseExceptPipe.transform(dartCdsResult?.games[0]?.matchHandicap?.homePlayer);
            expect(homePlayer).toBe('Asjad Iqbal +4.5');
        }
    });

    it('[DARK_THEME] create dart cds template result and check  match handicap away team', () => {
        const dartCdsResult = new DartCdsTemplateResult();
        dartCdsResult.games = [];
        service.prepareHandicapBetting(dartCdsResult, dartCdsMockdata.matchHandicap);
        expect(dartCdsResult.games).toBeDefined();
        if (dartCdsResult.games) {
            const awayPlayer = titleCaseExceptPipe.transform(dartCdsResult?.games[0]?.matchHandicap?.awayPlayer);
            expect(awayPlayer).toBe("Thepchaiya Un-n' -4.5");
        }
    });

    it('[DARK_THEME] create dart cds template result and check correct scorer data', () => {
        const dartCdsResult = new DartCdsTemplateResult();
        dartCdsResult.games = [];
        service.prepareFramesBetting(dartCdsResult, dartCdsMockdata.frameBetting);
        expect(dartCdsResult.games).toBeDefined();
        if (dartCdsResult.games) {
            expect(dartCdsResult?.games[0]?.frameBetting?.length).toBe(4);
            expect(dartCdsResult?.games[0]?.frameBetting[0]?.homeBettingPrice).toBe('4/1');
            expect(dartCdsResult?.games[0]?.frameBetting[0]?.awayBettingPrice).toBe('50/1');
        }
    });

    it('should return playerName1 when playerName1 is not "draw"', () => {
        const playerName1 = 'Player 1';
        const playerName2 = 'Player 2';
        const selectionName = service.getSelectionName(playerName1, playerName2);
        expect(selectionName).toBe('Player 1');
    });

    it('should return empty string when playerName1 is an empty string', () => {
        const playerName1 = '';
        const playerName2 = 'Player 2';
        const selectionName = service.getSelectionName(playerName1, playerName2);
        expect(selectionName).toBe('');
    });

    it('should return playerName2 when playerName1 is "draw"', () => {
        const playerName1 = 'draw';
        const playerName2 = 'Player 2';
        const selectionName = service.getSelectionName(playerName1, playerName2);
        expect(selectionName).toBe('Player 2');
    });
});
