import { PriceDetails, SportBookSelection } from "../models/data-feed/sport-bet-models";

export class SportBookSelectionHelper {
  static getCalculatedPrice(numPrice: number, denPrice: number): number {
    let price = numPrice / denPrice;
    return isNaN(price) ? 0 : price;
  }

  static sortSelectionsByCalculatedPrice(selections: SportBookSelection[]): SportBookSelection[] {
    return selections.sort((first, second) => {
      const firstNumber = SportBookSelectionHelper.getCalculatedPrice(first?.prices?.price[0]?.numPrice, first?.prices?.price[0]?.denPrice);
      const secondNumber = SportBookSelectionHelper.getCalculatedPrice(second?.prices?.price[0]?.numPrice, second?.prices?.price[0]?.denPrice);

      return firstNumber - secondNumber;
    });
  }

  static getLatestPrice(selection: SportBookSelection): PriceDetails {
    if (!!selection?.prices?.price) {
      return selection?.prices?.price[0];
    }
    return undefined;
  }

  static getPriceByPosition(selection: SportBookSelection, pricePosition: number): PriceDetails {
    if (!!selection?.prices?.price && selection?.prices?.price.length >= pricePosition) {
      return selection?.prices?.price[pricePosition];
    }
    return undefined;
  }

  static getRecentCalculatedPrice(selection: SportBookSelection): number {
    let latestPrice = this.getLatestPrice(selection);
    let price = this.getCalculatedPrice(latestPrice?.numPrice, latestPrice?.denPrice);
    return isNaN(price) ? 0 : price;
  }

  static isNonRunner(selectionName: string): boolean {
    return selectionName.includes('N/R');
  }

  static isSelectionExist(mainStr: string, subString: string | undefined | null) {
    const isSubStringExist = !!subString ? mainStr?.toLowerCase().includes(subString.toLowerCase()) : false;
    return isSubStringExist
  }
}
