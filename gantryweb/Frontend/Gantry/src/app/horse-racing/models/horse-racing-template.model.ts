import { RacingContentResult } from "./data-feed/racing-content.model";
import { NCastDividend, SportBookMarketStructured } from "../../common/models/data-feed/sport-bet-models";
import { HorseRacingContent } from "./horseracing-content.model";
 import { IBaseRacingTemplateResult, IBaseRacingTemplateResultEntry } from "../../common/contracts/base-racing-template.models";
 import { HorseRacingEventResultsTemplate, HorseRacingResultDetails } from "./horse-racing-meeting-results.model";
 import { ContentImage } from "@frontend/vanilla/core";
 import { PlaceDividend } from "src/app/common/models/data-feed/meeting-results.model";
import { ImageStatus } from "./fallback-src.constant";

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
    eventName: string;
    eventStatus: string;
    displayStatus: string;
    raceStage: string;
    defaultPriceColumn: string;
    horseRacingEntries: Array<HorseRacingEntry> = [];
    bettingFavouritePrice: number;
    areCurrentPricesPresent: boolean;
    arePastPricesPresent: boolean;
    marketEachWayString: string | null;
    arePlus1MarketPricesPresent: boolean;
    arePlus2MarketPricesPresent: boolean;
    spotlightHorseName: string | null;
    isNonRunner: boolean;
    isRaceOff: boolean;
    categoryName: string | null;
    isBettingWithout: boolean = false;
    bestOddsGuaranteedImageSrc: string | null;
    eventDateTime: Date;
    typeFlagCode: string | null;
    eventTimePlusTypeName?: string | null;
    virtualRaceSilkImage: RunnerImages;
    runnerCount?: string | null | undefined;
    isVirtualEvent?: boolean = false;
    isEvrRace?: boolean = false;
    isAvrRace?: boolean = false;
    isHalfScreenType?: boolean = false;
    diomedStart?:string | null | undefined;
    diomedEnd?:string | null | undefined;
    showBackPrice?:boolean = false;
    isInternationalRace : boolean = false ;
    showPostPick : boolean = false;
    isEventStarted? : boolean = false;
    showRaceStage?:boolean=false;
    diomed? :string | null | undefined;
}

export class HorseRacingEntry {
    jockeySilkImage: string = ImageStatus.Default;
    horseNumber: string;
    horseName: string;
    jockeyName: string;
    hasJockeyChanged: boolean;
    currentPrice: number = 0;
    pastPrice1Str: string;
    pastPrice2Str: string;
    prices: { [marketName: string]: string } = {};
    hidePrice: { [marketName: string]: boolean } = {};
    hideEntry: { [marketName: string]: boolean } = {};
    nonRunner: boolean;
    isWithdrawn: boolean;
    isReserved: boolean;
}

export class HorseRacingResultPage {
    horseRaceNonRunnerList?: string | null | undefined;
    racingContent: RacingContentResult;
    horseRacingContent: HorseRacingContent;
    runners: Array<HorseRacingResultDetails> = [];
    deadHeatPositions: Set<number>;
    raceStage: string;
    priceHeader: string;
    eventName: string;
    defaultMarket: SportBookMarketStructured;
    marketEachWayString: string;
    dividends: NCastDividend[];
    totes: Totes;
    raceOffTime: string | null | undefined;
    eventTime: string | null | undefined;
    eachWays: string | null | undefined;
    eachWayResult: string | null | undefined;
    runnerCount: string | null | undefined;
    win: string;
    place: string | null | undefined; // comma separated list
    get placeList(): Array<string> {
        if (!this.place) {
            return [];
        }

        let placeList = this.place.split(",").filter(place => place != "");

        return placeList;
    };
    foreCast: string;
    triCast: string;
    isStewardEnquiry: boolean = false;
    isVoidRace: boolean = false;
    eventDateTime?: Date;
    isVirtualEvent?: boolean = false;
    typeId?: string | null | undefined;
    placeDividends?: Array<PlaceDividend> | null | undefined;
    isResultAmended: boolean = false;
    addendumMessage: string;
    addendumMessageKey?: string;
    addendumColor: string= '#ffffff';

}
export class Totes {
    exacta: string | null | undefined;
    trifecta: string | null | undefined;
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