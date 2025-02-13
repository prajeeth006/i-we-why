import { Injectable } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { SportBookResultHelper } from 'src/app/common/helpers/sport-book-result.helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SportBookResult, SportBookSelection } from 'src/app/common/models/data-feed/sport-bet-models';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from 'src/app/common/models/query-param.model';
import { SportBookService } from 'src/app/common/services/data-feed/sport-book.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { DartEnumContent, DartMarkets } from '../models/dart-constants.model';
import { DartDataContent } from '../models/dart-data-content.model';
import { DartTemplateContent } from '../models/dart-template.model';
import { DartContentService } from './dart-content.service';
import { MatchBettingService } from './match-betting-service/match-betting.service';
import { MatchCorrectScoreService } from './match-correct-score/match-correct-score.service';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { Markets, Sports } from 'src/app/common/models/gantrymarkets.model';

@Injectable({
  providedIn: 'root'
})
export class DartTemplateService {
  constructor(private sportBookService: SportBookService,
    private dartContentService: DartContentService,
    private matchBettingService: MatchBettingService,
    private matchCorrectScoreService: MatchCorrectScoreService,
    private gantryMarketsService: GantryMarketsService,
    private errorService: ErrorService
  ) { }

  handCapvalue: number = 0;
  totalHandCapvalue: number = 0;

  errorMessage$ = this.errorService.errorMessage$;

  dartResult$ = this.sportBookService.data$
    .pipe(
      tap((sportBookResult: SportBookResult) => {
        this.errorService.isStaleDataAvailable = true;
        JSON.stringify(sportBookResult, JsonStringifyHelper.replacer);
        this.errorService.unSetError();
      }),
      catchError(err => {
        this.errorService.logError(err);
        return EMPTY;
      })
    );

  dartContent$ = this.dartContentService.data$
    .pipe(
      tap((dartContent: DartDataContent) => {
        JSON.stringify(dartContent, JsonStringifyHelper.replacer);
      }),
      catchError(err => {
        return EMPTY;
      })
    );



  gantryMarkets$ = this.gantryMarketsService.gantryMarkets$
    .pipe(
      tap((gantryMarkets: Array<Markets>) => {

      }),
      catchError(err => {
        return EMPTY;
      })
    );

  data$ = combineLatest([
    this.dartResult$,
    this.dartContent$,
    this.gantryMarkets$,
  ]).pipe(
    map(([dartResult, dartContent, gantryMarkets]) => {
      JSON.stringify(dartResult, JsonStringifyHelper.replacer);
      SportBookResultHelper.removePipeSymbolsAndUpperCaseAllNames(dartResult);
      return this.prepareResult(dartResult, dartContent, gantryMarkets);
    }),
    catchError(err => {
      return EMPTY;
    })
  );

  setEvenKeyAndMarketKeys(eventKey: string, marketKeys: string) {
    let queryParamEventMarkets =
      new QueryParamEventMarkets(new QueryParamEvent(eventKey), new QueryParamMarkets(marketKeys));
    this.sportBookService.setEventMarketsList([queryParamEventMarkets]);
    this.sportBookService.setRemoveSuspendedSelections(false);
  }

