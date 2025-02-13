import { Injectable } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { SportBookMarketStructured, SportBookResult, SportBookSelection } from '../../common/models/data-feed/sport-bet-models';
import { QueryParamEventMarkets, QueryParamEvent, QueryParamMarkets } from '../../common/models/query-param.model';
import { SportBookService } from '../../common/services/data-feed/sport-book.service';
import { SportBookResultHelper } from 'src/app/common/helpers/sport-book-result.helper';
import { CricketTemplateResult } from '../models/cricket-template.model';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { CricketContent, CricketMarkets } from '../models/cricket-template.enum';
import { MatchBettingService } from './match-betting-service/match-betting.service';
import { TossService } from './toss-service/toss-service';
import { RunscorerService } from './runscorer-service/runscorer-service';
import { CricketContentService } from './cricket-content.service';
import { CricketDataContent } from '../models/cricket-content.model';
import { ErrorService } from 'src/app/common/services/error.service';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { Markets, Sports } from 'src/app/common/models/gantrymarkets.model';
import { CricketCountriesContent } from '../models/cricket-countries.model';
import { TotalSixesService } from './total-sixes/total-sixes.service';
import { Toscore100In1stInnsService } from './ToScore100In1stInns/toscore-100-in1st-inns.service';

@Injectable({
    providedIn: 'root'
})
export class CricketTemplateService {

    errorMessage$ = this.errorService.errorMessage$;

    sportBookEvents$ = this.sportBookService.data$
        .pipe(
            tap((sportBookResult: SportBookResult) => {
                this.errorService.isStaleDataAvailable = true;
                this.errorService.unSetError();
            }),
            catchError(err => {
                this.errorService.logError(err);
                return EMPTY;
            })
        );

    cricketContent$ = this.cricketContentService.data$
        .pipe(
            tap((cricketContent: CricketDataContent) => { }),
            catchError(err => {
                return EMPTY;
            })
        );

