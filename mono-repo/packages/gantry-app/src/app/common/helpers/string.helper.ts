import { Game } from '../../cds/matches/snooker-cds/models/snooker-cds-template.model';
import { HomeAway } from '../../cds/matches/tennis/models/multi-match-model';
import { Selections } from '../../cds/outright/models/outright-cds.model';
import { HorseRacingMarkets } from '../../horse-racing/models/common.model';
import { EventDateTime } from '../cds-client/models/fixture.model';
import { PlaceDividend } from '../models/data-feed/meeting-results.model';
import { GantryCommonContent } from '../models/gantry-commom-content.model';
import { Draw, PriceType, ToteDividend } from '../models/general-codes-model';

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

    static checkSelectionNameLengthAndTrimEnd(stringToModify?: string, selectionLength?: number): string {
        if (!!stringToModify && stringToModify?.length > selectionLength!) {
            return stringToModify?.substring(0, selectionLength) + "'";
        }
        return stringToModify ? stringToModify : '';
    }

    static selectionNameLengthAndTrimEnd(stringToModify?: string, selectionLength?: number): string {
        if (!!stringToModify && stringToModify?.length > selectionLength!) {
            const expectedCharCount = selectionLength! - 1;
            return stringToModify?.substring(0, expectedCharCount) + "'";
        }
        return stringToModify ? stringToModify : '';
    }

    static checkReserveRunner(stringToModify: string): string {
        return stringToModify?.split('(')[0]?.trim();
    }

    static checkToteResults(stringToModify?: string): string {
        if (stringToModify) {
            const splitTotes = stringToModify?.trim()?.replaceAll(' ', '')?.split('/');
            stringToModify = '';
            if (splitTotes?.length > 0) {
                splitTotes.forEach((totes) => {
                    if (!!totes && totes != 'null') {
                        const toteValue = Number(totes?.match(/^\d+(?:\.\d{0,2})?/))?.toFixed(2);
                        stringToModify = stringToModify + toteValue + ' / ';
                    }
                });
            }
            return stringToModify?.trim()?.replace(/\/$/, '')?.trim();
        }
        return '';
    }

    static checkTotePlaceDividends(placeDividends?: Array<PlaceDividend>): string {
        let stringToModify = '';
        if (placeDividends) {
            if (placeDividends?.length > 0) {
                placeDividends?.forEach((totes) => {
                    if (totes && totes?.dividend != 'null') {
                        const toteValue = Number(totes?.dividend?.match(/^\d+(?:\.\d{0,2})?/))?.toFixed(2);
                        stringToModify = stringToModify + toteValue + ' / ';
                    }
                });
            }
            return stringToModify?.trim()?.replace(/\/$/, '')?.trim();
        }
        return stringToModify;
    }

    static checkToteDividendResults(stringToModify: string, dividendText: string): string {
        if (stringToModify) {
            const splitTotes = stringToModify?.trim()?.split('/');
            stringToModify = '';
            if (splitTotes?.length > 0) {
                splitTotes.forEach((totes) => {
                    if (!!totes && totes != 'null') {
                        const toteValue = Number(totes?.match(/^\d+(?:\.\d{0,2})?/))?.toFixed(2);
                        stringToModify = stringToModify + toteValue + ' / ';
                    }
                });
            }
            const splitToteDividends = stringToModify
                ?.trim()
                ?.split('/')
                ?.filter((n) => n); //We have remove empty string values and split the string
            if (splitToteDividends) {
                const chekTotes = splitToteDividends?.every((x) => {
                    // We have checking '0.00' this values there or not
                    const checkTotevalue = x?.trim();
                    return checkTotevalue === ToteDividend.DividendValue;
                });
                if (chekTotes) {
                    // We getting checkTotes true then assign "NOT WON" test
                    stringToModify = dividendText;
                }
            }
            return stringToModify?.trim()?.replace(/\/$/, '')?.trim();
        }
        return '';
    }

    static checkFavouriteTag(favourite: string): boolean {
        if (favourite?.toUpperCase() == 'F' || favourite?.toUpperCase() == 'JF' || favourite?.startsWith('CF')) return true;
        return false;
    }

    static getBtcTime(eventDateTime: Date): string {
        const eventStartTime = new Date(eventDateTime);
        let hours = eventStartTime?.toLocaleString('en-US', { timeZone: 'Europe/London', hour: '2-digit', hour12: true });
        const minutes = eventStartTime?.toLocaleString('en-US', { timeZone: 'Europe/London', minute: '2-digit', hour12: true })?.padStart(2, '0');
        if (hours?.toLowerCase()?.includes('pm')) {
            hours = eventStartTime?.toLocaleString('en-US', { timeZone: 'Europe/London', hour: 'numeric', hour12: true });
        }
        return `${hours?.toLowerCase()?.replace('am', '')?.replace('pm', '')?.trim()}:${minutes}`;
    }

    static prepareEachWay(eachWays: string, winOnly: string): string {
        const eachWayPositions = eachWays?.trim()?.split(' '); // Split eachWay term to find the positions which we want to show in results page : EACH WAY 1/4 1-2-3-4
        if ((!!eachWayPositions && (eachWayPositions[1] === '1/1' || eachWays?.toLocaleUpperCase() === HorseRacingMarkets.WinOnly)) || !eachWays) {
            eachWays = winOnly;
        }
        return eachWays;
    }

    static removeTimeInEventName(eventName: string): string {
        return eventName?.replace(/\d/g, '')?.replaceAll('.', '')?.replace(' ', '')?.trim()?.toUpperCase();
    }

    static isInternationalRace(raceType: string): boolean {
        return raceType?.toLowerCase()?.includes('int');
    }

    static sortTennisMultiMatchHomeAwayEvent(homeAwayEventData: HomeAway[]) {
        if (homeAwayEventData) {
            homeAwayEventData?.sort((b: any, a: any) => {
                if (!!b.eventDateTime && !!a.eventDateTime) {
                    const dataComparision = new Date(b.eventDateTime).getTime() - new Date(a.eventDateTime).getTime();
                    if (dataComparision !== 0) {
                        return dataComparision;
                    } else {
                        return b.homeSelection?.selectionName.localeCompare(a.homeSelection?.selectionName);
                    }
                }
            });
        }
    }

    static getTennisMultiMatchActiveSelections(homeAwayEventData: HomeAway[]) {
        return homeAwayEventData.filter((selection) => selection?.homeSelection || selection?.awaySelection);
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
        if (oddsPrice) {
            if (oddsPrice?.includes('/')) {
                let denPrice = 1;
                const oddsPriceArr = oddsPrice?.split('/');
                const numPrice = parseInt(oddsPriceArr[0]);
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
        } else {
            const price = odds?.trim()?.split('/');
            if (price?.length > 1) {
                const ratio = Number(price[0]) / Number(price[1]);
                return ratio;
            }
            return Number(odds);
        }
    }

    static getCdsFixtureTitle(name: string): string {
        return name
            ?.replace(/\([^)]*\)\s*/g, '')
            ?.replace('-', 'V')
            ?.trim();
    }

    static getCdsOutrightFixtureTitle(name: string): string {
        return name?.replace(/ *\([^)]*\) */g, ' ')?.toUpperCase();
    }

    static RemoveCountryCodeInSelectionName(stringToModify: string): string {
        return stringToModify?.split('(')[0]?.trim();
    }

    static getScoreNumberfromPlayer(stringToModify: string): string {
        if (!!stringToModify && stringToModify?.length > 0) {
            if (stringToModify?.includes('-')) {
                return stringToModify?.substring(stringToModify.lastIndexOf('-'), stringToModify.length)?.trim().replaceAll(',', '.');
            } else if (stringToModify?.includes('+')) {
                return stringToModify?.substring(stringToModify.lastIndexOf('+'), stringToModify.length).trim().replaceAll(',', '.');
            }
        }
        return '';
    }

    static getPlayerNameExcludingScore(stringToModify: string): string {
        if (!!stringToModify && stringToModify?.length > 0) {
            if (stringToModify?.includes('-')) {
                return stringToModify?.substring(0, stringToModify.lastIndexOf('-'))?.trim();
            } else if (stringToModify?.includes('+')) {
                return stringToModify?.substring(0, stringToModify.lastIndexOf('+'))?.trim();
            }
        }
        return stringToModify ? stringToModify : '';
    }

    static removeCountryfromSelection(stringToModify: string): string {
        if (!!stringToModify && stringToModify?.length > 0 && stringToModify?.indexOf('(') != -1 && stringToModify?.lastIndexOf(')') != -1) {
            return stringToModify?.replace(stringToModify.substring(stringToModify?.indexOf('('), stringToModify?.lastIndexOf(')') + 1), '').trim();
        }
        return stringToModify ? stringToModify : '';
    }

    static getValidSelections(selections: Selections[]): Selections[] {
        return selections?.filter((item: Selections) => !!item?.selectionPrice);
    }

    static updateIsEarlyOrLivePrice(currentStage: string): boolean {
        const excludedRaceStages = ['LIVE PRICE', 'EARLY PRICE', 'AWAITING PRICES'];
        return excludedRaceStages.includes(currentStage?.toUpperCase());
    }

    static updateRaceOffTimeToOffAt(raceOffString: string, replaceText: string): string {
        if (raceOffString && raceOffString.includes('RACE OFF @')) {
            const updatedRaceOffString = raceOffString.replace('RACE OFF @', replaceText);
            return updatedRaceOffString;
        }
        return raceOffString;
    }

    static getRaceOffTimeAtResult(raceOffTime: string): string {
        if (raceOffTime) {
            const raceStage = raceOffTime?.split('OFF:');
            if (raceStage?.length > 1) {
                return 'Off Time: ' + raceStage[1];
            }
        }
        return '';
    }

    static shouldShowSeparator(value: string, desiredLength: number): boolean {
        return value?.split('/')?.length > desiredLength;
    }

    static setDrawValue(drawValue: string, contentParameterValue: string) {
        if (
            drawValue?.toLowerCase()?.trim() === Draw.drawNameValue?.toLowerCase()?.trim() ||
            drawValue?.toLowerCase()?.trim() === Draw.drawName?.toLowerCase()?.trim() ||
            drawValue?.toLowerCase()?.trim() === Draw.tieName?.toLowerCase()?.trim()
        ) {
            return contentParameterValue;
        }
        return '';
    }

    static convertTo12HrsFormat(hoursValue: string, minutesValue: string): string {
        let hours: any = hoursValue;
        if (!!hours && !!minutesValue) {
            if (Number(hours) > 12) {
                hours = hours - 12;
            } else {
                hours = hours?.toString()?.padStart(2, '0');
            }
            return hours + ':' + minutesValue?.toString()?.padStart(2, '0');
        }
        return '';
    }

    static checkDrawMarketListed(gamesArray: Game[]): boolean {
        let isDrawMarketListed: boolean = false;
        if (gamesArray && gamesArray.filter((item) => item?.isMatchBetting === true).length > 0) {
            gamesArray.forEach((selection) => {
                if (selection.isMatchBetting) {
                    if (selection?.matchBetting?.drawPrice || selection?.matchBetting?.drawSuspended) {
                        isDrawMarketListed = true;
                    }
                }
            });
        }
        return isDrawMarketListed;
    }

    static getDarkThemeEventTimeDateFromPipe(homeDrawAway: EventDateTime[], gantryCommonContent: GantryCommonContent): any[] {
        const dateArrayempty: any[] = [];
        if (!homeDrawAway || homeDrawAway.length === 0) return dateArrayempty;

        const formatDate = (date: Date): any[] => {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Set to midnight
            const eventDate = new Date(date);
            eventDate.setHours(0, 0, 0, 0); // Set to midnight
            const diffInDays = Math.floor((eventDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));

            if (diffInDays === 0) {
                return [gantryCommonContent?.contentParameters?.Today ?? ''];
            } else if (diffInDays === 1) {
                return [gantryCommonContent?.contentParameters?.Tomorrow ?? ''];
            } else if (diffInDays >= 2 && diffInDays < 7) {
                return [eventDate.toLocaleString('en-US', { weekday: 'long' })];
            } else {
                return [eventDate.getDate(), eventDate.toLocaleString('en-US', { month: 'long' }).toUpperCase()];
            }
        };

        if (homeDrawAway.length > 1) {
            const firstEventDate = new Date(homeDrawAway[0]?.eventDateTime);
            const lastEventDate = new Date(homeDrawAway[homeDrawAway.length - 1]?.eventDateTime);

            if (
                firstEventDate.getDate() !== lastEventDate.getDate() ||
                firstEventDate.getMonth() !== lastEventDate.getMonth() ||
                firstEventDate.getFullYear() !== lastEventDate.getFullYear()
            ) {
                const firstDay = firstEventDate.getDate();
                const lastDay = lastEventDate.getDate();
                const firstMonth = firstEventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                const lastMonth = lastEventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();

                if (firstMonth !== lastMonth) {
                    const dateArray: any[] = [firstDay + ' ' + firstMonth + '-', lastDay + ' ' + lastMonth];
                    return dateArray;
                } else {
                    const dateArray: any[] = [firstDay + '-' + lastDay, firstEventDate.toLocaleString('default', { month: 'long' }).toUpperCase()];
                    return dateArray;
                }
            } else {
                return formatDate(firstEventDate);
            }
        } else {
            const eventDate = new Date(homeDrawAway[0]?.eventDateTime);
            return formatDate(eventDate);
        }
    }

    static toBoolean(value: string) {
        try {
            return JSON.parse(value);
        } catch (e) {
            return false;
        }
    }

    static setSelectionPrice(price: string): string {
        if (!!price) {
            if (price?.trim()?.toLowerCase() == PriceType.evs.toLowerCase()) {
                return (price = '1/1');
            }
        }
        return price;
    }
}
