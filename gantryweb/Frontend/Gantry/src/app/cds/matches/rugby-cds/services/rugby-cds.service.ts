import { Injectable } from '@angular/core';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { Log, LogType, LoggerService } from 'src/app/common/services/logger.service';
import { BetDetails, HalfFullBetting, RugbyCdsTemplateResult, RugbyContentParams } from '../models/rugby-cds-template.model';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay, tap } from 'rxjs';
import { FixtureView, Game } from 'src/app/common/cds-client/models/fixture-view.model';
import { Markets, Sports } from 'src/app/common/models/gantrymarkets.model';
import { MessageEnvelope } from '@cds/push';
import { CdsPushConstants } from 'src/app/common/cds-client/models/cds-push-updates.constant';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { RugbyCdsTemplateIds } from '../models/rugby-cds-template.constant';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';

@Injectable({
  providedIn: 'root'
})
export class RugbyCdsService {

  constructor(
    private cdsPushService: CdsClientService,
    private errorService: ErrorService,
    private loggerService: LoggerService,
    private gantryMarketsService: GantryMarketsService,
    private sportContentService: SportContentService
  ) { }

  rugbyCdsResult: RugbyCdsTemplateResult = new RugbyCdsTemplateResult();
  fixtureData$: Observable<FixtureView>;
  rugbyContentFromSitecore$: Observable<RugbyContentParams>;
  rugbyCdsContent$: Observable<RugbyCdsTemplateResult>;
  fixtureData: FixtureView;
  halfFullBettingList: HalfFullBetting = new HalfFullBetting();
  errorMessage$ = this.errorService.errorMessage$;
  gantryMarkets$: Observable<Array<Markets>>;
  gantryMarkets: Array<Markets>;
  homePlayerName: string;
  awayPlayerName: string;

