import { Injectable } from '@angular/core';

import { EMPTY, catchError, combineLatest, concatMap, map, shareReplay, startWith, tap } from 'rxjs';

import { FillerPageMessage } from '../../../common/components/filler-page/models/filler-page-messages.model';
import { FillerPageService } from '../../../common/components/filler-page/services/filler-page.service';
import { RunnerDetailsRacingEvent } from '../../../common/helpers/runner-details-racing-event.helper';
import { StringHelper } from '../../../common/helpers/string.helper';
import { MeetingResultContent, MeetingResultMap, ResultSelection } from '../../../common/models/data-feed/meeting-results.model';
import { DisplayStatus, SelectionNameLength, StewardType, StewardsStatus } from '../../../common/models/general-codes-model';
import { RunnerType } from '../../../common/models/racing-tags.model';
import { CommonResultsService } from '../../../common/services/data-feed/common-results.service';
import { ErrorService } from '../../../common/services/error.service';
import { EventFeedUrlService } from '../../../common/services/event-feed-url.service';
import { EventSourceDataFeedService } from '../../../common/services/event-source-data-feed.service';
import { DarkCategory, EachWay, ResultCode } from '../../models/common.model';
import { LatestResultDetails, LatestResults, LatestResultsTemplate } from '../../models/latest-results.model';
import { LatestSixResultsContent } from '../../models/latestsixresults-content.model';
import { LatestSixResultsContentService } from '../../services/latestsixresults-content.service';

@Injectable({
    providedIn: 'root',
})
export class DarkThemeLatestFourResultsService {
    errorMessage$ = this.errorService.errorMessage$;
    fillerPageMessage$ = this.fillerPageService.fillerPageMessage$;
    private eventFeedApiUrls$ = this.eventFeedUrlService.eventFeedApiUrls$;
    isLatestSixResultTemplate: boolean | null | undefined;

    constructor(
        private errorService: ErrorService,
        private fillerPageService: FillerPageService,
        private latestSixResultsContent: LatestSixResultsContentService,
        private eventFeedUrlService: EventFeedUrlService,
        private commonResultsService: CommonResultsService,
        private eventSourceDataFeedService: EventSourceDataFeedService,
    ) {}

    latestSixResultsData$ = combineLatest([this.eventFeedApiUrls$]).pipe(
        concatMap(([eventFeedApiUrls]) => {
            const url = `${eventFeedApiUrls.latestResultsApi}`;
            this.eventSourceDataFeedService.apiKeyName.next('');
            this.commonResultsService.setUrl(url, eventFeedApiUrls.snapShotDataTimeOut);
            return this.commonResultsService.data$;
        }),
        shareReplay(),
    );

    latestResult$ = this.latestSixResultsData$.pipe(
        map((meetingResultMap: MeetingResultMap) => {
            return this.prepareResult(meetingResultMap);
        }),
        tap(() => {
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
        }),
        catchError((err) => {
            this.errorService.logError(err);
            return EMPTY;
        }),
    );

    prepareResult(latestResultMap: MeetingResultMap): LatestResultsTemplate {
        const resultingContentList: Array<MeetingResultContent> = new Array<MeetingResultContent>();
        latestResultMap?.types?.forEach((value: MeetingResultContent) => {
            if (value.resultingContent?.displayStatus?.toLowerCase() !== DisplayStatus.NotDisplayed?.toLowerCase()) {
                resultingContentList.push(value);
            }
        });

        resultingContentList?.sort(function (a, b) {
            if (!!a.resultingContent?.marketSettledTime && !!b.resultingContent?.marketSettledTime) {
                if (a.resultingContent?.marketSettledTime < b.resultingContent?.marketSettledTime) return 1;
                if (a.resultingContent?.marketSettledTime > b.resultingContent?.marketSettledTime) return -1;
            }
            return 0;
        });
        return this.setLatestResultsTemplate(resultingContentList);
    }

    latestSixResultsContent$ = this.latestSixResultsContent.data$.pipe(
        startWith({} as LatestSixResultsContent), // Initial value
    );

    private setPageContent(latestResult: LatestResultsTemplate, latestSixResultsContent: LatestSixResultsContent): LatestResultsTemplate {
        latestResult.latestSixResultsStaticContent = latestSixResultsContent;
        return latestResult;
    }

