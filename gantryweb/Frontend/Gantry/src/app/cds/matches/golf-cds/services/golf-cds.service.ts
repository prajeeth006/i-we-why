import { Injectable } from '@angular/core';
import { BetDetails, GameDetails, GolfCdsTemplateResult, GolfContentParams, GolfData } from '../models/golf-cds-template.model';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay } from 'rxjs';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';
import { ErrorService } from 'src/app/common/services/error.service';
import { Log, LogType, LoggerService } from 'src/app/common/services/logger.service';
import { Fixtures } from 'src/app/common/cds-client/models/fixture.model';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { MessageEnvelope } from '@cds/push';
import { CdsPushConstants } from 'src/app/common/cds-client/models/cds-push-updates.constant';
import { EventDatetimePipe } from 'src/app/common/pipes/event-datetime.pipe';

@Injectable({
  providedIn: 'root'
})
export class GolfCdsService {

  golfCdsResult: GolfCdsTemplateResult = new GolfCdsTemplateResult();
  fixtureData$: Observable<Fixtures>;
  golfContentFromSitecore$: Observable<GolfContentParams>;
  golfCdsContent$: Observable<GolfCdsTemplateResult>;
  fixtureData: Fixtures;
  errorMessage$ = this.errorService.errorMessage$;
  gantryCommonContent: GolfContentParams

  constructor(
    private cdsPushService: CdsClientService,
    private sportContentService: SportContentService,
    private errorService: ErrorService,
    private loggerService: LoggerService,
    private eventDatetimePipe: EventDatetimePipe) {
  }

