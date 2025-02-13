import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { GantryMock } from '../../../../common/mocks/gantrymarkets.mock';
import { SportContentService } from '../../../../common/services/sport-content/sport-content.service';
import { SportCdsTemplateService } from '../../../common/services/sport-cds-template.service';
import { MockNFLData } from '../mocks/mocks-nfl-data';
import { NflCdsContent } from '../models/nfl-cds-content.model';
import { NflCdsService } from './nfl-cds.service';

describe('NflCdsService', () => {
    let service: NflCdsService;
    let cdsClientService: jasmine.SpyObj<CdsClientService>;
    let sportCdsTemplateService: jasmine.SpyObj<SportCdsTemplateService>;
    let sportContentService: jasmine.SpyObj<SportContentService>;
    let nflCdsMockdata: MockNFLData;
    let gantryMockData: GantryMock;

    beforeEach(() => {
        const cdsClientServiceSpy = jasmine.createSpyObj('CdsClientService', ['getFixtures']);
        const sportContentServiceSpy = jasmine.createSpyObj('SportContentService', ['getContent']);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                NflCdsService,
                { provide: CdsClientService, useValue: cdsClientServiceSpy },
                { provide: SportContentService, useValue: sportContentServiceSpy },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(NflCdsService);
        cdsClientService = TestBed.inject(CdsClientService) as jasmine.SpyObj<CdsClientService>;
        sportCdsTemplateService = TestBed.inject(SportCdsTemplateService) as jasmine.SpyObj<SportCdsTemplateService>;
        sportContentService = TestBed.inject(SportContentService) as jasmine.SpyObj<SportContentService>;
        nflCdsMockdata = new MockNFLData();
        gantryMockData = new GantryMock();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('GetNflCdsContent', () => {
        it('should fetch and combine data streams', fakeAsync(() => {
            cdsClientService.getFixtures.and.returnValue(of(nflCdsMockdata.Totals));
            sportContentService.getContent.and.returnValue(of(nflCdsMockdata.staticContent));
            spyOn(sportCdsTemplateService as any, 'getGantryMarketDataContent').and.returnValue(of(nflCdsMockdata.Spread));

            service.GetNflCdsContent('fixtureId', 'marketId', 'gameIds');
            tick();

            service.nflCdsContent$.subscribe((content) => {
                expect(content).toBeTruthy();
                expect(content.sportName).toBe('National Football League');
                expect(cdsClientService.getFixtures).toHaveBeenCalled();
                expect(sportContentService.getContent).toHaveBeenCalled();
            });
        }));
    });

    describe('prepareMatchBetting', () => {
        it('create nfl cds template result and check home team', () => {
            const nflCdsResult = new NflCdsContent();
            service.prepareMatchBetting(nflCdsResult, nflCdsMockdata.Totals, gantryMockData.Data);
            if (nflCdsResult.games) {
                expect(nflCdsResult?.games[0]?.matchBetting?.homePlayer).toBe('Over 45');
            }
        });

        it('create nfl cds template result and check away team', () => {
            const nflCdsResult = new NflCdsContent();
            service.prepareMatchBetting(nflCdsResult, nflCdsMockdata.Totals, gantryMockData.Data);
            if (nflCdsResult.games) {
                expect(nflCdsResult?.games[0]?.matchBetting?.awayPlayer).toBe('Under 45');
            }
        });

        it('create nfl cds template result and check home beting price', () => {
            const nflCdsResult = new NflCdsContent();
            service.prepareMatchBetting(nflCdsResult, nflCdsMockdata.Totals, gantryMockData.Data);
            if (nflCdsResult.games) {
                expect(nflCdsResult?.games[0]?.matchBetting?.homeBettingPrice).toBe('21/20');
            }
        });

        it('create nfl cds template result and check away beting price', () => {
            const nflCdsResult = new NflCdsContent();
            service.prepareMatchBetting(nflCdsResult, nflCdsMockdata.Totals, gantryMockData.Data);
            if (nflCdsResult.games) {
                expect(nflCdsResult?.games[0]?.matchBetting?.awayBettingPrice).toBe('7/10');
            }
        });
    });

    describe('getPlayerNames', () => {
        let inputString: string | undefined;
        let result: string;
        it('should format player names with extracted value', () => {
            inputString = 'Player A +1.5';
            result = service.getPlayerNames(inputString);
            expect(result).toEqual('Player A +1.5');
        });

        it('should handle commas in input string', () => {
            inputString = 'Player B, -2.0';
            result = service.getPlayerNames(inputString);
            expect(result).toEqual('Player B. -2.0');
        });

        it('should handle bracketed values in input string', () => {
            inputString = 'Player C (+3.5)';
            result = service.getPlayerNames(inputString);
            expect(result).toEqual('Player C');
        });

        it('should trim and format long player names', () => {
            inputString = 'VeryLongPlayerName +1.0';
            result = service.getPlayerNames(inputString);
            expect(result).toEqual(`VeryLongPlayerN' +1.0`);
        });

        it('should adjust length for latest design template and not handicap', () => {
            inputString = 'Player D -1.5';
            result = service.getPlayerNames(inputString, true);
            expect(result).toEqual('Player D -1.5');
        });

        it('should handle undefined input gracefully', () => {
            result = service.getPlayerNames(undefined);
            expect(result).toEqual('');
        });
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });
});
