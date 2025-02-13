import { PlaceDividend } from '../../common/models/data-feed/meeting-results.model';
import { RacingContentResult } from './data-feed/racing-content.model';
import { ImageStatus } from './fallback-src.constant';
import { HorseRacingContent } from './horseracing-content.model';

export class HorseRacingMeetingResultsTemplate {
    title: string | null | undefined;
    eventName: string | null | undefined;
    jackPot: string | null | undefined;
    placePot: string | null | undefined;
    quadPot: string | null | undefined;
    horseRacingMeetingResultsTable: Array<HorseRacingMeetingResults> = [];
    horseRacingStaticContent: HorseRacingContent;
    isResultAvailable: boolean | null | undefined;
    VoidRaceCount: number = 0;
    isVirtualRace: boolean | null | undefined;
    stewardsState: string | null | undefined;
}

export class HorseRacingEventResultsTemplate {
    eventName: string | null | undefined;
    raceOffTime: string | null | undefined;
    horseRacingEventResultsTable: HorseRacingMeetingResults;
    horseRacingContent: HorseRacingContent;
    racingContentResult: RacingContentResult;
}

export class HorseRacingMeetingResults {
    eventTime: string | null | undefined;
    raceStage: string | null | undefined;
    hideHeader: boolean | null | undefined;
    eachWays: string | null | undefined;
    sortedTricast: string | null | undefined;
    runnerCount: string | null | undefined;
    raceOffTime: string | null | undefined;
    runnerList: Array<HorseRacingResultDetails> = [];
    win: string | null | undefined;
    place: string | null | undefined; // comma separated list
    isTricastVerticalScroll: boolean;
    isForecastVerticalScroll: boolean;

    get placeList(): Array<string> {
        if (!this.place) {
            return [];
        }

        const placeList = this?.place?.split(',')?.filter((place) => place != '');

        return placeList;
    }

    foreCast: string | null | undefined;
    triCast: string | null | undefined;
    totes: Totes;
    isNonRunner: boolean = false;
    nonRunnerList: Array<HorseRacingResultDetails> = [];
    isStewardEnquiry: boolean = false;
    isAbandonedRace: boolean;
    isPhotoFinish: boolean;
    isVoidRace: boolean = false;
    showStewardsState: string | null | undefined;
    stewardsState?: string | null | undefined;
    isMarketSettled: boolean = false;
    eventDateTime?: Date | null | undefined;
    placeDividends?: Array<PlaceDividend> | null | undefined;
    page?: number | null;
}

export class HorseRacingResultDetails {
    horseRunnerNumber: string | null | undefined;
    horseName: string | null | undefined;
    horseOdds: string | null | undefined;
    position: string | null | undefined;
    isDeadHeat: boolean | null | undefined;
    favourite: string | null | undefined;
    price: string | null | undefined;
    jockeySilkImage: string | null | undefined = ImageStatus.Default;
    isReserved?: boolean | null | undefined;
    isFavourite: boolean = false;
    horseRaceNonRunnerList?: string | null | undefined;
}

export class Totes {
    exacta: string;
    trifecta: string;
    isToteExactaVerticalScroll: boolean;
    isToteTrifectaVerticalScroll: boolean;
}

export enum RaceStage {
    VOIDRACE = 'VOID RACE',
    STEWARDSENQUIRY = 'STEWARDS ENQUIRY',
}
