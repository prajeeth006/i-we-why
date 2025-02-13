import {
    MeetingResultContent,
    MeetingResultMap,
    PlaceDividend,
    ResultMarket,
    ResultSelection,
    ResultingContent,
} from '../../../../../common/models/data-feed/meeting-results.model';

export class MockMeetingResultsMapData {
    resultSelection: ResultSelection = {
        selectionName: 'Horse1',
        selectionId: 1,
        position: '1',
        startingPrice: 1,
        runnerNumber: 5,
        startingPriceFraction: '',
        isDeadHeat: false,
        favourite: 'F',
        resultCode: 'Win',
    };

    placeDividend1: PlaceDividend = {
        position: '1',
        runnerNumber: '1',
        dividend: '9.34',
    };

    placeDividend2: PlaceDividend = {
        position: '2',
        runnerNumber: '2',
        dividend: '10.34',
    };

    placeDividend3: PlaceDividend = {
        position: '3',
        runnerNumber: '3',
        dividend: '12.34',
    };

    listOfSelections: Array<ResultSelection> = [this.resultSelection];
    placeDividends: Array<PlaceDividend> = [this.placeDividend1, this.placeDividend2, this.placeDividend3];

    resultMarket1: ResultMarket = {
        sortedTricast: null,
        eachWays: 'EACH-WAY 1/4 1-2-3-4',
        exacta: '77.10',
        foreCast: '56.15',
        listOfSelections: this.listOfSelections,
        marketKey: 50212475,
        place: '5.10,2,4',
        get placeList(): Array<string> {
            if (!this.place) {
                return [];
            }

            const placeList = this.place.split(',').filter((place: string) => place != '');

            return placeList;
        },
        jackPot: '1004.56',
        placePot: '472.16',
        quadPot: '32.17',
        triCast: '695.10',
        trifecta: '77.70',
        win: '20.40',
        isMarketSettled: true,
        placeDividends: this.placeDividends,
        isAbandonedRace: false,
        isPhotoFinish: false,
        stewardsState: '',
    };

    resultingContent1: ResultingContent = {
        eventId: 1270481,
        eventName: 'Romford Results',
        eventTime: '17:08',
        raceOffTime: 'OFF: 12:45:16',
        resultMarket: this.resultMarket1,
        runnerCount: 3,
        typeId: '1001',
        isStewardEnquiry: false,
        isVoidRace: false,
        isAbandonedRace: false,
        isPhotoFinish: false,
        isMarketResulted: false,
        stewardsState: '',
        typeFlagCode: 'VR',
        category: 19,
        isResultAmended: false,
        isMarketSettled: false,
        eventDateTime: new Date(),
    };

    meetingResultContent1: MeetingResultContent = {
        resultingContent: this.resultingContent1,
    };

    types: Map<number, MeetingResultContent> = new Map<number, MeetingResultContent>([[1, this.meetingResultContent1]]);

    meetingResultMap: MeetingResultMap = {
        types: this.types,
    };

    //Trifact Testing mock Data

    resultSelection1Tricast: ResultSelection = {
        selectionName: 'Horse1',
        selectionId: 1,
        position: '1',
        startingPrice: 1,
        runnerNumber: 5,
        startingPriceFraction: '',
        isDeadHeat: false,
        favourite: 'F',
        resultCode: 'Win',
    };
    resultSelection2Tricast: ResultSelection = {
        selectionName: 'Horse2',
        selectionId: 2,
        position: '3',
        startingPrice: 2,
        runnerNumber: 1,
        startingPriceFraction: '',
        isDeadHeat: false,
        favourite: 'F',
        resultCode: 'Place',
    };
    resultSelection3Tricast: ResultSelection = {
        selectionName: 'Horse3',
        selectionId: 3,
        position: '2',
        startingPrice: 3,
        runnerNumber: 2,
        startingPriceFraction: '',
        isDeadHeat: false,
        favourite: 'F',
        resultCode: 'Place',
    };
    resultSelection4Tricast: ResultSelection = {
        selectionName: 'Horse4',
        selectionId: 4,
        position: '3',
        startingPrice: 4,
        runnerNumber: 4,
        startingPriceFraction: '',
        isDeadHeat: false,
        favourite: 'F',
        resultCode: 'Place',
    };

    listOfSelectionsTricast: Array<ResultSelection> = [
        this.resultSelection1Tricast,
        this.resultSelection2Tricast,
        this.resultSelection3Tricast,
        this.resultSelection4Tricast,
    ];

    resultMarket1Tricast: ResultMarket = {
        sortedTricast: null,
        eachWays: 'EACH-WAY 1/4 1-2',
        exacta: '77.10',
        foreCast: '56.15',
        listOfSelections: this.listOfSelectionsTricast,
        marketKey: 50212475,
        place: '5.10,2,4',
        get placeList(): Array<string> {
            if (!this.place) {
                return [];
            }

            const placeList = this.place.split(',').filter((place: string) => place != '');

            return placeList;
        },
        jackPot: '1004.56',
        placePot: '472.16',
        quadPot: '32.17',
        triCast: '695.10',
        trifecta: '77.70',
        win: '20.40',
        isMarketSettled: true,
        placeDividends: this.placeDividends,
        isAbandonedRace: false,
        isPhotoFinish: false,
        stewardsState: '',
    };

    resultingContent1Tricast: ResultingContent = {
        eventId: 1270481,
        eventName: 'Romford Results',
        eventTime: '17:08',
        raceOffTime: 'OFF: 12:45:16',
        resultMarket: this.resultMarket1Tricast,
        runnerCount: 6,
        typeId: '1001',
        isStewardEnquiry: false,
        isResultAmended: false,
        isVoidRace: false,
        isAbandonedRace: false,
        isPhotoFinish: false,
        stewardsState: '',
        typeFlagCode: 'VR',
        category: 19,
        isMarketResulted: false,
        isMarketSettled: false,
        eventDateTime: new Date(),
    };

    meetingResultContent1Tricast: MeetingResultContent = {
        resultingContent: this.resultingContent1Tricast,
    };

    typesTricast: Map<number, MeetingResultContent> = new Map<number, MeetingResultContent>([[1, this.meetingResultContent1Tricast]]);

    meetingResultTricastMap: MeetingResultMap = {
        types: this.typesTricast,
    };
}
