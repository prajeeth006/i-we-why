import { Injectable } from '@angular/core';
import { BetDetails, CricketCdsTemplateResult, CricketContentParams, TopRunScorer } from '../models/cricket-cds-template.model';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay, tap } from 'rxjs';
import { FixtureView, Game } from 'src/app/common/cds-client/models/fixture-view.model';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { CricketCdsTemplateIds } from '../models/cricket-cds-template.constant';
import { MessageEnvelope } from '@cds/push';
import { CdsPushConstants } from 'src/app/common/cds-client/models/cds-push-updates.constant';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { ErrorService } from 'src/app/common/services/error.service';
import { Log, LogType, LoggerService } from 'src/app/common/services/logger.service';
import { Markets, Sports } from 'src/app/common/models/gantrymarkets.model';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';

@Injectable({
  providedIn: 'root'
})
export class CricketCdsService {
  cricketCdsResult: CricketCdsTemplateResult = new CricketCdsTemplateResult();
  fixtureData$: Observable<FixtureView>;
  cricketContentFromSitecore$: Observable<CricketContentParams>;
  cricketCdsContent$: Observable<CricketCdsTemplateResult>;
  fixtureData: FixtureView;
  topRunScorer: TopRunScorer = new TopRunScorer();
  errorMessage$ = this.errorService.errorMessage$;
  gantryMarkets$: Observable<Array<Markets>>;
  gantryMarkets: Array<Markets>;

  constructor(
    private cdsPushService: CdsClientService,
    private errorService: ErrorService,
    private loggerService: LoggerService,
    private gantryMarketsService: GantryMarketsService,
    private sportContentService: SportContentService
  ) {

  }

