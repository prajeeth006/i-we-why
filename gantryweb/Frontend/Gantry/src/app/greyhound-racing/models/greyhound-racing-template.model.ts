import { SportBookMarketStructured } from "../../common/models/data-feed/sport-bet-models";
import { IBaseRacingTemplateResult, IBaseRacingTemplateResultEntry } from "../../common/contracts/base-racing-template.models";
import { RacingContentGreyhoundResult } from "./racing-content.model";
import { ContentImage } from "@frontend/vanilla/core";

export class GreyhoundRacingTemplateResult {
    isAnyEventResulted: boolean;
    greyhoundRacingResultPage: GreyhoundRacingResultPage;
    greyhoundRacingRunnersResult: GreyhoundRacingRunnersResult;
}

export class GreyhoundRacingResultPage {
    title: string | null | undefined;
    eventName: string | null | undefined;
    raceNumber: string | null | undefined;
    distance: string | null | undefined;
    going: string | null | undefined;
    raceOff: string | null | undefined;
    runners: Array<GreyhoundResultEntry> = [];
    forecastTitle: string | null | undefined;
    tricastTitle: string | null | undefined;
    forecast: string | null | undefined;
    tricast: string | null | undefined;
    eachWay: string | null | undefined;
    runnerCount: string | null | undefined;
    greyhoundStaticContent?: GreyhoundStaticContent;
    grade: string | null | undefined;
    eventDateTime?: Date;
    isVirtualEvent?: boolean = false;
}

export class GreyhoundRacingRunnersResult implements IBaseRacingTemplateResult {
    categoryName: string;
    markets: Array<SportBookMarketStructured> = [];
    featureMarkets?: Array<SportBookMarketStructured> = [];
    racingContent: RacingContentGreyhoundResult;
    eventName: string;
    eventStatus: string;
    displayStatus: string;
    raceStage: string;
    defaultPriceColumn: string;
    greyhoundRacingEntries: Array<GreyhoundRacingEntry> = [];
    bettingFavouritePrice: number;
    areCurrentPricesPresent: boolean;
    arePastPricesPresent: boolean;
    arePlus1MarketPricesPresent: boolean;
    arePlus2MarketPricesPresent: boolean;
    marketEachWayString: string;
    greyhoundRacingTipRunnerOrder: Array<string> = [];
    greyhoundRacingPostTip: Array<string> = [];
    isRaceOff: boolean;
    greyHoundImageData: GreyhoundStaticContent;
    isNonRunner: boolean = false;
    hasAnyReservedRunner?: boolean = false;
    isUKEvent: boolean = false;
    eventTimePlusTypeName?: string | null;
    napOrNb?: string;
    runnerCount?: string | null | undefined;
    isVirtualEvent: boolean = false;
    isEvrRace?: boolean = false;
    isHalfScreenType?: boolean = false;
    isFullScreenType?: boolean = false;
    featureMarketList?: Array<FeatureMarketEntry> = [];
    showBannerPostPick?: boolean | number = false;
    showFlexScreen?: boolean | number = false;
    marketSelectionPresent?: boolean | number = false;
    showForm?: boolean | number = false;
    isEventStarted?: boolean = false;
    showRaceStage?: boolean = false;
    isAdditionalMarket?: boolean = false;
    isApproachingTraps?: boolean = false;
}

export class FeatureMarketEntry {
    marketName: string;
    marketIndex: number;
    featureSelectionEntry?: Array<FeatureSelectionEntry> = [];
}

export class FeatureSelectionEntry {
    selectionName: string;
    price: number | string;
    isSuspended?: boolean;
}

export class GreyhoundResultEntry implements IBaseRacingTemplateResultEntry {
    position: string | null | undefined;
    trapImage: string | null | undefined;
    runnerNumber: string | null | undefined;
    greyhoundName: string | null | undefined;
    price: string | null | undefined;
    isJointFavourite: boolean | null | undefined;
    isDeadHeat: boolean | null | undefined;
    jointFavourite: string | null | undefined;
    deadHeat: string | null | undefined;
    isReserved: boolean | null | undefined;
}

export class GreyhoundRacingEntry {
    trapImage: string;
    greyhoundNumber: string;
    greyhoundName: string;
    currentPrice: number = 0;
    pastPrice1Str: string;
    pastPrice2Str: string;
    prices: { [marketName: string]: string } = {};
    hidePrice?: { [marketName: string]: boolean } = {};
    hideEntry?: { [marketName: string]: boolean } = {};
    nonRunner: boolean;
    comment: string;
    last5Runs: string;
    isReserved: boolean;
    isAdditionalSelection?: boolean = false;

}

export class GreyhoundStaticContent {
    contentParameters: {
        [attr: string]: string;
    };
    greyHoundImages: RunnerImages
    racingPostImage: ContentImage;
    racingPostImageFull: ContentImage | null | undefined;;
}

export class RunnerImages {
    runnerImages: Array<ContentImage>;
}