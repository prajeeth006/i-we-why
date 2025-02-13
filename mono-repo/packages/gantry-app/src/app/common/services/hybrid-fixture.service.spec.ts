import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { MockNFLData } from '../../cds/matches/nfl-cds/mocks/mocks-nfl-data';
import { ActivatedRouteMock } from '../mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../mocks/event-feed-url-service.mock';
import { GantryMock } from '../mocks/gantrymarkets.mock';
import { HybridContent } from '../models/hybrid-fixture.model';
import { HybridFixtureService } from './hybrid-fixture.service';

describe('HybridFixtureService', () => {
    let service: HybridFixtureService;
    let nflCdsMockdata: MockNFLData;
    let gantryMockData: GantryMock;

    beforeEach(() => {
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(HybridFixtureService);
        nflCdsMockdata = new MockNFLData();
        gantryMockData = new GantryMock();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // Match Betting
    it('create hybrid nfl cds template result and check home team', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.Totals1, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.homePlayer).toBe('Under 45');
        }
    });

    it('create Hybrid nfl cds template result and check away team', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.Totals1, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.awayPlayer).toBe('Over 45');
        }
    });

    it('create Hybrid nfl cds template result and check home beeting price', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.Totals1, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.homeBettingPrice).toBe('13/2');
        }
    });

    it('create nfl cds template result and check away beeting price', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.Totals1, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.awayBettingPrice).toBe('7/4');
        }
    });

    it('create hybrid nfl cds template MoneyLine result and check home team', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.MoneyLine, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.homePlayer).toBe('Green Bay');
        }
    });

    it('create Hybrid nfl cds template MoneyLine result and check away team', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.MoneyLine, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.awayPlayer).toBe('Tampa Bay');
        }
    });

    it('create Hybrid nfl cds template MoneyLine result and check home beeting price', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.MoneyLine, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.homeBettingPrice).toBe('21/20');
        }
    });

    it('create nfl cds template result MoneyLine and check away beeting price', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.MoneyLine, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.awayBettingPrice).toBe('10/21');
        }
    });

    it('create hybrid nfl cds template Spread result and check home team', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.Spread, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.homePlayer).toBe('Green Bay Packers +1.5');
        }
    });

    it('create Hybrid nfl cds template Spread result and check away team', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.Spread, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.awayPlayer).toBe("Tampa Bay Buccane' -1.5");
        }
    });

    it('create Hybrid nfl cds template Spread result and check home beeting price', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.Spread, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.homeBettingPrice).toBe('21/20');
        }
    });

    it('create nfl cds template result Spread and check away beeting price', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.Spread, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.awayBettingPrice).toBe('6/4');
        }
    });
    it('create hybrid nfl cds template 1st Half Spread result and check home team', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.HalfSpread, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.homePlayer).toBe('Green Bay Packers +1.5');
        }
    });

    it('create Hybrid nfl cds template1st Half Spread result and check away team', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.HalfSpread, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.awayPlayer).toBe("Tampa Bay Buccane' -1.5");
        }
    });

    it('create Hybrid nfl cds template 1st Half Spread result and check home beeting price', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.HalfSpread, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.homeBettingPrice).toBe('13/5');
        }
    });

    it('create nfl cds template result 1st Half Spread and check away beeting price', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.HalfSpread, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.awayBettingPrice).toBe('19/4');
        }
    });

    it('create hybrid nfl cds template 1ST HALF MONEY LINE result and check home team', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.HalfMoney, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.homePlayer).toBe('Green Bay');
        }
    });

    it('create Hybrid nfl cds template1st 1ST HALF MONEY LINE result and check away team', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.HalfMoney, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.awayPlayer).toBe('Tampa Bay');
        }
    });

    it('create Hybrid nfl cds template 1ST HALF MONEY LINE result and check home beeting price', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.HalfMoney, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.homeBettingPrice).toBe('1/14');
        }
    });

    it('create nfl cds template result 1ST HALF MONEY LINE and check away beeting price', () => {
        const nflCdsResult = new HybridContent();
        service.prepareMatchBettingHybrid(nflCdsResult, nflCdsMockdata.HalfMoney, gantryMockData.Data, nflCdsMockdata.staticContent);
        if (nflCdsResult.optionMarkets) {
            expect(nflCdsResult?.optionMarkets[0]?.matchBetting?.awayBettingPrice).toBe('1/20');
        }
    });
});
