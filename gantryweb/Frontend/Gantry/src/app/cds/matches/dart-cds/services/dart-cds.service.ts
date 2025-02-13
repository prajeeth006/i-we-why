import { Injectable } from '@angular/core';
import { BetDetails, CorrectScorer, DartCdsTemplateResult, DartContentParams } from '../models/dart-cds-template.model';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay, tap } from 'rxjs';
import { FixtureView, Game } from 'src/app/common/cds-client/models/fixture-view.model';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { DartCdsTemplateIds } from '../models/dart-cds-template.constant';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { MessageEnvelope } from '@cds/push';
import { CdsPushConstants } from 'src/app/common/cds-client/models/cds-push-updates.constant';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { ErrorService } from 'src/app/common/services/error.service';
import { Log, LogType, LoggerService } from 'src/app/common/services/logger.service';
import { Markets, Sports } from 'src/app/common/models/gantrymarkets.model';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';

@Injectable({
  providedIn: 'root'
})
export class DartCdsService {

  constructor(
    private cdsPushService: CdsClientService,
    private errorService: ErrorService,
    private loggerService: LoggerService,
    private gantryMarketsService: GantryMarketsService,
    private sportContentService: SportContentService
  ) { }

  dartCdsResult: DartCdsTemplateResult = new DartCdsTemplateResult();
  fixtureData$: Observable<FixtureView>;
  dartContentFromSitecore$: Observable<DartContentParams>;
  dartCdsContent$: Observable<DartCdsTemplateResult>;
  fixtureData: FixtureView;
  correctScorer: CorrectScorer = new CorrectScorer();
  errorMessage$ = this.errorService.errorMessage$;
  gantryMarkets$: Observable<Array<Markets>>;
  gantryMarkets: Array<Markets>;

