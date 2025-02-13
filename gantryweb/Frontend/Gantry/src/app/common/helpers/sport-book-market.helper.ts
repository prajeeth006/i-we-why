import { PriceDetails, SportBookMarketStructured } from "../models/data-feed/sport-bet-models";
import { GantryCommonContent } from "../models/gantry-commom-content.model";
import { EventStatus } from "../models/general-codes-model";

export class SportBookMarketHelper {
    static getPriceStr(priceDetails: PriceDetails): string {
        let numPrice = priceDetails?.numPrice;
        let denPrice = priceDetails?.denPrice;

        if (isNaN(numPrice) || isNaN(denPrice)) {
            return '';
        }

        let numPriceString = numPrice?.toString();
        return denPrice === 1 ? numPriceString : numPriceString + '/' + denPrice?.toString();
    }

    static getPreparePrice(priceDetails: PriceDetails): string {
        let numPrice = priceDetails?.numPrice;
        let denPrice = priceDetails?.denPrice;

        if (isNaN(numPrice) || isNaN(denPrice)) {
            return '';
        }
        return numPrice?.toString() + '/' + denPrice?.toString();
    }

    static getEachWayString(market: SportBookMarketStructured | null, gantryCommonContent: GantryCommonContent): string {
        return market.eachWayFactorNum == market.eachWayFactorDen || market.eachWayFactorNum == '' || market.eachWayFactorDen == ''
            ? gantryCommonContent?.contentParameters?.WinOnly :
            `${gantryCommonContent?.contentParameters?.EachWay}: ${market.eachWayFactorNum}/${market.eachWayFactorDen}
             ${gantryCommonContent?.contentParameters?.Odds}, ${market.eachWayPlaces} ${gantryCommonContent?.contentParameters?.Places}`;
    }

    static getPriceStrWithDenPrice(priceDetails: PriceDetails, wantEVSFormat: boolean = true): string {
        let numPrice = priceDetails?.numPrice;
        let denPrice = priceDetails?.denPrice;

        if (isNaN(numPrice) || isNaN(denPrice)) {
            return '';
        }

        let numPriceString = numPrice?.toString();
        let price = denPrice === 1 ? numPriceString : numPriceString + '/' + denPrice?.toString();
        let finalPrice = this.prepareEvs(price);
        return finalPrice;
    }

    static prepareEvs(price: string): string {
        if (!!price) {
            let finalPrice = price?.replace(/\s/g, ""); //Remove all spaces from SelectonName
            if (finalPrice === '1' || finalPrice === '1/1') {
                return 'EVS';
            }
            return finalPrice;
        }
        else {
            return price;
        }
    }

    static getManualPrepareEvs(price: string): string {
        if (!!price) {
            if (price?.includes('/')) {
                const oddsPriceArr = price?.split('/');
                let numPrice = parseInt(oddsPriceArr[0]);
                let denPrice = parseInt(oddsPriceArr[1]);

                if (isNaN(numPrice) || isNaN(denPrice)) {
                    return '';
                }
                let numPriceString = numPrice?.toString();
                let manualPrice = denPrice === 1 ? numPriceString : numPriceString + '/' + denPrice?.toString();
                let finalPrice = this.prepareEvs(manualPrice);
                return finalPrice;
            }
            else {
                return price = this.prepareEvs(price);
            }
        }
        else {
            return price = this.prepareEvs(price);
        }

    }

    static getCdsPriceStr(visibility: string, numPrices: number, denPrices: number): string {
        let numPrice = numPrices;
        let denPrice = denPrices;

        if (isNaN(numPrice) || isNaN(denPrice)) {
            return '';
        }
        if (visibility?.toUpperCase() == EventStatus.Suspended) {
            return '';
        }

        let numPriceString = numPrice?.toString();
        let price = denPrice === 1 ? numPriceString : numPriceString + '/' + denPrice?.toString();
        return price;
    }

    static sortSelectionsByPrice(selections: any[]) {
        return selections?.sort((a, b) => this.customSort(a?.selectionPrice, b?.selectionPrice));
    }

    static parseSelectionPrice(price: any): number {
        if (!price) {
            return 0;
        }

        if (price?.includes('/')) {
            const [numerator, denominator] = price?.split('/').map(parseFloat);
            if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
                return numerator / denominator;
            }
        }

        return parseFloat(price) || 0;
    }

    static customSort(price1: any, price2: any): number {
        const priceA = this.parseSelectionPrice(price1);
        const priceB = this.parseSelectionPrice(price2);

        if (priceA === 0 && priceB !== 0) {
            return 1;
        } else if (priceA !== 0 && priceB === 0) {
            return -1;
        } else {
            return priceA - priceB;
        }
    }

}