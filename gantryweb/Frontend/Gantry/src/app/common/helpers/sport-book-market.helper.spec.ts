import { PriceDetails } from '../models/data-feed/sport-bet-models';
import { SportBookMarketHelper } from './sport-book-market.helper';

describe('SportBookMarketHelper', () => {

  it('to check getPriceStrWithDenPrice in correct price with numerator and denominator', () => {
    let priceDetails = new PriceDetails();
    priceDetails.numPrice = 5;
    priceDetails.denPrice = 6;
    expect(SportBookMarketHelper.getPriceStrWithDenPrice(priceDetails, true)).toBe("5/6");
  });

  it('to check getPriceStrWithDenPrice with numerator and denominator in denominator value 1 ', () => {
    let priceDetails = new PriceDetails();
    priceDetails.numPrice = 5;
    priceDetails.denPrice = 1;
    expect(SportBookMarketHelper.getPriceStrWithDenPrice(priceDetails, true)).toBe("5");
  });

  it('to check getPriceStrWithDenPrice with numerator and denominator  value 1 or 1/1', () => {
    let priceDetails = new PriceDetails();
    priceDetails.numPrice = 1;
    priceDetails.denPrice = 1;
    expect(SportBookMarketHelper.getPriceStrWithDenPrice(priceDetails, true)).toBe("EVS");
  });

  it('to check getPriceStrWithDenPrice with numerator and denominator  value empty', () => {
    let priceDetails = new PriceDetails();
    expect(SportBookMarketHelper.getPriceStrWithDenPrice(priceDetails, true)).toBe("");
  });

  it('to check prepareEvs in correct price with numerator and denominator', () => {
    let price = '6/7';
    expect(SportBookMarketHelper.prepareEvs(price)).toBe("6/7");
  });

  it('to check prepareEvs with numerator and denominator  value 1 or 1/1', () => {
    let price = '1/1';
    expect(SportBookMarketHelper.prepareEvs(price)).toBe("EVS");
  });

  it('to check prepareEvs with numerator and denominator  value empty', () => {
    let price = '';
    expect(SportBookMarketHelper.prepareEvs(price)).toBe("");
  });

  it('to check getManualPrepareEvs in correct price with numerator and denominator', () => {
    let price = '8/2';
    expect(SportBookMarketHelper.getManualPrepareEvs(price)).toBe("8/2");
  });

  it('to check getManualPrepareEvs with numerator and denominator  value 1 or 1/1', () => {
    let price = '1/1';
    expect(SportBookMarketHelper.getManualPrepareEvs(price)).toBe("EVS");
  });

  it('to check getManualPrepareEvs with numerator and denominator  value empty', () => {
    let price = '';
    expect(SportBookMarketHelper.getManualPrepareEvs(price)).toBe("");
  });

});
