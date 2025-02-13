
import { Injectable } from '@angular/core';
//import * as moment from 'moment-timezone';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { BrandImageContent } from 'src/app/common/components/error/models/error-content.model';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { RunnerDetailsRacingEvent } from 'src/app/common/helpers/runner-details-racing-event.helper';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { ResultSelection } from 'src/app/common/models/data-feed/meeting-results.model';
import { SportBookMarketStructured } from 'src/app/common/models/data-feed/sport-bet-models';
import { SelectionNameLength, StewardsStatus, StewardType } from 'src/app/common/models/general-codes-model';
import { FavouriteTags, RunnerType } from 'src/app/common/models/racing-tags.model';
import { ErrorService } from 'src/app/common/services/error.service';
import { HorseRacingMarkets, ResultCode } from 'src/app/horse-racing/models/common.model';
import { HorseRacingContent } from 'src/app/horse-racing/models/horseracing-content.model';
import { HorseRacingContentService } from 'src/app/horse-racing/services/horseracing-content.service';
import { EpsResultGroupedSorted, EPSHorseRacingMeetingResults, EPSHorseRacingResultDetails, EpsResultsContent, Totes } from '../models/epsContent.model';
import { EpsResult, SportBookEPSEventStructured } from './data-feed/eps-models';
import { EpsImageService } from './eps-image.service';
import { EpsResultsService } from './eps-results/eps-results.service';
import { LoggerService } from 'src/app/common/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class EpsTemplateService {

  constructor(private errorService: ErrorService,
    private epsImageService: EpsImageService,
    private epsResultsService: EpsResultsService,
    private loggerService: LoggerService,
    private horseRacingContent: HorseRacingContentService) {
  }

  errorMessage$ = this.errorService.errorMessage$;

  brandImageContent$ = this.epsImageService.brandImage$;

  promoImageContent$ = this.epsImageService.promoImage$;

  epsResult$ = this.epsResultsService.data$
    .pipe(
      map((epsResultMap: EpsResult) => {
        return this.prepareResult(epsResultMap);
      }),
      tap((epsResultsContent: EpsResultsContent) => {
        this.errorService.isStaleDataAvailable = true;
        JSON.stringify(epsResultsContent, JsonStringifyHelper.replacer)
        this.errorService.unSetError();
      }),
      catchError(err => {
        this.errorService.logError(err);
        return EMPTY;
      })
    );

  horseRacingContent$ = this.horseRacingContent.data$
    .pipe(
      tap((horseRacingContent: HorseRacingContent) => { }),
      catchError(err => {
        this.loggerService.logError(err);
        return EMPTY;
      })
    );

  data$ = combineLatest([
    this.epsResult$,
    this.horseRacingContent$,
    this.brandImageContent$,
    this.promoImageContent$
  ]).pipe(
    map(([epsResultMap, horseRacingContent, brandImageContent, promoImageContent]) => {
      return this.prepareCombinedResult(epsResultMap, horseRacingContent, brandImageContent, promoImageContent);
    }),
    tap((epsResultsTemplate: EpsResultsContent) => JSON.stringify(epsResultsTemplate, JsonStringifyHelper.replacer)),
    catchError(err => {
      this.loggerService.logError(err);
      return EMPTY;
    })
  );

  private prepareCombinedResult(epsResultsContent: EpsResultsContent, horseRacingContent: HorseRacingContent, brandImageContent: BrandImageContent, promoImageContent: BrandImageContent): EpsResultsContent {
    epsResultsContent.title = horseRacingContent?.contentParameters?.EpsTitle;
    epsResultsContent.currentTime = new Date();
    epsResultsContent.bottomRightText = horseRacingContent?.contentParameters?.EpsBottomRightText;
    epsResultsContent.bestOddsGuaranteed = horseRacingContent?.contentParameters?.EpsBestOddsGuaranteed;
    epsResultsContent.brandImageSrc = brandImageContent?.brandImage?.src;
    epsResultsContent.promoImageSrc = promoImageContent?.brandImage?.src;
    epsResultsContent.epsTermsBottomRightText = horseRacingContent?.contentParameters?.EpsTermsBottomRightText;
    epsResultsContent.Runners = horseRacingContent?.contentParameters?.EpsRunner;
    epsResultsContent.Ran = horseRacingContent?.contentParameters?.EpsRan;
    var todayDate = new Date();
    epsResultsContent.showBestOddsLevel = todayDate.getHours() >= 8;


    //StringHelper?.checkEpsTextLengthAndTrimEnd()
    //this.paginationSetup(epsResultsContent, timeSeconds);
    return epsResultsContent;
  }

  // paginationSetup(resultContent: EpsResultsContent, timeSeconds: number) {
  //   this.paginationService.commonPaginationSetup(this.pageDetails, resultContent.epsResultGroupedSorted.length);
  //   resultContent.paginationText = this.pageDetails.paginationText;
  //   resultContent.startIndex = this.pageDetails.startIndex;
  //   resultContent.endIndex = this.pageDetails.endIndex;
  // }

  prepareResult(epsResultMap: EpsResult): EpsResultsContent {
    let epsResultsContent = new EpsResultsContent()
    let meetingList: Array<EPSHorseRacingMeetingResults> = new Array<EPSHorseRacingMeetingResults>();


    for (let [, event] of epsResultMap.events) {
      if (event.typeFlagCode?.includes('IE') || event.typeFlagCode?.includes('UK')) {
        let horseRacingMeetingResults = new EPSHorseRacingMeetingResults();
        horseRacingMeetingResults.isEventResulted = false;
        horseRacingMeetingResults.eventTime = event.eventDateTime;
        horseRacingMeetingResults.typeName = event.typeName?.replaceAll('|', '');
        horseRacingMeetingResults.runnerCount = event.runnerCount ? event.runnerCount.toString() : '';
        horseRacingMeetingResults.eventId = event.eventKey;
        horseRacingMeetingResults.raceOffTime = event.offTime || null;
        horseRacingMeetingResults.isAbandonedRace = !!event?.resultingContent?.isAbandonedRace;

        if (horseRacingMeetingResults?.isAbandonedRace) {
          horseRacingMeetingResults.stewardsState = StewardsStatus.Abandoned;
          horseRacingMeetingResults.hideHeader = true;
          horseRacingMeetingResults.backgroundColor = "bg-red";
        }

        for (let [, market] of event.markets) {
          if (market.marketName?.replaceAll('|', '').toUpperCase() == HorseRacingMarkets.WinOrEachWay) {
            horseRacingMeetingResults.winOrEachWayText = this.getEachWayString(market);
            horseRacingMeetingResults.eachWays = event?.resultingContent?.resultMarket?.eachWays;
            horseRacingMeetingResults.sortedTricast = event?.resultingContent?.resultMarket?.sortedTricast;
            for (let [, selection] of market.selections) {
              if (selection.resultCode?.toUpperCase() == ResultCode.Win) {
                horseRacingMeetingResults.isEventResulted = true;
              }
              if (selection.runnerNumber) {
                let horseDetails: EPSHorseRacingResultDetails = new EPSHorseRacingResultDetails();

                horseDetails.currentPrice = SportBookSelectionHelper.getLatestPrice(selection);
                horseDetails.horseOdds = SportBookMarketHelper.getPriceStrWithDenPrice(horseDetails.currentPrice);

                horseDetails.horseOddsTwo = SportBookMarketHelper.getPriceStrWithDenPrice(SportBookSelectionHelper.getPriceByPosition(selection, 1));

                horseDetails.horseName = selection.selectionName.replaceAll('|', '').toLocaleUpperCase();
                horseDetails.horseRunnerNumber = selection.runnerNumber?.toString();
                horseDetails.favourite = '';
                horseDetails.hideEntry = selection?.hideEntry;
                horseDetails.hidePrice = selection?.hidePrice;

                if (selection.selectionName?.includes("N/R")) {
                  horseDetails.horseOdds = "N/R";
                  horseDetails.horseName = StringHelper.checkSelectionNameLengthAndTrimEnd(horseDetails.horseName.toUpperCase().replace("N/R", ''), SelectionNameLength.Eighteen);
                  horseDetails.horseOddsTwo = '';
                  horseDetails.isNonRunner = true;
                  horseRacingMeetingResults.nonRunnerList?.push(horseDetails)
                }
                else {
                  horseDetails.horseName = StringHelper.checkSelectionNameLengthAndTrimEnd(horseDetails.horseName.toUpperCase(), SelectionNameLength.Eighteen);
                  horseRacingMeetingResults.allRunnerSelections?.push(horseDetails);
                }
              }
            }
          }
        }



        if (event.resultingContent && horseRacingMeetingResults.isEventResulted) {
          this.prepareMeetingResult(event, horseRacingMeetingResults);
        } else {
          if (event.raceStage && !horseRacingMeetingResults.isEventResulted) {
            horseRacingMeetingResults.isLiveNowEvent = true;
            horseRacingMeetingResults.isRaceOff = event.raceStage[0].toUpperCase() == 'O';
            if (!horseRacingMeetingResults.isRaceOff) {
              this.removeSuspendedSelections(horseRacingMeetingResults, event.eventName);
            }
          }
          else if (!horseRacingMeetingResults.isEventResulted && !horseRacingMeetingResults.isLiveNowEvent) {
            horseRacingMeetingResults.isEarlyPrice = true;
            this.removeSuspendedSelections(horseRacingMeetingResults, event.eventName);
          }
        }

        if (horseRacingMeetingResults.allRunnerSelections.length > 0 && !horseRacingMeetingResults.isEventResulted) {
          horseRacingMeetingResults.allRunnerSelections = this.sortSelectionsByFavorite(horseRacingMeetingResults.allRunnerSelections);
        }
        meetingList?.push(horseRacingMeetingResults);
      }
    }

    meetingList.sort((a, b) => new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime());
    //meetingList.sort((a, b) => this.convertToMinutes(a.eventTime) - this.convertToMinutes(b.eventTime));

    let groupByName = {};
    let sortedTypes: string[] = [];

    meetingList.forEach(function (a) {
      a.typeName = StringHelper.removeAllPipeSymbols(a.typeName);
      groupByName[a.typeName] = groupByName[a.typeName] || [];
      groupByName[a.typeName]?.push(a);
      if (!sortedTypes.find(x => x == a.typeName)) {
        sortedTypes?.push(a.typeName);
      }
    });
    let epsContentSortedList: Array<EpsResultGroupedSorted> = [];
    sortedTypes.forEach(function (itm) {
      let resultGrp = new EpsResultGroupedSorted();
      resultGrp.meetingName = itm;
      resultGrp.events = groupByName[itm];
      epsContentSortedList?.push(resultGrp);
    });
    epsResultsContent.epsResultGroupedSorted = epsContentSortedList;
    return epsResultsContent;
  }

  private getEachWayString(market: SportBookMarketStructured | null): string {
    if (market.eachWayFactorNum == market.eachWayFactorDen || market.eachWayFactorNum == '' || market.eachWayFactorDen == '') {
      return 'WIN ONLY';
    } else {
      let eachwayText = market.eachWayFactorNum + '/' + market.eachWayFactorDen + ' E/W ';
      if (parseInt(market.eachWayPlaces) > 0) {
        for (let i = 1; i <= parseInt(market.eachWayPlaces); i++) {
          eachwayText = eachwayText + i;
          if (i != parseInt(market.eachWayPlaces)) {
            eachwayText = eachwayText + '-';
          }
        }
      }
      return eachwayText;
    }
  }

  private sortSelectionsByFavorite(selections: EPSHorseRacingResultDetails[]): EPSHorseRacingResultDetails[] {
    selections.sort((a, b) => {
      return parseInt(a.horseRunnerNumber) - parseInt(b.horseRunnerNumber);
    });

    if (selections[0].currentPrice) {
      selections.sort((first, second) => {
        if (!first.currentPrice) {
          return 1;
        }
        else if (!second.currentPrice) {
          return -1;
        }
        const firstNumber = SportBookSelectionHelper.getCalculatedPrice(first.currentPrice.numPrice, first.currentPrice?.denPrice);
        const secondNumber = SportBookSelectionHelper.getCalculatedPrice(second.currentPrice.numPrice, second.currentPrice?.denPrice);

        return firstNumber - secondNumber;
      });

      let firstFavorite = selections?.find(x => x?.horseOdds != '');
      if (firstFavorite) {
        let favorites = selections?.filter(x => x.horseOdds != '' &&
          x.currentPrice?.numPrice == firstFavorite?.currentPrice?.numPrice &&
          x.currentPrice?.denPrice == firstFavorite?.currentPrice?.denPrice);

        favorites?.forEach(favoriteSel => {
          if (favoriteSel) {
            if (favorites?.length == 1)
              favoriteSel.favourite = FavouriteTags.favourite;
            else if (favorites?.length == 2)
              favoriteSel.favourite = FavouriteTags.jointFavourite;
            else if (favorites?.length > 2)
              favoriteSel.favourite = FavouriteTags.combinedFavorite;
          }
        });
      }
    }
    return selections
  }

  prepareMeetingResult(event: SportBookEPSEventStructured, horseRacingMeetingResults: EPSHorseRacingMeetingResults): EPSHorseRacingMeetingResults {
    //horseRacingMeetingResults.raceOffTime = event.offTime || null;
    // if(horseRacingMeetingResults.raceOffTime){
    //   let a = moment.tz(horseRacingMeetingResults.raceOffTime, 'Europe/London');
    //   horseRacingMeetingResults.raceOffTime = new Date(a.utc().format());
    // }
    horseRacingMeetingResults.foreCast = event.resultingContent?.resultMarket?.foreCast;
    horseRacingMeetingResults.triCast = event.resultingContent?.resultMarket?.triCast;
    horseRacingMeetingResults.win = event.resultingContent?.resultMarket?.win;
    horseRacingMeetingResults.totes = new Totes();
    horseRacingMeetingResults.totes.exacta = event.resultingContent?.resultMarket?.exacta;
    horseRacingMeetingResults.totes.trifecta = event.resultingContent?.resultMarket?.trifecta;

    horseRacingMeetingResults = this.setRunnersAndNonRunners(event.resultingContent?.resultMarket?.listOfSelections, horseRacingMeetingResults, horseRacingMeetingResults.winOrEachWayText);
    horseRacingMeetingResults.isStewardEnquiry = !!event?.resultingContent?.isStewardEnquiry;
    horseRacingMeetingResults.isVoidRace = !!event?.resultingContent?.isVoidRace;
    horseRacingMeetingResults.isMarketSettled = true;
    horseRacingMeetingResults.showStewardsState = event?.resultingContent?.stewardsState;
    horseRacingMeetingResults.isAbandonedRace = !!event?.resultingContent?.isAbandonedRace;
    horseRacingMeetingResults.isPhotoFinish = !!event?.resultingContent?.isPhotoFinish;

    if (horseRacingMeetingResults?.isAbandonedRace) {
      horseRacingMeetingResults.stewardsState = StewardsStatus.Abandoned;
      horseRacingMeetingResults.hideHeader = true;
      horseRacingMeetingResults.backgroundColor = "bg-red";
    } else if (horseRacingMeetingResults?.isVoidRace) {
      horseRacingMeetingResults.stewardsState = StewardsStatus.voidRace;
      horseRacingMeetingResults.hideHeader = true;
      horseRacingMeetingResults.backgroundColor = "bg-red";
    } else if (horseRacingMeetingResults.isStewardEnquiry && (horseRacingMeetingResults?.showStewardsState === StewardType.stewardsState_S || horseRacingMeetingResults?.showStewardsState === StewardType.stewardsState_R)) {
      horseRacingMeetingResults.stewardsState = StewardsStatus.stewardsEnquiry;
      horseRacingMeetingResults.backgroundColor = "bg-yellow";
    } else if (horseRacingMeetingResults.isStewardEnquiry && horseRacingMeetingResults?.showStewardsState === StewardType.stewardsState_V) {
      horseRacingMeetingResults.stewardsState = StewardsStatus.resultStands;
      horseRacingMeetingResults.backgroundColor = "bg-yellow";
    } else if (horseRacingMeetingResults.isStewardEnquiry && horseRacingMeetingResults?.showStewardsState === StewardType.stewardsState_Z) {
      horseRacingMeetingResults.stewardsState = StewardsStatus.amendedResult;
      horseRacingMeetingResults.backgroundColor = "bg-yellow";
    } else if (horseRacingMeetingResults?.isStewardEnquiry && horseRacingMeetingResults?.isPhotoFinish) {
      horseRacingMeetingResults.stewardsState = StewardsStatus.stewardsEnquiry;
      horseRacingMeetingResults.backgroundColor = "bg-yellow";
    } else if (horseRacingMeetingResults?.isPhotoFinish) {
      horseRacingMeetingResults.stewardsState = StewardsStatus.photo;
      horseRacingMeetingResults.backgroundColor = "bg-yellow";
    } else if (!horseRacingMeetingResults?.isPhotoFinish && horseRacingMeetingResults?.isMarketSettled) {
      horseRacingMeetingResults.stewardsState = StewardsStatus.result;
      horseRacingMeetingResults.backgroundColor = "bg-naviblue";
    }
    return horseRacingMeetingResults;
  }

  private setRunnersAndNonRunners(selections: Array<ResultSelection>, horseRacingMeetingResults: EPSHorseRacingMeetingResults, eachWays: string): EPSHorseRacingMeetingResults {
    if (!selections) {
      selections = Array<ResultSelection>();
    }
    horseRacingMeetingResults.nonRunnerList = [];
    horseRacingMeetingResults.allRunnerSelections = [];
    horseRacingMeetingResults.runnerList = [];
    selections.forEach(selection => {
      let horseDetails: EPSHorseRacingResultDetails = new EPSHorseRacingResultDetails();
      horseDetails.position = selection.position;
      horseDetails.horseOdds = SportBookMarketHelper.prepareEvs(selection?.startingPriceFraction?.endsWith('/1') ? selection?.startingPriceFraction?.substring(0, selection?.startingPriceFraction?.indexOf('/')) : selection?.startingPriceFraction);

      horseDetails.horseName = selection.selectionName.replaceAll('|', '').toLocaleUpperCase()
      horseDetails.horseRunnerNumber = selection.runnerNumber?.toString();
      horseDetails.favourite = selection.favourite;
      horseDetails.isDeadHeat = selection.isDeadHeat;

      if (selection.selectionName?.includes("N/R")) {
        horseDetails.horseOdds = "N/R";
        horseDetails.horseName = StringHelper.checkSelectionNameLengthAndTrimEnd(horseDetails.horseName.toUpperCase().replace("N/R", ''), SelectionNameLength.Eighteen);
        horseDetails.isNonRunner = true;
        horseDetails.position = selections.length.toString();
        horseRacingMeetingResults.nonRunnerList?.push(horseDetails)
      }
      else {
        horseDetails.horseName = StringHelper.checkSelectionNameLengthAndTrimEnd(horseDetails.horseName.toUpperCase(), SelectionNameLength.Eighteen);
        horseRacingMeetingResults.allRunnerSelections.push(horseDetails);
        horseRacingMeetingResults.runnerList.push(horseDetails);
      }
    });

    horseRacingMeetingResults.runnerList = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, horseRacingMeetingResults?.eachWays, horseRacingMeetingResults?.runnerList, horseRacingMeetingResults?.sortedTricast);
    return horseRacingMeetingResults;
  }

  private removeSuspendedSelections(horseRacingMeetingResults: EPSHorseRacingMeetingResults, eventName: string) {
    horseRacingMeetingResults.runnerList = horseRacingMeetingResults.runnerList.filter(x => !x.hideEntry);
    horseRacingMeetingResults.nonRunnerList = horseRacingMeetingResults.nonRunnerList.filter(x => !x.hideEntry);
    horseRacingMeetingResults.allRunnerSelections = horseRacingMeetingResults.allRunnerSelections.filter(x => !x.hideEntry);
    if (!horseRacingMeetingResults.isRaceOff) {
      horseRacingMeetingResults.runnerList.forEach(x => {
        x.horseOdds = x.hidePrice ? '' : x.horseOdds;
        x.horseOddsTwo = x.hidePrice ? '' : x.horseOddsTwo;
        return x;
      })
      horseRacingMeetingResults.nonRunnerList.forEach(x => {
        x.horseOdds = x.isNonRunner ? x.horseOdds : x.hidePrice ? '' : x.horseOdds;
        x.horseOddsTwo = x.hidePrice ? '' : x.horseOddsTwo;
        return x;
      })
      horseRacingMeetingResults.allRunnerSelections.forEach(x => {
        x.horseOdds = x.hidePrice ? '' : x.horseOdds;
        x.horseOddsTwo = x.hidePrice ? '' : x.horseOddsTwo;
        return x;
      })
    }
  }

}
