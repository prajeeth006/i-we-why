import { SportBookSelectionHelper } from './sport-book-selection-helper';
import { StringHelper } from './string.helper';

describe('String Helper check length of name and trim', () => {
    it('trim end of horse runner name when name is more than 18 characters long', () => {
        expect(StringHelper.checkSelectionNameLengthAndTrimEnd('BEST IN THE BUSINESS', 17)).toBe("BEST IN THE BUSIN'");
    });

    it('do not trim end of horse runner name when name is less than 18 characters long', () => {
        expect(StringHelper.checkSelectionNameLengthAndTrimEnd('GOOD EARTH', 17)).toBe('GOOD EARTH');
    });

    it('trim end of horse runner name when name is more than 19 characters long', () => {
        expect(StringHelper.checkSelectionNameLengthAndTrimEnd('BEST IN THE BUSINESSSS', 18)).toBe("BEST IN THE BUSINE'");
    });

    it('do not trim end of horse runner name when name is less than 19 characters long', () => {
        expect(StringHelper.checkSelectionNameLengthAndTrimEnd('GOOD EARTH', 18)).toBe('GOOD EARTH');
    });

    it('convert utc time to bst time in am', () => {
        const eventStartTime = new Date('2022-05-19T08:12:00Z');
        expect(StringHelper.getBtcTime(eventStartTime)).toBe('09:12');
    });

    it('convert utc time to bst time in pm', () => {
        const eventStartTime = new Date('2022-05-19T18:12:00Z');
        expect(StringHelper.getBtcTime(eventStartTime)).toBe('7:12');
    });

    it('convert utc time to bst eventStartTime in am', () => {
        const eventStartTime = new Date('2022-05-19T23:00:00Z');
        expect(StringHelper.getBtcTime(eventStartTime)).toBe('12:00');
    });

    it('to check single tote value', () => {
        const toteValue = '32.56';
        expect(StringHelper.checkToteResults(toteValue?.trim())).toBe('32.56');
    });

    it('to check multiple tote values', () => {
        const toteValue = '32.56/125.93';
        expect(StringHelper.checkToteResults(toteValue?.trim())).toBe('32.56 / 125.93');
    });

    it('when prepareEachWay called, each way with odds and places should be correct', () => {
        const result = StringHelper.prepareEachWay('EACH-WAY 1/4 1-2-3-4', 'WIN ONLY');
        expect(result).toBe('EACH-WAY 1/4 1-2-3-4');
    });

    it('when prepareEachWay called, each way with win only should be correct', () => {
        const result = StringHelper.prepareEachWay('EACH-WAY 1/1 1-2-3-4', 'WIN ONLY');
        expect(result).toBe('WIN ONLY');
    });

    it('when prepareEachWay called, each way with win only comes feed should be correct', () => {
        const result = StringHelper.prepareEachWay('WIN ONLY', 'WIN ONLY');
        expect(result).toBe('WIN ONLY');
    });

    it('when prepareEachWay called, to check empty', () => {
        const result = StringHelper.prepareEachWay('', 'WIN ONLY');
        expect(result).toBe('WIN ONLY');
    });

    it('to checkToteDividendResults single tote value', () => {
        const toteValue = '32.56';
        const dividendText = 'NOT WON';
        expect(StringHelper.checkToteDividendResults(toteValue?.trim(), dividendText)).toBe('32.56');
    });

    it('to checkToteDividendResults multiple tote values', () => {
        const toteValue = '32.56/125.93';
        const dividendText = 'NOT WON';
        expect(StringHelper.checkToteDividendResults(toteValue?.trim(), dividendText)).toBe('32.56 / 125.93');
    });

    it('to checkToteDividendResults single tote value with NOT WON', () => {
        const toteValue = '0.009876';
        const dividendText = 'NOT WON';
        expect(StringHelper.checkToteDividendResults(toteValue?.trim(), dividendText)).toBe('NOT WON');
    });

    it('to checkToteDividendResults multiple tote values with NOT WON', () => {
        const toteValue = '0.008765/0.006543';
        const dividendText = 'NOT WON';
        expect(StringHelper.checkToteDividendResults(toteValue?.trim(), dividendText)).toBe('NOT WON');
    });

    it('to checkToteDividendResults diffrent multiple tote values', () => {
        const toteValue = '0.008765/0.006543/98.87654';
        const dividendText = 'NOT WON';
        expect(StringHelper.checkToteDividendResults(toteValue?.trim(), dividendText)).toBe('0.00 / 0.00 / 98.87');
    });

    it('to remove event time in eventName', () => {
        const eventName = '18.02 Race of Champions';
        expect(StringHelper.removeTimeInEventName(eventName)).toBe('RACE OF CHAMPIONS');
    });

    it('to check N/R exists in Selection Name', () => {
        const SelectionName = 'South Dakota Sioux N/R';
        expect(SportBookSelectionHelper.isNonRunner(SelectionName)).toBe(true);
    });

    it('to check N/R not exists in Selection Name', () => {
        const SelectionName = 'South Dakota Sioux';
        expect(SportBookSelectionHelper.isNonRunner(SelectionName)).toBe(false);
    });

    it('should check substring is valid and return status return "true" if substring exists in mainstring', () => {
        expect(
            SportBookSelectionHelper.isSelectionExist(
                'The return to AW can see WHITE WOLF resume winning ways. Dangers abound, with Sun King perhaps the one to chase the selection home',
                'WHITE WOLF',
            ),
        ).toBe(true);
    });

    it('should check substring is valid and return status return "false" if substring not exists in mainstring', () => {
        expect(
            SportBookSelectionHelper.isSelectionExist(
                'The return to AW can see WHITE WOLF resume winning ways. Dangers abound, with Sun King perhaps the one to chase the selection home',
                undefined,
            ),
        ).toBe(false);
    });

    it('should return F, JF, CF3 based on favourite selections length', () => {
        expect(StringHelper.getFavouriteFlag(1)).toBe('F');
        expect(StringHelper.getFavouriteFlag(2)).toBe('JF');
        expect(StringHelper.getFavouriteFlag(3)).toBe('CF3');
        expect(StringHelper.getFavouriteFlag(4)).toBe('CF4');
    });

    it("should return true/false as boolean if we pass 'true' or 'false' as string", () => {
        const booleanValue1 = StringHelper.toBoolean('true');
        expect(booleanValue1).toBe(true);
        const booleanValue2 = StringHelper.toBoolean('false');
        expect(booleanValue2).toBe(false);
        const booleanValue3 = StringHelper.toBoolean('');
        expect(booleanValue3).toBe(false);
        const booleanValue4 = StringHelper.toBoolean(undefined);
        expect(booleanValue4).toBe(false);
    });

    it('should return Score Number -10.2 from Player `Neil Robertson (ENG) -10,2`', () => {
        const score = StringHelper.getScoreNumberfromPlayer('Neil Robertson (ENG) -10,2');
        expect(score).toBe('-10.2');
    });

    it('should return Score Number -10.2 from Player `Neil Robertson (ENG) +10,2`', () => {
        const score = StringHelper.getScoreNumberfromPlayer('Neil Robertson (ENG) +10,2');
        expect(score).toBe('+10.2');
    });

    it('should return empty string for input without a score', () => {
        const score = StringHelper.getScoreNumberfromPlayer('Jane Smith');
        expect(score).toBe('');
    });

    it('should return player name `Neil Robert-son` excluding score from `Neil Robert-son -10,2`', () => {
        const playerName = StringHelper.getPlayerNameExcludingScore('Neil Robert-son -10,2');
        expect(playerName).toBe('Neil Robert-son');
    });

    it('should handle input with only a score and return an empty string', () => {
        const playerName = StringHelper.getPlayerNameExcludingScore('-45,8');
        expect(playerName).toBe('');
    });

    it('should handle input with extra spaces and return the trimmed name', () => {
        const playerName = StringHelper.getPlayerNameExcludingScore('   Chris Pine    -7,8   ');
        expect(playerName).toBe('Chris Pine');
    });

    it('[DARK_THEME] Should return correct title for latest design template with basic case', () => {
        expect(StringHelper.getCdsFixtureTitle('Fixture Type A'))
            .withContext('Should remove parentheses and keep string unchanged')
            .toBe('Fixture Type A');

        expect(StringHelper.getCdsFixtureTitle('Fixture (Old) - Type A'))
            .withContext('Should remove parentheses, replace - with V, and convert to uppercase')
            .toBe('Fixture V Type A');

        expect(StringHelper.getCdsFixtureTitle(null)).withContext('Should return null for null input').toBeUndefined();

        expect(StringHelper.getCdsFixtureTitle(undefined)).withContext('Should return undefined for undefined input').toBeUndefined();

        expect(StringHelper.getCdsFixtureTitle('')).withContext('Should return empty string for empty input').toBe('');
    });

    it('To verify the EVS in the pricing.', () => {
        const price = 'EVS';
        expect(StringHelper.setSelectionPrice(price)).toBe('1/1');
    });

    it('To verify the prie in the selection.', () => {
        const price = '20';
        expect(StringHelper.setSelectionPrice(price)).toBe('20');
    });
});