  public GetGolfCdsContent(fixtureId: any, marketId: any, gameIds: any) {
    this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, gameIds);
    this.golfContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.commonContent);
    this.golfCdsContent$ = combineLatest([this.fixtureData$, this.golfContentFromSitecore$]).
      pipe(
        map(([fixtureData, contentFromSitecore]) => {
          if (!!fixtureData && fixtureData?.fixtures?.length) {
            this.fixtureData = fixtureData;
            this.golfCdsResult.content = contentFromSitecore;
            this.golfCdsResult = this.getGolfCdsContent(fixtureData);
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
          }
          else {
            throw 'Could not find golf data for Url - ' + this.cdsPushService.fixturesUrl;
          }
          return this.golfCdsResult;
        }),
        catchError(err => {
          this.errorService.setError(err);
          this.logError(err, 'Error');
          return EMPTY;
        })
      ), shareReplay()
  }

  public getFixtureViewData(fixtureId: any, marketId: any, gameIds: any) {
    return this.cdsPushService.getFixtures(fixtureId, marketId, gameIds);
  }


  public getGolfCdsContent(fixtureData: Fixtures): GolfCdsTemplateResult {
    if (!!fixtureData && fixtureData?.fixtures?.length > 0) {
      if (this.errorService.isStaleDataAvailable) {
        this.errorService.unSetError();
      }
      let golfResult = new GolfData();
      let golfRunnerDetails: GameDetails[] = [];

      golfRunnerDetails = this.getGolfRunnersDetails(fixtureData, this.golfCdsResult);
      if (golfRunnerDetails?.length) {
        if (this.errorService.isStaleDataAvailable) {
          this.errorService.unSetError();
        }
        golfResult.gameDetails = golfRunnerDetails;
        this.golfCdsResult.golfData = golfResult;
      }
      else {
        const errorMessage = 'Could not find golf Content for Url - ' + this.cdsPushService.fixturesUrl;
        this.errorService.setError(errorMessage);
      }

      this.golfCdsResult.eventDateTimeInputValue = this?.getGolfEventTimeDateFromPipe(
        golfResult.gameDetails, this.golfCdsResult?.content?.contentParameters?.EventTimeInfo, this.golfCdsResult?.content);
    }
    else {
      const errorMessage = 'Could not find golf Content for Url - ' + this.cdsPushService.fixturesUrl;
      this.errorService.setError(errorMessage);
    }
    return this.golfCdsResult;
  }

  getGolfRunnersDetails = (fixtureData: Fixtures, golfCdsTemplateResult: GolfCdsTemplateResult) => {
    if (!!fixtureData) {
      const golfDetails: GameDetails[] = [];
      fixtureData?.fixtures?.map((fixture: any) => {
        if (!!fixture?.sport) {
          golfCdsTemplateResult.sportName = fixture?.sport?.name?.value?.toUpperCase();
        }
        if (!!fixture) {
          golfCdsTemplateResult.eventStartDate = fixture?.startDate;
        }
        if (!!fixture?.competition) {
          golfCdsTemplateResult.competitionName = fixture?.competition?.name?.value?.toUpperCase();
        }
        let RunsList = new Array<BetDetails>();
        fixture?.games?.map((game: any) => {
          golfCdsTemplateResult.title = game?.name?.value?.toUpperCase();
          game.results?.forEach((runners: any) => {
            let betDetails = new BetDetails();
            betDetails.betName = StringHelper.RemoveCountryCodeInSelectionName(runners.name.value);
            betDetails.betOdds = SportBookMarketHelper.getCdsPriceStr(runners?.visibility, runners?.numerator, runners?.denominator);
            RunsList?.push(betDetails);
          })
          this.sortRunScorerList(RunsList)
          // prepare golf selections
          golfDetails.push({
            gameStartTime: new Date(fixture?.startDate),
            runnerDetails: RunsList,

          })
        })
      })

      this.sortingByGolfEvent(golfDetails);
      return golfDetails;
    }
  }

  public GetUpdateGolfDataContent(messageEnvelope: MessageEnvelope): GolfCdsTemplateResult {
    var marketIndex = 0;
    var gameIndex = 0;
    if (!!messageEnvelope?.messageType) {
      if (messageEnvelope.messageType == CdsPushConstants.gameUpdate) {
        if (!!messageEnvelope?.payload?.game?.id) {
          marketIndex = this.fixtureData?.fixtures?.findIndex(x => x.id == messageEnvelope?.payload?.fixtureId);
          if (marketIndex != -1) {
            gameIndex = this.fixtureData?.fixtures[marketIndex]?.games?.findIndex(y => y.id == messageEnvelope?.payload?.game?.id);
            if (gameIndex != -1) {
              this.fixtureData.fixtures[marketIndex].games[gameIndex] = messageEnvelope?.payload?.game;
            }
            else {
              this.fixtureData.fixtures[marketIndex].games?.push(messageEnvelope?.payload?.game);
            }
          }

        }
      }
      else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
        marketIndex = this.fixtureData?.fixtures?.findIndex(x => x.id == messageEnvelope?.payload?.fixtureId);
        if (marketIndex != -1) {

          this.fixtureData.fixtures[marketIndex].startDate = messageEnvelope?.payload?.startDate;
        }
      }
      else if (messageEnvelope.messageType == CdsPushConstants.gameDelete) {
        if (!!messageEnvelope?.payload?.gameId) {
          marketIndex = this.fixtureData?.fixtures?.findIndex(x => x.id == messageEnvelope?.payload?.fixtureId);
          if (marketIndex != -1) {
            gameIndex = this.fixtureData?.fixtures[marketIndex]?.games?.findIndex(y => y.id == messageEnvelope?.payload?.gameId);
            if (gameIndex != -1) {
              this.fixtureData.fixtures[marketIndex].games.splice(gameIndex, 1);
            }
          }
          else {
            this.fixtureData?.fixtures?.splice(marketIndex, 1);
          }
        }

      }
      return this.getGolfCdsContent(this.fixtureData);
    }
  }

  sortingByGolfEvent(golfEventData: GameDetails[]) {
    golfEventData?.sort((b, a) => {
      return new Date(b?.gameStartTime)?.getTime() - new Date(a?.gameStartTime)?.getTime();
    })
  }

  private sortRunScorerList(topRunScorerList: Array<BetDetails>) {
    if (topRunScorerList?.length > 1) {
      topRunScorerList?.sort(
        function (first, second) {
          let firstNumber = GolfCdsService.getPriceFromOdds(first?.betOdds);
          let secondNumber = GolfCdsService.getPriceFromOdds(second?.betOdds);
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

  getGolfEventTimeDateFromPipe(golfEvent: GameDetails[], eventTimeInfo: string, gantryCommonContent: GolfContentParams): string {
    const timeFormat: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      timeStyle: 'short'
    }
    if (!!golfEvent && golfEvent?.length > 1) {
      if (new Date(golfEvent[0]?.gameStartTime).getDate() != new Date(golfEvent[golfEvent?.length - 1].gameStartTime).getDate()
        || new Date(golfEvent[0]?.gameStartTime).getMonth() != new Date(golfEvent[golfEvent?.length - 1].gameStartTime).getMonth()
        || new Date(golfEvent[0]?.gameStartTime).getFullYear() != new Date(golfEvent[golfEvent?.length - 1].gameStartTime).getFullYear()) {
        return `${this.eventDatetimePipe.transform(eventTimeInfo, golfEvent[0]?.gameStartTime, gantryCommonContent, timeFormat, true)} - ${this.eventDatetimePipe.transform(eventTimeInfo, golfEvent.slice(-1)[0]?.gameStartTime, gantryCommonContent, timeFormat, true)}`;
      }
      else {
        if (!!golfEvent[0]) {
          return `${this.eventDatetimePipe.transform(eventTimeInfo, golfEvent[0]?.gameStartTime, gantryCommonContent, timeFormat, true)}`;
        }

      }
    }
    else {
      if (!!golfEvent) {
        if (!!golfEvent[0]) {
          return `${this.eventDatetimePipe.transform(eventTimeInfo, golfEvent[0]?.gameStartTime, gantryCommonContent, timeFormat, true)}`;
        }
      }


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
