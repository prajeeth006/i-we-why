import { LatestSixResultsContent } from "./latestsixresults-content.model"
export class LatestResultsTemplate {
  title: string | null | undefined;
  eventName: string | null | undefined;
  latestResultsTable: Array<LatestResults> = [];
  latestSixResultsStaticContent: LatestSixResultsContent;
  isResultAvailable: boolean | null | undefined;
}
export class LatestResults {
  eventId: number | null | undefined;
  category: number | null | undefined;
  eventName: string | null | undefined;
  eventTime: string | null | undefined;
  eachWays: string | null | undefined;
  runnerCount: string | null | undefined;
  runnerList: Array<LatestResultDetails> = [];
  markets: Array<any>;
  price: string | null | undefined;
  foreCast: string;
  triCast: string;
  isMarketSettled: boolean = false;
  eventDateTime?: Date;
  page?: number | null;
  isResultAmended?: boolean = false;
  isStewardEnquiry?: boolean = false;
  isVoidRace?: boolean = false;
  stewardsState?: string | null | undefined;
  showStewardsState:string | null | undefined;
  hideHeader: boolean | null | undefined;
  isPhotoFinish:boolean;
  flipHeader: boolean | null | undefined;
  marketSettledTime?: Date | null | undefined;
}

export class LatestResultDetails {
  selectionRunnerNumber: string | null | undefined;
  selectionName: string | null | undefined;
  selectioneOdds: string | null | undefined;
  position: string | null | undefined;
  isDeadHeat: boolean = false;
  jointFavorite: string | null | undefined;
  price: string | null | undefined;
  isJointFavorite: boolean = false;
  resultCode: string | null | undefined;
  categoryName: string | null | undefined;
}




