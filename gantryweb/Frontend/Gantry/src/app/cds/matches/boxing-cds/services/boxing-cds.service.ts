import { Injectable } from '@angular/core';
import { BoxingCdsContent, BoxingContentParams, FinalResult, Game, IndividualBetting, MethodOfVictory, Result, RoundGroupBetting } from '../models/boxing-cds-content.model';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay, tap } from 'rxjs';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { MessageEnvelope } from '@cds/push';
import { CdsPushConstants } from 'src/app/common/cds-client/models/cds-push-updates.constant';
import { BoxingCdsTemplateIds, RoundBetting, SelectionName, titleFilter } from '../models/boxing-cds-constants.model';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { groupBy } from 'lodash';
import { ErrorService } from "src/app/common/services/error.service";
import { Log, LogType, LoggerService } from 'src/app/common/services/logger.service';
import { Markets, Sports } from 'src/app/common/models/gantrymarkets.model';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';

@Injectable({
  providedIn: 'root'
})
export class BoxingCdsService {
  boxingCdsContent: BoxingCdsContent = new BoxingCdsContent();
  fixtureData$: Observable<FixtureView>;
  boxingContentFromSitecore$: Observable<BoxingContentParams>;
  boxingCdsContent$: Observable<BoxingCdsContent>;
  errorMessage$ = this.errorService.errorMessage$;
  gantryMarkets$: Observable<Array<Markets>>;
  gantryMarkets: Array<Markets>;
  fixtureData: FixtureView;
  constructor(
    private cdsPushService: CdsClientService,
    private errorService: ErrorService,
    private loggerService: LoggerService,
    private gantryMarketsService: GantryMarketsService,
    private sportContentService: SportContentService
  ) { }


  public getFixtureViewData(fixtureId: any, marketId: any, gameIds: any) {
    return this.cdsPushService.getFixture_View(fixtureId, '', gameIds);
  }

