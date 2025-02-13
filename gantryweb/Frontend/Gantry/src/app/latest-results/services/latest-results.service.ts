import { Injectable } from "@angular/core";
import { catchError, combineLatest, EMPTY, map, tap, concatMap, shareReplay } from 'rxjs';
import { EventFeedUrlService } from 'src/app/common/services/event-feed-url.service';
import { CommonResultsService } from 'src/app/common/services/data-feed/common-results.service';
import { SelectionNameLength, StewardType, StewardsStatus } from "src/app/common/models/general-codes-model";
import { FillerPageService } from "src/app/common/components/filler-page/services/filler-page.service";
import { FillerPageMessage } from "src/app/common/components/filler-page/models/filler-page-messages.model";
import { RunnerDetailsRacingEvent } from "src/app/common/helpers/runner-details-racing-event.helper";
import {
  LatestResults,
  LatestResultsTemplate,
  LatestResultDetails
} from '../models/latest-results.model';
import {
  MeetingResultContent,
  MeetingResultMap,
  ResultSelection,
} from "src/app/common/models/data-feed/meeting-results.model";
import { Category, EachWay } from '../models/common.model';
import { StringHelper } from "src/app/common/helpers/string.helper";
import { ErrorService } from "src/app/common/services/error.service";
import { LatestSixResultsContentService } from "../services/latestsixresults-content.service";
import { LatestSixResultsContent } from '../models/latestsixresults-content.model'
import { RunnerType } from "src/app/common/models/racing-tags.model";

@Injectable({
  providedIn: 'root'
})
export class LatestResultsService {
  errorMessage$ = this.errorService.errorMessage$;
  fillerPageMessage$ = this.fillerPageService.fillerPageMessage$;
  private eventFeedApiUrls$ = this.eventFeedUrlService.eventFeedApiUrls$;
  isLatestSixResultTemplate: boolean | null | undefined;

  constructor(
    private errorService: ErrorService,
    private fillerPageService: FillerPageService,
    private latestSixResultsContent: LatestSixResultsContentService,
    private eventFeedUrlService: EventFeedUrlService,
    private commonResultsService: CommonResultsService
  ) { }

  latestSixResultsData$ = combineLatest([
    this.eventFeedApiUrls$
  ])
    .pipe(
      concatMap(([eventFeedApiUrls]) => {
        let url = `${eventFeedApiUrls.latestResultsApi}`;
        this.commonResultsService.setUrl(url, eventFeedApiUrls.snapShotDataTimeOut);
        return this.commonResultsService.data$;
      }),
      shareReplay()
    );

  latestResult$ = this.latestSixResultsData$.pipe(
    map((meetingResultMap: MeetingResultMap) => {
      return this.prepareResult(meetingResultMap);
    }),
    tap(
      (
        latestResultsTemplate: LatestResultsTemplate
      ) => {
        this.errorService.isStaleDataAvailable = true;
        this.errorService.unSetError();
      }
    ),
    catchError((err) => {
      this.errorService.logError(err);
      return EMPTY;
    })
  );

  prepareResult(
    latestResultMap: MeetingResultMap
  ): LatestResultsTemplate {
    let resultingContentList: Array<MeetingResultContent> =
      new Array<MeetingResultContent>();
    latestResultMap?.types?.forEach((value: MeetingResultContent) => {
      resultingContentList.push(value);
    });

    resultingContentList?.sort(function (a, b) {
      if (a.resultingContent?.marketSettledTime < b.resultingContent?.marketSettledTime)
        return 1;
      if (a.resultingContent?.marketSettledTime > b.resultingContent?.marketSettledTime)
        return -1;
      return 0;
    });
    return this.setLatestResultsTemplate(resultingContentList);
  }

  latestSixResultsContent$ = this.latestSixResultsContent.data$.pipe(
    tap((
      latestSixResultsContent: LatestSixResultsContent) => {
    }),
    catchError((err) => {
      return EMPTY;
    })
  );

  private setPageContent(
    latestResult: LatestResultsTemplate,
    latestSixResultsContent: LatestSixResultsContent
  ): LatestResultsTemplate {
    latestResult.latestSixResultsStaticContent = latestSixResultsContent;
    return latestResult;
  }

  data$ = combineLatest([this.latestResult$, this.latestSixResultsContent$]).pipe(
    map(([latestResult, latestSixResultsContent]) => {
      return this.setPageContent(latestResult, latestSixResultsContent);
    }),
    tap(
      (latestResultsTemplate: LatestResultsTemplate) => { }),
    catchError((err) => {
      return EMPTY;
    })
  );

