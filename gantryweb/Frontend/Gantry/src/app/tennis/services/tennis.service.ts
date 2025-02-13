import { Injectable } from "@angular/core";
import { EMPTY, combineLatest, tap, catchError, map } from "rxjs";
import { SportBookResultHelper } from "src/app/common/helpers/sport-book-result.helper";
import { StringHelper } from "src/app/common/helpers/string.helper";
import { SportBookResult } from "src/app/common/models/data-feed/sport-bet-models";
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from "src/app/common/models/query-param.model";
import { SportBookService } from "src/app/common/services/data-feed/sport-book.service";
import { ErrorService } from "src/app/common/services/error.service";
import { TennisDataContent } from "../models/tennis-content.model";
import { TennisMarkets } from "../models/tennis.enum";
import { TennisContent } from "../models/tennis.model";
import { MatchBettingService } from "./match-betting-service/match-betting.service";
import { SetBettingService } from "./set-betting-service/set-betting.service";
import { TennisContentService } from "./tennis-content.service";
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { Markets, Sports } from "src/app/common/models/gantrymarkets.model";

@Injectable({
    providedIn: 'root'
})

export class TennisService {
    errorMessage$ = this.errorService.errorMessage$;

    tennisResult$ = this.sportBookService.data$
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

    tennisContent$ = this.tennisContentService.data$
        .pipe(
            tap((horseRacingContent: TennisDataContent) => {}),
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
        this.tennisResult$,
        this.tennisContent$,
        this.gantryMarkets$,
    ]).pipe(
        map(([tennisResult, tennisContent, gantryMarkets]) => {
            SportBookResultHelper.removePipeSymbolsAndUpperCaseAllNames(tennisResult);
            return this.prepareResult(tennisResult, tennisContent, gantryMarkets);
        }),
        catchError(err => {
            return EMPTY;
        })
    );

    private prepareResult(sportBookResult: SportBookResult, content: TennisDataContent, gantryMarkets: Array<Markets>) {
        let tennisContent = new TennisContent();
        tennisContent.content = content;
        tennisContent.leftStipulatedLine = content.contentParameters.LeftStipulatedLine;//"OTHERS ON REQUEST";
        tennisContent.rightStipulatedLine = content.contentParameters.RightStipulatedLine;
        for (let [, event] of sportBookResult.events) {
            tennisContent.eventName = event.eventName;
            tennisContent.typeName = event.typeName;
            tennisContent.eventDateTime = event.eventDateTime;
            tennisContent.title = event.categoryName;

            for (let [, market] of event.markets) {
                market.marketName = StringHelper.removeAllPipeSymbols(market.marketName);
                tennisContent.markets.push(market);
                if (market.marketName.trim().toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Tennis, TennisMarkets.MatchBetting, market.marketName, gantryMarkets)) {
                    tennisContent = this.matchBettingService.getMatchBettingDetails(market, tennisContent);
                    tennisContent.MatchBetting = market.marketName;
                }
                if (market.marketName.trim().toUpperCase() == this.gantryMarketsService.hasMarket(Sports.Tennis, TennisMarkets.SetBetting, market.marketName, gantryMarkets)) {
                    tennisContent = this.setBettingService.setBettingDetails(market, tennisContent);
                    tennisContent.SetBetting = market.marketName;
                }
            }
            break;
        }
        return tennisContent;
    }

    setEvenKeyAndMarketKeys(eventKey: string, marketKeys: string) {
        let queryParamEventMarkets =
            new QueryParamEventMarkets(new QueryParamEvent(eventKey), new QueryParamMarkets(marketKeys));
        this.sportBookService.setEventMarketsList([queryParamEventMarkets]);
        this.sportBookService.setRemoveSuspendedSelections(false);
    }

    constructor(private sportBookService: SportBookService,
        private tennisContentService: TennisContentService,
        private matchBettingService: MatchBettingService,
        private setBettingService: SetBettingService,
        private gantryMarketsService: GantryMarketsService,
        private errorService: ErrorService) {

    }

}