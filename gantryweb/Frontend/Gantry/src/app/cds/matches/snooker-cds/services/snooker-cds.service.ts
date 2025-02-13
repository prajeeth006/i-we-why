import { Injectable } from '@angular/core';
import { BetDetails, CorrectScorer, SnookerCdsTemplateResult, SnookerContentParams } from '../models/snooker-cds-template.model';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay, tap } from 'rxjs';
import { FixtureView, Game } from 'src/app/common/cds-client/models/fixture-view.model';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { SnookerCdsTemplateIds } from '../models/snooker-cds-template.constant';
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
export class SnookerCdsService {

  constructor(
    private cdsPushService: CdsClientService,
    private errorService: ErrorService,
    private loggerService: LoggerService,
    private gantryMarketsService: GantryMarketsService,
    private sportContentService: SportContentService
  ) { }

  snookerCdsResult: SnookerCdsTemplateResult = new SnookerCdsTemplateResult();
  fixtureData$: Observable<FixtureView>;
  snookerContentFromSitecore$: Observable<SnookerContentParams>;
  snookerCdsContent$: Observable<SnookerCdsTemplateResult>;
  fixtureData: FixtureView;
  correctScorer: CorrectScorer = new CorrectScorer();
  errorMessage$ = this.errorService.errorMessage$;
  gantryMarkets$: Observable<Array<Markets>>;
  gantryMarkets: Array<Markets>;

