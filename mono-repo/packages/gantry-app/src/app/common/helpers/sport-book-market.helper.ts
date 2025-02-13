import { CdsPriceDetails } from '../../cds/common/models/sport-cds-template.model';
import { Result } from '../../cds/matches/boxing-cds/models/boxing-cds-content.model';
import { EachWayTerms, OutRightContentParams } from '../../cds/outright/models/outright-cds.model';
import { ForecastTricastType } from '../../horse-racing/models/common.model';
import { PriceDetails, SportBookMarketStructured } from '../models/data-feed/sport-bet-models';
import { GantryCommonContent } from '../models/gantry-commom-content.model';
import { EventStatus } from '../models/general-codes-model';
import { StringHelper } from './string.helper';

export class SportBookMarketHelper {
    static getPriceStr(priceDetails: PriceDetails): string {
        const numPrice = priceDetails?.numPrice;
        const denPrice = priceDetails?.denPrice;

        if (isNaN(numPrice) || isNaN(denPrice)) {
            return '';
        }

        const numPriceString = numPrice?.toString();
        return denPrice === 1 ? numPriceString : numPriceString + '/' + denPrice?.toString();
    }

    static getPreparePrice(priceDetails: PriceDetails): string {
        const numPrice = priceDetails?.numPrice;
        const denPrice = priceDetails?.denPrice;

        if (isNaN(numPrice) || isNaN(denPrice)) {
            return '';
        }
        return numPrice?.toString() + '/' + denPrice?.toString();
    }

    static getEachWayString(market: SportBookMarketStructured | null, gantryCommonContent: GantryCommonContent): string {
        const eachwayString =
            market?.eachWayFactorNum == market?.eachWayFactorDen || market?.eachWayFactorNum == '' || market?.eachWayFactorDen == ''
                ? (gantryCommonContent?.contentParameters?.WinOnly ?? '')
                : `${gantryCommonContent?.contentParameters?.EachWay ?? ''}: ${market?.eachWayFactorNum}/${market?.eachWayFactorDen}
               ${gantryCommonContent?.contentParameters?.Odds ?? ''}, ${market?.eachWayPlaces} ${gantryCommonContent?.contentParameters?.Places ?? ''}`;
        if (eachwayString) {
            return eachwayString;
        }
        return '';
    }

    /* Template used : Outright TV2 Golf, Football
    Return Format  : EW 1/4 Odds, 5 Places */
    static getDarkThemeEachWayString(placeTerms: EachWayTerms | null, outrightCdsContent: OutRightContentParams | undefined): string {
        const numerator = placeTerms?.numerator?.toString();
        const denominator = placeTerms?.denominator?.toString();
        const eachwayString = numerator + '/' + denominator;
        if (eachwayString !== '1/1') {
            const contentParameters = outrightCdsContent?.contentParameters ?? '';
            const eachWayTerm = contentParameters
                ? `${contentParameters?.EachWay ?? ''} ${eachwayString} ${contentParameters?.Odds ?? ''} ${placeTerms?.places ?? ''} ${contentParameters?.Places ?? ''}`
                : eachwayString
                  ? `${eachwayString} ${placeTerms?.places ?? ''}`
                  : '';
            return eachWayTerm;
        }
        return '';
    }

    static prepareEachWayString(market: SportBookMarketStructured | null, gantryCommonContent: GantryCommonContent): string {
        const eachwayString =
            market?.eachWayFactorNum == market?.eachWayFactorDen || market?.eachWayFactorNum == '' || market?.eachWayFactorDen == ''
                ? gantryCommonContent?.contentParameters?.WinOnly || ''
                : `${market?.eachWayFactorNum}/${market?.eachWayFactorDen}
               ${gantryCommonContent?.contentParameters?.Odds || ''} ${this.getPlaces(market ? market?.eachWayPlaces : '')}`;
        if (eachwayString) {
            return eachwayString;
        }
        return '';
    }

    static getPlaces(eachWayPlaces: string) {
        if (eachWayPlaces) {
            return Array.from({ length: Number(eachWayPlaces) }, (v, i) => i + 1)
                ?.toString()
                ?.replaceAll(',', '-');
        }
        return '';
    }

