import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CricketCdsTemplateModel } from '../../../common/models/cricket-cds-template.model';
import { TradingPartition } from '../../../common/models/sport-cds-template.constant';
import { VisibilityFlags } from '../../../common/models/sport-cds-template.model';
import { CricketCdsSitecoreContent } from '../mocks/cricket-cds-sitecore.mock';
import { Tv2CricketCdsMockData } from '../mocks/tv2-cricket-cds.mock';
import { CricketTv2CdsService } from './cricket-tv2-cds.service';

describe('CricketTv2CdsService', () => {
    let service: CricketTv2CdsService;
    let tv2CricketCdsMockData: Tv2CricketCdsMockData;
    let cricketCdsSitecoreContent: CricketCdsSitecoreContent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
        });
        service = TestBed.inject(CricketTv2CdsService);
        tv2CricketCdsMockData = new Tv2CricketCdsMockData();
        cricketCdsSitecoreContent = new CricketCdsSitecoreContent();
    });

    it('should be created', () => {
        expect(service).withContext('Service instance should be created successfully.').toBeTruthy();
    });

    it('getMarketSelections should be available', () => {
        const tv2fixture = tv2CricketCdsMockData.fixture;
        const matchBettingMarket = tv2fixture?.optionMarkets[0];
        const marketSelections = service.getMarketSelections(TradingPartition.TV2, matchBettingMarket);

        expect(marketSelections).withContext('Market selections should be defined for the match betting market.').toBeDefined();
    });

    it('isAnyMarketPresent should return true if at least one market is Visible (with default flag)', () => {
        const tv2fixture = tv2CricketCdsMockData.fixture;
        const isAnyMarketsPresent = service.isAnyMarketPresent(tv2fixture.optionMarkets, VisibilityFlags.Status);

        expect(isAnyMarketsPresent).withContext('At least one market should be visible in the fixture.').toBe(true);
    });

    it('isAnyMarketPresent should return false if no market available', () => {
        const tv2fixture = tv2CricketCdsMockData.fixture;
        tv2fixture.optionMarkets = [];
        const isAnyMarketsPresent = service.isAnyMarketPresent(tv2fixture.optionMarkets, VisibilityFlags.Status);

        expect(isAnyMarketsPresent).withContext('No market should be available if the markets array is empty.').toBe(false);
    });

    it('isAnyOptionPresent should return true if at least one option is Visible (with default flag)', () => {
        const tv2fixture = tv2CricketCdsMockData.fixture;
        const matchBettingOptions = tv2fixture?.optionMarkets[0].options;
        const isAnyMarketsPresent = service.isAnyOptionPresent(matchBettingOptions, VisibilityFlags.Status);

        expect(isAnyMarketsPresent).withContext('At least one option should be visible in the match betting market.').toBe(true);
    });

    it('isAnyOptionPresent should return false if no options available', () => {
        const tv2fixture = tv2CricketCdsMockData.fixture;
        tv2fixture.optionMarkets[0].options = [];
        const matchBettingOptions = tv2fixture?.optionMarkets[0].options;
        const isAnyMarketsPresent = service.isAnyOptionPresent(matchBettingOptions, VisibilityFlags.Status);

        expect(isAnyMarketsPresent).withContext('No options should be available if the options array is empty.').toBe(false);
    });

    it('isAnyOptionPresent should return false if no options available (null scenario)', () => {
        const isAnyMarketsPresent = service.isAnyOptionPresent(null, VisibilityFlags.Status);

        expect(isAnyMarketsPresent).withContext('Should return false if the options array is null.').toBe(false);
    });

    it('should get Cricket Cds Content', () => {
        const tv2fixture = tv2CricketCdsMockData.fixture;
        let cricketCdsResult: CricketCdsTemplateModel = new CricketCdsTemplateModel();
        cricketCdsResult.content = cricketCdsSitecoreContent.content;
        service.prepareCricketTv2CdsContent(tv2fixture, cricketCdsResult);

        const matchBetting = cricketCdsResult?.gameInfo?.markets?.matchBetting;
        const topHomeRunScorer = cricketCdsResult?.gameInfo?.markets?.topHomeRunScorer;
        const topAwayRunScorer = cricketCdsResult?.gameInfo?.markets?.topAwayRunScorer;
        const totalSixes = cricketCdsResult?.gameInfo?.markets?.totalSixes;

        expect(matchBetting).withContext('Match betting market should be defined.').toBeDefined();

        expect(matchBetting?.status).withContext("Match betting market status should be 'Visible'.").toBe('Visible');

        expect(matchBetting?.marketSelections).withContext('Match betting market selections should be defined.').toBeDefined();

        expect(matchBetting?.marketSelections?.home?.betName).withContext("Home team bet name should be 'Punjab Kings'.").toBe('Punjab Kings');

        expect(matchBetting?.marketSelections?.home?.status).withContext("Home team selection status should be 'Visible'.").toBe('Visible');

        expect(matchBetting?.marketSelections?.away?.betName).withContext("Away team bet name should be 'Delhi Capitals'.").toBe('Delhi Capitals');

        expect(matchBetting?.marketSelections?.away?.status).withContext("Away team selection status should be 'Visible'.").toBe('Visible');

        expect(cricketCdsResult?.gameInfo?.gameFlags?.isSuperOver).withContext('Game flag should indicate this is a Super Over match.').toBeTrue();

        expect(cricketCdsResult?.gameInfo?.gameFlags?.isTestMatch).withContext('Game flag should indicate this is not a Test Match.').toBeFalse();

        expect(topHomeRunScorer?.topRunScorer).withContext('Top home run scorer market should be defined.').toBeDefined();

        expect(topHomeRunScorer?.topRunScorer.length).withContext('There should be 2 top home run scorers listed.').toBe(2);

        expect(topHomeRunScorer?.topRunScorer[0].betName)
            .withContext("The first top home run scorer should be 'Arshdeep Singh'.")
            .toBe('Arshdeep Singh');

        expect(topHomeRunScorer?.topRunScorer[0].status).withContext("The first top home run scorer status should be 'Visible'.").toBe('Visible');

        expect(topAwayRunScorer?.topRunScorer).withContext('Top away run scorer market should be defined.').toBeDefined();

        expect(topAwayRunScorer?.topRunScorer.length).withContext('There should be 4 top away run scorers listed.').toBe(4);

        expect(topAwayRunScorer?.topRunScorer[0].betName)
            .withContext("The first top away run scorer should be 'Aniruddha Joshi'.")
            .toBe('Aniruddha Joshi');

        expect(topAwayRunScorer?.topRunScorer[0].status).withContext("The first top away run scorer status should be 'Visible'.").toBe('Visible');

        expect(totalSixes).withContext('Total sixes market should be defined.').toBeDefined();

        expect(totalSixes?.status).withContext("Total sixes market status should be 'Visible'.").toBe('Visible');

        expect(totalSixes?.marketSelections).withContext('Total sixes market selections should be defined.').toBeDefined();

        expect(totalSixes?.marketSelections?.home?.betName).withContext("Home team selection for total sixes should be 'Over 5.5'.").toBe('Over 5.5');

        expect(totalSixes?.marketSelections?.home?.status)
            .withContext("Home team selection for total sixes status should be 'Visible'.")
            .toBe('Visible');

        expect(totalSixes?.marketSelections?.away?.betName)
            .withContext("Away team selection for total sixes should be 'Under 5.5'.")
            .toBe('Under 5.5');

        expect(totalSixes?.marketSelections?.away?.status)
            .withContext("Away team selection for total sixes status should be 'Visible'.")
            .toBe('Visible');
    });
});
