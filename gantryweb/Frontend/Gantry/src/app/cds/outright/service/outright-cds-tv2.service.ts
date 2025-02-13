import { Injectable } from '@angular/core';
import { FinalResult, Game, OutRightCdsContent, OutRightContentParams, Result, Selections } from '../models/outright-cds.model';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay } from 'rxjs';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { Log, LogType, LoggerService } from 'src/app/common/services/logger.service';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';
import { MessageEnvelope } from '@cds/push';
import { CdsPushConstants } from 'src/app/common/cds-client/models/cds-push-updates.constant';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { MarketParameters } from '../models/market-parameters.model';
import { EventStatus } from 'src/app/common/models/general-codes-model';

@Injectable({
  providedIn: 'root'
})
export class OutrightCdsTv2Service {
  outRightCDSTv2Content: OutRightCdsContent = new OutRightCdsContent();
  fixtureData$: Observable<FixtureView>;
  outRightTv2ContentFromSitecore$: Observable<OutRightContentParams>;
  outRightCDSTv2Content$: Observable<OutRightCdsContent>;
  errorMessage$ = this.errorService.errorMessage$;
  fixtureData: FixtureView;

  constructor(private cdsPushService: CdsClientService,
    private errorService: ErrorService,
    private loggerService: LoggerService,
    private sportContentService: SportContentService) { }

  public getFixtureViewData(fixtureId: any, marketId: any, gameIds: any) {
    return this.cdsPushService.getFixture_View(fixtureId, marketId, gameIds);
  }

  public getOutRightCdsTv2Content(fixtureId: any, marketId: any, gameIds: any) {
    this.outRightTv2ContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.outrightCDS)
    this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, "");
    this.outRightCDSTv2Content$ = combineLatest([this.fixtureData$, this.outRightTv2ContentFromSitecore$]).
      pipe(
        map(([fixtureData, outrightCdsContent]) => {
          if (!!fixtureData && fixtureData?.fixture) {
            this.fixtureData = fixtureData;
            this.outRightCDSTv2Content.content = outrightCdsContent;
            this.outRightCDSTv2Content = this.getOutRightTv2Content(fixtureData);

            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
          } else {
            throw 'Could not find OutRight tv2 Content for Url - ' + this.cdsPushService.fixtureViewUrl;
          }
          return this.outRightCDSTv2Content;
        }),
        catchError(err => {
          this.errorService.logError(err);
          return EMPTY;
        })
      ), shareReplay()
  }

  public getOutRightTv2Content(fixture: FixtureView): OutRightCdsContent {
    this.outRightCDSTv2Content.sportName = fixture?.fixture?.sport?.name?.value?.toUpperCase();
    this.outRightCDSTv2Content.title = StringHelper.getCdsOutrightFixtureTitle(fixture?.fixture?.name?.value?.toUpperCase());
    this.outRightCDSTv2Content.eventStartDate = fixture?.fixture?.startDate;
    this.outRightCDSTv2Content.games = []
    const gamesArray = fixture?.fixture?.optionMarkets;

    gamesArray?.map(game => {
      if (!!game && game?.status?.toUpperCase() == EventStatus.Suspended) {
        const errorMessage = "This tournament has been Suspended : " + this.cdsPushService.fixtureViewUrl;
        this.errorService.setError(errorMessage);
      }
      else {
        if (this.errorService.isSnapshotDataAvailable) {
          this.errorService.unSetError();
        }
        this.outRightCDSTv2Content.finalResult = this.getOutrightSelectionData(game);
      }

    })
    return this.outRightCDSTv2Content;
  }

  public getUpdatedOutRightCdsTv2Content(messageEnvelope: MessageEnvelope): OutRightCdsContent {
    var marketIndex = 0;
    if (!!messageEnvelope.messageType) {
      if (messageEnvelope.messageType == CdsPushConstants.optionMarketUpdate) {
        if (!!messageEnvelope?.payload?.optionMarket?.id) {
          marketIndex = this.fixtureData?.fixture?.optionMarkets?.findIndex(x => x.id == messageEnvelope?.payload?.optionMarket?.id);
          if (marketIndex != -1) {
            this.fixtureData.fixture.optionMarkets[marketIndex] = messageEnvelope?.payload?.optionMarket;
          }
          else {
            this.fixtureData?.fixture?.optionMarkets?.push(messageEnvelope?.payload?.optionMarket);
          }
        }
      }
      else if (messageEnvelope.messageType == CdsPushConstants.optionMarketDelete) {
        marketIndex = this.fixtureData?.fixture?.optionMarkets?.findIndex(x => x.id == messageEnvelope?.payload?.optionMarket);
        this.fixtureData?.fixture?.optionMarkets?.splice(marketIndex, 1);
      }
      else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
        this.fixtureData.fixture.startDate = messageEnvelope?.payload?.startDate;
      }
      return this.getOutRightTv2Content(this.fixtureData);
    }
  }

  getOutrightSelectionData = (game: Game): FinalResult => {
    return {
      id: game.id,
      gameName: this.getMarketName(game),
      selections: this.prepareSelections(game?.options)
    }
  }

  prepareSelections = (results: Result[]): Selections[] => {
    let selections: Selections[] = results.map(result => {
      return {
        selectionPrice: SportBookMarketHelper.getCdsPriceStr(result?.status, result?.price?.numerator, result?.price?.denominator),
        selectionName: StringHelper.getCdsFixtureTitle(result?.name?.value?.toUpperCase()?.replace(',', '.')),
      }
    });
    selections = SportBookMarketHelper.sortSelectionsByPrice(selections)
    let activeSelections = StringHelper.getValidSelections(selections)
    return activeSelections;
  }

  getMarketName(game: Game) {
    let skippedMarkets = {};
    let marketName = '';
    let getXValue: number;
    let marketParameters: MarketParameters = new MarketParameters();
    let marketDetails = this.outRightCDSTv2Content?.content?.contentParameters?.Football;
    if (!!marketDetails) {
      let footballMarketDetails = JSON.parse(marketDetails)[0];
      game?.parameters?.forEach(parameter => {
        marketParameters[parameter.key] = parameter.value;
        getXValue = marketParameters.Places;
      })

      for (let market in footballMarketDetails) {
        let marketData = footballMarketDetails[market];
        if (!!marketData?.MarketType && marketParameters?.MarketType === marketData.MarketType) {
          if (!!marketData?.MarketSubType && marketParameters?.MarketSubType === marketData.MarketSubType) {
            marketName = market;
            break;
          } else {
            skippedMarkets[market] = marketData;
          }
        }
      }
    }

    if (!marketName) {
      for (let market in skippedMarkets) {
        let marketData = skippedMarkets[market];
        if (!!marketData?.MarketType && marketParameters?.MarketType === marketData.MarketType) {
          if (!!marketData.Position && marketParameters?.Position === marketData.Position) {
            marketName = market;
            break;
          }
        }
      }
    }
    const findXValue = marketName?.slice(-1);
    if (findXValue == '$') {
      let newMarketName = marketName?.replace("$", getXValue?.toString());
      marketName = newMarketName;
    }
    return marketName?.toUpperCase();
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
