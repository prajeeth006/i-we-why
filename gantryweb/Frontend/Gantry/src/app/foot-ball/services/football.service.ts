import { Injectable } from '@angular/core';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from "src/app/common/models/query-param.model";
import { SportBookService } from "src/app/common/services/data-feed/sport-book.service";
import { EMPTY, combineLatest, tap, catchError, map } from "rxjs";
import { SportBookMarketStructured, SportBookResult } from "src/app/common/models/data-feed/sport-bet-models";
import { JsonStringifyHelper } from "src/app/common/helpers/json-stringify.helper";
import { FootballContentService } from "./football-content.service";
import { FootBallDataContent, BetDetails } from '../models/football.model';
import { SportBookResultHelper } from "src/app/common/helpers/sport-book-result.helper";
import { FootballContent } from '../models/football.model';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { FootballMarket } from '../models/football.constant';
import { FootballMarketService } from './markets/football/football-market.service';
import { NflMarketService } from './markets/nfl/nfl-market.service';
import { FootballSportBookMarketHelper } from './helpers/FootballSportBookMarketHelper';
import { SportBookMarketHelper } from '../../common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from '../../common/helpers/sport-book-selection-helper';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { GantryCommonContent } from 'src/app/common/models/gantry-commom-content.model';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { Markets, Sports } from 'src/app/common/models/gantrymarkets.model';
import { ErrorService } from 'src/app/common/services/error.service';
import { GantryCommonContentService } from 'src/app/common/services/gantry-common-content.service';

@Injectable({
    providedIn: 'root'
})
export class FootballService {

    errorMessage$ = this.errorService.errorMessage$;

    footballResult$ = this.sportBookService.data$
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

    footballContent$ = this.footballContentService.data$
        .pipe(
            tap((footballRacingContent: FootBallDataContent) => {
                JSON.stringify(footballRacingContent, JsonStringifyHelper.replacer);
            }),
            catchError(err => {
                return EMPTY;
            })
        );