  public GetSnookerContent(fixtureId: any, marketId: any, gameIds: any) {
    this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, gameIds);
    this.snookerContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.snookerCds);
    this.gantryMarkets$ = this.getGantryMarketDataContent();
    this.snookerCdsContent$ = combineLatest([this.fixtureData$, this.snookerContentFromSitecore$, this.gantryMarkets$]).
      pipe(
        map(([fixtureData, contentFromSitecore, gantryMarkets]) => {
          if (!!fixtureData && fixtureData?.fixture) {
            this.fixtureData = fixtureData;
            this.gantryMarkets = gantryMarkets;
            this.snookerCdsResult = this.getSnookerCdsResult(fixtureData, this.gantryMarkets);
            this.snookerCdsResult.content = contentFromSitecore;
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
          }
          else {
            throw 'Could not find snooker data for Url - ' + this.cdsPushService.fixtureViewUrl;
          }
          return this.snookerCdsResult;
        }),
        catchError(err => {
          this.errorService.logError(err);
          this.logError(err, 'Error');
          return EMPTY;
        })
      ), shareReplay()
  }

  public getSnookerCdsResult(fixture: FixtureView, gantryMarkets: Array<Markets>): SnookerCdsTemplateResult {
    if (!!fixture && fixture?.fixture && fixture?.fixture?.games?.length > 0) {
      if (this.errorService.isStaleDataAvailable) {
        this.errorService.unSetError();
      }
      this.snookerCdsResult.sportName = fixture?.fixture?.sport?.name?.value?.toUpperCase();
      this.snookerCdsResult.title = StringHelper.getCdsFixtureTitle(fixture?.fixture?.name?.value);
      this.snookerCdsResult.eventStartDate = fixture?.fixture?.startDate;
      this.snookerCdsResult.competitionName = fixture?.fixture?.competition?.name?.value?.toUpperCase();
      this.snookerCdsResult.context = fixture?.fixture?.context;
      fixture?.fixture?.games?.forEach(x => {
        let findedMatchBet = gantryMarkets?.find(x => x.sport == Sports.CdsSnooker)?.markets?.find(y => y.matches?.includes(SnookerCdsTemplateIds.matchBetting) || y.matches?.includes(SnookerCdsTemplateIds.matchBetting3Way))
        if (!!findedMatchBet && findedMatchBet?.matches?.includes(x?.templateId?.toString())) {
          x.isMatchBetting = true;
        }
        let findFrameBet = gantryMarkets?.find(x => x.sport == Sports.CdsSnooker)?.markets?.find(y => y.matches?.includes(SnookerCdsTemplateIds.frameBetting))
        if (!!findFrameBet && findFrameBet?.matches?.includes(x?.templateId?.toString())) {
          x.isFrameBetting = true;
        }
        let findTotalFrameBet = gantryMarkets?.find(x => x.sport == Sports.CdsSnooker)?.markets?.find(y => y.matches?.includes(SnookerCdsTemplateIds.totalFrames))
        if (!!findTotalFrameBet && findTotalFrameBet?.matches?.includes(x?.templateId?.toString())) {
          x.isTotalFrames = true;
        }
        let findHandicapBet = gantryMarkets?.find(x => x.sport == Sports.CdsSnooker)?.markets?.find(y => y.matches?.includes(SnookerCdsTemplateIds.matchHandicap))
        if (!!findHandicapBet && findHandicapBet?.matches?.includes(x?.templateId?.toString())) {
          x.isMatchHandicap = true;
        }

      });
      this.snookerCdsResult.games = []
      var gamesArray = fixture?.fixture?.games;
      gamesArray?.forEach((x) => {
        if (x.isMatchBetting) {
          this.prepareMatchBetting(this.snookerCdsResult, x);
        }
        else if (x.isFrameBetting) {
          this.prepareFramesBetting(this.snookerCdsResult, x);
        }
        else if (x.isTotalFrames) {
          this.prepareTotalFramesBetting(this.snookerCdsResult, x);
        }
        else if (x.isMatchHandicap) {
          this.prepareHandicapBetting(this.snookerCdsResult, x);
        }

      })
      //Prepareing Player to Score 100 Market
      this.snookerCdsResult.frameBetting = new CorrectScorer();
      this.snookerCdsResult.frameBetting.homeTeamScorerList = new Array<BetDetails>();
      this.snookerCdsResult.frameBetting.awayTeamScorerList = new Array<BetDetails>();
      let frameBetting = this.snookerCdsResult.games.filter(a => a.isFrameBetting == true);
      if (frameBetting?.length > 0) {
        frameBetting?.forEach((selection) => {
          this.snookerCdsResult.frameBetting.homeTeamScorerList = selection.correctScore.homeTeamScorerList;
          this.snookerCdsResult.frameBetting.awayTeamScorerList = selection.correctScore.awayTeamScorerList;
        })
      }
      return this.snookerCdsResult;
    }
    else {
      const errorMessage = 'Could not find snooker data for Url - ' + this.cdsPushService.fixtureViewUrl;
      this.errorService.setError(errorMessage);
    }

  }

  prepareMatchBetting(snookerCdsResult: SnookerCdsTemplateResult, x: Game) {
    snookerCdsResult.homeName = !!x.results[0] ? x.results[0]?.name?.value?.toUpperCase() : "";
    snookerCdsResult.awayName = !!x?.results[1] ? this.getSelectionName(x.results[1]?.name.value, !!x.results[2] ? x.results[2]?.name?.value : "") : "";
    snookerCdsResult?.games?.push(
      {
        id: x.id,
        gameName: x.name?.value?.toUpperCase(),
        isMatchBetting: true,
        matchBetting: {
          homePrice: SportBookMarketHelper.getCdsPriceStr(x?.results[0]?.visibility, x?.results[0]?.numerator, x?.results[0]?.denominator),
          homePlayer: !!x.results[0] ? x.results[0]?.name?.value?.toUpperCase() : "",
          awayPrice: !!x?.results[1] ? this.getSelectionPrice(x.results[1]?.name.value, x?.results[1]?.visibility, x?.results[1]?.numerator, x?.results[1]?.denominator, x?.results[2]?.visibility, x?.results[2]?.numerator, x?.results[2]?.denominator) : "",
          awayPlayer: !!x?.results[1] ? this.getSelectionName(x.results[1]?.name.value, !!x.results[2] ? x.results[2].name.value : "") : "",
        }
      })
  }

  prepareFramesBetting(snookerCdsResult: SnookerCdsTemplateResult, x: Game) {
    this.correctScorer.homeTeamScorerList = new Array<BetDetails>();
    this.correctScorer.awayTeamScorerList = new Array<BetDetails>();
    x.results?.forEach((homeSelection) => {
      if (homeSelection?.name?.value?.toLowerCase().includes(snookerCdsResult?.homeName?.toLowerCase())) {
        let betDetails = new BetDetails();
        betDetails.betName = homeSelection.name.value?.toUpperCase();
        betDetails.betOdds = SportBookMarketHelper.getCdsPriceStr(homeSelection?.visibility, homeSelection?.numerator, homeSelection?.denominator);
        betDetails = this.updateSelectionDetails(betDetails);
        this.correctScorer.homeTeamScorerList.push(betDetails);
      }
      else if (homeSelection?.name?.value?.toLowerCase().includes(snookerCdsResult.awayName?.toLowerCase())) {
        let betDetails = new BetDetails();
        betDetails.betName = homeSelection.name.value?.toUpperCase();
        betDetails.betOdds = SportBookMarketHelper.getCdsPriceStr(homeSelection?.visibility, homeSelection?.numerator, homeSelection?.denominator);
        betDetails = this.updateSelectionDetails(betDetails);
        this.correctScorer.awayTeamScorerList.push(betDetails);
      }
      else if (homeSelection?.name?.value?.toLowerCase()?.includes("draw")) {
        let betDetails = new BetDetails();
        betDetails.betName = homeSelection.name.value?.toUpperCase();
        betDetails.betOdds = SportBookMarketHelper.getCdsPriceStr(homeSelection?.visibility, homeSelection?.numerator, homeSelection?.denominator);
        betDetails = this.updateSelectionDetails(betDetails);
        this.correctScorer.homeTeamScorerList.push(betDetails);
        this.correctScorer.awayTeamScorerList.push(betDetails);
      }
    })
    snookerCdsResult?.games?.push(
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

  prepareTotalFramesBetting(snookerCdsResult: SnookerCdsTemplateResult, x: Game) {
    snookerCdsResult?.games?.push(
      {
        id: x.id,
        gameName: x.name?.value?.toUpperCase(),
        isTotalFrames: true,
        totalFrames: {
          homePrice: SportBookMarketHelper.getCdsPriceStr(x?.results[0]?.visibility, x?.results[0]?.numerator, x?.results[0]?.denominator),
          homePlayer: !!x.results[0] ? x.results[0]?.name?.value?.replace(',', '.')?.toUpperCase() : "",
          awayPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[1]?.visibility, x?.results[1]?.numerator, x?.results[1]?.denominator),
          awayPlayer: !!x?.results[1] ? x?.results[1]?.name?.value?.replace(',', '.')?.toUpperCase() : ""
        }
      })
  }

  prepareHandicapBetting(snookerCdsResult: SnookerCdsTemplateResult, x: Game) {
    snookerCdsResult?.games?.push(
      {
        id: x.id,
        gameName: x.name?.value?.toUpperCase(),
        isMatchHandicap: true,
        matchHanicap: {
          homePrice: SportBookMarketHelper.getCdsPriceStr(x?.results[0]?.visibility, x?.results[0]?.numerator, x?.results[0]?.denominator),
          homePlayer: !!x?.results[1] ? this.getPlayerName(x.results[0]?.name.value) : "",
          awayPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[1]?.visibility, x?.results[1]?.numerator, x?.results[1]?.denominator),
          awayPlayer: !!x?.results[1] ? this.getPlayerName(x.results[1]?.name.value) : "",
        }
      })
  }

  public GetUpdatedSnookerCdsContent(messageEnvelope: MessageEnvelope): SnookerCdsTemplateResult {
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
      return this.getSnookerCdsResult(this.fixtureData, this.gantryMarkets);

    }
  }

  updateSelectionDetails(teamDetail: BetDetails): BetDetails {
    let teamSelectionItems = teamDetail?.betName?.replace(/\s/g, ""); //Remove all spaces from SelectonName
    //Ex: "selectionName":"Neil Robertson 10-2"
    //Res: "NeilRobertson10-2"
    let selectScoreNumber = teamSelectionItems?.trim()?.substr(teamSelectionItems.length - 5)?.replace(':', '-'); //We take last 5 characters from teamSelectionItems
    //Ex: "NeilRobertson10-2"
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
      selectionName = playerName1?.toLowerCase() == 'tie' ? playerName2 : playerName1;
    }
    return selectionName?.toUpperCase();
  }

  getSelectionPrice(playerName1: string, visibility1?: string, numerator1?: number, denominator1?: number, visibility2?: string, numerator2?: number, denominator2?: number): string {
    let selectionPrice = "";
    if (!!playerName1) {
      selectionPrice = playerName1?.toLowerCase() == 'tie' ? SportBookMarketHelper.getCdsPriceStr(visibility2, numerator2, denominator2) : SportBookMarketHelper.getCdsPriceStr(visibility1, numerator1, denominator1);
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
