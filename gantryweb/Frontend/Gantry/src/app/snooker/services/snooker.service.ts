import { Injectable } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookResultHelper } from 'src/app/common/helpers/sport-book-result.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SportBookMarketStructured, SportBookResult } from 'src/app/common/models/data-feed/sport-bet-models';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from 'src/app/common/models/query-param.model';
import { SportBookService } from 'src/app/common/services/data-feed/sport-book.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { SnookerMarket } from '../models/snooker.constant';
import { BetDetails, Market, SnookerContent, SnookerDataContent, SnookerMarketResult } from '../models/snooker.model';
import { SnookerSportBookMarketHelper } from './helpers/SnookerSportBookMarketHelper';
import { SnookerMarketService } from './markets/snooker-market.service';
import { SnookerContentService } from './snooker-content.service';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { Markets, Sports } from 'src/app/common/models/gantrymarkets.model';

@Injectable({
  providedIn: 'root'
})
export class SnookerService {

  errorMessage$ = this.errorService.errorMessage$;

  constructor(private sportBookService: SportBookService,
    private snookerContentService: SnookerContentService,
    private snookerMarketService: SnookerMarketService,
    private gantryMarketsService: GantryMarketsService,
    private errorService: ErrorService) { }

  snookerResult$ = this.sportBookService.data$
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

