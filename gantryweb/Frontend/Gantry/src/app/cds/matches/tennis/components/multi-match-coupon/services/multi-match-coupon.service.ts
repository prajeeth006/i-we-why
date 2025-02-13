import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay } from 'rxjs';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { Fixtures, Result } from 'src/app/common/cds-client/models/fixture.model';
import { GantryCommonContent } from 'src/app/common/models/gantry-commom-content.model';
import { GantryCommonContentService } from 'src/app/common/services/gantry-common-content.service';
import { HomeAway, HomeAwayData, HomeAwayResult, HomeAwaySelection, TennisContentParams } from '../../../models/multi-match-model';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { ErrorService } from 'src/app/common/services/error.service';
import { Log, LogType } from 'src/app/common/services/logger.service';
import { HomeDrawAwayService } from 'src/app/foot-ball/components/home-draw-away/services/home-draw-away/home-draw-away.service';
import { CdsPushConstants } from 'src/app/common/cds-client/models/cds-push-updates.constant';
import { MessageEnvelope } from '@cds/push';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';

@Injectable({
  providedIn: 'root'
})
export class MultiMatchCouponService {
  homeAndAwayResult: HomeAwayData = new HomeAwayData();
  fixtureData$: Observable<Fixtures>;
  gantryCommonContent$: Observable<GantryCommonContent>;
  multiMatchCouponCdsContent$: Observable<HomeAwayData>;
  tennisContent$: Observable<TennisContentParams>;
  loggerService: any;
  fixtureData: Fixtures;
  gantryCommonContent: GantryCommonContent

  constructor(private cdsPushService: CdsClientService,
    private gantryCommonContentService: GantryCommonContentService,
    private errorService: ErrorService,
    private homeDrawAwayService: HomeDrawAwayService,
    private sportContentService: SportContentService
  ) { }

  public getFixtureViewData(fixtureId: any, marketId: any, gameIds: any) {
    return this.cdsPushService.getFixtures(fixtureId, marketId, gameIds);
  }

  prepareSelection(selection: Result): HomeAwaySelection {
    let selectionObj = new HomeAwaySelection();
    selectionObj.price = SportBookMarketHelper.getCdsPriceStr(selection?.visibility, selection?.numerator, selection?.denominator);
    selectionObj.selectionName = selection?.name?.value?.toUpperCase();
    return selectionObj
  }

  getHomeAwayEvent = (fixtureData: Fixtures, homeAndAwayResult: HomeAwayData) => {
    if (!!fixtureData) {
      const homeAwayEvent: HomeAway[] = [];
      fixtureData?.fixtures?.map((fixture: any) => {
        if (!!fixture?.sport) {
          homeAndAwayResult.sportName = fixture?.sport?.name?.value?.toUpperCase();
          homeAndAwayResult.tournamentName = fixture?.tournament?.name?.value?.toUpperCase();
        }
        fixture?.games?.map((game: any) => {
          // prepare home & away selections
          homeAwayEvent.push({
            eventDateTime: new Date(fixture?.startDate),
            homeSelection: this.prepareSelection(game?.results?.[0]),
            awaySelection: this.prepareSelection(game?.results?.[1])
          })
        })
      })
      return homeAwayEvent;
    }
  }

  public getCdsContent(fixtureId: any, marketId: any, gameIds: any) {
    this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, gameIds);
    this.gantryCommonContent$ = this.gantryCommonContentService?.data$;
    this.tennisContent$ = this.sportContentService.getContent(ContentItemPaths.tennisCds);
    this.multiMatchCouponCdsContent$ = combineLatest([this.fixtureData$, this.gantryCommonContent$, this.tennisContent$]).
      pipe(
        map(([fixtureData, gantryCommonContent, tennisContent]) => {
          if (!!fixtureData && fixtureData?.fixtures?.length) {
            this.fixtureData = fixtureData;
            this.gantryCommonContent = gantryCommonContent;
            this.homeAndAwayResult.contentParameters = tennisContent?.contentParameters;
            this.homeAndAwayResult = this.getHomeAndAwayResult(fixtureData, gantryCommonContent);
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
          }
          else {
            throw 'Could not find TennisMultiMatchCoupon Content for Url - ' + this.cdsPushService.fixturesUrl;
          }
          return this.homeAndAwayResult;
        }),
        catchError(err => {
          this.errorService.setError(err);
          this.logError(err, 'Error');
          return EMPTY;
        }), shareReplay()
      );

  }


  public getHomeAndAwayResult(fixtureData: Fixtures, gantryCommonContent: GantryCommonContent) {
    if (!!fixtureData && fixtureData?.fixtures?.length) {
      if (this.errorService.isSnapshotDataAvailable) {
        this.errorService.unSetError();
      }
      let result = new HomeAwayResult();
      result.gantryCommonContent = gantryCommonContent;
      let homeAwayEvent: HomeAway[] = [];

      homeAwayEvent = this.getHomeAwayEvent(fixtureData, this.homeAndAwayResult);
      result.homeAwayEvent = homeAwayEvent;

      // get EventDateTime for the given selections
      if (result?.homeAwayEvent?.length) {
        if (this.errorService.isStaleDataAvailable) {
          this.errorService.unSetError();
        }
        result.homeAwayEvent = StringHelper.getTennisMultiMatchActiveSelections(result?.homeAwayEvent);
        StringHelper.sortTennisMultiMatchHomeAwayEvent(result?.homeAwayEvent);
        if (!!result?.gantryCommonContent) {
          this.homeAndAwayResult.eventDateTimeInputValue = this.homeDrawAwayService?.getTennisCouponEventTimeDateFromPipe(
            result?.homeAwayEvent, result?.gantryCommonContent?.contentParameters?.EventTimeInfo, result?.gantryCommonContent);
        }

        this.homeAndAwayResult.result = result;
      }
      else {
        const errorMessage = 'Could not find TennisMultiMatchCoupon Content for Url - ' + this.cdsPushService.fixturesUrl;
        this.errorService.setError(errorMessage);
      }
    }
    else {
      const errorMessage = 'Could not find TennisMultiMatchCoupon Content for Url - ' + this.cdsPushService.fixturesUrl;
      this.errorService.setError(errorMessage);
    }
    return this.homeAndAwayResult;
  }

  public GetUpdatedHomeDrawAwayContent(messageEnvelope: MessageEnvelope): HomeAwayData {
    var marketIndex = 0;
    var gameIndex = 0;
    if (!!messageEnvelope?.messageType) {
      if (messageEnvelope.messageType == CdsPushConstants.gameUpdate) {
        if (!!messageEnvelope?.payload?.game?.id) {
          marketIndex = this.fixtureData?.fixtures?.findIndex(x => x.id == messageEnvelope?.payload?.fixtureId);
          if (marketIndex != -1) {
            gameIndex = this.fixtureData.fixtures[marketIndex].games?.findIndex(y => y.id == messageEnvelope?.payload?.game?.id);
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
      return this.getHomeAndAwayResult(this.fixtureData, this.gantryCommonContent);
    }
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
