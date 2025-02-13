import { Injectable } from '@angular/core';
import { FinalResult, Game, OutRightCdsContent, OutRightContentParams, Result, Selections, SeriesCorrectScore } from '../models/outright-cds.model';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay, tap } from 'rxjs';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { Markets } from 'src/app/common/models/gantrymarkets.model';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { Log, LogType, LoggerService } from 'src/app/common/services/logger.service';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';
import { MessageEnvelope } from '@cds/push';
import { CdsPushConstants } from 'src/app/common/cds-client/models/cds-push-updates.constant';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';

@Injectable({
  providedIn: 'root'
})
export class OutrightCdsService {

  outRightCDSContent: OutRightCdsContent = new OutRightCdsContent();
  fixtureData$: Observable<FixtureView>;
  outRightContentFromSitecore$: Observable<OutRightContentParams>;
  outRightCDSContent$: Observable<OutRightCdsContent>;
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

  public GetOutRightCdsContent(fixtureId: any, marketId: any, gameIds: any) {
    this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, gameIds);
    this.outRightContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.outrightCds)
    this.gantryMarkets$ = this.getGantryMarketDataContent();
    this.outRightCDSContent$ = combineLatest([this.fixtureData$, this.outRightContentFromSitecore$, this.gantryMarkets$]).
      pipe(
        map(([fixtureData, contentFromSitecore, gantryMarkets]) => {
          if (!!fixtureData && fixtureData?.fixture) {
            this.fixtureData = fixtureData;
            this.gantryMarkets = gantryMarkets;
            this.outRightCDSContent = this.getOutRightCdsContent(fixtureData, this.gantryMarkets);
            this.outRightCDSContent.content = contentFromSitecore;
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
          }
          else {
            throw 'Could not find OutRight Content for Url - ' + this.cdsPushService.fixtureViewUrl;
          }
          return this.outRightCDSContent;
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

  public GetUpdatedOutRightCdsContent(messageEnvelope: MessageEnvelope): OutRightCdsContent {
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
      this.errorService.unSetError();
      if (!this.fixtureData?.fixture?.games || this.fixtureData?.fixture?.games?.length === 0) {
        const errorMessage = "No games available for Url: " + this.cdsPushService.fixtureViewUrl;
        this.errorService.logError(errorMessage);
        this.errorService.setError(errorMessage);
      }

      return this.getOutRightCdsContent(this.fixtureData, this.gantryMarkets);
    }
  }

  prepareSelections = (results: Result[]): Selections[] => {
    let selections: Selections[] = results.map(result => {
      return {
        selectionPrice: SportBookMarketHelper.getCdsPriceStr(result?.visibility, result?.numerator, result?.denominator),
        selectionName: StringHelper.getCdsFixtureTitle(result?.name?.value?.toUpperCase()?.replace(',', '.')),
      }
    });

    selections = SportBookMarketHelper.sortSelectionsByPrice(selections)
    let activeSelections = StringHelper.getValidSelections(selections)
    return activeSelections;
  }

  prepareSeriesCorrectScore = (results: Result[]): Selections[] => {
    let selections: Selections[] = results.map(result => {
      return {
        selectionPrice: SportBookMarketHelper.getCdsPriceStr(result?.visibility, result?.numerator, result?.denominator),
        selectionName: result?.name?.value?.toUpperCase()?.replace(',', '.'),
      }
    });

    selections = SportBookMarketHelper.sortSelectionsByPrice(selections)
    let activeSelections = StringHelper.getValidSelections(selections)

    return activeSelections;
  }

  getOutrightSelectionData = (game: Game, typeId?: number): FinalResult => {
    return {
      id: game.id,
      gameName: this.outRightCDSContent?.content?.contentParameters[typeId]?.toUpperCase(),
      selections: this.prepareSelections(game?.results)
    }
  }

  getSeriesCorrectScore = (game: Game, typeId?: number): SeriesCorrectScore => {
    return {
      id: game.id,
      gameName: this.outRightCDSContent?.content?.contentParameters[typeId]?.toUpperCase(),
      selections: this.prepareSeriesCorrectScore(game?.results)
    }
  }

  public getOutRightCdsContent(fixture: FixtureView, gantryMarkets: Array<Markets>, typeId?: string): OutRightCdsContent {
    this.outRightCDSContent.sportName = fixture?.fixture?.sport?.name?.value?.toUpperCase();
    this.outRightCDSContent.title = StringHelper.getCdsOutrightFixtureTitle(fixture?.fixture?.name?.value?.toUpperCase());
    this.outRightCDSContent.eventStartDate = fixture?.fixture?.startDate;
    this.outRightCDSContent.games = []
    this.outRightCDSContent.typeId = fixture?.fixture?.games[0]?.templateId;
    const gamesArray = fixture?.fixture?.games;

    gamesArray?.map(game => {
      this.outRightCDSContent.finalResult = game?.name?.value === this.outRightCDSContent?.content?.contentParameters?.seriesCorrectScore ? this.getSeriesCorrectScore(game) : this.getOutrightSelectionData(game, this.outRightCDSContent?.typeId);
    })

    return this.outRightCDSContent;
  }

  logError(message: string, status: string, fatal: boolean = false) {
    let errorLog: Log = {
      level: LogType.Error,
      message: message,
      status: status,
      fatal: fatal
    };
    this.loggerService?.log(errorLog);
  }

}