  snookerContent$ = this.snookerContentService.data$
    .pipe(
      tap((snookerRacingContent: SnookerDataContent) => {
        JSON.stringify(snookerRacingContent, JsonStringifyHelper.replacer);
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
    this.snookerResult$,
    this.snookerContent$,
    this.gantryMarkets$
  ]).pipe(
    map(([snookerResult, snookerContent, gantryMarkets]) => {
      JSON.stringify(snookerResult, JsonStringifyHelper.replacer);
      SportBookResultHelper.removePipeSymbolsAndUpperCaseAllNames(snookerResult);
      return this.prepareResult(snookerResult, snookerContent, gantryMarkets);
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

  private prepareResult(sportBookResult: SportBookResult, snookerDataContent: SnookerDataContent, gantryMarkets: Array<Markets>) {

    //Prepare EventData
    let snookerContent = new SnookerContent();
    snookerContent.snookerDataContent = snookerDataContent;

    snookerContent.marketResult.additionalInfo = snookerDataContent.contentParameters.AdditionalInfo;//"ADDITIONAL INFO";
    snookerContent.marketResult.homeTitle = snookerDataContent.contentParameters.Home;//"HOME"
    snookerContent.marketResult.awayTitle = snookerDataContent.contentParameters.Away;//"AWAY";
    snookerContent.marketResult.leftStipulatedLine = snookerDataContent.contentParameters.OnRequest;//"OTHERS ON REQUEST";
    snookerContent.marketResult.rightStipulatedLine = snookerDataContent.contentParameters.MoreMarkets;//"MORE MARKETS AVAILABLE ON BETSTATION";
    for (let [, event] of sportBookResult.events) {
      snookerContent.marketResult.eventName = event.eventName.replace(" VS ", " vs ");
      snookerContent.marketResult.eventDateTime = event.eventDateTime;
      snookerContent.marketResult.optionalInfo = event.typeName;//"OPTIONAL ADDITIONAL INFO";
      snookerContent.marketResult.leadTitle = event.categoryName;

      for (let [, market] of event.markets) {
        market.marketName = StringHelper.removeAllPipeSymbols(market.marketName);
        if (market.marketName == this.gantryMarketsService.hasMarket(Sports.Snooker, SnookerMarket.MATCHBETTING, market.marketName, gantryMarkets)) {
          this.prepareMarketResult(market, snookerContent, snookerDataContent, gantryMarkets);
        }
      }

      for (let [, market] of event.markets) {
        market.marketName = StringHelper.removeAllPipeSymbols(market.marketName);
        if (!(market.marketName == this.gantryMarketsService.hasMarket(Sports.Snooker, SnookerMarket.MATCHBETTING, market.marketName, gantryMarkets))) {
          this.prepareMarketResult(market, snookerContent, snookerDataContent, gantryMarkets);
        }
      }
    }
    return snookerContent;
  }

  private prepareMarketResult(market: SportBookMarketStructured, snookerContent: SnookerContent, snookerDataContent: SnookerDataContent, gantryMarkets: Array<Markets>) {
    snookerContent.marketContents.push(market);

    //Prepare Markets
    let preparedMarket = this.prepareMarket(market, snookerContent.marketResult, gantryMarkets);
    preparedMarket.marketSubTitle = snookerDataContent.contentParameters.WinOnly;
    switch (preparedMarket.marketTitle) {
      case this.gantryMarketsService.hasMarket(Sports.Snooker, SnookerMarket.MATCHBETTING, preparedMarket.marketTitle, gantryMarkets):
        preparedMarket.marketDisplayTitle = snookerDataContent.contentParameters.MatchBetting;
        preparedMarket.marketVersesName = snookerDataContent.contentParameters.V;
        snookerContent.marketResult.matchResult = preparedMarket;
        break;
      case this.gantryMarketsService.hasMarket(Sports.Snooker, SnookerMarket.CORRECTSCORE, preparedMarket.marketTitle, gantryMarkets):
        preparedMarket.marketDisplayTitle = snookerDataContent.contentParameters.SelectedCorrectScores;
        snookerContent.marketResult.correctScore = preparedMarket;
        break;
      case SnookerSportBookMarketHelper.isHandicapMarket(this.gantryMarketsService.hasMarket(Sports.Snooker, SnookerMarket.HANDICAPBETTING, preparedMarket.marketTitle, gantryMarkets), market):
        preparedMarket.marketDisplayTitle = snookerDataContent.contentParameters.Handicap;
        snookerContent.marketResult.handicapBetting = preparedMarket;
        snookerContent.marketResult.handicapBetting.isHandicapValue = true;
        break;
      case this.gantryMarketsService.hasMarket(Sports.Snooker, SnookerMarket.TOTALFRAMES, preparedMarket.marketTitle, gantryMarkets):
        preparedMarket.marketDisplayTitle = snookerDataContent.contentParameters.TotalFrames;
        snookerContent.marketResult.totalframes = preparedMarket;
        snookerContent.marketResult.totalframes.isHandicapValue = true;
        break;
      case this.gantryMarketsService.hasMarket(Sports.Snooker, SnookerMarket.TOWINTHEFIRSTFRAME, preparedMarket.marketTitle, gantryMarkets):
        preparedMarket.marketDisplayTitle = snookerDataContent.contentParameters.ToWinTheFirstFrame;
        snookerContent.marketResult.towinfirstframe = preparedMarket;
        break;
    }

  }

  private prepareMarket(sportBookMarket: SportBookMarketStructured, marketResult: SnookerMarketResult, gantryMarkets: Array<Markets>) {
    let market = new Market();
    market.marketTitle = sportBookMarket.marketName;
    sportBookMarket.selections.forEach(selection => {
      let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
      let teamDetail = market.marketTitle == SnookerMarket.CORRECTSCORE ? new BetDetails(selection.selectionName, odds, selection?.hidePrice, selection.hideEntry) : new BetDetails(selection.selectionName, odds, selection.hidePrice, selection.hideEntry);
      switch (market.marketTitle) {
        case this.gantryMarketsService.hasMarket(Sports.Snooker, SnookerMarket.MATCHBETTING, market.marketTitle, gantryMarkets):
          market = this.snookerMarketService.prepareMatchResult(selection, teamDetail, market, marketResult);
          break;
        case this.gantryMarketsService.hasMarket(Sports.Snooker, SnookerMarket.CORRECTSCORE, market.marketTitle, gantryMarkets):
          market = this.snookerMarketService.prepareCorrectScore(selection, teamDetail, market, marketResult);
          break;
        case SnookerSportBookMarketHelper.isHandicapMarket(this.gantryMarketsService.hasMarket(Sports.Snooker, SnookerMarket.HANDICAPBETTING, market.marketTitle, gantryMarkets), sportBookMarket):
          market = this.snookerMarketService.prepareHandicapBetting(selection, teamDetail, market, sportBookMarket);
          break;
        case this.gantryMarketsService.hasMarket(Sports.Snooker, SnookerMarket.TOTALFRAMES, market.marketTitle, gantryMarkets):
          market = this.snookerMarketService.prepareTotalFramesBetting(selection, teamDetail, market, sportBookMarket);
          break;
        case this.gantryMarketsService.hasMarket(Sports.Snooker, SnookerMarket.TOWINTHEFIRSTFRAME, market.marketTitle, gantryMarkets):
          market = this.snookerMarketService.prepareFirstFrameBetting(selection, teamDetail, market, marketResult);
          break;
      }
    });
    return market;
  }

}
