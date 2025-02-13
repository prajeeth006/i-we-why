import { Injectable } from "@angular/core";
import { catchError, combineLatest, EMPTY, map, tap } from "rxjs";
import { FillerPageMessage } from "src/app/common/components/filler-page/models/filler-page-messages.model";
import { FillerPageService } from "src/app/common/components/filler-page/services/filler-page.service";
import { RunnerDetailsRacingEvent } from "src/app/common/helpers/runner-details-racing-event.helper";
import { StringHelper } from "src/app/common/helpers/string.helper";
import {
  MeetingResultContent,
  MeetingResultMap,
  ResultingContent,
  ResultSelection,
} from "src/app/common/models/data-feed/meeting-results.model";
import { SelectionNameLength, StewardType, ToteDividend } from "src/app/common/models/general-codes-model";
import { QueryParamEvent } from "src/app/common/models/query-param.model";
import { RunnerType } from "src/app/common/models/racing-tags.model";
import { MeetingResultsService } from "src/app/common/services/data-feed/meeting-result-service/meeting-results.service";
import { ErrorService } from "src/app/common/services/error.service";
import { HorseRacingMarkets } from "src/app/horse-racing/models/common.model";
import {
  HorseRacingMeetingResults,
  HorseRacingMeetingResultsTemplate,
  HorseRacingResultDetails,
  Totes,
} from "src/app/horse-racing/models/horse-racing-meeting-results.model";
import { HorseRacingContent } from "src/app/horse-racing/models/horseracing-content.model";
import { HorseRacing } from "src/app/horse-racing/models/hose-racing-common.enum";
import { HorseRacingContentService } from "src/app/horse-racing/services/horseracing-content.service";

@Injectable({
  providedIn: "root",
})
export class HorseRacingMeetingResultsService {
  errorMessage$ = this.errorService.errorMessage$;
  fillerPageMessage$ = this.fillerPageService.fillerPageMessage$;
  DividendText: string;

