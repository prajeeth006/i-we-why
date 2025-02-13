import { HorseRacingMarkets } from "src/app/horse-racing/models/common.model";
import { SelectionNameLength, ToteDividend } from "../models/general-codes-model";
import { HomeDrawAway } from "src/app/foot-ball/components/home-draw-away/models/home-draw-away.model";
import { HomeAway } from "src/app/cds/matches/tennis/models/multi-match-model";
import { Selections } from "src/app/cds/outright/models/outright-cds.model";


export class StringHelper {
    static removeFirstAndLastLetter(stringToModify: string): string {
        return stringToModify ? stringToModify.substr(1, stringToModify.length - 2) : stringToModify;
    }

    static removeFirstAndLastLetterAndUpperCase(stringToModify: string): string {
        return this.removeFirstAndLastLetter(stringToModify)?.toLocaleUpperCase();
    }

    static removeAllPipeSymbols(stringToModify: string): string {
        return stringToModify?.replaceAll('|', '');
    }

    static checkEpsTextLengthAndTrimEnd(stringToModify: string): string {
        return stringToModify?.length >= 200 ? stringToModify?.substring(0, 199) + "..." : !stringToModify ? "" : stringToModify;
    }

    static checkNameLengthAndTrimEnd(stringToModify: string): string {
        return stringToModify?.length >= 18 ? stringToModify?.substring(0, 17) + "'" : !stringToModify ? "" : stringToModify;
    }

    static checkSelectionNameLengthAndTrimEnd(stringToModify: string, selectionLength: number): string {
        if (!!stringToModify && stringToModify?.length > selectionLength) {
            return stringToModify?.substring(0, selectionLength) + "'";
        }
        return !!stringToModify ? stringToModify : ''
    }

    static SelectionNameLengthAndTrimEnd(stringToModify: string, selectionLength: number): string {
        if (!!stringToModify && stringToModify?.length >= selectionLength) {
            let expectedCharCount = stringToModify?.length === selectionLength ? selectionLength : SelectionNameLength.TWELVE
            return stringToModify?.substring(0, expectedCharCount) + "'";
        }
        return !!stringToModify ? stringToModify : ''
    }

    static checkReserveRunner(stringToModify: string): string {
        return stringToModify?.split("(")[0]?.trim();
    }

    static checkToteResults(stringToModify: string): string {
        if (!!stringToModify) {
            let splitTotes = stringToModify?.trim()?.split("/");
            stringToModify = '';
            if (splitTotes?.length > 0) {
                splitTotes.forEach((totes) => {
                    if (!!totes && totes != 'null') {
                        let toteValue = Number(totes?.match(/^\d+(?:\.\d{0,2})?/))?.toFixed(2);
                        stringToModify = stringToModify + toteValue + ' / ';
                    }
                });
            }
            return stringToModify?.trim()?.replace(/\/$/, '')?.trim();
        }
    }

    static checkToteDividendResults(stringToModify: string, dividendText: string): string {
        if (!!stringToModify) {
            let splitTotes = stringToModify?.trim()?.split("/");
            stringToModify = '';
            if (splitTotes?.length > 0) {
                splitTotes.forEach((totes) => {
                    if (!!totes && totes != 'null') {
                        let toteValue = Number(totes?.match(/^\d+(?:\.\d{0,2})?/))?.toFixed(2);
                        stringToModify = stringToModify + toteValue + ' / ';
                    }
                });
            }
            let splitToteDividends = stringToModify?.trim()?.split("/")?.filter(n => n); //We have remove empty string values and split the string
            if (!!splitToteDividends) {
                let chekTotes = splitToteDividends?.every(x => {    // We have checking '0.00' this values there or not
                    let checkTotevalue = x?.trim();
                    return checkTotevalue === ToteDividend.DividendValue;
                });
                if (chekTotes) {  // We getting checkTotes true then assign "NOT WON" test
                    stringToModify = dividendText;
                }
            }
            return stringToModify?.trim()?.replace(/\/$/, '')?.trim();
        }
    }

    static checkFavouriteTag(favourite?: string): boolean {
        if (favourite?.toUpperCase() == "F" || favourite?.toUpperCase() == "JF" || favourite?.startsWith('CF')) return true;
        return false;
    }

    static getBtcTime(eventDateTime: Date): string {
        let eventStartTime = new Date(eventDateTime);
        let hours = eventStartTime?.toLocaleString('en-US', { timeZone: "Europe/London", hour: '2-digit', hour12: true });
        let minutes = eventStartTime?.toLocaleString('en-US', { timeZone: "Europe/London", minute: '2-digit', hour12: true })?.padStart(2, '0');
        if (hours?.toLowerCase()?.includes('pm')) {
            hours = eventStartTime?.toLocaleString('en-US', { timeZone: "Europe/London", hour: 'numeric', hour12: true });
        }
        return `${hours?.toLowerCase()?.replace('am', '')?.replace('pm', '')?.trim()}:${minutes}`;
    }

