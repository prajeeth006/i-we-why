import { Injectable } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookResultHelper } from 'src/app/common/helpers/sport-book-result.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SportBookMarketStructured, SportBookResult, SportBookSelection } from 'src/app/common/models/data-feed/sport-bet-models';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from 'src/app/common/models/query-param.model';
import { SportBookService } from 'src/app/common/services/data-feed/sport-book.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { FormulaOneMarkets } from '../model/formula1-constant.model';
import { Formula1DataContent } from '../model/formula1-content.model';
import { BetDetails, EachWayText, Formula1TemplateContent, MarketSelection, RacerBetName, Racers } from '../model/formula1-template.model';
import { FormulaContentService } from './formula-content.service';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { Markets, Sports } from 'src/app/common/models/gantrymarkets.model';

@Injectable({
  providedIn: 'root'
})
export class FormulaTemplateService {

  constructor(private sportBookService: SportBookService,
    private formula1ContentService: FormulaContentService,
    private gantryMarketsService: GantryMarketsService,
    private errorService: ErrorService) { }

  errorMessage$ = this.errorService.errorMessage$;
  racerList: Array<Racers> = [];

  formulaResult$ = this.sportBookService.data$
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

  formulaContent$ = this.formula1ContentService.data$
    .pipe(
      tap((formulaContent: Formula1DataContent) => {
        JSON.stringify(formulaContent, JsonStringifyHelper.replacer);
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
    this.formulaResult$,
    this.formulaContent$,
    this.gantryMarkets$,
  ]).pipe(
    map(([formulaResult, formulaContent, gantryMarkets]) => {
      JSON.stringify(formulaResult, JsonStringifyHelper.replacer);
      SportBookResultHelper.removePipeSymbolsAndUpperCaseAllNames(formulaResult);
      return this.prepareResult(formulaResult, formulaContent, gantryMarkets);
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

  prepareResult(sportBookResult: SportBookResult, formulaContent: Formula1DataContent, gantryMarkets: Array<Markets>): Formula1TemplateContent {
    let formulaTemplateResult = new Formula1TemplateContent();
    formulaTemplateResult.formula1DataContent = formulaContent;
    formulaTemplateResult.racerBetNameList = [];
    formulaTemplateResult.winOrEachWayTextList = [];

    for (let [, event] of sportBookResult.events) {
      formulaTemplateResult.eventName = StringHelper.removeAllPipeSymbols(event.eventName);
      formulaTemplateResult.eventType = event.typeName;
      formulaTemplateResult.eventDateTime = event.eventDateTime;
      formulaTemplateResult.leadTitle = event.categoryName;

      for (let [, market] of event.markets) {
        let marketName = StringHelper.removeAllPipeSymbols(market.marketName);
        market.marketName = marketName;
        this.getRaceBetNames(market, formulaTemplateResult, formulaContent);
        for (let [, selection] of market.selections) {
          this.prepareFormula1Results(formulaTemplateResult, selection, marketName, gantryMarkets);
        }
      }
    }

    if (formulaTemplateResult.raceWinner.length > 0 && formulaTemplateResult.raceWinner.length) {
      formulaTemplateResult.racerList = [];

      for (let item of formulaTemplateResult.raceWinner) {
        let racer = new Racers();
        racer.driverName = item.selectionName;
        racer.hideEntry = item.hideEntry;
        item.betdetails.order = 4;
        racer.selectionDetails.push(item.betdetails);
        let fastestLapSelection = formulaTemplateResult.fastestLap.find(ele => ele.selectionName.toUpperCase() == item.selectionName.toUpperCase());
        if (fastestLapSelection && fastestLapSelection.betdetails) {
          fastestLapSelection.betdetails.order = 1;
          racer.selectionDetails.push(fastestLapSelection.betdetails);
        }

        let pointsFinishSelection = formulaTemplateResult.pointsFinish.find(ele => ele.selectionName.toUpperCase() == item.selectionName.toUpperCase());
        if (pointsFinishSelection && pointsFinishSelection.betdetails) {
          pointsFinishSelection.betdetails.order = 2;
          racer.selectionDetails.push(pointsFinishSelection.betdetails);
        }

        let podiumFinishSelection = formulaTemplateResult.podiumFinish.find(ele => ele.selectionName.toUpperCase() == item.selectionName.toUpperCase());
        if (podiumFinishSelection && podiumFinishSelection.betdetails) {
          podiumFinishSelection.betdetails.order = 3;
          racer.selectionDetails.push(podiumFinishSelection.betdetails);

        }

        formulaTemplateResult.racerList.push(racer);

      }
    }
    formulaTemplateResult?.racerList?.map(
      obj => {
        obj.selectionDetails?.sort((a, b) => (a.order < b.order ? -1 : 1));
      }
    );
    this.arrangeMissingSelections(formulaTemplateResult);
    return formulaTemplateResult;
  }

  private prepareFormula1Results(formula1TemplateContent: Formula1TemplateContent, selection: SportBookSelection, marketName: string, gantryMarkets: Array<Markets>) {
    let selectionName = StringHelper.removeAllPipeSymbols(selection.selectionName);
    selection.selectionName = selectionName;
    if (!selection.hideEntry) {
      if (marketName?.trim()?.toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Formula1, FormulaOneMarkets.RACEWINNER, marketName, gantryMarkets)) {
        this.prepareRaceWinnerResults(formula1TemplateContent, selection, marketName);
      } else {
        this.prepareOtherMarketResults(formula1TemplateContent, selection, marketName, gantryMarkets);
      }
    }
  }

  private prepareRaceWinnerResults(formula1TemplateContent: Formula1TemplateContent, selection: SportBookSelection, marketName: string) {
    let marketSelection = new MarketSelection();
    marketSelection.selectionName = selection.selectionName;
    marketSelection.hideEntry = selection.hideEntry;
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    marketSelection.betdetails = new BetDetails(marketName, odds, selection?.hidePrice, selection?.hideEntry);
    marketSelection.betdetails.isRaceWinner = true;

    formula1TemplateContent.raceWinner.push(marketSelection);

    if (formula1TemplateContent.raceWinner.length > 1) {
      formula1TemplateContent.raceWinner.sort(
        function (first, second) {
          let firstNumber = FormulaTemplateService.getPriceFromOdds(first?.betdetails?.betOdds);
          let secondNumber = FormulaTemplateService.getPriceFromOdds(second?.betdetails?.betOdds);
          return firstNumber - secondNumber;
        }
      );
      formula1TemplateContent.raceWinner = formula1TemplateContent.raceWinner.slice(0, 6);
    }
  }

  private static getPriceFromOdds(odds: string): number {
    if (!odds) {
      return 0;
    }
    else {
      let price = odds?.trim()?.split('/');
      if (price?.length > 1) {
        let ratio = Number(price[0]) / Number(price[1]);
        return ratio;
      }
      return Number(odds);
    }
  }

  private prepareOtherMarketResults(formula1TemplateContent: Formula1TemplateContent, selection: SportBookSelection, marketName: string, gantryMarkets: Array<Markets>) {
    let marketSelection = new MarketSelection();
    marketSelection.selectionName = selection.selectionName;
    let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
    marketSelection.betdetails = new BetDetails(marketName, odds, selection?.hidePrice, selection?.hideEntry);

    if (marketName.trim().toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Formula1, FormulaOneMarkets.FASTESTLAP, marketName, gantryMarkets)) {
      formula1TemplateContent.fastestLap.push(marketSelection);
    }
    else if (marketName.trim().toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Formula1, FormulaOneMarkets.PODIUMFINISH, marketName, gantryMarkets)) {
      formula1TemplateContent.podiumFinish.push(marketSelection);
    }
    else if (marketName.trim().toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Formula1, FormulaOneMarkets.POINTSFINISH, marketName, gantryMarkets)) {
      formula1TemplateContent.pointsFinish.push(marketSelection);
    }
  }