  meetingResult$ = this.meetingResultsService.data$.pipe(
    map((meetingResultMap: MeetingResultMap) => {
      return this.prepareResult(meetingResultMap);
    }),
    tap(
      (
        horseRacingMeetingResultsTemplate: HorseRacingMeetingResultsTemplate
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

  horseRacingContent$ = this.horseRacingContent.data$.pipe(
    tap((horseRacingContent: HorseRacingContent) => { }),
    catchError((err) => {
      return EMPTY;
    })
  );

  data$ = combineLatest([this.meetingResult$, this.horseRacingContent$]).pipe(
    map(([meetingResult, horseRacingContent]) => {
      return this.setPageContent(meetingResult, horseRacingContent);
    }),
    tap(
      (horseRacingMeetingResultsTemplate: HorseRacingMeetingResultsTemplate) => { }),
    catchError((err) => {
      return EMPTY;
    })
  );

  constructor(
    private meetingResultsService: MeetingResultsService,
    private horseRacingContent: HorseRacingContentService,
    private errorService: ErrorService,
    private fillerPageService: FillerPageService
  ) { }

  prepareResult(
    meetingResultMap: MeetingResultMap
  ): HorseRacingMeetingResultsTemplate {
    let resultingContentList: Array<MeetingResultContent> =
      new Array<MeetingResultContent>();
    meetingResultMap?.types?.forEach((value: MeetingResultContent) => {
      resultingContentList.push(value);
    });

    resultingContentList?.sort(function (a, b) {
      if (a.resultingContent?.eventDateTime > b.resultingContent?.eventDateTime)
        return 1;
      if (a.resultingContent?.eventDateTime < b.resultingContent?.eventDateTime)
        return -1;
      return 0;
    });
    return this.setHorseRacingMeetingResultsTemplate(resultingContentList);
  }

  private setHorseRacingMeetingResultsTemplate(
    resultingContentList: Array<MeetingResultContent>
  ): HorseRacingMeetingResultsTemplate {
    let horseRacingMeetingResultsTemplate: HorseRacingMeetingResultsTemplate =
      new HorseRacingMeetingResultsTemplate();
    horseRacingMeetingResultsTemplate.eventName =
      resultingContentList[0]?.resultingContent?.eventName;

    resultingContentList.forEach(
      (meetingResultContent: MeetingResultContent) => {
        let horseRacingMeetingResults: HorseRacingMeetingResults =
          new HorseRacingMeetingResults();

        this.setIsVirtualRace(horseRacingMeetingResultsTemplate, meetingResultContent?.resultingContent);

        if (!!meetingResultContent?.resultingContent?.resultMarket?.jackPot) {
          horseRacingMeetingResultsTemplate.jackPot =
            StringHelper.checkToteResults(meetingResultContent?.resultingContent?.resultMarket?.jackPot) == ToteDividend.DividendValue ? this.DividendText
              : meetingResultContent?.resultingContent?.resultMarket?.jackPot;
        }

        if (!!meetingResultContent?.resultingContent?.resultMarket?.quadPot) {
          horseRacingMeetingResultsTemplate.quadPot =
            meetingResultContent?.resultingContent?.resultMarket?.quadPot;
        }

        if (!!meetingResultContent?.resultingContent?.resultMarket?.placePot) {
          horseRacingMeetingResultsTemplate.placePot =
            meetingResultContent?.resultingContent?.resultMarket?.placePot;
        }

        horseRacingMeetingResults.eventDateTime =
          meetingResultContent.resultingContent?.eventDateTime;
        horseRacingMeetingResults.eachWays =
          StringHelper.prepareEachWay(meetingResultContent.resultingContent?.resultMarket?.eachWays, HorseRacingMarkets.WinOnly);
        horseRacingMeetingResults.sortedTricast =  meetingResultContent.resultingContent?.resultMarket?.sortedTricast;
        horseRacingMeetingResults.runnerCount =
          meetingResultContent.resultingContent?.runnerCount?.toString();
        horseRacingMeetingResults.raceOffTime =
          meetingResultContent.resultingContent?.raceOffTime;
        horseRacingMeetingResults.foreCast =
          StringHelper.checkToteResults(meetingResultContent.resultingContent?.resultMarket?.foreCast);
        horseRacingMeetingResults.triCast =
          StringHelper.checkToteResults(meetingResultContent.resultingContent?.resultMarket?.triCast);
        horseRacingMeetingResults.win =
          meetingResultContent.resultingContent?.resultMarket?.win;
        horseRacingMeetingResults.place =
          meetingResultContent.resultingContent?.resultMarket?.place;
        horseRacingMeetingResults.placeDividends = RunnerDetailsRacingEvent.setPlaceDividends(meetingResultContent?.resultingContent?.resultMarket?.placeDividends);
        horseRacingMeetingResults.totes = new Totes();
        horseRacingMeetingResults.totes.exacta =
          meetingResultContent.resultingContent?.resultMarket?.exacta;
        horseRacingMeetingResults.totes.trifecta = (!!meetingResultContent.resultingContent?.resultMarket?.triCast && meetingResultContent.resultingContent?.resultMarket?.triCast != 'null') ?
          meetingResultContent.resultingContent?.resultMarket?.trifecta : '';
        horseRacingMeetingResults = this.setRunnersAndNonRunners(
          meetingResultContent.resultingContent?.resultMarket?.listOfSelections,
          horseRacingMeetingResults,
          meetingResultContent.resultingContent?.resultMarket?.eachWays
        );
        horseRacingMeetingResults.isStewardEnquiry =
          !!meetingResultContent?.resultingContent?.isStewardEnquiry;
        horseRacingMeetingResults.isVoidRace =
          !!meetingResultContent?.resultingContent?.isVoidRace;
        horseRacingMeetingResults.isAbandonedRace =
          !!meetingResultContent?.resultingContent?.isAbandonedRace;
        horseRacingMeetingResults.isPhotoFinish =
          !!meetingResultContent?.resultingContent?.isPhotoFinish;
        horseRacingMeetingResults.runnerList =
          RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse, meetingResultContent.resultingContent?.resultMarket?.eachWays, horseRacingMeetingResults?.runnerList, horseRacingMeetingResults?.sortedTricast
          );
        if (
          !!horseRacingMeetingResults?.isStewardEnquiry ||
          !!horseRacingMeetingResults?.isVoidRace ||
          !!horseRacingMeetingResults?.isAbandonedRace ||
          !!horseRacingMeetingResults?.isPhotoFinish ||
          horseRacingMeetingResults?.runnerList?.length > 0
        ) {
          horseRacingMeetingResultsTemplate.isResultAvailable = true;
          horseRacingMeetingResults.isMarketSettled = true;
          horseRacingMeetingResults.showStewardsState = meetingResultContent?.resultingContent?.stewardsState;
          horseRacingMeetingResultsTemplate.horseRacingMeetingResultsTable.push(
            horseRacingMeetingResults
          );
        }
        if (horseRacingMeetingResults.isVoidRace) {
          horseRacingMeetingResultsTemplate.VoidRaceCount =
            horseRacingMeetingResultsTemplate.VoidRaceCount + 1;
        }
      }
    );
    horseRacingMeetingResultsTemplate.isResultAvailable
      ? this.fillerPageService.unSetFillerPage()
      : this.fillerPageService.setFillerPage(FillerPageMessage.ResultsToFollow);
    return horseRacingMeetingResultsTemplate;
  }

  private setRunnersAndNonRunners(
    selections: Array<ResultSelection>,
    horseRacingMeetingResults: HorseRacingMeetingResults,
    eachWays: string
  ): HorseRacingMeetingResults {
    selections?.forEach((selection) => {
      let horseDetails: HorseRacingResultDetails =
        new HorseRacingResultDetails();
      horseDetails.position = selection.position;
      horseDetails.horseName = selection.selectionName?.replaceAll('|', '')?.toLocaleUpperCase();
      if (horseDetails.horseName?.includes(HorseRacing.Reserve)) {
        horseDetails.isReserved = true;
        horseDetails.horseName = StringHelper.checkReserveRunner(horseDetails.horseName);
      }
      horseDetails.horseName = StringHelper.checkSelectionNameLengthAndTrimEnd(horseDetails.horseName, SelectionNameLength.Eighteen);
      horseDetails.horseRunnerNumber = selection.runnerNumber?.toString();
      horseDetails.favourite = selection.favourite;
      horseDetails.isDeadHeat = selection.isDeadHeat;
      horseDetails.price = selection?.startingPriceFraction?.endsWith("/1")
        ? selection?.startingPriceFraction?.substring(
          0,
          selection?.startingPriceFraction?.indexOf("/")
        )
        : selection?.startingPriceFraction;
      if (selection.selectionName?.includes("N/R")) {
        horseRacingMeetingResults.nonRunnerList.push(horseDetails);
      } else {
        if (!!horseDetails.position) {
          horseRacingMeetingResults.runnerList.push(horseDetails);
        }
      }
    });

    horseRacingMeetingResults.nonRunnerList.length > 0
      ? (horseRacingMeetingResults.isNonRunner = true)
      : (horseRacingMeetingResults.isNonRunner = false);
    horseRacingMeetingResults.runnerList?.sort(
      (a, b) => Number(a.position) - Number(b.position)
    );
    return horseRacingMeetingResults;
  }

  private setPageContent(
    meetingResult: HorseRacingMeetingResultsTemplate,
    horseRacingContent: HorseRacingContent
  ): HorseRacingMeetingResultsTemplate {
    meetingResult = this.setPageTitle(meetingResult, horseRacingContent);
    meetingResult = this.setRaceStages(meetingResult, horseRacingContent);
    meetingResult.horseRacingStaticContent = horseRacingContent;
    return meetingResult;
  }

  private setPageTitle(
    meetingResult: HorseRacingMeetingResultsTemplate,
    horseRacingContent: HorseRacingContent
  ): HorseRacingMeetingResultsTemplate {
    meetingResult.title = meetingResult?.isVirtualRace ?
      horseRacingContent?.contentParameters?.VirtualRacing :
      horseRacingContent?.contentParameters?.Title;

    this.DividendText = horseRacingContent?.contentParameters?.NotWon;
    return meetingResult;
  }

  setRaceStages(
    meetingResult: HorseRacingMeetingResultsTemplate,
    horseRacingContent: HorseRacingContent
  ): HorseRacingMeetingResultsTemplate {
    meetingResult?.horseRacingMeetingResultsTable.forEach((selection) => {
      selection.raceStage = selection?.isStewardEnquiry
        ? horseRacingContent?.contentParameters?.StewardEnquiry
        : selection?.isVoidRace
          ? horseRacingContent?.contentParameters?.VoidRace
          : horseRacingContent?.contentParameters?.ResultComplete;

      if (selection?.isAbandonedRace) {
        selection.stewardsState = horseRacingContent?.contentParameters?.RaceAbandoned;
        selection.hideHeader = true;
      } else if (selection?.isVoidRace) {
        selection.stewardsState = horseRacingContent?.contentParameters?.VoidRace;
        selection.hideHeader = true;
      } else if (selection.isStewardEnquiry && (selection?.showStewardsState === StewardType.stewardsState_S || selection?.showStewardsState === StewardType.stewardsState_R)) {
        selection.stewardsState = horseRacingContent?.contentParameters?.StewardsEnquiry;
      }
      else if (selection.isStewardEnquiry && selection?.showStewardsState === StewardType.stewardsState_V) {
        selection.stewardsState = horseRacingContent?.contentParameters?.ResultStands;
      } else if (selection.isStewardEnquiry && selection?.showStewardsState === StewardType.stewardsState_Z) {
        selection.stewardsState = horseRacingContent?.contentParameters?.AmendedResult;

      } else if (selection?.isStewardEnquiry && selection?.isPhotoFinish) {
        selection.stewardsState = horseRacingContent?.contentParameters?.StewardsEnquiry;
      }

      else if (selection?.isPhotoFinish) {
        selection.stewardsState = horseRacingContent?.contentParameters?.Photo;
      } else if (!selection?.isPhotoFinish && selection?.isMarketSettled) {
        selection.stewardsState = horseRacingContent?.contentParameters?.ResultComplete;
      }

    });

    return meetingResult;
  }

  public setTypeId(typeId: string) {
    this.meetingResultsService.setTypeId(new QueryParamEvent(typeId));
  }

  public setIsVirtualRace(meetingResult: HorseRacingMeetingResultsTemplate, resultingContent: ResultingContent) {
    let typesCodes = resultingContent?.typeFlagCode?.split(",");
    meetingResult.isVirtualRace = typesCodes?.indexOf('VR') > -1
  }

}
