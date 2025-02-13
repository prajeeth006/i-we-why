import {
    MeetingResultContent,
    MeetingResultMap,
    ResultMarket,
    ResultSelection,
    ResultingContent,
} from '../../common/models/data-feed/meeting-results.model';

export class MockLatestResultsMapData {
    resultSelection: ResultSelection = {
        selectionName: 'DUMPY DAVE',
        selectionId: 411391879,
        position: '1',
        startingPrice: 12,
        runnerNumber: 2,
        startingPriceFraction: '11/1',
        isDeadHeat: false,
        favourite: 'F',
        resultCode: 'Win',
    };

    listOfSelections: Array<ResultSelection> = [this.resultSelection];

    resultMarket1: ResultMarket = {
        sortedTricast: null,
        eachWays: 'EACH-WAY 1/4 1-2-3',
        exacta: '77.10',
        foreCast: '568.26',
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
        isAbandonedRace: false,
        isPhotoFinish: false,
        stewardsState: '',
    };

    resultingContent1: ResultingContent = {
        eventId: 1270481,
        eventName: 'HOT BALLOON',
        eventTime: '17:08',
        raceOffTime: 'OFF: 12:45:16',
        resultMarket: this.resultMarket1,
        runnerCount: 3,
        typeId: '1001',
        isStewardEnquiry: false,
        isResultAmended: false,
        isVoidRace: false,
        isAbandonedRace: false,
        isPhotoFinish: false,
        stewardsState: '',
        isMarketResulted: false,
        typeFlagCode: 'VR',
        category: 19,
        isMarketSettled: false,
        eventDateTime: new Date(),
        displayStatus: 'Displayed',
    };

    meetingResultContent1: MeetingResultContent = {
        resultingContent: this.resultingContent1,
    };

    types: Map<number, MeetingResultContent> = new Map<number, MeetingResultContent>([[1, this.meetingResultContent1]]);

    meetingResultMap: MeetingResultMap = {
        types: this.types,
    };
}
