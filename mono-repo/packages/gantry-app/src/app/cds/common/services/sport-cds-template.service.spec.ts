import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Tv2CricketCdsMockData } from '../../matches/cricket-cds/mocks/tv2-cricket-cds.mock';
import { VisibilityFlags } from '../models/sport-cds-template.model';
import { SportCdsTemplateService } from './sport-cds-template.service';

describe('SportCdsTemplateService', () => {
    let service: SportCdsTemplateService;
    let tv2CricketCdsMockData: Tv2CricketCdsMockData;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(SportCdsTemplateService);
        tv2CricketCdsMockData = new Tv2CricketCdsMockData();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('hasAnyRecordVisible should return true if at least one record is Visible (with default flag)', () => {
        const records = [{ status: 'SUSPENDED' }, { status: 'ACTIVE' }, { status: 'Visible' }];

        const result = service.hasAnyRecordVisible(records);
        expect(result).toBe(true);
    });

    it('hasAnyRecordVisible should return false if no record is Visible (with default flag)', () => {
        const records = [{ status: 'SUSPENDED' }, { status: 'ACTIVE' }];

        const result = service.hasAnyRecordVisible(records);
        expect(result).toBe(false);
    });

    it('hasAnyRecordVisible should return false for empty records', () => {
        const records: any[] = [];

        const result = service.hasAnyRecordVisible(records);
        expect(result).toBe(false);
    });

    it('hasAnyRecordVisible should return false if records are null or undefined', () => {
        const resultWithNull = service.hasAnyRecordVisible(null);
        const resultWithUndefined = service.hasAnyRecordVisible(undefined);

        expect(resultWithNull).toBe(false);
        expect(resultWithUndefined).toBe(false);
    });

    it('isAnyMarketPresent should return true if at least one market is Visible (with default flag)', () => {
        const tv2fixture = tv2CricketCdsMockData.fixture;
        const isAnyMarketsPresent = service.isAnyMarketPresent(tv2fixture.optionMarkets, VisibilityFlags.Status);
        expect(isAnyMarketsPresent).toBe(true);
    });

    it('isAnyMarketPresent should return false if no market available', () => {
        const tv2fixture = tv2CricketCdsMockData.fixture;
        tv2fixture.optionMarkets = [];
        const isAnyMarketsPresent = service.isAnyMarketPresent(tv2fixture.optionMarkets, VisibilityFlags.Status);
        expect(isAnyMarketsPresent).toBe(false);
    });

    it('isAnyOptionPresent should return true if at least one option is Visible (with default flag)', () => {
        const tv2fixture = tv2CricketCdsMockData.fixture;
        const matchBettingOptions = tv2fixture?.optionMarkets[0].options;
        const isAnyMarketsPresent = service.isAnyOptionPresent(matchBettingOptions, VisibilityFlags.Status);
        expect(isAnyMarketsPresent).toBe(true);
    });

    it('isAnyOptionPresent should return false if no options available', () => {
        const tv2fixture = tv2CricketCdsMockData.fixture;
        tv2fixture.optionMarkets[0].options = [];
        const matchBettingOptions = tv2fixture?.optionMarkets[0].options;
        const isAnyMarketsPresent = service.isAnyOptionPresent(matchBettingOptions, VisibilityFlags.Status);
        expect(isAnyMarketsPresent).toBe(false);
    });

    it('isAnyOptionPresent should return true if no options available', () => {
        const isAnyMarketsPresent = service.isAnyOptionPresent(null, VisibilityFlags.Status);
        expect(isAnyMarketsPresent).toBe(false);
    });
});