  public GetDartContent(fixtureId: any, marketId: any, gameIds: any) {
    this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, gameIds);
    this.dartContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.dartCds);
    this.gantryMarkets$ = this.getGantryMarketDataContent();
    this.dartCdsContent$ = combineLatest([this.fixtureData$, this.dartContentFromSitecore$, this.gantryMarkets$]).
      pipe(
        map(([fixtureData, contentFromSitecore, gantryMarkets]) => {
          if (!!fixtureData && fixtureData?.fixture) {
            this.fixtureData = fixtureData;
            this.gantryMarkets = gantryMarkets;
            this.dartCdsResult = this.getDartCdsResult(fixtureData, this.gantryMarkets);
            this.dartCdsResult.content = contentFromSitecore;
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
          }
          else {
            throw 'Could not find dart data for Url - ' + this.cdsPushService.fixtureViewUrl;
          }
          return this.dartCdsResult;
        }),
        catchError(err => {
          this.errorService.logError(err);
          this.logError(err, 'Error');
          return EMPTY;
        })
      ), shareReplay()
  }

  public getDartCdsResult(fixture: FixtureView, gantryMarkets: Array<Markets>): DartCdsTemplateResult {
    if (!!fixture && fixture?.fixture && fixture?.fixture?.games?.length > 0) {
      if (this.errorService.isStaleDataAvailable) {
        this.errorService.unSetError();
      }
      this.dartCdsResult.sportName = fixture?.fixture?.sport?.name?.value?.toUpperCase();
      this.dartCdsResult.title = StringHelper.getCdsFixtureTitle(fixture?.fixture?.name?.value);
      this.dartCdsResult.eventStartDate = fixture?.fixture?.startDate;
      this.dartCdsResult.competitionName = fixture?.fixture?.competition?.name?.value?.toUpperCase();
      this.dartCdsResult.context = fixture?.fixture?.context;
      fixture?.fixture?.games?.forEach(gameRecord => {
        let findedMatchBet = gantryMarkets?.find(market => market.sport == Sports.CdsDarts)?.markets?.find(market => (market.matches?.includes(DartCdsTemplateIds.MatchBetting)))
        if (!!findedMatchBet && findedMatchBet?.matches?.includes(gameRecord?.templateId?.toString())) {
          gameRecord.isMatchBetting = true;
        }
        let findedMatchBetDraw = gantryMarkets?.find(market => market.sport == Sports.CdsDarts)?.markets?.find(market => (market.matches?.includes(DartCdsTemplateIds.MatchBetting3Way)))
        if (!!findedMatchBetDraw && findedMatchBetDraw?.matches?.includes(gameRecord?.templateId?.toString())) {
          gameRecord.isMatchBetting = true;
        }
        let findFrameBet = gantryMarkets?.find(market => market.sport == Sports.CdsDarts)?.markets?.find(market => market.matches?.includes(DartCdsTemplateIds.SelectedCorrectScores))
        if (!!findFrameBet && findFrameBet?.matches?.includes(gameRecord?.templateId?.toString())) {
          let homeName = fixture?.fixture?.participants[0]?.name?.short;
          let awayName = fixture?.fixture?.participants[1]?.name?.short;;
          if (gameRecord.results.length > 0) {
            gameRecord.results.forEach(result => {
              if (result?.name?.value?.indexOf(':') != -1 || result?.name?.value?.indexOf('-') != -1) {
                let array = result?.name?.value.indexOf(':') != -1 ? result?.name?.value.split(':') : result?.name?.value.split('-');
                if (array[0] > array[1] && !result.name.home && !result.name.away) {
                  result.name.home = homeName;
                  result.name.away = null;
                }
                else if (array[1] > array[0] && !result.name.home && !result.name.away) {
                  result.name.home = null;
                  result.name.away = awayName;
                  result.name.value = result?.name?.value.indexOf(':') != -1 ? array[1] + ':' + array[0] : array[1] + '-' + array[0];
                }
                else if (array[1] == array[0]) {
                  result.name.home = homeName;
                  result.name.away = awayName;
                }
              }
              else {
                this.errorService.logError('Could not find dart data for SelectedCorrectScores');
                this.logError('Could not find dart data for SelectedCorrectScores', 'Error');
              }
            })
          }
          gameRecord.isFrameBetting = true;
        }
        let findTotalFrameBet = gantryMarkets?.find(market => market.sport == Sports.CdsDarts)?.markets?.find(market => market.matches?.includes(DartCdsTemplateIds.Most180S))
        if (!!findTotalFrameBet && findTotalFrameBet?.matches?.includes(gameRecord?.templateId?.toString())) {
          gameRecord.isTotalFrames = true;
        }
        let findHandicapBet = gantryMarkets?.find(market => market.sport == Sports.CdsDarts)?.markets?.find(market => market.matches?.includes(DartCdsTemplateIds.MatchHandicap))
        if (!!findHandicapBet && findHandicapBet?.matches?.includes(gameRecord?.templateId?.toString())) {
          gameRecord.isMatchHandicap = true;
        }
        let findLegHandicapBet = gantryMarkets?.find(market => market.sport == Sports.CdsDarts)?.markets?.find(market => market.matches?.includes(DartCdsTemplateIds.LegHandicap))
        if (!!findLegHandicapBet && findLegHandicapBet?.matches?.includes(gameRecord?.templateId?.toString())) {
          gameRecord.isMatchHandicap = true;
        }
      });
      this.dartCdsResult.games = []
      var gamesArray = fixture?.fixture?.games;
      gamesArray?.forEach((game) => {
        if (game.isMatchBetting) {
          this.prepareMatchBetting(this.dartCdsResult, game);
        }
        else if (game.isFrameBetting) {
          this.prepareFramesBetting(this.dartCdsResult, game);
        }
        else if (game.isTotalFrames) {
          this.prepareTotalFramesBetting(this.dartCdsResult, game);
        }
        else if (game.isMatchHandicap) {
          this.prepareHandicapBetting(this.dartCdsResult, game);
        }

      })
      //Prepareing Player to Score 100 Market
      this.dartCdsResult.frameBetting = new CorrectScorer();
      this.dartCdsResult.frameBetting.homeTeamScorerList = new Array<BetDetails>();
      this.dartCdsResult.frameBetting.awayTeamScorerList = new Array<BetDetails>();
      let frameBetting = this.dartCdsResult.games.filter(game => game.isFrameBetting == true);
      if (frameBetting?.length > 0) {
        frameBetting?.forEach((selection) => {
          this.dartCdsResult.frameBetting.homeTeamScorerList = selection.correctScore.homeTeamScorerList;
          this.dartCdsResult.frameBetting.awayTeamScorerList = selection.correctScore.awayTeamScorerList;
        })
      }
      return this.dartCdsResult;
    }
    else {
      const errorMessage = 'Could not find dart data for Url - ' + this.cdsPushService.fixtureViewUrl;
      this.errorService.setError(errorMessage);
    }

  }

  prepareMatchBetting(dartCdsResult: DartCdsTemplateResult, game: Game) {
    dartCdsResult.homeName = !!game.results[0] ? StringHelper.removeCountryfromSelection(game.results[0]?.name?.value?.toUpperCase()) : "";
    dartCdsResult.awayName = !!game?.results[1] ? StringHelper.removeCountryfromSelection(this.getSelectionName(game.results[1]?.name.value, !!game.results[2] ? game.results[2]?.name?.value : "")) : "";
    dartCdsResult?.games?.push(
      {
        id: game.id,
        gameName: game.name?.value?.toUpperCase(),
        isMatchBetting: true,
        matchBetting: {
          homePrice: SportBookMarketHelper.getCdsPriceStr(game?.results[0]?.visibility, game?.results[0]?.numerator, game?.results[0]?.denominator),
          homePlayer: !!game.results[0] ? StringHelper.removeCountryfromSelection(game.results[0]?.name?.value?.toUpperCase()) : "",
          awayPrice: !!game?.results[1] ? this.getSelectionPrice(game.results[1]?.name.value, game?.results[1]?.visibility, game?.results[1]?.numerator, game?.results[1]?.denominator, game?.results[2]?.visibility, game?.results[2]?.numerator, game?.results[2]?.denominator) : "",
          awayPlayer: !!game?.results[1] ? StringHelper.removeCountryfromSelection(this.getSelectionName(game.results[1]?.name.value, !!game.results[2] ? game.results[2].name.value : "")) : "",
          drawPrice: game?.results?.length > 2 ? SportBookMarketHelper.getCdsPriceStr(game?.results[1]?.visibility, game?.results[1]?.numerator, game?.results[1]?.denominator) : ""
        }
      })
  }

  prepareFramesBetting(dartCdsResult: DartCdsTemplateResult, x: Game) {
    this.correctScorer.homeTeamScorerList = new Array<BetDetails>();
    this.correctScorer.awayTeamScorerList = new Array<BetDetails>();
    x.results?.forEach((homeSelection) => {
      if (homeSelection?.name?.home?.toLowerCase().includes(dartCdsResult?.homeName?.toLowerCase())) {
        let betDetails = new BetDetails();
        betDetails.betName = homeSelection.name.value?.toUpperCase();
        betDetails.betOdds = SportBookMarketHelper.getCdsPriceStr(homeSelection?.visibility, homeSelection?.numerator, homeSelection?.denominator);
        betDetails = this.updateSelectionDetails(betDetails);
        this.correctScorer.homeTeamScorerList.push(betDetails);
      }
      else if (homeSelection?.name?.away?.toLowerCase().includes(dartCdsResult.awayName?.toLowerCase())) {
        let betDetails = new BetDetails();
        betDetails.betName = homeSelection.name.value?.toUpperCase();
        betDetails.betOdds = SportBookMarketHelper.getCdsPriceStr(homeSelection?.visibility, homeSelection?.numerator, homeSelection?.denominator);
        betDetails = this.updateSelectionDetails(betDetails);
        this.correctScorer.awayTeamScorerList.push(betDetails);
      }
      else if (homeSelection?.name?.home?.toLowerCase()?.includes("draw")) {
        let betDetails = new BetDetails();
        betDetails.betName = homeSelection.name.value?.toUpperCase();
        betDetails.betOdds = SportBookMarketHelper.getCdsPriceStr(homeSelection?.visibility, homeSelection?.numerator, homeSelection?.denominator);
        betDetails = this.updateSelectionDetails(betDetails);
        this.correctScorer.homeTeamScorerList.push(betDetails);
        this.correctScorer.awayTeamScorerList.push(betDetails);
      }
    })
    dartCdsResult?.games?.push(
      {
        id: x.id,
        gameName: x.name?.value?.toUpperCase(),
        isFrameBetting: true,
        correctScore: {
          homeTeamScorerList: this.correctScorer.homeTeamScorerList,
          awayTeamScorerList: this.correctScorer.awayTeamScorerList
        }
      })
  }

  prepareTotalFramesBetting(dartCdsResult: DartCdsTemplateResult, game: Game) {
    dartCdsResult?.games?.push(
      {
        id: game.id,
        gameName: game.name?.value?.toUpperCase(),
        isTotalFrames: true,
        totalFrames: {
          homePrice: SportBookMarketHelper.getCdsPriceStr(game?.results[0]?.visibility, game?.results[0]?.numerator, game?.results[0]?.denominator),
          homePlayer: !!game.results[0] ? game.results[0]?.name?.value?.replace(',', '.')?.toUpperCase() : "",
          awayPrice: SportBookMarketHelper.getCdsPriceStr(game?.results[1]?.visibility, game?.results[1]?.numerator, game?.results[1]?.denominator),
          awayPlayer: !!game?.results[1] ? game?.results[1]?.name?.value?.replace(',', '.')?.toUpperCase() : ""
        }
      })
  }

  prepareHandicapBetting(dartCdsResult: DartCdsTemplateResult, game: Game) {
    dartCdsResult?.games?.push(
      {
        id: game.id,
        gameName: game.name?.value?.toUpperCase(),
        isMatchHandicap: true,
        matchHanicap: {
          homePrice: SportBookMarketHelper.getCdsPriceStr(game?.results[0]?.visibility, game?.results[0]?.numerator, game?.results[0]?.denominator),
          homePlayer: !!game?.results[1] ? this.getPlayerName(game.results[0]?.name.value) : "",
          awayPrice: SportBookMarketHelper.getCdsPriceStr(game?.results[1]?.visibility, game?.results[1]?.numerator, game?.results[1]?.denominator),
          awayPlayer: !!game?.results[1] ? this.getPlayerName(game.results[1]?.name.value) : "",
        }
      })
  }

  public GetUpdatedDartCdsContent(messageEnvelope: MessageEnvelope): DartCdsTemplateResult {
    var gameIndex = 0;
    if (!!messageEnvelope.messageType) {
      if (messageEnvelope.messageType == CdsPushConstants.gameUpdate) {
        if (!!messageEnvelope?.payload?.game?.id) {
          gameIndex = this.fixtureData?.fixture?.games?.findIndex(game => game.id == messageEnvelope?.payload?.game?.id);
          if (gameIndex != -1) {
            this.fixtureData.fixture.games[gameIndex] = messageEnvelope?.payload?.game;
          }
          else {
            this.fixtureData?.fixture?.games?.push(messageEnvelope?.payload?.game);
          }
        }
      }
      else if (messageEnvelope.messageType == CdsPushConstants.gameDelete) {
        gameIndex = this.fixtureData?.fixture?.games?.findIndex(game => game.id == messageEnvelope?.payload?.gameId);
        this.fixtureData?.fixture?.games.splice(gameIndex, 1);
      }
      else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
        this.fixtureData.fixture.startDate = messageEnvelope?.payload?.startDate;
      }
      return this.getDartCdsResult(this.fixtureData, this.gantryMarkets);

    }
  }

  updateSelectionDetails(teamDetail: BetDetails): BetDetails {
    let teamSelectionItems = teamDetail?.betName?.replace(/\s/g, ""); //Remove all spaces from SelectonName
    //Ex: "selectionName":"10:2"
    //Res: "10-2"
    let selectScoreNumber = teamSelectionItems?.indexOf(':') != -1 ? teamSelectionItems?.trim()?.replace(':', '-') : teamSelectionItems?.trim();
    //Ex: "10:2"
    //Res:10-2
    let scoreNumber = selectScoreNumber?.trim()?.replace(/[^-+\d]/g, '');  //Remove alphabets from selectScoreNumber
    //Ex: "ON10-2"
    //Res:10-2
    teamDetail.betName = scoreNumber;
    //Final Response :10-2
    return teamDetail;
  }

  getPlayerName(playerName: string): string {
    let selectionName = "";
    if (!!playerName) {
      let splitSelectionName = StringHelper.removeCountryfromSelection(playerName);
      //Ex: "selectionName":"Neil Robertson (ENG) 10,2"
      //Res: "Neil Robertson 10,2"
      let scoreNumber = StringHelper.getScoreNumberfromPlayer(splitSelectionName)
      //Ex: "Neil Robertson (ENG) 10,2"
      //Final Response :10.2
      if (splitSelectionName?.includes('-')) {
        splitSelectionName = StringHelper.checkSelectionNameLengthAndTrimEnd(splitSelectionName?.split('-')[0], SelectionNameLength.Seventeen);
      }
      else if (splitSelectionName?.includes('+')) {
        splitSelectionName = StringHelper.checkSelectionNameLengthAndTrimEnd(splitSelectionName?.split('+')[0], SelectionNameLength.Seventeen);
      }
      selectionName = splitSelectionName?.toUpperCase() + " " + (scoreNumber ? scoreNumber : '');
    }

    return selectionName;
  }

  getSelectionName(playerName1: string, playerName2: string): string {
    let selectionName = "";
    if (!!playerName1) {
      selectionName = playerName1?.toLowerCase() == 'draw' ? playerName2 : playerName1;
    }
    return selectionName?.toUpperCase();
  }

  getSelectionPrice(playerName1: string, visibility1?: string, numerator1?: number, denominator1?: number, visibility2?: string, numerator2?: number, denominator2?: number): string {
    let selectionPrice = "";
    if (!!playerName1) {
      selectionPrice = playerName1?.toLowerCase() == 'draw' ? SportBookMarketHelper.getCdsPriceStr(visibility2, numerator2, denominator2) : SportBookMarketHelper.getCdsPriceStr(visibility1, numerator1, denominator1);
    }
    return selectionPrice;
  }

  public getFixtureViewData(fixtureId: any, marketId: any, gameIds: any) {
    return this.cdsPushService.getFixture_View(fixtureId, '', gameIds);
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