  prepareResult(sportBookResult: SportBookResult, dartDataContent: DartDataContent, gantryMarkets: Array<Markets>) {
    let dartTemplateResult = new DartTemplateContent();
    dartTemplateResult.dartDataContent = dartDataContent;
    dartTemplateResult = this.setDartTemplateInfo(dartTemplateResult, dartDataContent);
    let selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } } = {};

    for (let [, event] of sportBookResult.events) {

      dartTemplateResult.eventName = StringHelper.removeAllPipeSymbols(event.eventName).replace(" VS ", "  v  ");
      dartTemplateResult.optionalInfo = event.typeName;
      dartTemplateResult.eventDateTime = event.eventDateTime;
      for (let [, market] of event.markets) {
        let marketName = StringHelper.removeAllPipeSymbols(market.marketName);
        if (market.isHandicapMarket.toString() == 'true') {
          if (marketName?.trim().toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Darts, DartMarkets.MOST180S, marketName, gantryMarkets)) {
            this.totalHandCapvalue = market.handicapValue;
          }
          else {
            this.handCapvalue = market.handicapValue;
          }

        }
        market.marketName = marketName;
        for (let [, selection] of market.selections) {
          let selectionName = StringHelper.removeAllPipeSymbols(selection.selectionName);
          if (!selections[marketName]) {
            selections[marketName] = {};
          }

          selections[marketName][selectionName] = selection;
        }
      }

      if (Object.keys(selections).length === 0) {
        return dartTemplateResult;
      }

      this.setDartPageEntries(dartTemplateResult, selections, this.handCapvalue, this.totalHandCapvalue, dartDataContent, gantryMarkets);
    }
    return dartTemplateResult;

  }

  private setDartPageEntries(dartTemplateResult: DartTemplateContent,
    selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } }, handCapvalue: number, totalHandCapvalue: number, dartDataContent: DartDataContent, gantryMarkets: Array<Markets>) {
    for (let marketName in selections) {
      if (!!marketName) {
        if (marketName.trim().toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Darts, DartMarkets.MATCHBETTING, marketName, gantryMarkets)) {
          dartTemplateResult.mainEventInfoPanel = this.matchBettingService.setMatchDetails(marketName, dartTemplateResult, selections, true);
          if (dartTemplateResult.mainEventInfoPanel.drawDetails) {
            dartTemplateResult.mainEventInfoPanel.marketName = dartDataContent.contentParameters.Draw;
            dartTemplateResult.mainEventInfoPanel.marketVersesName = "";
          }
          else {
            dartTemplateResult.mainEventInfoPanel.marketName = dartDataContent.contentParameters.MatchBetting;
            dartTemplateResult.mainEventInfoPanel.marketVersesName = dartDataContent.contentParameters.V;
          }

        }
        else if (marketName.trim().toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Darts, DartMarkets.MATCHHANDICAP, marketName, gantryMarkets)) {
          dartTemplateResult.handicapValue = handCapvalue;
          dartTemplateResult.handicapBettingInfoPanel = this.matchBettingService.setMatchDetails(marketName, dartTemplateResult, selections, true);
          dartTemplateResult.handicapBettingInfoPanel.marketName = dartDataContent.contentParameters.Handicap;
          dartTemplateResult.handicapBettingInfoPanel.isHandicapValue = true;
        }
        else if (marketName.trim().toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Darts, DartMarkets.CORRECTSCORE, marketName, gantryMarkets)) {
          dartTemplateResult = this.matchCorrectScoreService.setCorrectScore(marketName, dartTemplateResult, selections);
          dartTemplateResult.correctScoreBettingInfoPanel.marketName = dartDataContent.contentParameters.SelectedCorrectScores;
        }
        else if (marketName.trim().toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Darts, DartMarkets.MOST180S, marketName, gantryMarkets)) {
          dartTemplateResult.handicapValue = totalHandCapvalue;
          dartTemplateResult.most180SBettingInfoPanel = this.matchBettingService.setMatchDetails(marketName, dartTemplateResult, selections, false);
          dartTemplateResult.most180SBettingInfoPanel.marketName = dartDataContent.contentParameters.Total180S;
          dartTemplateResult.most180SBettingInfoPanel.isHandicapValue = true;
        }
      }
    }
  }


  private setDartTemplateInfo(dartTemplateResult: DartTemplateContent, dartdataContent: DartDataContent): DartTemplateContent {
    dartTemplateResult.leadTitle = !dartdataContent.contentParameters[DartEnumContent.LeadTitle] ? "" : dartdataContent.contentParameters[DartEnumContent.LeadTitle];;
    dartTemplateResult.additionalInfo = !dartdataContent.contentParameters[DartEnumContent.AdditionalInfo] ? "" : dartdataContent.contentParameters[DartEnumContent.AdditionalInfo];
    dartTemplateResult.onRequest = !dartdataContent.contentParameters[DartEnumContent.OnRequest] ? "" : dartdataContent.contentParameters[DartEnumContent.OnRequest];
    dartTemplateResult.moreMarkets = !dartdataContent.contentParameters[DartEnumContent.MoreMarkets] ? "" : dartdataContent.contentParameters[DartEnumContent.MoreMarkets];
    return dartTemplateResult;
  }

}
