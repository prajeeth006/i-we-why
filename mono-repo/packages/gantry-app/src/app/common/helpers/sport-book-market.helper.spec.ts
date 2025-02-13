import { ForecastTricastType } from '../../horse-racing/models/common.model';
import { PriceDetails } from '../models/data-feed/sport-bet-models';
import { SportBookMarketHelper } from './sport-book-market.helper';

describe('SportBookMarketHelper', () => {
    it('to check getPriceStrWithDenPrice in correct price with numerator and denominator', () => {
        const priceDetails = new PriceDetails();
        priceDetails.numPrice = 5;
        priceDetails.denPrice = 6;
        expect(SportBookMarketHelper.getPriceStrWithDenPrice(priceDetails)).toBe('5/6');
    });

    it('to check getPriceStrWithDenPrice with numerator and denominator in denominator value 1 ', () => {
        const priceDetails = new PriceDetails();
        priceDetails.numPrice = 5;
        priceDetails.denPrice = 1;
        expect(SportBookMarketHelper.getPriceStrWithDenPrice(priceDetails)).toBe('5');
    });

    it('to check getPriceStrWithDenPrice with numerator and denominator  value 1 or 1/1', () => {
        const priceDetails = new PriceDetails();
        priceDetails.numPrice = 1;
        priceDetails.denPrice = 1;
        expect(SportBookMarketHelper.getPriceStrWithDenPrice(priceDetails)).toBe('EVS');
    });

    it('to check getPriceStrWithDenPrice with numerator and denominator  value empty', () => {
        const priceDetails = new PriceDetails();
        expect(SportBookMarketHelper.getPriceStrWithDenPrice(priceDetails)).toBe('');
    });

    it('to check prepareEvs in correct price with numerator and denominator', () => {
        const price = '6/7';
        expect(SportBookMarketHelper.prepareEvs(price)).toBe('6/7');
    });

    it('to check prepareEvs with numerator and denominator  value 1 or 1/1', () => {
        const price = '1/1';
        expect(SportBookMarketHelper.prepareEvs(price)).toBe('EVS');
    });

    it('to check prepareEvs with numerator and denominator  value empty', () => {
        const price = '';
        expect(SportBookMarketHelper.prepareEvs(price)).toBe('');
    });

    // PGR Tracks
    it('should return "" if "isForecastMarket":"false","isTricastMarket":"false","runnerCount" =anything', () => {
        expect(SportBookMarketHelper.getFcTcValue('false', 'false', 6)).toBe('');
    });

    it('should return "FC Available" if "isForecastMarket":"true","isTricastMarket":"false","RunnerCount" >=3 ', () => {
        expect(SportBookMarketHelper.getFcTcValue('true', 'false', 4)).toBe(ForecastTricastType.forecast);
    });

    it('should return "" if "isForecastMarket":"true","isTricastMarket":"false","RunnerCount" < 3 ', () => {
        expect(SportBookMarketHelper.getFcTcValue('true', 'false', 2)).toBe('');
    });

    it('should return "FC/TC Available" if "isForecastMarket":"true","isTricastMarket":"true","runnerCount" >= 6 ', () => {
        expect(SportBookMarketHelper.getFcTcValue('true', 'true', 6)).toBe(ForecastTricastType.forecastandtricast);
    });

    it('should return "FC Available" if "isForecastMarket":"true","isTricastMarket":"true", 3 <= "runnerCount" < 6 ', () => {
        expect(SportBookMarketHelper.getFcTcValue('true', 'true', 4)).toBe(ForecastTricastType.forecast);
    });

    it('should return "" if "isForecastMarket":"true","isTricastMarket":"true", "runnerCount" < 3 ', () => {
        expect(SportBookMarketHelper.getFcTcValue('true', 'true', 2)).toBe('');
    });

    it('should return "" if "isForecastMarket":"false","isTricastMarket":"true", "runnerCount" < 6 ', () => {
        expect(SportBookMarketHelper.getFcTcValue('false', 'true', 4)).toBe('');
    });

    it('should return "TC Available" if "isForecastMarket":"false","isTricastMarket":"true","runnerCount" >= 6 ', () => {
        expect(SportBookMarketHelper.getFcTcValue('false', 'true', 6)).toBe(ForecastTricastType.tricast);
    });

    // NON-PGR Tracks
    it('should return "" if "isForecastMarket":"false","isTricastMarket":"false","runnerCount" =anything, maxLimit 6 ', () => {
        expect(SportBookMarketHelper.getFcTcValue('false', 'false', 6, 6)).toBe('');
    });

    it('should return "FC Available" if "isForecastMarket":"true","isTricastMarket":"false","RunnerCount" >=3 , maxLimit 6', () => {
        expect(SportBookMarketHelper.getFcTcValue('true', 'false', 4, 6)).toBe(ForecastTricastType.forecast);
    });

    it('should return "" if "isForecastMarket":"true","isTricastMarket":"false","RunnerCount" < 3  , maxLimit 6', () => {
        expect(SportBookMarketHelper.getFcTcValue('true', 'false', 2, 6)).toBe('');
    });

    it('should return "FC/TC Available" if "isForecastMarket":"true","isTricastMarket":"true","runnerCount" >= 6  , maxLimit 6', () => {
        expect(SportBookMarketHelper.getFcTcValue('true', 'true', 6, 6)).toBe(ForecastTricastType.forecastandtricast);
    });

    it('should return "FC Available" if "isForecastMarket":"true","isTricastMarket":"true", 3 <= "runnerCount" < 6 , maxLimit 6 ', () => {
        expect(SportBookMarketHelper.getFcTcValue('true', 'true', 4, 6)).toBe(ForecastTricastType.forecast);
    });

    it('should return "" if "isForecastMarket":"true","isTricastMarket":"true", "runnerCount" < 3 , maxLimit 6 ', () => {
        expect(SportBookMarketHelper.getFcTcValue('true', 'true', 2, 6)).toBe('');
    });

    it('should return "" if "isForecastMarket":"false","isTricastMarket":"true", "runnerCount" < 6 , maxLimit 6 ', () => {
        expect(SportBookMarketHelper.getFcTcValue('false', 'true', 4, 6)).toBe('');
    });

    it('should return "TC Available" if "isForecastMarket":"false","isTricastMarket":"true","runnerCount" >= 6 , maxLimit 6 ', () => {
        expect(SportBookMarketHelper.getFcTcValue('false', 'true', 6, 6)).toBe(ForecastTricastType.tricast);
    });

    it('should return price based on visibility,numPrices,denPrices', () => {
        expect(SportBookMarketHelper.getCdsPriceStr('visible', 2, 3)).toBe('2/3');
        expect(SportBookMarketHelper.getCdsPriceStr('visible', NaN, 3)).toBe('');
        expect(SportBookMarketHelper.getCdsPriceStr('suspended', 2, 3)).toBe('');
        expect(SportBookMarketHelper.getCdsPriceStr('visible', 2, 1)).toBe('2/1');
    });
});