  private getRaceBetNames(market: SportBookMarketStructured | null, formulaTemplateResult: Formula1TemplateContent, formulaContent: Formula1DataContent) {
    let getBetnamesList = formulaContent?.contentParameters?.BetNamesList?.split('|');
    if (getBetnamesList?.length > 0) {
      for (let name of getBetnamesList) {
        let racerBetName = new RacerBetName();
        racerBetName.betName = name;
        formulaTemplateResult.racerBetNameList.push(racerBetName);
        let eachWayText = new EachWayText();
        eachWayText.winOrEachWayText = racerBetName.betName == formulaContent?.contentParameters?.RaceWinner ? this.getEachWayString(market, formulaContent) : formulaContent?.contentParameters?.WinOnly;
        formulaTemplateResult.winOrEachWayTextList.push(eachWayText);

      }
    }
  }

  private getEachWayString(market: SportBookMarketStructured | null, formulaContent: Formula1DataContent): string {
    let price = "", eachwayText = "";
    //Here checking for eachWayFactorNum value and eachWayFactorDen values not null or undefined
    if (!!market.eachWayFactorNum || !!market.eachWayFactorDen) {
      price = (market?.eachWayFactorNum + '/' + market?.eachWayFactorDen)?.toString();
    }
    //Here checking for isEachWayAvailable is false and eachWayFactorNum value and eachWayFactorDen value is empty  values
    if ((market.isEachWayAvailable?.trim()?.toLocaleLowerCase() == "false") || (!market.eachWayFactorDen?.trim() || !market.eachWayFactorNum?.trim()) || (price == '1/1' || price?.trim() == '')) {
      return formulaContent?.contentParameters?.WinOnly;
    } else {
      if (parseInt(market.eachWayPlaces) > 0) {
        eachwayText = formulaContent?.contentParameters?.EW + " " + price + " ";
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

  private arrangeMissingSelections(formula1TempContent: Formula1TemplateContent) {
    formula1TempContent.racerList.forEach(resList => {
      if (resList?.selectionDetails?.length < 4) {
        let orders: Array<number> = [];
        let missingNumbers: Array<number> = [];
        resList?.selectionDetails?.forEach(x => orders?.push(x.order));
        for (let j = 1; j <= 4; j++) {
          if (orders.indexOf(j) == -1) {
            missingNumbers.push(j)
          }
        }
        missingNumbers.forEach(x => {
          let racerSelections = new BetDetails('', '', false);
          racerSelections.order = x;
          resList?.selectionDetails?.push(racerSelections);
        })
        resList.selectionDetails = resList?.selectionDetails?.sort((a, b) => (a.order < b.order ? -1 : 1));
      }
    });
  }
}
