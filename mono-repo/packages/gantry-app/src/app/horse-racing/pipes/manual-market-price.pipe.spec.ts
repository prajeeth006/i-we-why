import { ManualMarketPricePipe } from './manual-market-price.pipe';

describe('ManualMarketPricePipe', () => {
    const pipe = new ManualMarketPricePipe();

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('return "NR" if horseRacingEntry is a nonRunner', () => {
        const horseRacingEntry = {
            horseNumber: '2',
            horseName: 'erer',
            jockeyName: 'erer',
            currentPrice: 0,
            fractionPrice: '',
            isStartPrice: false,
            nonRunner: true,
            isReserved: true,
            jockeySilkImage: '',
        };
        expect(pipe.transform('0', horseRacingEntry)).toBe('N/R');
    });

    it('return "SP" if horseRacingEntry has isStartPrice', () => {
        const horseRacingEntry = {
            horseNumber: '2',
            horseName: 'erer',
            jockeyName: 'erer',
            currentPrice: 5,
            fractionPrice: '10/2',
            isStartPrice: true,
            nonRunner: false,
            isReserved: true,
            jockeySilkImage: '',
        };
        expect(pipe.transform('5', horseRacingEntry)).toBe('SP');
    });

    it('return "EVS" if horseRacingEntry price is "1" or "1/1"', () => {
        const horseRacingEntry = {
            horseNumber: '2',
            horseName: 'erer',
            jockeyName: 'erer',
            currentPrice: 1,
            fractionPrice: '1/1',
            isStartPrice: false,
            nonRunner: false,
            isReserved: true,
            jockeySilkImage: '',
        };
        expect(pipe.transform('1', horseRacingEntry)).toBe('EVS');
    });

    it('return fraction price format "X/X" if above conditions fail', () => {
        const horseRacingEntry = {
            horseNumber: '2',
            horseName: 'erer',
            jockeyName: 'erer',
            currentPrice: 3.5,
            fractionPrice: '7/2',
            isStartPrice: false,
            nonRunner: false,
            isReserved: true,
            jockeySilkImage: '',
        };
        expect(pipe.transform('3.5', horseRacingEntry)).toBe('7/2');
    });
});
