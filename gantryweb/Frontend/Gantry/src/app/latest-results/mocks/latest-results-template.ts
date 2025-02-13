import { MeetingResultContent, ResultMarket, ResultSelection, ResultingContent } from "src/app/common/models/data-feed/meeting-results.model";
import { LatestResultDetails, LatestResults } from "../models/latest-results.model";

export class MockLatestResultsMapData1 {
  resultSelection1Tricast: LatestResultDetails = {
    selectionRunnerNumber: "11",
    selectionName: "NEW REALIST",
    selectioneOdds: "4",
    position: "2",
    isDeadHeat: false,
    price: "",
    jointFavorite: "",
    resultCode: "",
    categoryName: "",
    isJointFavorite: false
  };
  listOfSelectionsTricast: Array<LatestResultDetails> = [this.resultSelection1Tricast];
  latestResultingContent1: LatestResults = {
    eventTime: "17:08",
    eventId: 1,
    hideHeader: false,
    category: 21,
    eventName: "Horse Racing",
    eachWays: "EACH-WAY 1/4 1-2",
    runnerCount: "6",
    markets: [],
    price: "",
    runnerList: this.listOfSelectionsTricast,
    foreCast: "56.15",
    triCast: "695.10",
    isStewardEnquiry: false,
    isPhotoFinish: false,
    isVoidRace: false,
    showStewardsState: "",
    stewardsState: "",
    eventDateTime: new Date("2022-12-31T15:30:00Z"),
    isResultAmended: false,
    marketSettledTime: new Date("2022-12-31T15:30:00Z"),
    flipHeader: false,
    page: 2,
    isMarketSettled: false,
  };

  resultSelection: ResultSelection = {
    selectionName: "DUMPY DAVE",
    selectionId: 411391879,
    position: "1",
    startingPrice: 12,
    runnerNumber: 2,
    startingPriceFraction: "11/1",
    isDeadHeat: false,
    favourite: "F",
    resultCode: "Win",
  };

  listOfSelections: Array<ResultSelection> = [this.resultSelection];

  resultMarket1: ResultMarket = {
    "sortedTricast": null,
    eachWays: "EACH-WAY 1/4 1-2-3",
    exacta: "77.10",
    foreCast: "568.26",
    listOfSelections: this.listOfSelections,
    marketKey: 50212475,
    place: "5.10,2,4",
    get placeList(): Array<string> {
      if (!this.place) {
        return [];
      }

      let placeList = this.place
        .split(",")
        .filter((place: string) => place != "");

      return placeList;
    },
    jackPot: "1004.56",
    placePot: "472.16",
    quadPot: "32.17",
    triCast: "695.10",
    trifecta: "77.70",
    win: "20.40",
    isMarketSettled: true,
    stewardsState: "",
    isAbandonedRace:false,
    isPhotoFinish: false,

  };

  latestResult: ResultingContent = {
    eventId: 1,
    typeId: '',
    eventName: '',
    eventTime: '',
    runnerCount: 1,
    raceOffTime: '',
    resultMarket: this.resultMarket1,
    isStewardEnquiry: false,
    isAbandonedRace: false,
    isPhotoFinish: false,
    stewardsState: "",
    isVoidRace: false,
    typeFlagCode: '',
    eventDateTime: new Date(),
    category: 1,
    marketSettledTime: new Date(),
    isResultAmended: false,
    isMarketResulted: false,
    isMarketSettled : false
  };

  latestResultContent: MeetingResultContent = {
    resultingContent: this.latestResult,
  }

}