    cricketCountries$ = this.cricketContentService.countriesData$
        .pipe(
            tap((cricketContent: Array<CricketCountriesContent>) => { }),
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
        this.sportBookEvents$,
        this.cricketContent$,
        this.gantryMarkets$,
        this.cricketCountries$
    ]).pipe(
        map(([sportBookResult, cricketContent, gantryMarkets, cricketCountries]) => {
            SportBookResultHelper.removePipeSymbolsAndUpperCaseAllNames(sportBookResult);
            const cricketTemplateResult: CricketTemplateResult =
                this.createCricketTemplateResult(sportBookResult, cricketContent, gantryMarkets, cricketCountries);
            return cricketTemplateResult;
        }),
        catchError(err => {
            return EMPTY;
        })
    );

    constructor(private sportBookService: SportBookService,
        private matchEventService: MatchBettingService,
        private tossService: TossService,
        private runscorerService: RunscorerService,
        private totalSixesService: TotalSixesService,
        private toscore100In1stInnsService: Toscore100In1stInnsService,
        private cricketContentService: CricketContentService,
        private errorService: ErrorService,
        private gantryMarketsService: GantryMarketsService,
    ) { }

    setEventKeyAndMarketKeys(eventKey: string, marketKeys: string) {
        let queryParamEventMarkets =
            new QueryParamEventMarkets(new QueryParamEvent(eventKey), new QueryParamMarkets(marketKeys));

        this.sportBookService.setEventMarketsList([queryParamEventMarkets]);
        this.sportBookService.setRemoveSuspendedSelections(false);
    }

    createCricketTemplateResult(sportBookResult: SportBookResult, cricketContent: CricketDataContent, gantryMarkets: Array<Markets>, cricketCountries: Array<CricketCountriesContent>): CricketTemplateResult {
        let cricketTemplateResult = new CricketTemplateResult();
        cricketTemplateResult.cricketContent = cricketContent;
        cricketTemplateResult.cricketCountries = cricketCountries;

        cricketTemplateResult = this.setCricketTemplateInfo(cricketTemplateResult, cricketContent);
        let selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } } = {};

        for (let [, event] of sportBookResult.events) {
            cricketTemplateResult.eventName = event.eventName;
            cricketTemplateResult.optionalInfo = event.typeName;
            cricketTemplateResult.eventDateTime = event.eventDateTime;
            cricketTemplateResult.leadTitle = event.categoryName;
            for (let [, market] of event.markets) {
                market.marketName = StringHelper.removeAllPipeSymbols(market.marketName);
                for (let [, selection] of market.selections) {
                    let selectionName = StringHelper.removeAllPipeSymbols(selection.selectionName);
                    if (!selections[market.marketName]) {
                        selections[market.marketName] = {};
                    }
                    if (market.marketName == this.gantryMarketsService.hasMarket(Sports.Cricket, CricketMarkets.MatchBetting, market.marketName, gantryMarkets)) {
                        selections[market.marketName][selectionName] = selection;
                        cricketTemplateResult = this.setCricketPageEntries(cricketTemplateResult, market, selections, gantryMarkets);
                    }
                }
            }

            for (let [, market] of event.markets) {
                market.marketName = StringHelper.removeAllPipeSymbols(market.marketName);
                for (let [, selection] of market.selections) {
                    let selectionName = StringHelper.removeAllPipeSymbols(selection.selectionName);
                    if (!selections[market.marketName]) {
                        selections[market.marketName] = {};
                    }
                    if (!(market.marketName == this.gantryMarketsService.hasMarket(Sports.Cricket, CricketMarkets.MatchBetting, market.marketName, gantryMarkets))) {
                        selections[market.marketName][selectionName] = selection;
                        cricketTemplateResult = this.setCricketPageEntries(cricketTemplateResult, market, selections, gantryMarkets);
                    }
                }
            }
        }
        if (Object.keys(selections).length === 0) {
            return cricketTemplateResult;
        }
        return cricketTemplateResult;
    }


    private setCricketPageEntries(cricketTemplateResult: CricketTemplateResult, market: SportBookMarketStructured,
        selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } }, gantryMarkets: Array<Markets>): CricketTemplateResult {
        cricketTemplateResult.toScore100in1stInns = [];
        for (let marketName in selections) {
            if (!!marketName) {
                if (marketName.trim().toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Cricket, CricketMarkets.MatchBetting, marketName, gantryMarkets)) {
                    cricketTemplateResult = this.matchEventService.setMatchDetails(marketName, cricketTemplateResult, selections);
                    cricketTemplateResult.mainEventInfoPanel.marketVersesName = cricketTemplateResult.isTestMatch ? "" : cricketTemplateResult.cricketContent.contentParameters.Vs;
                    cricketTemplateResult.mainEventInfoPanel.marketName = cricketTemplateResult.cricketContent.contentParameters.MatchBetting;
                }
                else if (marketName.trim().toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Cricket, CricketMarkets.ToWinTheToss, marketName, gantryMarkets)) {
                    cricketTemplateResult = this.tossService.setTossDetails(marketName, cricketTemplateResult, selections);
                }
                else if (marketName.trim().toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Cricket, CricketMarkets.TopRunscorer, marketName, gantryMarkets)) {
                    cricketTemplateResult.topRunScorer = this.runscorerService.setTopRunScorers(marketName, cricketTemplateResult, cricketTemplateResult.topRunScorer, selections);
                }
                else if (marketName.trim().toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Cricket, CricketMarkets.Top1stInningsRunscorer, marketName, gantryMarkets)) {
                    cricketTemplateResult.top1stInningRunScorer = this.runscorerService.setTopRunScorers(marketName, cricketTemplateResult, cricketTemplateResult.top1stInningRunScorer, selections);
                }
                else if (marketName.trim().toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Cricket, CricketMarkets.TotalSixes, marketName, gantryMarkets)) {
                    this.totalSixesService.setTotalSixes(marketName, market, cricketTemplateResult, selections);
                }
                else if (marketName.trim().toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Cricket, CricketMarkets.ToScore100In1stInns, marketName, gantryMarkets)) {
                    cricketTemplateResult.toScore100in1stInns = this.toscore100In1stInnsService.setScore100In1stInning(marketName, cricketTemplateResult, cricketTemplateResult.toScore100in1stInns, selections);
                }
            }
        }
        return cricketTemplateResult;
    }

    private setCricketTemplateInfo(cricketTemplateResult: CricketTemplateResult, cricketContent: CricketDataContent): CricketTemplateResult {
        cricketTemplateResult.additionalInfo = !cricketContent.contentParameters[CricketContent.AdditionalInfo] ? "" : cricketContent.contentParameters[CricketContent.AdditionalInfo];
        cricketTemplateResult.onRequest = !cricketContent.contentParameters[CricketContent.OnRequest] ? "" : cricketContent.contentParameters[CricketContent.OnRequest];
        cricketTemplateResult.moreMarkets = !cricketContent.contentParameters[CricketContent.MoreMarkets] ? "" : cricketContent.contentParameters[CricketContent.MoreMarkets];
        return cricketTemplateResult;
    }

}
