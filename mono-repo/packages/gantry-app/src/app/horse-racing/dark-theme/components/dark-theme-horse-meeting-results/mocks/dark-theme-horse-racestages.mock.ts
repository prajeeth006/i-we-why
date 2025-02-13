import {
    HorseRacingMeetingResults,
    HorseRacingMeetingResultsTemplate,
    HorseRacingResultDetails,
    Totes,
} from '../../../../models/horse-racing-meeting-results.model';
import { HorseRacingContent } from '../../../../models/horseracing-content.model';

export class MockMeetingResultsMapData1 {
    resultSelection1Tricast: HorseRacingResultDetails = {
        horseRunnerNumber: '11',
        horseName: 'NEW REALIST',
        horseOdds: '4',
        position: '2',
        isDeadHeat: false,
        favourite: '',
        price: '',
        jockeySilkImage: 'Default',
        isReserved: false,
        isFavourite: false,
        horseRaceNonRunnerList: '',
    };
    resultSelection2Tricast: HorseRacingResultDetails = {
        horseRunnerNumber: '1',
        horseName: 'NEW REALISE',
        horseOdds: '2',
        position: '1',
        isDeadHeat: false,
        favourite: '',
        price: '',
        jockeySilkImage: 'Default',
        isReserved: false,
        isFavourite: false,
        horseRaceNonRunnerList: '',
    };
    resultSelection3Tricast: HorseRacingResultDetails = {
        horseRunnerNumber: '5',
        horseName: 'OXYGEN',
        horseOdds: '9',
        position: '5',
        isDeadHeat: false,
        favourite: '',
        price: '',
        jockeySilkImage: 'Default',
        isReserved: false,
        isFavourite: false,
        horseRaceNonRunnerList: '',
    };
    resultSelection4Tricast: HorseRacingResultDetails = {
        horseRunnerNumber: '8',
        horseName: 'SWEET MAGIC',
        horseOdds: '15',
        position: '2',
        isDeadHeat: false,
        favourite: '',
        price: '',
        jockeySilkImage: 'Default',
        isReserved: false,
        isFavourite: false,
        horseRaceNonRunnerList: '',
    };

    listOfSelectionsTricast: Array<HorseRacingResultDetails> = [
        this.resultSelection1Tricast,
        this.resultSelection2Tricast,
        this.resultSelection3Tricast,
        this.resultSelection4Tricast,
    ];
    nonRunnerListOfSelections: Array<HorseRacingResultDetails> = [];
    meetingResultResultingContent: HorseRacingMeetingResults = {
        eventTime: '17:08',
        raceStage: '',
        hideHeader: false,
        eachWays: 'EACH-WAY 1/4 1-2',
        runnerCount: '6',
        raceOffTime: 'OFF: 12:45:16',
        runnerList: this.listOfSelectionsTricast,
        win: '20.40',
        place: '5.10,1.50,3.20',
        get placeList(): Array<string> {
            if (!this.place) {
                return [];
            }

            const placeList = this.place.split(',').filter((place: string) => place != '');

            return placeList;
        },
        foreCast: '56.15',
        isForecastVerticalScroll: false,
        triCast: '695.10',
        isTricastVerticalScroll: false,
        // totes: undefined,
        isNonRunner: false,
        nonRunnerList: this.nonRunnerListOfSelections,
        isStewardEnquiry: false,
        isAbandonedRace: false,
        isPhotoFinish: false,
        isVoidRace: false,
        showStewardsState: '',
        stewardsState: '',
        eventDateTime: new Date('2022-12-31T15:30:00Z'),
        placeDividends: [
            {
                position: '1',
                runnerNumber: '1',
                dividend: '7.34',
            },
            {
                position: '2',
                runnerNumber: '2',
                dividend: '9.34',
            },
            {
                position: '3',
                runnerNumber: '3',
                dividend: '12.34',
            },
        ],
        page: 2,
        isMarketSettled: false,
        sortedTricast: undefined,
        totes: new Totes(),
    };

    horseRacingMeetingResults: Array<HorseRacingMeetingResults> = [this.meetingResultResultingContent];
    nonrunnersRacingMeetingResults: Array<HorseRacingMeetingResults> = [];
    horseRacingContent: HorseRacingContent = {
        racingPostImage: {
            src: 'https://scmedia.cms.test.env.works/$-$/62461d8ebe87448cab3fc58c48951c56.png',
            alt: 'RacingPost',
            width: 545,
            height: 68,
        },
        contentParameters: {
            AntePostOptionalAdditionalInfo: 'Ante Post Optional Additional Info',
            AvailableUntil: 'AVAILABLE UNTIL',
            BestOddGuaranteed: 'BEST ODDS GUARANTEED',
            DeadHeat: 'Dead-Heat',
            EW: 'E/W',
            GOING: 'GOING',
            HorseRacing: 'HORSE RACING',
            HowFar: 'HOW FAR?',
            HowFarLeftSideText: 'HORSE MUST WIN OR ALL BETS ARE LOSERS / RULE 4 MAY APPLY',
            HowFarOptionalAdditionalInfo: 'How Far Optional Additional Info',
            HowFarWill: 'HOW FAR WILL',
            JC: 'JC',
            JF: 'JF',
            MatchBetsLeftSideText: 'ONE HORSE MUST FINISH OTHERWISE BET VOID',
            MatchBetsOptionalAdditionalInfo: ' Match Bets Optional Additional Info',
            Meeting: 'MEETING',
            MoneyBoostLeftSideText: 'MAX BET £25. SINGLES ONLY. ONE PER CUSTOMER. BETS MUST BE PLACES OVER THE COUNTER TO QUALIFY.',
            MoneyBoostSubtitleLeft: 'RENDLESHAM HURDLE SPECIAL',
            MoneyBoostSubtitleRight: 'AVAILABLE UNTIL 11AM TODAY',
            No: 'NO',
            PLACES: 'PLACES',
            RACE: 'RACE',
            RAN: 'RAN',
            RUN: 'RUN',
            Runner: 'RUNNER',
            SuspendsAt: 'SUSPENDS AT',
            TIP: 'TIP',
            TodaysMatchBets: "TODAY'S MATCH BETS",
            TodaysNonRunnersUK: "TODAY'S NON RUNNERS UK",
            Was2: 'WAS 2',
            WinBy: 'WIN BY?',
            WinOnly: 'WIN ONLY',
            Odds: 'ODDS',
            stewardsState: '',
            Photo: 'PHOTO',
            RaceAbandoned: 'RACE ABANDONED',
            ResultStands: 'RESULT STANDS',
            VoidRace: 'VOID RACE',
            AmendedResult: 'AMENDED RESULT',
            StewardsEnquiry: "STEWARDS' ENQUIRY",
        },
    };

    horseRacingMeetingResultsTemplate: HorseRacingMeetingResultsTemplate = {
        title: 'VIRTUAL RACING',
        eventName: 'Portman Park',
        jackPot: '456',
        placePot: '459',
        quadPot: '543',
        horseRacingMeetingResultsTable: this.horseRacingMeetingResults,
        horseRacingStaticContent: this.horseRacingContent,
        isResultAvailable: false,
        VoidRaceCount: 0,
        isVirtualRace: true,
        stewardsState: '',
    };
}