  public GetBoxingCdsContent(fixtureId: any, marketId: any, gameIds: any) {
    this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, gameIds);
    this.boxingContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.boxingCds)
    this.gantryMarkets$ = this.getGantryMarketDataContent();
    this.boxingCdsContent$ = combineLatest([this.fixtureData$, this.boxingContentFromSitecore$, this.gantryMarkets$]).
      pipe(
        map(([fixtureData, contentFromSitecore, gantryMarkets]) => {
          if (!!fixtureData && fixtureData?.fixture) {
            this.fixtureData = fixtureData;
            this.gantryMarkets = gantryMarkets;
            this.boxingCdsContent.content = contentFromSitecore;
            this.boxingCdsContent = this.getBoxingCdsContent(fixtureData, this.gantryMarkets);
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
          }
          else {
            throw 'Could not find Boxing Content for Url - ' + this.cdsPushService.fixtureViewUrl;
          }
          return this.boxingCdsContent;
        }),
        catchError(err => {
          this.errorService.logError(err);
          this.logError(err, 'Error');
          return EMPTY;
        })
      ), shareReplay()
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

  public GetUpdatedBoxingCdsContent(messageEnvelope: MessageEnvelope): BoxingCdsContent {
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
      return this.getBoxingCdsContent(this.fixtureData, this.gantryMarkets);
    }
  }

  private getTitleNameFromSelection(name: string) {
    let _name = name?.toLowerCase();
    if (_name?.includes(titleFilter.TechnicalDecision.toLowerCase())) {
      return titleFilter.TechnicalDecision?.toUpperCase().replaceAll('/', ' / ')
    } else if (_name?.includes(titleFilter.OnPoints.toLowerCase())) {
      return titleFilter.OnPoints?.toUpperCase()
    }
  }

  private extractNumbersFromString(inputString: string): string {
    if (inputString) {
      const regexMatch = inputString.match(/\d+-\d+/);
      return regexMatch ? regexMatch[0] : "";
    } else {
      return "";
    }
  }

  getIndividualRoundBettingData(arr: Result[]): IndividualBetting {
    const updateRoundNames = arr.map((item: Result) => {
      let splitName = [];
      let updatedName = '';
      if (item?.name?.value?.toLowerCase()?.includes(RoundBetting.POINTSNAME)) {
        updatedName = item?.name?.value?.toLowerCase()?.slice(item?.name?.value?.toLowerCase()?.indexOf(RoundBetting.POINTSNAME));
        updatedName = updatedName?.toLowerCase()?.includes(SelectionName.POINTSNAME?.toLowerCase()) ? updatedName : `${updatedName} ${SelectionName.POINTSNAME}`
      } else {
        splitName = item?.name?.value?.split(' ');
        updatedName = splitName[splitName?.length - 2] + ' ' + splitName[splitName?.length - 1];
      }
      if (updatedName.includes(RoundBetting.ROUND) || updatedName.includes(RoundBetting.POINTSNAME)) {
        return {
          betName: updatedName.toUpperCase(),
          betOdds: SportBookMarketHelper.getCdsPriceStr(item?.visibility, item?.numerator, item?.denominator),
        }

      }
    })
    const roundBettingBetName = groupBy(updateRoundNames, RoundBetting.BETNAME);
    const homeTeamListDetails = Object.values(roundBettingBetName)?.map(details => details?.length && details[0]);
    const awayTeamListDetails = Object.values(roundBettingBetName)?.map(details => details?.length && details[1]);
    return {
      homeTeamListDetails,
      awayTeamListDetails,
      marketTitle: this.boxingCdsContent?.content?.contentParameters?.RoundBetting,
    }
  }

  getFightBettingData = (game: Game): FinalResult => {
    return {
      id: game.id,
      gameName: game.name?.value?.toUpperCase(),
      selections: [{
        homePrice: SportBookMarketHelper.getCdsPriceStr(game?.results?.[0]?.visibility, game?.results?.[0]?.numerator, game?.results?.[0]?.denominator),
        homeSelectionTitle: StringHelper.getCdsFixtureTitle(game?.results?.[0].name?.value?.toUpperCase()?.replace(',', '.')),
        awayPrice: SportBookMarketHelper.getCdsPriceStr(game?.results?.[2]?.visibility, game?.results?.[2]?.numerator, game?.results?.[2]?.denominator),
        awaySelectionTitle: StringHelper.getCdsFixtureTitle(game?.results?.[2]?.name?.value?.toUpperCase()?.replace(',', '.')),
        drawTitle: game?.results?.[1].name?.value?.replace(',', '.'),
        drawPrice: SportBookMarketHelper.getCdsPriceStr(game?.results?.[1]?.visibility, game?.results?.[1]?.numerator, game?.results?.[1]?.denominator),
      }]
    }
  }

  getRoundGroupBetting = (game: Game): RoundGroupBetting => {
    return {
      id: game.id,
      gameName: game.name?.value?.toUpperCase(),
      selections: [
        {
          homePrice: SportBookMarketHelper.getCdsPriceStr(game?.results?.[0]?.visibility, game?.results?.[0]?.numerator, game?.results?.[0]?.denominator),
          name: this.extractNumbersFromString(game?.results?.[0]?.name?.value),
          awayPrice: SportBookMarketHelper.getCdsPriceStr(game?.results?.[5]?.visibility, game?.results?.[5]?.numerator, game?.results?.[5]?.denominator)
        },
        {
          homePrice: SportBookMarketHelper.getCdsPriceStr(game?.results?.[1]?.visibility, game?.results?.[1]?.numerator, game?.results?.[1]?.denominator),
          name: this.extractNumbersFromString(game.results?.[1].name?.value),
          awayPrice: SportBookMarketHelper.getCdsPriceStr(game?.results?.[6]?.visibility, game?.results?.[6]?.numerator, game?.results?.[6]?.denominator)
        },
        {
          homePrice: SportBookMarketHelper.getCdsPriceStr(game?.results?.[2]?.visibility, game?.results?.[2]?.numerator, game?.results?.[2]?.denominator),
          name: this.extractNumbersFromString(game?.results?.[2]?.name?.value),
          awayPrice: SportBookMarketHelper.getCdsPriceStr(game?.results?.[7]?.visibility, game?.results?.[7]?.numerator, game?.results?.[7]?.denominator)
        },
        {
          homePrice: SportBookMarketHelper.getCdsPriceStr(game?.results?.[3]?.visibility, game?.results?.[3]?.numerator, game?.results?.[3]?.denominator),
          name: this.extractNumbersFromString(game?.results?.[3]?.name?.value),
          awayPrice: SportBookMarketHelper.getCdsPriceStr(game?.results?.[8]?.visibility, game?.results?.[8]?.numerator, game?.results?.[8]?.denominator)
        },
      ],

    }
  }

  getMethodOfVictory = (game: Game): MethodOfVictory => {
    return {
      id: game.id,
      gameName: game.name?.value?.toUpperCase(),
      selections: [
        {
          homePrice: SportBookMarketHelper.getCdsPriceStr(game?.results?.[1]?.visibility, game?.results?.[1]?.numerator, game?.results?.[1]?.denominator),
          name: this.getTitleNameFromSelection(game?.results?.[1]?.name?.value) + ' ' + SelectionName.POINTSNAME,
          awayPrice: SportBookMarketHelper.getCdsPriceStr(game?.results?.[3]?.visibility, game?.results?.[3]?.numerator, game?.results?.[3]?.denominator)
        },
        {
          homePrice: SportBookMarketHelper.getCdsPriceStr(game?.results?.[0]?.visibility, game?.results?.[0]?.numerator, game?.results?.[0]?.denominator),
          name: this.getTitleNameFromSelection(game.results?.[0]?.name?.value?.toUpperCase()),
          awayPrice: SportBookMarketHelper.getCdsPriceStr(game?.results?.[2]?.visibility, game?.results?.[2]?.numerator, game?.results?.[2]?.denominator)
        },
      ],
      marketName: game?.name?.value?.toUpperCase(),
      marketDisplayTitle: game?.name?.value?.toUpperCase(),
    }
  }
  public getBoxingCdsContent(fixture: FixtureView, gantryMarkets: Array<Markets>): BoxingCdsContent {
    if (!!fixture && fixture?.fixture && fixture?.fixture?.games?.length > 0) {
      if (this.errorService.isStaleDataAvailable) {
        this.errorService.unSetError();
      }
      this.boxingCdsContent.sportName = fixture?.fixture?.sport?.name?.value?.toUpperCase();
      this.boxingCdsContent.title = StringHelper.getCdsFixtureTitle(fixture?.fixture?.name?.value?.toUpperCase());
      this.boxingCdsContent.eventStartDate = fixture?.fixture?.startDate;
      this.boxingCdsContent.competitionName = fixture?.fixture?.competition?.name?.value;
      this.boxingCdsContent.context = fixture?.fixture?.context;
      this.boxingCdsContent.games = []

      const gamesArray = fixture?.fixture?.games;
      if (gamesArray?.length) {
        this.boxingCdsContent.finalResult = new FinalResult();
        this.boxingCdsContent.roundGroupBetting = new RoundGroupBetting();
        this.boxingCdsContent.methodOfVictory = new MethodOfVictory();
        this.boxingCdsContent.individualRoundBetting = new IndividualBetting();
      }

      gamesArray?.map(game => {
        let fightBetting = gantryMarkets?.find(x => x.sport == Sports.CdsBoxing)?.markets?.find(y => y.matches?.includes(BoxingCdsTemplateIds.FIGHTBETTING))
        if (!!fightBetting && fightBetting?.matches?.includes(game?.templateId?.toString())) {
          this.boxingCdsContent.finalResult = this.getFightBettingData(game);
        }

        let roundGroupBetting = gantryMarkets?.find(x => x.sport == Sports.CdsBoxing)?.markets?.find(y => y.matches?.includes(BoxingCdsTemplateIds.ROUNDGROUPBETTING))
        if (!!roundGroupBetting && roundGroupBetting?.matches?.includes(game?.templateId?.toString())) {
          this.boxingCdsContent.roundGroupBetting = this.getRoundGroupBetting(game);
        }

        let methodOfVictory = gantryMarkets?.find(x => x.sport == Sports.CdsBoxing)?.markets?.find(y => y.matches?.includes(BoxingCdsTemplateIds.METHODOFVICTORY))
        if (!!methodOfVictory && methodOfVictory?.matches?.includes(game?.templateId?.toString())) {
          this.boxingCdsContent.methodOfVictory = this.getMethodOfVictory(game);
        }

        let individualRoundBetting = gantryMarkets?.find(x => x.sport == Sports.CdsBoxing)?.markets?.find(y => y.matches?.includes(BoxingCdsTemplateIds.ROUNDBETTING))
        if (!!individualRoundBetting && individualRoundBetting?.matches?.includes(game?.templateId?.toString())) {
          this.boxingCdsContent.individualRoundBetting = this.getIndividualRoundBettingData(game?.results);
        }
      })
      return this.boxingCdsContent;
    }
    else {
      const errorMessage = 'Could not find Boxing Content for Url - ' + this.cdsPushService.fixtureViewUrl;
      this.errorService.setError(errorMessage);
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
