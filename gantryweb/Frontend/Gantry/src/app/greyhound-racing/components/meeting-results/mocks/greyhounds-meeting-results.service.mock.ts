import { MeetingResultContent, MeetingResultMap, ResultingContent, ResultMarket, ResultSelection } from "src/app/common/models/data-feed/meeting-results.model";

export class MockMeetingResultsMapData {

    resultSelection: ResultSelection = {
        selectionName: "Greyhound1",
        selectionId: 1,
        position: "1",
        startingPrice: 1,
        runnerNumber: 5,
        startingPriceFraction: "14/1",
        isDeadHeat: false,
        favourite: "F",
        resultCode: "Win"
    }

    resultSelection2: ResultSelection = {
        selectionName: "Greyhound2",
        selectionId: 1,
        position: "2",
        startingPrice: 2,
        runnerNumber: 3,
        startingPriceFraction: "20/1",
        isDeadHeat: true,
        favourite: undefined,
        resultCode: "Place"
    }

    resultSelection3: ResultSelection = {
        selectionName: "Greyhound3",
        selectionId: 1,
        position: "2",
        startingPrice: 3,
        runnerNumber: 4,
        startingPriceFraction: "15/1",
        isDeadHeat: true,
        favourite: undefined,
        resultCode: "Place"
    }

    resultSelection4: ResultSelection = {
        selectionName: "Greyhound4",
        selectionId: 1,
        position: "4",
        startingPrice: 4,
        runnerNumber: 5,
        startingPriceFraction: "17/1",
        isDeadHeat: false,
        favourite: undefined,
        resultCode: "Place"
    }

    resultSelection5: ResultSelection = {
        selectionName: "Greyhound5",
        selectionId: 1,
        position: "3",
        startingPrice: 8,
        runnerNumber: 5,
        startingPriceFraction: "20/1",
        isDeadHeat: true,
        favourite: undefined,
        resultCode: "Place"
    }


    listOfSelections: Array<ResultSelection> = [this.resultSelection, this.resultSelection2, this.resultSelection3, this.resultSelection4]

    resultMarket1: ResultMarket = {
        "sortedTricast": null,
        eachWays: "EACH-WAY 1/4 1-2-3-4",
        exacta: "77.10",
        foreCast: "56.15",
        listOfSelections: this.listOfSelections,
        marketKey: 50212475,
        place: '5.10,2,4',
        get placeList(): Array<string> {
            if (!this.place) {
                return [];
            }

            let placeList = this.place.split(",").filter((place: string) => place != "");

            return placeList;
        },
        placePot: "456",
        quadPot: "457",
        triCast: "695.10",
        trifecta: "77.70",
        win: "20.40",
        isMarketSettled: true,
        stewardsState: "",
        isAbandonedRace: false,
        isPhotoFinish: false
    }

    resultingContent1: ResultingContent = {
        eventId: 1270481,
        eventName: "ROMFORD RESULTS",
        eventTime: "01:15",
        raceOffTime: "OFF: 12:45:16",
        resultMarket: this.resultMarket1,
        runnerCount: 3,
        typeId: "1001",
        isStewardEnquiry: false,
        isResultAmended: false,
        isVoidRace: false,
        isAbandonedRace: false,
        isPhotoFinish: false,
        isMarketResulted: false,
        stewardsState: "",
        typeFlagCode: "VR",
        eventDateTime: new Date("2022-05-19T18:12:00Z"),
        category: 19,
        isMarketSettled: false
    };

    meetingResultContent1: MeetingResultContent = {
        resultingContent: this.resultingContent1
    }

    types: Map<number, MeetingResultContent> = new Map<number, MeetingResultContent>(
        [
            [1, this.meetingResultContent1]
        ]
    );


    meetingResultMap: MeetingResultMap = {
        types: this.types
    }
}