  private setRunners(
    selections: Array<ResultSelection>,
    latestResults: LatestResults,
    eachWays: string
  ): LatestResults {
    selections?.forEach((selection) => {
      let resultDetails: LatestResultDetails =
        new LatestResultDetails();
      resultDetails.position = selection.position;
      resultDetails.selectionName = selection.selectionName?.replaceAll('|', '')?.toLocaleUpperCase();
      resultDetails.selectionName = StringHelper.checkSelectionNameLengthAndTrimEnd(resultDetails.selectionName, SelectionNameLength.Eighteen);
      resultDetails.selectionRunnerNumber = selection.runnerNumber?.toString();
      resultDetails.jointFavorite = selection.favourite;
      resultDetails.isJointFavorite = StringHelper.checkFavouriteTag(selection?.favourite)
      resultDetails.isDeadHeat = selection.isDeadHeat;
      resultDetails.price = selection?.startingPriceFraction?.endsWith("/1")
        ? selection?.startingPriceFraction?.substring(
          0,
          selection?.startingPriceFraction?.indexOf("/")
        )
        : selection?.startingPriceFraction;
      if (latestResults.category == Category.categoryKey1) {
        resultDetails.categoryName = Category.categoryName;
      }
      if (!!resultDetails.position) {
        latestResults.runnerList.push(resultDetails);
      }
    });
    latestResults.runnerList?.sort(
      (a, b) => Number(a.position) - Number(b.position)
    );
    return latestResults;
  }

  setSISData(latestResults: LatestResults) {
    if (latestResults?.isVoidRace) {
      latestResults.stewardsState = StewardsStatus.voidRace;
      latestResults.hideHeader = true;
    } else if (latestResults.isStewardEnquiry && (latestResults?.showStewardsState === StewardType.stewardsState_S || latestResults?.showStewardsState === StewardType.stewardsState_R)) {
      latestResults.stewardsState = StewardsStatus.stewardsEnquiry;
      latestResults.flipHeader = true;
    } else if (latestResults.isStewardEnquiry && latestResults?.showStewardsState === StewardType.stewardsState_V) {
      latestResults.stewardsState = StewardsStatus.resultStands;
      latestResults.flipHeader = true;
    } else if (latestResults.isStewardEnquiry && latestResults?.showStewardsState === StewardType.stewardsState_Z) {
      latestResults.stewardsState = StewardsStatus.amendedResult;
      latestResults.flipHeader = true;
    } else if (latestResults?.isStewardEnquiry && latestResults?.isPhotoFinish) {
      latestResults.stewardsState = StewardsStatus.stewardsEnquiry;
      latestResults.flipHeader = true;
    } else if (latestResults?.isPhotoFinish) {
      latestResults.stewardsState = StewardsStatus.photo;
      latestResults.flipHeader = true;
    }
    return latestResults
  }

  setLatestResultsTemplate(
    resultingContentList: Array<MeetingResultContent>
  ): LatestResultsTemplate {
    let latestResultsTemplate: LatestResultsTemplate =
      new LatestResultsTemplate();
    resultingContentList.forEach(
      (latestResultContent: MeetingResultContent) => {
        let latestResults: LatestResults =
          new LatestResults();
        latestResults.eventName =
          latestResultContent.resultingContent?.eventName;
        latestResults.eventId =
          latestResultContent.resultingContent?.eventId;
        latestResults.isStewardEnquiry = !!latestResultContent?.resultingContent?.isStewardEnquiry;
        latestResults.category = latestResultContent.resultingContent?.category;
        latestResults.showStewardsState = latestResultContent?.resultingContent?.stewardsState;
        latestResults.isPhotoFinish = latestResultContent?.resultingContent?.isPhotoFinish;
        latestResults.isVoidRace = latestResultContent?.resultingContent?.isVoidRace;
        latestResults = this.setSISData(latestResults);
        latestResults.eventDateTime =
          latestResultContent.resultingContent?.eventDateTime;
        latestResults.marketSettledTime = latestResultContent.resultingContent?.marketSettledTime;
        latestResults.eachWays =
          StringHelper.prepareEachWay(latestResultContent.resultingContent?.resultMarket?.eachWays, EachWay.winOnly);
        latestResults.runnerCount =
          latestResultContent.resultingContent?.runnerCount?.toString();
        latestResults.foreCast =
          StringHelper.checkToteResults(latestResultContent.resultingContent?.resultMarket?.foreCast);
        latestResults.triCast =
          StringHelper.checkToteResults(latestResultContent.resultingContent?.resultMarket?.triCast);
        latestResults = this.setRunners(
          latestResultContent.resultingContent?.resultMarket?.listOfSelections,
          latestResults,
          latestResultContent.resultingContent?.resultMarket?.eachWays,
        );
        if (latestResults.category == Category.categoryKey1) {
          latestResults.runnerList =
            RunnerDetailsRacingEvent.setRunnerDetails(
              RunnerType.Dog,
              Number(latestResults?.runnerCount),
              latestResultContent.resultingContent?.resultMarket?.eachWays,
              latestResults?.foreCast,
              latestResults?.triCast,
              latestResults?.runnerList
            );
        }

        if (latestResults.category == Category.categoryKey2) {
          latestResults.runnerList =
            RunnerDetailsRacingEvent.setRunnerDetails(
              RunnerType.Horse,
              Number(latestResults?.runnerCount),
              latestResultContent.resultingContent?.resultMarket?.eachWays,
              latestResults.foreCast,
              latestResults.triCast,
              latestResults?.runnerList);
        }

        if (latestResults?.runnerList?.length > 0) {
          latestResultsTemplate.isResultAvailable = true;
          latestResults.isMarketSettled = true;
          latestResultsTemplate.latestResultsTable.push(
            latestResults
          );
        }
      }
    );
    latestResultsTemplate.isResultAvailable
      ? this.fillerPageService.unSetFillerPage()
      : this.fillerPageService.setFillerPage(FillerPageMessage.ResultsToFollow);
    return latestResultsTemplate;
  }
}