  public GetCricketCdsContent(fixtureId: any, marketId: any, gameIds: any) {
    this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, gameIds);
    this.cricketContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.cricketCds);
    this.gantryMarkets$ = this.getGantryMarketDataContent();
    this.cricketCdsContent$ = combineLatest([this.fixtureData$, this.cricketContentFromSitecore$, this.gantryMarkets$]).
      pipe(
        map(([fixtureData, contentFromSitecore, gantryMarkets]) => {
          if (!!fixtureData && fixtureData?.fixture) {
            this.fixtureData = fixtureData;
            this.gantryMarkets = gantryMarkets;
            this.cricketCdsResult = this.getCricketCdsContent(fixtureData, this.gantryMarkets);
            this.cricketCdsResult.content = contentFromSitecore;
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
          }
          else {
            throw 'Could not find cricket data for Url - ' + this.cdsPushService.fixtureViewUrl;
          }
          return this.cricketCdsResult;
        }),
        catchError(err => {
          this.errorService.logError(err);
          this.logError(err, 'Error');
          return EMPTY;
        })
      ), shareReplay()
  }

  public getFixtureViewData(fixtureId: any, marketId: any, gameIds: any) {
    return this.cdsPushService.getFixture_View(fixtureId, '', gameIds);
  }

  public getCricketCdsContent(fixture: FixtureView, gantryMarkets: Array<Markets>): CricketCdsTemplateResult {
    if (!!fixture && fixture?.fixture && fixture?.fixture?.games?.length > 0) {
      if (this.errorService.isStaleDataAvailable) {
        this.errorService.unSetError();
      }
      this.cricketCdsResult.sportName = fixture?.fixture?.sport?.name?.value?.toUpperCase();
      this.cricketCdsResult.title = fixture?.fixture?.name?.value?.replace('-', 'V')?.toUpperCase();
      this.cricketCdsResult.eventStartDate = fixture?.fixture?.startDate;
      this.cricketCdsResult.competitionName = fixture?.fixture?.competition?.name?.value?.toUpperCase();
      this.cricketCdsResult.context = fixture?.fixture?.context;
      fixture?.fixture?.games?.forEach(x => {
        let findedMatchBet = gantryMarkets?.find(x => x.sport == Sports.CdsCricket)?.markets?.find(y => y.matches?.includes(CricketCdsTemplateIds.matchBetting))
        if (!!findedMatchBet && findedMatchBet?.matches?.includes(x?.templateId?.toString())) {
          x.isMatchBetting = true;
        }
        let topHomeRunscorer = gantryMarkets?.find(x => x.sport == Sports.CdsCricket)?.markets?.find(y => y.matches?.includes(CricketCdsTemplateIds.topHomeRunscorer))
        if (!!topHomeRunscorer && topHomeRunscorer?.matches?.includes(x?.templateId?.toString())) {
          x.isHomeTopRunscorer = true;
        }
        let topAwayRunscorer = gantryMarkets?.find(x => x.sport == Sports.CdsCricket)?.markets?.find(y => y.matches?.includes(CricketCdsTemplateIds.topAwayRunscorer))
        if (!!topAwayRunscorer && topAwayRunscorer?.matches?.includes(x?.templateId?.toString())) {
          x.isAwayTopRunscorer = true;
        }
        let totalMatchSixes = gantryMarkets?.find(x => x.sport == Sports.CdsCricket)?.markets?.find(y => y.matches?.includes(CricketCdsTemplateIds.totalMatchSixes))
        if (!!totalMatchSixes && totalMatchSixes?.matches?.includes(x?.templateId?.toString())) {
          x.isTotalSixes = true;
        }
        let testMatchBetting = gantryMarkets?.find(x => x.sport == Sports.CdsCricket)?.markets?.find(y => y.matches?.includes(CricketCdsTemplateIds.testMatchBetting))
        if (!!testMatchBetting && testMatchBetting?.matches?.includes(x?.templateId?.toString())) {
          x.isTestMatchBetting = true;
          this.cricketCdsResult.isTestMatch = true;
        }
        let matchSuperOver = gantryMarkets?.find(x => x.sport == Sports.CdsCricket)?.markets?.find(y => y.matches?.includes(CricketCdsTemplateIds.matchSuperOver))
        if (!!matchSuperOver && matchSuperOver?.matches?.includes(x?.templateId?.toString())) {
          x.isSuperOverBetting = true;
          this.cricketCdsResult.isSuperOver = true;
        }
        let topToScore100 = gantryMarkets?.find(x => x.sport == Sports.CdsCricket)?.markets?.find(y => y.matches?.includes(CricketCdsTemplateIds.topToScore100))
        if (!!topToScore100 && topToScore100?.matches?.includes(x?.templateId?.toString())) {
          x.isTopScore100 = true;
        }

      });
      this.cricketCdsResult.games = []
      var gamesArray = fixture?.fixture?.games;
      gamesArray?.forEach((x) => {
        if (x.isMatchBetting) {
          this.prepareMatchBetting(this.cricketCdsResult, x);
        }
        else if (x.isHomeTopRunscorer) {
          this.prepareHomeTopRunScorer(this.cricketCdsResult, x);
        }
        else if (x.isAwayTopRunscorer) {
          this.prepareAwayTopRunScorer(this.cricketCdsResult, x);
        }
        else if (x.isTotalSixes) {
          this.prepareTotalSixes(this.cricketCdsResult, x);
        }
        else if (x.isTestMatchBetting) {
          this.prepareTestMatchBetting(this.cricketCdsResult, x);
        }
        else if (x.isSuperOverBetting) {
          this.prepareSuperOverBetting(this.cricketCdsResult, x);
        }
        else if (x.isTopScore100) {
          this.prepareTopScore100Betting(this.cricketCdsResult, x);
        }
      })
      //Prepareing Player to Score 100 Market
      let getTopScore100 = this.cricketCdsResult?.games?.filter((item) => item?.isTopScore100 === true);
      let topScore100List: BetDetails[] = [];
      if (getTopScore100?.length > 0) {
        getTopScore100?.forEach((selection) => {
          let betDetails = new BetDetails();
          betDetails.betName = this.checkRemovecountry(selection.topScore100in1stInns.betName);
          betDetails.betOdds = selection.topScore100in1stInns.betOdds;
          topScore100List.push(betDetails);
        })
      }
      this.sortRunScorerList(topScore100List);
      this.cricketCdsResult.topScore100List = topScore100List;
      return this.cricketCdsResult;
    }
    else {
      const errorMessage = 'Could not find cricket data for Url - ' + this.cdsPushService.fixtureViewUrl;
      this.errorService.setError(errorMessage);
    }

  }

  prepareMatchBetting(cricketCdsResult: CricketCdsTemplateResult, x: Game) {
    cricketCdsResult?.games?.push(
      {
        id: x.id,
        gameName: x.name?.value?.toUpperCase(),
        isMatchBetting: true,
        matchBetting: {
          homeBettingPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[0]?.visibility, x?.results[0]?.numerator, x?.results[0]?.denominator),
          homePlayer: !!x.results[0] ? x.results[0]?.name?.value?.toUpperCase() : "",
          awayBettingPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[1]?.visibility, x?.results[1]?.numerator, x?.results[1]?.denominator),
          awayPlayer: !!x?.results[1] ? x?.results[1]?.name?.value?.toUpperCase() : ""
        }
      })
  }

  prepareSuperOverBetting(cricketCdsResult: CricketCdsTemplateResult, x: Game) {
    cricketCdsResult?.games?.push(
      {
        id: x.id,
        gameName: x.name?.value?.toUpperCase(),
        isSuperOverBetting: true,
        matchBetting: {
          homeBettingPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[0]?.visibility, x?.results[0]?.numerator, x?.results[0]?.denominator),
          homePlayer: !!x.results[0] ? x.results[0]?.name?.value?.toUpperCase() : "",
          awayBettingPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[1]?.visibility, x?.results[1]?.numerator, x?.results[1]?.denominator),
          awayPlayer: !!x?.results[1] ? x?.results[1]?.name?.value?.toUpperCase() : ""
        }
      })
  }

  prepareTestMatchBetting(cricketCdsResult: CricketCdsTemplateResult, x: Game) {
    cricketCdsResult?.games?.push(
      {
        id: x.id,
        gameName: x.name?.value?.toUpperCase(),
        isTestMatchBetting: true,
        matchBetting: {
          homeBettingPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[0]?.visibility, x?.results[0]?.numerator, x?.results[0]?.denominator),
          homePlayer: !!x.results[0] ? x.results[0]?.name?.value?.toUpperCase() : "",
          drawBettingPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[1]?.visibility, x?.results[1]?.numerator, x?.results[1]?.denominator),
          drawPlayer: !!x?.results[1] ? x?.results[1]?.name?.value?.toUpperCase() : "",
          awayBettingPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[2]?.visibility, x?.results[2]?.numerator, x?.results[2]?.denominator),
          awayPlayer: !!x?.results[2] ? x?.results[2]?.name?.value?.toUpperCase() : ""
        }
      })
  }

  prepareHomeTopRunScorer(cricketCdsResult: CricketCdsTemplateResult, x: Game) {
    this.topRunScorer.homeTeamTopRunScorerList = new Array<BetDetails>();
    let topHomeRunscorer = this.gantryMarkets?.find(x => x.sport == Sports.CdsCricket)?.markets?.find(y => y.matches?.includes(CricketCdsTemplateIds.topHomeRunscorer))
    if (!!topHomeRunscorer && topHomeRunscorer?.matches?.includes(x?.templateId?.toString())) {
      x.results?.forEach((homeSelection) => {
        let betDetails = new BetDetails();
        betDetails.betName = this.checkRemovecountry(homeSelection.name.value);
        betDetails.betOdds = SportBookMarketHelper.getCdsPriceStr(homeSelection?.visibility, homeSelection?.numerator, homeSelection?.denominator);
        this.topRunScorer.homeTeamTopRunScorerList.push(betDetails);

      })
      this.sortRunScorerList(this.topRunScorer.homeTeamTopRunScorerList);
      cricketCdsResult?.games?.push(
        {
          id: x.id,
          gameName: x.name?.value,
          marketName: x.templateCategory?.name?.value,
          isHomeTopRunscorer: true,
          topRunScorer: {
            order: 1,
            homeTeamTopRunScorerList: this.topRunScorer.homeTeamTopRunScorerList
          }
        })
    }
  }
  prepareAwayTopRunScorer(cricketCdsResult: CricketCdsTemplateResult, x: Game) {
    this.topRunScorer.awayTeamTopRunScorerList = new Array<BetDetails>();
    let topAwayRunscorer = this.gantryMarkets?.find(x => x.sport == Sports.CdsCricket)?.markets?.find(y => y.matches?.includes(CricketCdsTemplateIds.topAwayRunscorer))
    if (!!topAwayRunscorer && topAwayRunscorer?.matches?.includes(x?.templateId?.toString())) {
      x.results?.forEach((awaySelection) => {
        let betDetails = new BetDetails();
        betDetails.betName = this.checkRemovecountry(awaySelection.name.value);
        betDetails.betOdds = SportBookMarketHelper.getCdsPriceStr(awaySelection?.visibility, awaySelection?.numerator, awaySelection?.denominator);
        this.topRunScorer.awayTeamTopRunScorerList.push(betDetails);
      })
      this.sortRunScorerList(this.topRunScorer.awayTeamTopRunScorerList);
      cricketCdsResult?.games?.push(
        {
          id: x.id,
          gameName: x.name?.value,
          marketName: x.templateCategory?.name?.value,
          isAwayTopRunscorer: true,
          topRunScorer: {
            order: 2,
            awayTeamTopRunScorerList: this.topRunScorer.awayTeamTopRunScorerList
          }
        })
    }
  }

  prepareTopScore100Betting(cricketCdsResult: CricketCdsTemplateResult, x: Game) {
    let market = x.results?.filter((item) => item?.name?.value?.toLowerCase() === "yes")
    if (market?.length > 0) {
      cricketCdsResult?.games?.push(
        {
          id: x.id,
          gameName: x.name?.value,
          marketName: x.templateCategory?.name?.value,
          isTopScore100: true,
          topScore100in1stInns: {
            betName: this.checkRemovecountry(x.player1?.value),
            betOdds: !!market[0] ? SportBookMarketHelper.getCdsPriceStr(market[0]?.visibility, market[0]?.numerator, market[0]?.denominator) : "",
          }
        })
    }
  }

  prepareTotalSixes(cricketCdsResult: CricketCdsTemplateResult, x: Game) {
    cricketCdsResult?.games?.push(
      {
        id: x.id,
        gameName: x.name?.value?.toUpperCase(),
        isTotalSixes: true,
        totalSixes: {
          homeBettingPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[0]?.visibility, x?.results[0]?.numerator, x?.results[0]?.denominator),
          homePlayer: !!x.results[0] ? x.results[0]?.name?.value?.replace(',', '.')?.toUpperCase() : "",
          awayBettingPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[1]?.visibility, x?.results[1]?.numerator, x?.results[1]?.denominator),
          awayPlayer: !!x?.results[1] ? x?.results[1]?.name?.value?.replace(',', '.')?.toUpperCase() : ""
        }
      })
  }

  public GetUpdatedCricketCdsContent(messageEnvelope: MessageEnvelope): CricketCdsTemplateResult {
    var gameIndex = 0;
    if (!!messageEnvelope.messageType) {
      if (messageEnvelope.messageType == CdsPushConstants.gameUpdate) {
        if (!!messageEnvelope?.payload?.game?.id) {
          gameIndex = this.fixtureData?.fixture?.games?.findIndex(x => x.id == messageEnvelope?.payload?.game?.id);
          if (gameIndex != -1) {
            this.fixtureData.fixture.games[gameIndex] = messageEnvelope?.payload?.game;
          }
          else {
            this.fixtureData?.fixture?.games?.push(messageEnvelope?.payload?.game);
          }
        }
      }
      else if (messageEnvelope.messageType == CdsPushConstants.gameDelete) {
        gameIndex = this.fixtureData?.fixture?.games?.findIndex(x => x.id == messageEnvelope?.payload?.gameId);
        this.fixtureData?.fixture?.games.splice(gameIndex, 1);
      }
      else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
        this.fixtureData.fixture.startDate = messageEnvelope?.payload?.startDate;
      }
      return this.getCricketCdsContent(this.fixtureData, this.gantryMarkets);

    }
  }

  private sortRunScorerList(topRunScorerList: Array<BetDetails>) {
    if (topRunScorerList?.length > 1) {
      topRunScorerList?.sort(
        function (first, second) {
          let firstNumber = CricketCdsService.getPriceFromOdds(first?.betOdds);
          let secondNumber = CricketCdsService.getPriceFromOdds(second?.betOdds);
          return firstNumber - secondNumber;
        }
      );
    }
    return topRunScorerList;
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

  checkRemovecountry(stringToModify: string): string {
    return stringToModify?.split("(")[0]?.trim()?.toUpperCase();
  }

  private getGantryMarketDataContent() {
    return this.gantryMarketsService.gantryMarkets$
      .pipe(
        tap((gantryMarkets: Array<Markets>) => {

        }),
        catchError(err => {
          return EMPTY;
        })
      );
  }

  logError(message: string, status: string, fatal: boolean = false) {
    let errorLog: Log = {
      level: LogType.Error,
      message: message,
      status: status,
      fatal: fatal
    };
    this.loggerService.log(errorLog);
  }

}
