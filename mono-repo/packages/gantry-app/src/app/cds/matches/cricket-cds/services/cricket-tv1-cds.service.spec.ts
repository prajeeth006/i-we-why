import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { GetMarketsMock } from '../../../common/mocks/get-markets.mock';
import { CricketCdsTemplateModel } from '../../../common/models/cricket-cds-template.model';
import { TradingPartition } from '../../../common/models/sport-cds-template.constant';
import { VisibilityFlags } from '../../../common/models/sport-cds-template.model';
import { CricketCdsSitecoreContent } from '../mocks/cricket-cds-sitecore.mock';
import { Tv1CricketCdsMockData } from '../mocks/tv1-cricket-cds.mock';
import { CricketTv1CdsService } from './cricket-tv1-cds.service';

describe('CricketTv1CdsService', () => {
    let service: CricketTv1CdsService;
    let tv1CricketCdsMockData: Tv1CricketCdsMockData;
    let cricketCdsSitecoreContent: CricketCdsSitecoreContent;
    let getMarketsMock: GetMarketsMock;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
        });
        service = TestBed.inject(CricketTv1CdsService);
        tv1CricketCdsMockData = new Tv1CricketCdsMockData();
        cricketCdsSitecoreContent = new CricketCdsSitecoreContent();
        getMarketsMock = new GetMarketsMock();
    });

    it('should be created', () => {
        expect(service).withContext('Service instance should be created').toBeTruthy();
    });

    it('getMarketSelections should be available', () => {
        const tv1Fixture = tv1CricketCdsMockData.fixture;
        const matchBettingMarket = tv1Fixture?.games[0];
        const marketSelections = service.getMarketSelections(TradingPartition.TV1, matchBettingMarket);

        expect(marketSelections).withContext('Market selections should be defined for the given match betting market').toBeDefined();
    });

    it('isAnyMarketPresent should return true if at least one market is Visible (with default flag)', () => {
        const tv1Fixture = tv1CricketCdsMockData.fixture;
        const isAnyMarketsPresent = service.isAnyMarketPresent(tv1Fixture.games, VisibilityFlags.Visibility);

        expect(isAnyMarketsPresent).withContext('At least one market should be Visible when markets are present').toBe(true);
    });

    it('isAnyMarketPresent should return false if no market available', () => {
        const tv1Fixture = tv1CricketCdsMockData.fixture;
        tv1Fixture.games = [];
        const isAnyMarketsPresent = service.isAnyMarketPresent(tv1Fixture.games, VisibilityFlags.Visibility);

        expect(isAnyMarketsPresent).withContext('No markets should be available when the games array is empty').toBe(false);
    });

    it('isAnyOptionPresent should return true if at least one option is Visible (with default flag)', () => {
        const tv1Fixture = tv1CricketCdsMockData.fixture;
        const matchBettingOptions = tv1Fixture?.games[0].results;
        const isAnyMarketsPresent = service.isAnyOptionPresent(matchBettingOptions, VisibilityFlags.Visibility);

        expect(isAnyMarketsPresent).withContext('At least one option should be Visible when options are present').toBe(true);
    });

    it('isAnyOptionPresent should return false if no options available', () => {
        const tv1Fixture = tv1CricketCdsMockData.fixture;
        tv1Fixture.games[0].results = [];
        const matchBettingOptions = tv1Fixture?.games[0].results;
        const isAnyMarketsPresent = service.isAnyOptionPresent(matchBettingOptions, VisibilityFlags.Visibility);

        expect(isAnyMarketsPresent).withContext('No options should be available when the options array is empty').toBe(false);
    });

    it('isAnyOptionPresent should return false if no options are available (null)', () => {
        const isAnyMarketsPresent = service.isAnyOptionPresent(null, VisibilityFlags.Visibility);

        expect(isAnyMarketsPresent).withContext('No options should be available when options are null').toBe(false);
    });

    it('should get Cricket Cds Content', () => {
        const tv1Fixture = tv1CricketCdsMockData.fixture;
        let cricketCdsResult: CricketCdsTemplateModel = new CricketCdsTemplateModel();
        cricketCdsResult.content = cricketCdsSitecoreContent.content;

        service.prepareCricketTv1CdsContent(tv1Fixture, getMarketsMock.markets, cricketCdsResult);

        const matchBetting = cricketCdsResult?.gameInfo?.markets?.matchBetting;
        const topHomeRunScorer = cricketCdsResult?.gameInfo?.markets?.topHomeRunScorer;
        const topAwayRunScorer = cricketCdsResult?.gameInfo?.markets?.topAwayRunScorer;
        const totalSixes = cricketCdsResult?.gameInfo?.markets?.totalSixes;

        expect(matchBetting).withContext('Match betting market should be defined in the prepared content').toBeDefined();

        expect(matchBetting?.status).withContext('Match betting market status should be Visible').toBe('Visible');

        expect(matchBetting?.marketSelections).withContext('Market selections for match betting should be defined').toBeDefined();

        expect(matchBetting?.marketSelections?.home?.betName).withContext("Home team bet name should be '1'").toBe('1');

        expect(matchBetting?.marketSelections?.home?.betOdds).withContext("Home team bet odds should be '45/1'").toBe('45/1');

        expect(matchBetting?.marketSelections?.home?.status).withContext('Home team selection status should be Visible').toBe('Visible');

        expect(matchBetting?.marketSelections?.away?.betName).withContext("Away team bet name should be '2'").toBe('2');

        expect(matchBetting?.marketSelections?.away?.betOdds).withContext("Away team bet odds should be '33/1'").toBe('33/1');

        expect(matchBetting?.marketSelections?.away?.status).withContext('Away team selection status should be Visible').toBe('Visible');

        expect(cricketCdsResult?.gameInfo?.gameFlags?.isSuperOver).withContext('Game flag isSuperOver should be true').toBeTrue();

        expect(cricketCdsResult?.gameInfo?.gameFlags?.isTestMatch).withContext('Game flag isTestMatch should be false').toBeFalse();

        expect(topHomeRunScorer?.topRunScorer).withContext('Top home run scorer should be defined in the content').toBeDefined();

        expect(topHomeRunScorer?.topRunScorer.length).withContext('There should be 3 top home run scorers').toBe(3);

        expect(topHomeRunScorer?.topRunScorer[0].betName).withContext("First top home run scorer's name should be 'De Villiers'").toBe('De Villiers');

        expect(topHomeRunScorer?.topRunScorer[0].status).withContext("First top home run scorer's status should be Visible").toBe('Visible');

        expect(topAwayRunScorer?.topRunScorer).withContext('Top away run scorer should be defined in the content').toBeDefined();

        expect(topAwayRunScorer?.topRunScorer.length).withContext('There should be 3 top away run scorers').toBe(3);

        expect(topAwayRunScorer?.topRunScorer[0].betName)
            .withContext("First top away run scorer's name should be 'Mumbai Champs'")
            .toBe('Mumbai Champs');

        expect(topAwayRunScorer?.topRunScorer[0].status).withContext("First top away run scorer's status should be Visible").toBe('Visible');

        expect(totalSixes).withContext('Total sixes market should be defined in the content').toBeDefined();

        expect(totalSixes?.status).withContext('Total sixes market status should be Visible').toBe('Visible');

        expect(totalSixes?.marketSelections).withContext('Market selections for total sixes should be defined').toBeDefined();

        expect(totalSixes?.marketSelections?.home?.betName).withContext("Total sixes home team selection should be 'Over 8.5'").toBe('Over 8.5');

        expect(totalSixes?.marketSelections?.home?.betOdds).withContext("Total sixes home team bet odds should be '20/1'").toBe('20/1');

        expect(totalSixes?.marketSelections?.home?.status).withContext('Total sixes home team selection status should be Visible').toBe('Visible');

        expect(totalSixes?.marketSelections?.away?.betName).withContext("Total sixes away team selection should be 'Under 8.5'").toBe('Under 8.5');

        expect(totalSixes?.marketSelections?.away?.betOdds).withContext("Total sixes away team bet odds should be '75/1'").toBe('75/1');

        expect(totalSixes?.marketSelections?.away?.status).withContext('Total sixes away team selection status should be Visible').toBe('Visible');
    });
});
