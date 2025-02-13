
export class MeetingTempResult {
  newItem: MeetingResultContent;
  result: MeetingResultMap = new MeetingResultMap();
}

export class MeetingResultMap {
  types: Map<number, MeetingResultContent> = new Map<
    number,
    MeetingResultContent
  >();
}

export class MeetingResultContent {
  resultingContent: ResultingContent;
}

export class ResultingContent {
  eventId: number | null | undefined;
  typeId: string | null | undefined;
  eventName: string | null | undefined; //2 2nd header = RESULTS COMPLETE
  eventTime: string | null | undefined; //1 header
  runnerCount: number | null | undefined; //5 4th header
  raceOffTime: string | null | undefined; //6 5th header
  resultMarket: ResultMarket | null | undefined;
  isStewardEnquiry: boolean | null | undefined;
  isAbandonedRace: boolean | null | undefined;
  isPhotoFinish: boolean | null | undefined;
  stewardsState: string | null | undefined;
  isVoidRace: boolean | null | undefined;
  typeFlagCode: string | null | undefined;
  eventDateTime?: Date | null | undefined;
  category: number | null | undefined;
  marketSettledTime?: Date | null | undefined;
  isResultAmended?: boolean = false;
  isMarketResulted: boolean | null | undefined;
  isMarketSettled: boolean | null | undefined;
}

export class ResultMarket {
  marketKey: number | null | undefined;
  foreCast: string | null | undefined; //7 top
  triCast: string | null | undefined; //7 bottom
  exacta: string | null | undefined; //10 (8th header = EXACTA content = stringdata) if only exacta present
  trifecta: string | null | undefined; // 8th header = content = EXACTA \n stringdata \n TRIFECTA \n stringdata
  win: string | null | undefined; //8 6th header
  place: string | null | undefined; // comma separated list - 9 7th header = PLACE content = array data
  get placeList(): Array<string> {
    if (!this.place) {
      return [];
    }

    let placeList = this.place.split(",").filter((place) => place != "");

    return placeList;
  }
  jackPot?: string | null | undefined;
  placePot: string | null | undefined;
  quadPot: string | null | undefined;
  eachWays: string | null | undefined; //4 3rd col header
  listOfSelections: Array<ResultSelection> | null | undefined;
  isMarketSettled: boolean | null | undefined;
  placeDividends?: Array<PlaceDividend> | null | undefined;
  stewardsState: string | null | undefined;
  isAbandonedRace: boolean | null | undefined;
  isPhotoFinish: boolean | null | undefined;
  sortedTricast: any | null | undefined;
}

export class ResultSelection {
  selectionName: string | null | undefined;
  selectionId: number | null | undefined;
  position: string | null | undefined;
  startingPrice: number | null | undefined;
  runnerNumber: number | null | undefined;
  startingPriceFraction: string | null | undefined;
  isDeadHeat: boolean | null | undefined;
  favourite: string | null | undefined;
  resultCode: string | null | undefined;
}

export class PlaceDividend {
  position: string | null | undefined;
  runnerNumber: string | null | undefined;
  dividend: string | null | undefined;
}