    static prepareEachWay(eachWays: string, winOnly: string): string {
        let eachWayPositions = eachWays?.trim()?.split(" "); // Split eachWay term to find the positions which we want to show in results page : EACH WAY 1/4 1-2-3-4
        if (!!eachWayPositions && (eachWayPositions[1] === '1/1' || eachWays?.toLocaleUpperCase() === HorseRacingMarkets.WinOnly) || !eachWays) {
            return eachWays = winOnly;
        }
        return eachWays;
    }

    static removeTimeInEventName(eventName: string): string {
        return eventName?.replace(/\d/g, "")?.replaceAll(".", "")?.replace(" ", "")?.trim()?.toUpperCase();
    }

    static isInternationalRace(raceType: string): boolean {
        return raceType?.toLowerCase()?.includes('int');
    }
    static sortHomeDrawAwayEvent(homeDrawAwayEventData: HomeDrawAway[]) {
        homeDrawAwayEventData?.sort((b, a) => {
            const dataComparision = new Date(b.eventDateTime).getTime() - new Date(a.eventDateTime).getTime();
            if (dataComparision !== 0) {
                return dataComparision;
            } else {
                return b.homeSelection?.selectionName?.localeCompare(a.homeSelection?.selectionName);
            }
        })

    }

    static sortTennisMultiMatchHomeAwayEvent(homeAwayEventData: HomeAway[]) {
        homeAwayEventData?.sort((b, a) => {
            const dataComparision = new Date(b.eventDateTime).getTime() - new Date(a.eventDateTime).getTime();
            if (dataComparision !== 0) {
                return dataComparision;
            } else {
                return b.homeSelection?.selectionName.localeCompare(a.homeSelection?.selectionName);
            }
        })

    }

    static getActiveSelections(homeDrawAwayEventData: HomeDrawAway[]) {
        return homeDrawAwayEventData.filter(selection => selection?.homeSelection && !(selection.homeSelection?.hideEntry) || selection?.drawSelection && !(selection.drawSelection?.hideEntry) || selection?.awaySelection && !(selection.awaySelection?.hideEntry))
    }
    static getTennisMultiMatchActiveSelections(homeAwayEventData: HomeAway[]) {
        return homeAwayEventData.filter(selection => selection?.homeSelection || selection?.awaySelection)
    }
    static getFavouriteFlag(favouriteRunnersCount: number) {
        if (favouriteRunnersCount === 1) {
            return 'F';
        } else if (favouriteRunnersCount === 2) {
            return 'JF';
        } else {
            return 'CF' + favouriteRunnersCount;
        }
    }

    static calculatedPrice(oddsPrice: string): number {
        let price = 0;
        if (!!oddsPrice) {
            if (oddsPrice?.includes('/')) {
                let denPrice = 1;
                const oddsPriceArr = oddsPrice?.split('/');
                let numPrice = parseInt(oddsPriceArr[0]);
                if (oddsPriceArr[1]) {
                    denPrice = parseInt(oddsPriceArr[1]);
                }
                price = numPrice / denPrice;
            } else {
                price = parseInt(oddsPrice);
            }
        }
        return isNaN(price) ? 0 : price;
    }

    static getValueWithoutBracket(stringToModify: string): string {
        return stringToModify?.replace(/\([^)]+\)/g, '')?.trim();
    }

    static getPriceFromOdds(odds: string): number {
        if (!odds) {
            return 0;
        }
        else {
            let price = odds?.trim()?.split('/');
            if (price?.length > 1) {
                let ratio = Number(price[0]) / Number(price[1]);
                return ratio;
            }
            return Number(odds);
        }
    }

    static getCdsFixtureTitle(name: string): string {
        return name?.replace(/ *\([^)]*\) */g, " ")?.replace('-', 'V')?.toUpperCase();
    }

    static getCdsOutrightFixtureTitle(name: string): string {
        return name?.replace(/ *\([^)]*\) */g, " ")?.toUpperCase();
    }

    static RemoveCountryCodeInSelectionName(stringToModify: string): string {
        return stringToModify?.split("(")[0]?.trim()?.toUpperCase();
      }

    static getScoreNumberfromPlayer(stringToModify: string): string {
        if (!!stringToModify && stringToModify?.length > 0) {
            if (stringToModify?.includes('-')) {
                return stringToModify?.substring(stringToModify.lastIndexOf('-'), stringToModify.length)?.trim().replaceAll(',', '.');
            }
            else if (stringToModify?.includes('+')) {
                return stringToModify?.substring(stringToModify.lastIndexOf('+'), stringToModify.length).trim().replaceAll(',', '.');
            }
        }
        return !!stringToModify ? stringToModify : '';
    }

    static removeCountryfromSelection(stringToModify: string): string {
        if (!!stringToModify && stringToModify?.length > 0 && stringToModify?.indexOf('(') != -1 && stringToModify?.lastIndexOf(')') != -1) {
            return stringToModify?.replace(stringToModify.substring(stringToModify?.indexOf('('), stringToModify?.lastIndexOf(')') + 1), '').trim();
        }
        return !!stringToModify ? stringToModify : '';
    }

    static getValidSelections(selections: Selections[]): Selections[] {
        return selections?.filter((item: Selections) => !!item?.selectionPrice);
    }

}
