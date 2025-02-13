import { GreyhoundsResultsMock } from '../mocks/greyhounds-results.mock';
import { SportBookSelectionHelper } from './sport-book-selection-helper';

describe('SportBookSelectionHelper', () => {
    it('to prepare selections properly i.e if a vacant is replaced with another selection of same runnerNumber, then based on selectionKey latest selection to be considered', () => {
        const greyhoundsResultsMock = new GreyhoundsResultsMock();
        const selections = SportBookSelectionHelper.prepareSelections(greyhoundsResultsMock.selections);
        const expectedSelectionName = selections.filter((s) => s.runnerNumber === 3)[0].selectionName;
        expect(expectedSelectionName).toBe('A Dublin Job (RES)');
    });

    it('should return true if selection name has N/R', () => {
        const selectionName = '|Backoftheline N/R|';
        expect(SportBookSelectionHelper.isNonRunner(selectionName)).toBeTrue();
    });

    it('should return true if selection name has N|/|R', () => {
        const selectionName = '|Backoftheline N|/|R|';
        expect(SportBookSelectionHelper.isNonRunner(selectionName)).toBeTrue();
    });

    it("should return false if selection name doesn't has N/R", () => {
        const selectionName = '|Backoftheline|';
        expect(SportBookSelectionHelper.isNonRunner(selectionName)).toBeFalse();
    });
});