  public GetRugbyContent(fixtureId: any, marketId: any, gameIds: any) {
    this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, gameIds);
    this.rugbyContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.rugbyCds);
    this.gantryMarkets$ = this.getGantryMarketDataContent();
    this.rugbyCdsContent$ = combineLatest([this.fixtureData$, this.rugbyContentFromSitecore$, this.gantryMarkets$]).
      pipe(
        map(([fixtureData, contentFromSitecore, gantryMarkets]) => {
          if (!!fixtureData && fixtureData?.fixture) {
            this.fixtureData = fixtureData;
            this.gantryMarkets = gantryMarkets;
            this.rugbyCdsResult = this.getRugbyCdsResult(fixtureData, this.gantryMarkets);
            this.rugbyCdsResult.content = contentFromSitecore;
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
          }
          else {
            throw 'Could not find rugby data for Url - ' + this.cdsPushService.fixtureViewUrl;
          }
          return this.rugbyCdsResult;
        }),
        catchError(err => {
          this.errorService.logError(err);
          this.logError(err, 'Error');
          return EMPTY;
        })
      ), shareReplay()
  }

  public getRugbyCdsResult(fixture: FixtureView, gantryMarkets: Array<Markets>): RugbyCdsTemplateResult {
    if (!!fixture && fixture?.fixture && fixture?.fixture?.games?.length > 0) {
      if (this.errorService.isStaleDataAvailable) {
        this.errorService.unSetError();
      }
      this.rugbyCdsResult.sportName = fixture?.fixture?.sport?.name?.value?.toUpperCase();
      this.rugbyCdsResult.title = StringHelper.getCdsFixtureTitle(fixture?.fixture?.name?.value);
      this.rugbyCdsResult.eventStartDate = fixture?.fixture?.startDate;
      this.rugbyCdsResult.competitionName = fixture?.fixture?.competition?.name?.value?.toUpperCase();
      this.rugbyCdsResult.context = fixture?.fixture?.context;
      fixture?.fixture?.games?.forEach(x => {
        let findedMatchBet = gantryMarkets?.find(x => x.sport == Sports.CdsRugby)?.markets?.find(y => y.matches?.includes(RugbyCdsTemplateIds.matchBettingLeague) || y.matches?.includes(RugbyCdsTemplateIds.matchBettingUnion))
        if (!!findedMatchBet && findedMatchBet?.matches?.includes(x?.templateId?.toString())) {
          x.isMatchBetting = true;
        }
        let findHandicapBet = gantryMarkets?.find(x => x.sport == Sports.CdsRugby)?.markets?.find(y => y.matches?.includes(RugbyCdsTemplateIds.handicapBettingLeague) || y.matches?.includes(RugbyCdsTemplateIds.handicapBettingUnion))
        if (!!findHandicapBet && findHandicapBet?.matches?.includes(x?.templateId?.toString())) {
          x.isMatchHandicap = true;
        }
        let findTotalPointsBet = gantryMarkets?.find(x => x.sport == Sports.CdsRugby)?.markets?.find(y => y.matches?.includes(RugbyCdsTemplateIds.totalMatchPointsLeague) || y.matches?.includes(RugbyCdsTemplateIds.totalMatchPointsUnion))
        if (!!findTotalPointsBet && findTotalPointsBet?.matches?.includes(x?.templateId?.toString())) {
          x.isTotalFrames = true;
        }
        let find1stHandicapBet = gantryMarkets?.find(x => x.sport == Sports.CdsRugby)?.markets?.find(y => y.matches?.includes(RugbyCdsTemplateIds.firstHandicapBettingLeague) || y.matches?.includes(RugbyCdsTemplateIds.firstHandicapBettingUnion))
        if (!!find1stHandicapBet && find1stHandicapBet?.matches?.includes(x?.templateId?.toString())) {
          x.isFirstMatchHandicap = true;
        }
        let findHalfFullBet = gantryMarkets?.find(x => x.sport == Sports.CdsRugby)?.markets?.find(y => y.matches?.includes(RugbyCdsTemplateIds.halfTimeFullTimeLeague) || y.matches?.includes(RugbyCdsTemplateIds.halfTimeFullTimeUnion))
        if (!!findHalfFullBet && findHalfFullBet?.matches?.includes(x?.templateId?.toString())) {
          x.isHalfFullBetting = true;
        }

      });
      this.rugbyCdsResult.games = []
      var gamesArray = fixture?.fixture?.games;
      gamesArray?.forEach((x) => {
        if (x.isMatchBetting) {
          this.prepareMatchBetting(this.rugbyCdsResult, x);
        }
        else if (x.isMatchHandicap) {
          this.prepareHandicapBetting(this.rugbyCdsResult, x);
        }
        else if (x.isTotalFrames) {
          this.prepareTotalPointsBetting(this.rugbyCdsResult, x);
        }
        else if (x.isFirstMatchHandicap) {
          this.prepareFirstMatchHandicapBetting(this.rugbyCdsResult, x);
        }
        else if (x.isHalfFullBetting) {
          this.prepareHalfFullBetting(this.rugbyCdsResult, x);
        }

      })
      //Prepareing Half and Full Market
      let homeBetting: BetDetails[] = [];
      let awayBetting: BetDetails[] = [];
      if (this.halfFullBettingList?.allScorerList?.length > 0) {
        this.halfFullBettingList?.allScorerList?.forEach((selection) => {
          let betDetails = new BetDetails();
          let selectionSplit = selection?.betName?.split('/');
          if (this.homePlayerName?.includes(selectionSplit[0]?.trim()) && this.homePlayerName.includes(selectionSplit[1]?.trim())) {
            betDetails.betName = selectionSplit[0]?.trim();
            betDetails.betOdds = selection.betOdds;
            homeBetting.push(betDetails);
          }
          else if (this.awayPlayerName?.includes(selectionSplit[0]?.trim()) && this.awayPlayerName.includes(selectionSplit[1]?.trim())) {
            betDetails.betName = selectionSplit[0]?.trim();
            betDetails.betOdds = selection.betOdds;
            awayBetting.push(betDetails);
          }
        })
      }
      this.rugbyCdsResult.rightBetList = awayBetting;
      this.rugbyCdsResult.leftBetList = homeBetting;
      return this.rugbyCdsResult;
    }
    else {
      const errorMessage = 'Could not find rugby Content for Url - ' + this.cdsPushService.fixtureViewUrl;
      this.errorService.setError(errorMessage);
    }

  }

  prepareMatchBetting(rugbyCdsResult: RugbyCdsTemplateResult, x: Game) {
    this.homePlayerName = !!x.results[0] ? x.results[0]?.name?.value?.toUpperCase() : "";
    this.awayPlayerName = !!x?.results[2] ? x?.results[2]?.name?.value?.toUpperCase() : "";
    rugbyCdsResult?.games?.push(
      {
        id: x.id,
        gameName: x.name?.value?.toUpperCase(),
        isMatchBetting: true,
        matchBetting: {
          homePrice: SportBookMarketHelper.getCdsPriceStr(x?.results[0]?.visibility, x?.results[0]?.numerator, x?.results[0]?.denominator),
          homePlayer: !!x.results[0] ? x.results[0]?.name?.value?.toUpperCase() : "",
          drawPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[1]?.visibility, x?.results[1]?.numerator, x?.results[1]?.denominator),
          drawPlayer: !!x?.results[1] ? x?.results[1]?.name?.value?.toUpperCase() : "",
          awayPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[2]?.visibility, x?.results[2]?.numerator, x?.results[2]?.denominator),
          awayPlayer: !!x?.results[2] ? x?.results[2]?.name?.value?.toUpperCase() : ""
        }
      })
  }

  prepareHandicapBetting(rugbyCdsResult: RugbyCdsTemplateResult, x: Game) {
    rugbyCdsResult?.games?.push(
      {
        id: x.id,
        gameName: x.name?.value?.toUpperCase(),
        isHandicapBetting: true,
        handicapBetting: {
          homePrice: SportBookMarketHelper.getCdsPriceStr(x?.results[0]?.visibility, x?.results[0]?.numerator, x?.results[0]?.denominator),
          homePlayer: !!x?.results[1] ? this.getPlayerName(x.results[0]?.name.value) : "",
          awayPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[1]?.visibility, x?.results[1]?.numerator, x?.results[1]?.denominator),
          awayPlayer: !!x?.results[1] ? this.getPlayerName(x.results[1]?.name.value) : "",
        }
      })
  }

  prepareTotalPointsBetting(rugbyCdsResult: RugbyCdsTemplateResult, x: Game) {
    rugbyCdsResult?.games?.push(
      {
        id: x.id,
        gameName: x.name?.value?.toUpperCase(),
        isTotalPointsBetting: true,
        totalPointsBetting: {
          homePrice: SportBookMarketHelper.getCdsPriceStr(x?.results[0]?.visibility, x?.results[0]?.numerator, x?.results[0]?.denominator),
          homePlayer: !!x.results[0] ? x.results[0]?.name?.value?.replace(',', '.')?.toUpperCase() : "",
          awayPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[1]?.visibility, x?.results[1]?.numerator, x?.results[1]?.denominator),
          awayPlayer: !!x?.results[1] ? x?.results[1]?.name?.value?.replace(',', '.')?.toUpperCase() : ""
        }
      })
  }

  prepareFirstMatchHandicapBetting(rugbyCdsResult: RugbyCdsTemplateResult, x: Game) {
    rugbyCdsResult?.games?.push(
      {
        id: x.id,
        gameName: x.name?.value?.toUpperCase(),
        isFirstHanicapBetting: true,
        firstHanicapBetting: {
          homePrice: SportBookMarketHelper.getCdsPriceStr(x?.results[0]?.visibility, x?.results[0]?.numerator, x?.results[0]?.denominator),
          homePlayer: !!x?.results[1] ? this.getPlayerName(x.results[0]?.name.value) : "",
          awayPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[1]?.visibility, x?.results[1]?.numerator, x?.results[1]?.denominator),
          awayPlayer: !!x?.results[1] ? this.getPlayerName(x.results[1]?.name.value) : "",
        }
      })
  }

  prepareHalfFullBetting(rugbyCdsResult: RugbyCdsTemplateResult, x: Game) {
    this.halfFullBettingList.allScorerList = new Array<BetDetails>();
    let topAwayRunscorer = this.gantryMarkets?.find(x => x.sport == Sports.CdsRugby)?.markets?.find(y => y.matches?.includes(RugbyCdsTemplateIds.halfTimeFullTimeLeague) || y.matches?.includes(RugbyCdsTemplateIds.halfTimeFullTimeUnion))
    if (!!topAwayRunscorer && topAwayRunscorer?.matches?.includes(x?.templateId?.toString())) {
      x.results?.forEach((Selection) => {
        let betDetails = new BetDetails();
        betDetails.betName = Selection.name.value?.toUpperCase();
        betDetails.betOdds = SportBookMarketHelper.getCdsPriceStr(Selection?.visibility, Selection?.numerator, Selection?.denominator);
        this.halfFullBettingList.allScorerList.push(betDetails);
      })

      rugbyCdsResult?.games?.push(
        {
          id: x.id,
          gameName: x.name?.value?.toUpperCase(),
          isHalfFullBetting: true,
          halfFullBetting: this.halfFullBettingList.allScorerList
        })
    }
  }

  getPlayerName(playerName: string): string {
    let selectionName = "";
    if (!!playerName) {
      let teamSelectionItems = playerName?.replace(/\s/g, ""); //Remove all spaces from SelectonName
      //Ex: "selectionName":"Neil Robertson 10-2"
      //Res: "NeilRobertson10-2"
      let selectScoreNumber = teamSelectionItems?.trim()?.substr(teamSelectionItems.length - 5)?.replace(',', '.'); //We take last 5 characters from teamSelectionItems
      //Ex: "NeilRobertson10-2"
      //Res:10-2
      let scoreNumber = !!selectScoreNumber?.split(')')[1]?.trim() ? selectScoreNumber?.split(')')[1]?.trim() : selectScoreNumber?.replace(/[^\d.+-]/g, '');  //Remove alphabets from selectScoreNumber
      //Ex: "ON10-2"
      //Res:10-2
      //Final Response :10-2
      let splitSelectionName = playerName?.replace(/\(.*?\)/g, "");
      if (splitSelectionName?.includes('-')) {
        splitSelectionName = StringHelper.checkSelectionNameLengthAndTrimEnd(splitSelectionName?.split('-')[0], SelectionNameLength.Seventeen);
      }
      else if (splitSelectionName?.includes('+')) {
        splitSelectionName = StringHelper.checkSelectionNameLengthAndTrimEnd(splitSelectionName?.split('+')[0], SelectionNameLength.Seventeen);
      }
      selectionName = splitSelectionName?.toUpperCase() + " " + scoreNumber;
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

  public GetUpdatedRugbyCdsContent(messageEnvelope: MessageEnvelope): RugbyCdsTemplateResult {
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
      return this.getRugbyCdsResult(this.fixtureData, this.gantryMarkets);
    }
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