    static getPriceStrWithDenPrice(priceDetails: PriceDetails): string {
        const numPrice = priceDetails?.numPrice;
        const denPrice = priceDetails?.denPrice;

        if (isNaN(numPrice) || isNaN(denPrice)) {
            return '';
        }

        const numPriceString = numPrice?.toString();
        const price = denPrice === 1 ? numPriceString : numPriceString + '/' + denPrice?.toString();
        const finalPrice = this.prepareEvs(price);
        return finalPrice;
    }

    static prepareEvs(price: string): string {
        if (price) {
            const finalPrice = price?.replace(/\s/g, ''); //Remove all spaces from SelectonName
            if (finalPrice === '1' || finalPrice === '1/1') {
                return 'EVS';
            }
            return finalPrice;
        } else {
            return price;
        }
    }

    static getCdsPriceStr(visibility: string, numPrices: number, denPrices: number): string {
        const numPrice = numPrices;
        const denPrice = denPrices;
        let price;
        if (isNaN(numPrice) || isNaN(denPrice)) {
            return '';
        }
        if (visibility?.toUpperCase() == EventStatus.Suspended) {
            return '';
        }

        const numPriceString = numPrice?.toString();
        price = numPriceString + '/' + denPrice?.toString();
        return price;
    }

    static getCdsPriceOdds(visibility: string, priceDetails: CdsPriceDetails) {
        if (visibility?.toUpperCase() == EventStatus.Suspended.toUpperCase()) {
            return '';
        }

        // TODO: Initial prices doesn't have numerator and denominator
        const priceString = priceDetails?.odds?.toString();
        if (priceString == '1') {
            return priceString + '/1';
        }

        if (!priceDetails?.numerator && !priceDetails?.denominator) {
            return '';
        }

        const priceOddsValue =
            priceDetails?.numerator &&
            priceDetails?.denominator &&
            SportBookMarketHelper.getCdsPriceStr(visibility, priceDetails?.numerator, priceDetails?.denominator);
        return priceOddsValue;
    }

    static getCdsMethodOfVictoryArray(gameResult: Result[], title: string): Result[] {
        const marketArray = gameResult?.filter((game) => game?.name?.value?.toLowerCase()?.includes(title?.toLowerCase()));
        return marketArray;
    }

    static getCdsGoalScorerPriceStr(visibility: string, numPrices: number, denPrices: number): string {
        const numPrice = numPrices;
        const denPrice = denPrices;
        let price;
        if (isNaN(numPrice) || isNaN(denPrice)) {
            return '';
        }
        if (visibility?.toUpperCase() == EventStatus.Suspended) {
            return '';
        }
        const numPriceString = numPrice?.toString();
        price = numPriceString + '/' + denPrice?.toString();
        return price;
    }

    static sortSelectionsByPrice(selections: any[]) {
        return selections?.sort((a, b) => this.customSort(a?.selectionPrice, b?.selectionPrice));
    }

    static parseSelectionPrice(price: any): number {
        if (!price) {
            return 0;
        }

        if (!!price && price?.includes('/')) {
            const [numerator, denominator] = price != null ? price.split('/').map(parseFloat) : [NaN, NaN];
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

    /**
     * [Prajeeth][Mar'18 2024]
     * * This method validates TC,FC availabilty based on respective flags and runner count.
     * @param isForecastMarket
     * @param isTricastMarket
     * @param runnerCount
     * @param runnerCountMaxLimit
     * @param runnerCountMinLimit
     * @returns FC Available, TC Available, FC/TC Available, ''
     */
    static getFcTcValue(
        isForecastMarket: string,
        isTricastMarket: string,
        runnerCount: number,
        runnerCountMaxLimit = 5,
        runnerCountMinLimit = 3,
    ): string {
        isForecastMarket = StringHelper.toBoolean(isForecastMarket);
        isTricastMarket = StringHelper.toBoolean(isTricastMarket);

        if (isForecastMarket) {
            if (isTricastMarket) {
                if (runnerCount >= runnerCountMaxLimit) {
                    return ForecastTricastType.forecastandtricast;
                } else if (runnerCount >= runnerCountMinLimit) {
                    return ForecastTricastType.forecast;
                } else {
                    return '';
                }
            } else {
                return runnerCount >= runnerCountMinLimit ? ForecastTricastType.forecast : '';
            }
        } else {
            if (isTricastMarket) {
                return runnerCount >= runnerCountMaxLimit ? ForecastTricastType.tricast : '';
            } else {
                return '';
            }
        }
    }
}