    data$ = combineLatest([this.latestResult$, this.latestSixResultsContent$]).pipe(
        map(([latestResult, latestSixResultsContent]) => {
            return this.setPageContent(latestResult, latestSixResultsContent);
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    private setRunners(selections?: Array<ResultSelection>, latestResults?: LatestResults): LatestResults {
        selections?.forEach((selection) => {
            const resultDetails: LatestResultDetails = new LatestResultDetails();
            resultDetails.position = selection.position;
            resultDetails.selectionName = selection?.selectionName?.replaceAll('|', '');
            if (resultDetails?.selectionName?.toLowerCase()?.includes(ResultCode?.Reserve?.toLowerCase())) {
                resultDetails.isReserved = true;
                resultDetails.selectionName = StringHelper.selectionNameLengthAndTrimEnd(
                    StringHelper.checkReserveRunner(resultDetails.selectionName),
                    SelectionNameLength.Thirteen,
                );
            }
            resultDetails.selectionName = StringHelper.selectionNameLengthAndTrimEnd(resultDetails.selectionName, SelectionNameLength.Eighteen);
            resultDetails.selectionRunnerNumber = selection.runnerNumber?.toString();
            resultDetails.jointFavorite = selection.favourite;
            resultDetails.isJointFavorite = StringHelper.checkFavouriteTag(selection.favourite);
            resultDetails.isDeadHeat = selection.isDeadHeat;
            resultDetails.price = selection?.startingPriceFraction;
            if (latestResults?.category == DarkCategory.categoryKey1) {
                resultDetails.categoryName = DarkCategory.categoryName;
            }
            if (resultDetails?.position) {
                latestResults?.runnerList?.push(resultDetails);
            }
        });
        latestResults?.runnerList?.sort((a, b) => Number(a.position) - Number(b.position));
        return latestResults!;
    }

    setSISData(latestResults: LatestResults) {
        if (latestResults.isStewardEnquiry && latestResults?.showStewardsState === StewardType.stewardsState_Z) {
            latestResults.stewardsState = StewardsStatus.amendedResult;
        }
        return latestResults;
    }

    setLatestResultsTemplate(resultingContentList: Array<MeetingResultContent>): LatestResultsTemplate {
        const latestResultsTemplate: LatestResultsTemplate = new LatestResultsTemplate();
        resultingContentList.forEach((latestResultContent: MeetingResultContent) => {
            let latestResults: LatestResults = new LatestResults();
            latestResults.eventName = latestResultContent.resultingContent?.eventName;
            latestResults.eventId = latestResultContent.resultingContent?.eventId;
            latestResults.isStewardEnquiry = !!latestResultContent?.resultingContent?.isStewardEnquiry;
            latestResults.category = latestResultContent.resultingContent?.category;
            latestResults.showStewardsState = latestResultContent?.resultingContent?.stewardsState;
            latestResults = this.setSISData(latestResults);
            latestResults.eventDateTime = latestResultContent.resultingContent?.eventDateTime;
            latestResults.marketSettledTime = latestResultContent.resultingContent?.marketSettledTime;
            latestResults.eachWays = StringHelper.prepareEachWay(latestResultContent.resultingContent?.resultMarket?.eachWays, EachWay.winOnly);
            latestResults.runnerCount = latestResultContent.resultingContent?.runnerCount?.toString();
            latestResults.foreCast = StringHelper.checkToteResults(latestResultContent.resultingContent?.resultMarket?.foreCast);
            latestResults.isForecastVerticalScroll = StringHelper.shouldShowSeparator(latestResults?.foreCast, 1);
            latestResults.triCast = StringHelper.checkToteResults(latestResultContent.resultingContent?.resultMarket?.triCast);
            latestResults.isTricastVerticalScroll = StringHelper.shouldShowSeparator(latestResults?.triCast, 1);
            latestResults.displayStatus = latestResultContent.resultingContent?.displayStatus;
            latestResults = this.setRunners(latestResultContent.resultingContent?.resultMarket?.listOfSelections, latestResults);
            if (latestResults.category == DarkCategory.categoryKey1) {
                latestResults.runnerList = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
                    RunnerType.Dog,
                    latestResultContent.resultingContent?.resultMarket?.eachWays,
                    latestResults?.runnerList,
                    latestResultContent.resultingContent?.resultMarket?.sortedTricast,
                );
            }

            if (latestResults.category == DarkCategory.categoryKey2) {
                latestResults.runnerList = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
                    RunnerType.Horse,
                    latestResultContent.resultingContent?.resultMarket?.eachWays,
                    latestResults?.runnerList,
                    latestResultContent.resultingContent?.resultMarket?.sortedTricast,
                );
            }

            if (latestResults?.runnerList?.length > 0) {
                latestResultsTemplate.isResultAvailable = true;
                latestResults.isMarketSettled = true;
                latestResultsTemplate.latestResultsTable.push(latestResults);
            }
        });
        latestResultsTemplate.isResultAvailable
            ? this.fillerPageService.unSetFillerPage()
            : this.fillerPageService.setFillerPage(FillerPageMessage.ResultsToFollow);
        return latestResultsTemplate;
    }
}