    gantryCommonContent$ = this.gantryCommonContentService.data$
        .pipe(
            tap((gantryCommonContent: GantryCommonContent) => {
                JSON.stringify(gantryCommonContent, JsonStringifyHelper.replacer);
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
        this.footballResult$,
        this.footballContent$,
        this.gantryCommonContent$,
        this.gantryMarkets$
    ]).pipe(
        map(([footballResult, footballContent, gantryCommonContent, gantryMarkets]) => {
            JSON.stringify(footballResult, JsonStringifyHelper.replacer);
            SportBookResultHelper.removePipeSymbolsAndUpperCaseAllNames(footballResult);
            return this.prepareResult(this.routeDataService.getDifferentialPath(), footballResult, footballContent, gantryCommonContent, gantryMarkets);
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

    private prepareResult(sportType: string, sportBookResult: SportBookResult, content: FootBallDataContent, gantryCommonContent: GantryCommonContent, markets: Array<Markets>) {

        //Prepare EventData
        let footballContent = new FootballContent();
        footballContent.gantryCommonContent = gantryCommonContent;
        footballContent.content = content;

        for (let [, event] of sportBookResult.events) {

            footballContent.marketResult.eventName = event.eventName;
            footballContent.marketResult.eventDateTime = event.eventDateTime;
            footballContent.marketResult.leadTitle = !!event.categoryName ? event.categoryName : content.contentParameters.LeadTitle;// "FOOTBALL";
            footballContent.marketResult.subTitleLeft = content.contentParameters.SubTitleLeft;//"K/O TONIGHT XPM - LIVE ON 12345";

            footballContent.marketResult.subTitleRight = event.typeName;//"COMPETITION";

            footballContent.marketResult.homeTitle = content.contentParameters.Home;//"HOME"
            footballContent.marketResult.awayTitle = content.contentParameters.Away;//"AWAY";
            footballContent.marketResult.drawTitle = content.contentParameters.Draw;//"DRAW";

            footballContent.marketResult.leftStipulatedLine = content.contentParameters.OnRequest;//"OTHERS ON REQUEST";
            footballContent.marketResult.rightStipulatedLine = content.contentParameters.MoreMarkets;//"MORE MARKETS AVAILABLE ON BETSTATION";
            // Preparing Match Result market because rest of the markets are dependent on it
            for (let [, market] of event.markets) {
                market.marketName = StringHelper.removeAllPipeSymbols(market.marketName);
                if (market.marketName == this.gantryMarketsService.hasMarket(Sports.FootBall, FootballMarket.MATCHRESULT, market.marketName, markets)
                    || market.marketName == this.gantryMarketsService.hasMarket(Sports.Nfl, FootballMarket.MONEYLINE, market.marketName, markets)
                    || market.marketName == this.gantryMarketsService.hasMarket(Sports.Rugby, FootballMarket.MATCHBETTING, market.marketName, markets)
                ) {
                    this.prepareMarketResult(sportType, market, footballContent, content, markets);
                }
            }

            //Preparing remaining markets other than Match Result
            for (let [, market] of event.markets) {
                market.marketName = StringHelper.removeAllPipeSymbols(market.marketName);
                if (!(market.marketName == this.gantryMarketsService.hasMarket(Sports.FootBall, FootballMarket.MATCHRESULT, market.marketName, markets)
                    || market.marketName == this.gantryMarketsService.hasMarket(Sports.Nfl, FootballMarket.MONEYLINE, market.marketName, markets)
                    || market.marketName == this.gantryMarketsService.hasMarket(Sports.Rugby, FootballMarket.MATCHBETTING, market.marketName, markets)
                )) {
                    this.prepareMarketResult(sportType, market, footballContent, content, markets);
                }
            }
        }
        return footballContent;
    }

    private prepareMarketResult(sportType: string, market: SportBookMarketStructured, footballContent: FootballContent, content: FootBallDataContent, markets: Array<Markets>) {
        footballContent.marketContents.push(market);
        this.prepareMarket(sportType, market, markets, footballContent, content);
    }

    private prepareMarket(sportType: string, sportBookMarket: SportBookMarketStructured, markets: Array<Markets>, footballContent: FootballContent, content: FootBallDataContent) {
        //market.marketSubTitle = "WIN ONLY";
        sportBookMarket.selections.forEach(selection => {
            let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
            let teamDetail = new BetDetails(selection.selectionName, odds, selection?.hidePrice, selection?.hideEntry);

            if (sportType == Sports.FootBall.toUpperCase()) {
                switch (sportBookMarket.marketName) {
                    case this.gantryMarketsService.hasMarket(Sports.FootBall, FootballMarket.MATCHRESULT, sportBookMarket.marketName, markets): //FootballMarket.MATCHRESULT:
                        teamDetail.betName = teamDetail.betName;
                        this.footballMarketService.prepareMatchResult(selection, teamDetail, footballContent.marketResult.matchResult, footballContent.marketResult);
                        footballContent.marketResult.matchResult.marketTitle = sportBookMarket.marketName;
                        footballContent.marketResult.matchResult.marketLeftTitle = content.contentParameters.Home;
                        footballContent.marketResult.matchResult.marketRightTitle = content.contentParameters.Away;
                        if (footballContent.marketResult.matchResult.drawBetList)
                            footballContent.marketResult.matchResult.marketDisplayTitle = content?.contentParameters?.Draw;
                        else
                            footballContent.marketResult.matchResult.marketDisplayTitle = content.contentParameters.MatchResult;
                        break;
                    case this.gantryMarketsService.hasMarket(Sports.FootBall, FootballMarket.FIRSTGOALSCORER, sportBookMarket.marketName, markets): //FootballMarket.FIRSTGOALSCORER:
                        this.footballMarketService.prepareFirstGoalScorer(selection, teamDetail, footballContent.marketResult.firstGoalScorer);
                        footballContent.marketResult.firstGoalScorer.marketDisplayTitle = content.contentParameters.FirstGoalScorer;
                        break;
                    case this.gantryMarketsService.hasMarket(Sports.FootBall, FootballMarket.CORRECTSCORE, sportBookMarket.marketName, markets): //FootballMarket.CORRECTSCORE:
                        this.footballMarketService.prepareCorrectScore(selection, teamDetail, footballContent.marketResult.correctScore, footballContent.marketResult);
                        footballContent.marketResult.correctScore.marketDisplayTitle = content.contentParameters.CorrectScore;
                        break;
                    case this.gantryMarketsService.hasMarket(Sports.FootBall, FootballMarket.BOTHTEAMSTOSCORE, sportBookMarket.marketName, markets):
                        this.footballMarketService.prepareBothTeamsToScore(selection, teamDetail, footballContent.marketResult.bothTeamsToScore);
                        footballContent.marketResult.bothTeamsToScore.marketDisplayTitle = content.contentParameters.BothTeamsToScore;
                        break;
                    case this.gantryMarketsService.hasMarket(Sports.FootBall, FootballMarket.TOTALGOALSINTHEMATCH, sportBookMarket.marketName, markets):
                        this.footballMarketService.prepareTotalGloasInTheMatch(sportBookMarket.marketName, sportBookMarket.handicapValue, selection, teamDetail, footballContent.marketResult.totalGoalsInTheMatch);
                        footballContent.marketResult.totalGoalsInTheMatch.marketLeftTitle = content.contentParameters.Over;
                        footballContent.marketResult.totalGoalsInTheMatch.marketDisplayTitle = content.contentParameters.TotalGoalsInTheMatch;
                        footballContent.marketResult.totalGoalsInTheMatch.marketRightTitle = content.contentParameters.Under;
                        break;
                    case this.gantryMarketsService.hasMarket(Sports.FootBall, FootballMarket.MATCHRESULTBOTHTEAMSTOSCORE, sportBookMarket.marketName, markets):
                        this.footballMarketService.prepareMatchResultBothTeamsToScore(selection, teamDetail, footballContent.marketResult.matchResultBothTeamsToScore, footballContent.marketResult);
                        footballContent.marketResult.matchResultBothTeamsToScore.marketDisplayTitle = content.contentParameters.MatchResultBothTeamsToScore;
                        break;
                }
            } else if (sportType == Sports.Nfl.toUpperCase()) {
                switch (sportBookMarket.marketName) {
                    case this.gantryMarketsService.hasMarket(Sports.Nfl, FootballMarket.MONEYLINE, sportBookMarket.marketName, markets): //FootballMarket.MONEYLINE:
                        this.nflMarketService.prepareMoneyLine(selection, teamDetail, footballContent.marketResult.moneyLine, footballContent.marketResult);
                        footballContent.marketResult.moneyLine.marketDisplayTitle = content.contentParameters.MoneyLine;
                        footballContent.marketResult.moneyLine.marketSubTitle = content.contentParameters.WinOnly;
                        break;
                    case FootballSportBookMarketHelper.isHandicapMarket(this.gantryMarketsService.hasMarket(Sports.Nfl, FootballMarket.HANDICAPBETTING, sportBookMarket.marketName, markets), sportBookMarket):
                        teamDetail.betName = StringHelper.checkSelectionNameLengthAndTrimEnd(teamDetail.betName, SelectionNameLength.Seventeen);
                        this.nflMarketService.prepareHandicapBetting(selection, teamDetail, footballContent.marketResult.handicapBetting, sportBookMarket);
                        footballContent.marketResult.handicapBetting.marketDisplayTitle = content.contentParameters.HandicapBetting;
                        footballContent.marketResult.handicapBetting.marketSubTitle = content.contentParameters.WinOnly;
                        footballContent.marketResult.handicapBetting.isHandicapValue = true;
                        break;
                    case this.gantryMarketsService.hasMarket(Sports.Nfl, FootballMarket.WINNINGMARGIN, sportBookMarket.marketName, markets): //FootballMarket.WINNINGMARGIN:
                        this.nflMarketService.prepareWinningMargin(selection, teamDetail, footballContent.marketResult.winningMargin, footballContent.marketResult);
                        footballContent.marketResult.winningMargin.marketDisplayTitle = content.contentParameters.WinningMargin;
                        footballContent.marketResult.winningMargin.marketSubTitle = content.contentParameters.WinOnly;
                        break;
                    case this.gantryMarketsService.hasMarket(Sports.Nfl, FootballMarket.FIRSTTOUCHDOWNSCORER, sportBookMarket.marketName, markets): //FootballMarket.FIRSTTOUCHDOWNSCORER:
                        this.nflMarketService.prepareFirstTouchdownScorer(selection, teamDetail, footballContent.marketResult.firstTouchdownScorer);
                        footballContent.marketResult.firstTouchdownScorer.marketDisplayTitle = content.contentParameters.FirstTDScorer;
                        footballContent.marketResult.firstTouchdownScorer.marketSubTitle = content.contentParameters.WinOnly;
                        break;
                }
            } else if (sportType == Sports.Rugby.toUpperCase()) {
                switch (sportBookMarket.marketName) {
                    case this.gantryMarketsService.hasMarket(Sports.Rugby, FootballMarket.MATCHBETTING, sportBookMarket.marketName, markets):
                        teamDetail.betName = teamDetail.betName;
                        this.footballMarketService.prepareMatchResult(selection, teamDetail, footballContent.marketResult.matchResult, footballContent.marketResult);
                        footballContent.marketResult.matchResult.marketSubTitle = content.contentParameters.WinOnly;
                        footballContent.marketResult.matchResult.marketDisplayTitle = content?.contentParameters?.Draw;
                        break;
                    case this.gantryMarketsService.hasMarket(Sports.Rugby, FootballMarket.RUGBYWINNINGMARGIN, sportBookMarket.marketName, markets):
                        this.nflMarketService.prepareWinningMargin(selection, teamDetail, footballContent.marketResult.winningMargin, footballContent.marketResult);
                        footballContent.marketResult.winningMargin.marketDisplayTitle = content.contentParameters.WinningMargin;
                        footballContent.marketResult.winningMargin.marketSubTitle = content.contentParameters.WinOnly;
                        break;
                    case FootballSportBookMarketHelper.isHandicapMarket(this.gantryMarketsService.hasMarket(Sports.Rugby, FootballMarket.RUGBYHANDICAPBETTING, sportBookMarket.marketName, markets), sportBookMarket):
                        footballContent.marketResult.handicapBetting.isHandicapValue = true;
                        if (sportBookMarket.marketName?.toLocaleUpperCase() == content?.contentParameters?.FirstHalfHandicapMarketName) {
                            this.nflMarketService.prepareHandicapBetting(selection, teamDetail, footballContent.marketResult.FirstHalfHandicap, sportBookMarket);
                            footballContent.marketResult.FirstHalfHandicap.marketSubTitle = content.contentParameters.WinOnly;
                            footballContent.marketResult.FirstHalfHandicap.marketDisplayTitle = content?.contentParameters?.FirstHalfHandicap;
                            footballContent.marketResult.FirstHalfHandicap.isHandicapValue = true;
                        }
                        else {
                            this.nflMarketService.prepareHandicapBetting(selection, teamDetail, footballContent.marketResult.handicapBetting, sportBookMarket);
                            footballContent.marketResult.handicapBetting.marketDisplayTitle = content.contentParameters.Handicap;
                            footballContent.marketResult.handicapBetting.marketSubTitle = content.contentParameters.WinOnly;
                        }
                        break;
                    case this.gantryMarketsService.hasMarket(Sports.Rugby, FootballMarket.TOTALMATCHPOINTS, sportBookMarket.marketName, markets):
                        this.nflMarketService.prepareTotalMatchPoints(selection, teamDetail, footballContent.marketResult.TotalPoints, sportBookMarket);
                        footballContent.marketResult.TotalPoints.marketSubTitle = content.contentParameters.WinOnly;
                        footballContent.marketResult.TotalPoints.marketDisplayTitle = content?.contentParameters?.TotalPoints;
                        footballContent.marketResult.TotalPoints.isHandicapValue = true;
                        break;
                    case this.gantryMarketsService.hasMarket(Sports.Rugby, FootballMarket.RUGBYHALFTIMEFULLTIME, sportBookMarket.marketName, markets):
                        this.footballMarketService.prepareHalfTimeFullTime(selection, teamDetail, footballContent.marketResult.halfOrFullTime, footballContent.marketResult);
                        footballContent.marketResult.halfOrFullTime.marketDisplayTitle = content.contentParameters.HalfTImeFullTime;
                        footballContent.marketResult.halfOrFullTime.marketSubTitle = content.contentParameters.WinOnly;
                        break;
                }
            }

        });
    }

    constructor(private sportBookService: SportBookService,
        private footballContentService: FootballContentService,
        private footballMarketService: FootballMarketService,
        private nflMarketService: NflMarketService,
        private gantryCommonContentService: GantryCommonContentService,
        private errorService: ErrorService,
        private routeDataService: RouteDataService,
        private gantryMarketsService: GantryMarketsService,
    ) {
    }
}
