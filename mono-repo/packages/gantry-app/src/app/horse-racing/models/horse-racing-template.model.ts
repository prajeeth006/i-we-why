import { IBaseRacingTemplateResult, IBaseRacingTemplateResultEntry } from '../../common/contracts/base-racing-template.models';
import { ContentImage } from '../../common/models/content-image.model';
import { PlaceDividend } from '../../common/models/data-feed/meeting-results.model';
import { NCastDividend, SportBookMarketStructured } from '../../common/models/data-feed/sport-bet-models';
import { RacingContentResult } from './data-feed/racing-content.model';
import { ImageStatus } from './fallback-src.constant';
import { HorseRacingEventResultsTemplate, HorseRacingResultDetails } from './horse-racing-meeting-results.model';
import { HorseRacingContent } from './horseracing-content.model';

export class HorseRacingTemplateResult {
    isAnyEventResulted: boolean;
    horseRacingResultPage: HorseRacingResultPage;
    horseRacingRunnersResult: HorseRacingRunnersResult;
    horseRacingEventResultsTemplate: HorseRacingEventResultsTemplate;
}

export class HorseRacingRunnersResult implements IBaseRacingTemplateResult {
    racingContent: RacingContentResult;
    horseRacingContent: HorseRacingContent;
    markets: Array<SportBookMarketStructured> = [];
    eventName: string | null | undefined;
    eventStatus: string | null | undefined;
    displayStatus: string | null | undefined;
    raceStage: string | null | undefined;
    defaultPriceColumn: string;
    horseRacingEntries: Array<HorseRacingEntry> = [];
    bettingFavouritePrice: number;
    areCurrentPricesPresent: boolean;
    arePastPricesPresent: boolean;
    marketEachWayString: string | null | undefined;
    arePlus1MarketPricesPresent: boolean;
    arePlus2MarketPricesPresent: boolean;
    spotlightHorseName: string;
    isNonRunner: boolean;
    isWithdrawn: boolean;
    isRaceOff: boolean;
    categoryName: string | null | undefined;
    isBettingWithout: boolean = false;
    bestOddsGuaranteedImageSrc: string | null;
    eventDateTime: Date | null | undefined;
    typeFlagCode?: string;
    eventTimePlusTypeName?: string | null;
    virtualRaceSilkImage: RunnerImages;
    runnerCount?: string | null | undefined;
    isVirtualEvent?: boolean = false;
    isEvrRace?: boolean = false;
    isAvrRace?: boolean = false;
    isHalfScreenType?: boolean = false;
    diomedStart?: string | null | undefined;
    diomedEnd?: string | null | undefined;
    showBackPrice?: boolean = false;
    isInternationalRace: boolean = false;
    showPostPick: boolean = false;
    isEventStarted?: boolean = false;
    showRaceStage?: boolean = false;
    diomed?: string | null | undefined;
    forecastTricastValue?: string;
    runnerConfig?: any;
    splitScreenRunnerConfig?: any;
}

export class HorseRacingEntry {
    jockeySilkImage: string = ImageStatus.Default;
    horseNumber: string | null | undefined;
    horseName: string;
    jockeyName: string | null | undefined;
    hasJockeyChanged: boolean;
    currentPrice: number = 0;
    pastPrice1Str: string | null | undefined;
    pastPrice2Str: string | null | undefined;
    prices: { [marketName: string]: string } = {};
    hidePrice: { [marketName: string]: boolean } = {};
    hideEntry: { [marketName: string]: boolean } = {};
    nonRunner: boolean | null | undefined;
    isWithdrawn: boolean | null | undefined;
    isReserved: boolean | null | undefined;
}

export class HorseRacingResultPage {
    horseRaceNonRunnerList?: string | null | undefined;
    racingContent: RacingContentResult;
    horseRacingContent: HorseRacingContent;
    runners: Array<HorseRacingResultDetails> = [];
    deadHeatPositions?: Set<number>;
    raceStage: string | null | undefined;
    priceHeader: string | null | undefined;
    eventName: string | null | undefined;
    defaultMarket?: SportBookMarketStructured;
    marketEachWayString: string;
    dividends?: NCastDividend[];
    totes: Totes;
    raceOffTime: string;
    eventTime: string;
    eachWays: string | null | undefined;
    eachWayResult: string | null | undefined;
    runnerCount: string | null | undefined;
    win: string;
    place: string | null | undefined; // comma separated list
    get placeList(): Array<string> {
        if (!this.place) {
            return [];
        }

        const placeList = this?.place?.split(',')?.filter((place) => place != '');

        return placeList;
    }
    foreCast: string;
    triCast: string;
    isStewardEnquiry: boolean = false;
    isVoidRace: boolean = false;
    eventDateTime?: Date | null | undefined;
    isVirtualEvent?: boolean = false;
    typeId?: string | null | undefined;
    placeDividends?: Array<PlaceDividend>;
    totePlaceDividends: string;
    isResultAmended: boolean | undefined;
    addendumMessage: string | null | undefined;
    addendumMessageKey?: string | null | undefined;
    addendumColor: string = '#ffffff';
}
export class Totes {
    exacta: string;
    trifecta: string;
}

export class HorseResultEntry implements IBaseRacingTemplateResultEntry {
    position: string;
    jockeySilkImage: string;
    runnerNumber: string;
    horseName: string;
    price: string;
    favourite: string;
    isJointFavourite: boolean;
    isDeadHeat: boolean = false;
}

export class RunnerImages {
    runnerImages: Array<ContentImage>;
}

export class MaxFixedViewrRunner {
    maxFixedRunners: number = 7;
    maxViewRunners: number = 10;
}

export interface RangeObject {
    range: [number, number];
    templateClass: string;
}

export interface SplitScreenPageInfo {
    startPageIndex: number;
    endPageIndex: number;
    templateClass: string;
}

export interface SplitScreenQueryParams {
    startPageIndex: string;
    endPageIndex: string;
    maxRunnerCount: string;
    totalPages: string;
    currentPage: string;
}
