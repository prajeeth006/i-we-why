import { ResultSelection } from '../models/data-feed/meeting-results.model';
import { PriceDetails, SportBookSelection } from '../models/data-feed/sport-bet-models';

export class SportBookSelectionHelper {
    static getCalculatedPrice(numPrice: number, denPrice: number): number {
        const price = numPrice / denPrice;
        return isNaN(price) ? 0 : price;
    }

    static sortSelectionsByCalculatedPrice(selections: SportBookSelection[]): SportBookSelection[] {
        return selections.sort((first, second) => {
            const firstNumber = SportBookSelectionHelper.getCalculatedPrice(
                first?.prices ? first?.prices?.price[0]?.numPrice : 0,
                first?.prices ? first?.prices?.price[0]?.denPrice : 0,
            );
            const secondNumber = SportBookSelectionHelper.getCalculatedPrice(
                second?.prices ? second?.prices?.price[0]?.numPrice : 0,
                second?.prices ? second?.prices?.price[0]?.denPrice : 0,
            );

            return firstNumber - secondNumber;
        });
    }

    static getLatestPrice(selection: SportBookSelection): PriceDetails {
        if (selection?.prices?.price) {
            return selection?.prices?.price[0];
        }
        return new PriceDetails();
    }

    static getPriceByPosition(selection: SportBookSelection, pricePosition: number): PriceDetails {
        if (!!selection?.prices?.price && selection?.prices?.price.length >= pricePosition) {
            return selection?.prices?.price[pricePosition];
        }
        return new PriceDetails();
    }

    static getRecentCalculatedPrice(selection: SportBookSelection): number {
        const latestPrice = this.getLatestPrice(selection);
        const price = this.getCalculatedPrice(latestPrice?.numPrice, latestPrice?.denPrice);
        return isNaN(price) ? 0 : price;
    }

    static isNonRunner(selectionName: string): boolean {
        return selectionName?.toUpperCase()?.replaceAll('|', '')?.includes('N/R');
    }

    static isSelectionExist(mainStr: string, subString: string | undefined | null) {
        const isSubStringExist = subString ? mainStr?.toLowerCase().includes(subString.toLowerCase()) : false;
        return isSubStringExist;
    }

    static prepareSelections(selections: ResultSelection[]): ResultSelection[] {
        const updatedSelections: { [runnerNumber: string]: ResultSelection } = {};
        const selectionsMap = new Map();
        selections.forEach((i) => selectionsMap.set(i?.selectionId, i));
        for (const [, selection] of selectionsMap) {
            const runnerNumber = selection?.runnerNumber?.toString();
            if (!runnerNumber) {
                console.info(`Warning: Selection with doesn't have any runnerNumber. Skipping selection. SelectionId: ${selection?.selectionKey}`);
                continue;
            }
            updatedSelections[runnerNumber] = selection;
        }

        const finalSelections = Object.values(updatedSelections).sort((prev, next) => parseInt(prev?.position) - parseInt(next?.position));
        return finalSelections;
    }
}
