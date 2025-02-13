import { StringHelper } from './string.helper';
import { SportBookSelectionHelper } from './sport-book-selection-helper'

describe('String Helper check length of name and trim', () => {

    it('trim end of horse runner name when name is more than 18 characters long', () => {
        expect(StringHelper.checkSelectionNameLengthAndTrimEnd("BEST IN THE BUSINESS", 17)).toBe("BEST IN THE BUSIN'");
    });

    it('do not trim end of horse runner name when name is less than 18 characters long', () => {
        expect(StringHelper.checkSelectionNameLengthAndTrimEnd("GOOD EARTH", 17)).toBe("GOOD EARTH");
    });

    it('trim end of horse runner name when name is more than 19 characters long', () => {
        expect(StringHelper.checkSelectionNameLengthAndTrimEnd("BEST IN THE BUSINESSSS", 18)).toBe("BEST IN THE BUSINE'");
    });

    it('do not trim end of horse runner name when name is less than 19 characters long', () => {
        expect(StringHelper.checkSelectionNameLengthAndTrimEnd("GOOD EARTH", 18)).toBe("GOOD EARTH");
    });

    it('convert utc time to bst time in am', () => {
        let eventStartTime = new Date("2022-05-19T08:12:00Z");
        expect(StringHelper.getBtcTime(eventStartTime)).toBe("09:12");
    });

    it('convert utc time to bst time in pm', () => {
        let eventStartTime = new Date("2022-05-19T18:12:00Z");
        expect(StringHelper.getBtcTime(eventStartTime)).toBe("7:12");
    });

    it('convert utc time to bst time in am', () => {
        let eventStartTime = new Date("2022-05-19T23:00:00Z");
        expect(StringHelper.getBtcTime(eventStartTime)).toBe("12:00");
    });

    it('to check single tote value', () => {
        let toteValue = "32.56";
        expect(StringHelper.checkToteResults(toteValue?.trim())).toBe("32.56");
    });

    it('to check multiple tote values', () => {
        let toteValue = "32.56/125.93";
        expect(StringHelper.checkToteResults(toteValue?.trim())).toBe("32.56 / 125.93");
    });

    it('when prepareEachWay called, each way with odds and places should be correct', () => {
        let result = StringHelper.prepareEachWay("EACH-WAY 1/4 1-2-3-4", "WIN ONLY");
        expect(result).toBe('EACH-WAY 1/4 1-2-3-4');
    });

    it('when prepareEachWay called, each way with win only should be correct', () => {
        let result = StringHelper.prepareEachWay("EACH-WAY 1/1 1-2-3-4", "WIN ONLY");
        expect(result).toBe('WIN ONLY');
    });

    it('when prepareEachWay called, each way with win only comes feed should be correct', () => {
        let result = StringHelper.prepareEachWay("WIN ONLY", "WIN ONLY");
        expect(result).toBe('WIN ONLY');
    });

    it('when prepareEachWay called, to check empty', () => {
        let result = StringHelper.prepareEachWay("", "WIN ONLY");
        expect(result).toBe('WIN ONLY');
    });

    it('when prepareEachWay called, to check null or undefined', () => {
        let eachwayValue: string | null | undefined;
        let result = StringHelper.prepareEachWay(eachwayValue as string, "WIN ONLY");
        expect(result).toBe('WIN ONLY');
    });

    it('to checkToteDividendResults single tote value', () => {
        let toteValue = "32.56";
        let dividendText = "NOT WON";
        expect(StringHelper.checkToteDividendResults(toteValue?.trim(), dividendText)).toBe("32.56");
    });

    it('to checkToteDividendResults multiple tote values', () => {
        let toteValue = "32.56/125.93";
        let dividendText = "NOT WON";
        expect(StringHelper.checkToteDividendResults(toteValue?.trim(), dividendText)).toBe("32.56 / 125.93");
    });

    it('to checkToteDividendResults single tote value with NOT WON', () => {
        let toteValue = "0.009876";
        let dividendText = "NOT WON";
        expect(StringHelper.checkToteDividendResults(toteValue?.trim(), dividendText)).toBe("NOT WON");
    });

    it('to checkToteDividendResults multiple tote values with NOT WON', () => {
        let toteValue = "0.008765/0.006543";
        let dividendText = "NOT WON";
        expect(StringHelper.checkToteDividendResults(toteValue?.trim(), dividendText)).toBe("NOT WON");
    });

    it('to checkToteDividendResults diffrent multiple tote values', () => {
        let toteValue = "0.008765/0.006543/98.87654";
        let dividendText = "NOT WON";
        expect(StringHelper.checkToteDividendResults(toteValue?.trim(), dividendText)).toBe("0.00 / 0.00 / 98.87");
    });

    it('to remove event time in eventName', () => {
        let eventName = "18.02 Race of Champions";
        expect(StringHelper.removeTimeInEventName(eventName)).toBe("RACE OF CHAMPIONS");
    });

    it('to check N/R exists in Selection Name', () => {
        let SelectionName = "South Dakota Sioux N/R";
        expect(SportBookSelectionHelper.isNonRunner(SelectionName)).toBe(true);
    });

    it('to check N/R not exists in Selection Name', () => {
        let SelectionName = "South Dakota Sioux";
        expect(SportBookSelectionHelper.isNonRunner(SelectionName)).toBe(false);
    });

    it('should check substring is valid and return status return "true" if substring exists in mainstring', () => {
        expect(SportBookSelectionHelper.isSelectionExist("The return to AW can see WHITE WOLF resume winning ways. Dangers abound, with Sun King perhaps the one to chase the selection home", "WHITE WOLF")).toBe(true);
    });

    it('should check substring is valid and return status return "false" if substring not exists in mainstring', () => {
        expect(SportBookSelectionHelper.isSelectionExist("The return to AW can see WHITE WOLF resume winning ways. Dangers abound, with Sun King perhaps the one to chase the selection home", undefined)).toBe(false);
    });

    it('should return F, JF, CF3 based on favourite selections length', () => {
        expect(StringHelper.getFavouriteFlag(1)).toBe('F');
        expect(StringHelper.getFavouriteFlag(2)).toBe('JF');
        expect(StringHelper.getFavouriteFlag(3)).toBe('CF3');
        expect(StringHelper.getFavouriteFlag(4)).toBe('CF4');
    });
});
