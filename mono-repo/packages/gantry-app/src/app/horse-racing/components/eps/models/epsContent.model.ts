import { PriceDetails } from '../../../../common/models/data-feed/sport-bet-models';
import { PaginationContent } from '../../../../common/models/pagination/pagination.models';

export class EpsResultsContent extends PaginationContent {
    title: string;
    currentTime: Date;
    bottomRightText: string;
    bestOddsGuaranteed: string;
    Runners: string;
    Ran: string;
    showBestOddsLevel: boolean = false;
    brandImageSrc: string | null;
    promoImageSrc: string | null;
    epsTermsBottomRightText: string | null;
    epsResultGroupedSorted: Array<EpsResultGroupedSorted> = [];
    sortedTricast?: string;
}

export class EpsResultGroupedSorted {
    meetingName: string;
    events: Array<EPSHorseRacingMeetingResults> = [];
    noOfPageGroupColumns: Array<Number> = [];
    pages: Array<Number> = [];
}

export class EPSHorseRacingMeetingResults {
    eventId: number | null | undefined;
    typeName: string;
    eventTime: Date | null | undefined;
    raceStage: string | null | undefined;
    eachWays?: string;
    runners: string | null | undefined;
    sortedTricast: string | null | undefined;
    winOrEachWayText: string | null | undefined;
    runnerCount: string | null | undefined;
    raceOffTime: Date | null | undefined;
    runnerList: Array<EPSHorseRacingResultDetails> = [];
    win: string | null | undefined;
    place: Array<string> = [];
    foreCast: string | null | undefined;
    triCast: string | null | undefined;
    totes: Totes;
    isNonRunner: boolean = false;
    nonRunnerList: Array<EPSHorseRacingResultDetails> = [];
    allRunnerSelections: Array<EPSHorseRacingResultDetails> = [];
    isStewardEnquiry: boolean = false;
    isVoidRace: boolean = false;
    isMarketSettled: boolean = false;
    isEventResulted: boolean = false;
    isAbandonedRace: boolean = false;
    isLiveNowEvent: boolean = false;
    isPhotoFinish: boolean = false;
    isEarlyPrice: boolean = false;
    isRaceOff: boolean = false;
    showStewardsState: string | null | undefined;
    page: number;
    stewardsState?: string | null | undefined;
    hideHeader: boolean = false;
    backgroundColor: string | null | undefined;
}

export class EPSHorseRacingResultDetails {
    horseRunnerNumber: string;
    horseName: string | null | undefined;
    currentPrice: PriceDetails | null | undefined;
    horseOdds: string | null | undefined;
    horseOddsTwo: string | null | undefined;
    position: string | null | undefined;
    isDeadHeat: boolean = false;
    favourite: string | null | undefined;
    jockeySilkImage: string | null | undefined;
    isReserved?: boolean | null | undefined;
    isFavourite: boolean = false;
    isRunner: boolean = false;
    isNonRunner: boolean = false;
    hideEntry: boolean = false;
    hidePrice: boolean = false;
}

export class Totes {
    exacta: string | null | undefined;
    trifecta: string | null | undefined;
}
