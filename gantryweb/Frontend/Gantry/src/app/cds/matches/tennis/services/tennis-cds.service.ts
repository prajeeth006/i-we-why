import { Injectable } from '@angular/core';
import { TennisCdsContent, TennisContentParams } from '../models/tennis-cds-content.model';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay, tap } from 'rxjs';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { TennisCdsTemplate } from '../models/tennis-cds-template.constant';
import { MessageEnvelope } from '@cds/push';
import { CdsPushConstants } from 'src/app/common/cds-client/models/cds-push-updates.constant';
import { ErrorService } from 'src/app/common/services/error.service';
import { Log, LogType, LoggerService } from 'src/app/common/services/logger.service';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { Markets, Sports } from 'src/app/common/models/gantrymarkets.model';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';


@Injectable({
  providedIn: 'root'
})
export class TennisCdsService {
  errorMessage$ = this.errorService.errorMessage$;
  tennisCdsContent: TennisCdsContent = new TennisCdsContent();
  fixtureData$: Observable<FixtureView>;
  tennisContentFromSitecore$: Observable<TennisContentParams>;
  tennisContentFromSitecore: TennisContentParams;
  tennisCdsContent$: Observable<TennisCdsContent>;
  fixtureData: FixtureView;
  gantryMarkets$: Observable<Array<Markets>>;
  gantryMarkets: Array<Markets>;

  constructor(
    private cdsPushService: CdsClientService,
    private errorService: ErrorService,
    private loggerService: LoggerService,
    private gantryMarketsService: GantryMarketsService,
    private sportContentService: SportContentService
  ) { }

  public GetTennisCdsContent(fixtureId: any, marketId: any, gameIds: any) {
    this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, gameIds);
    this.tennisContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.tennisCds);
    this.gantryMarkets$ = this.getGantryMarketDataContent();
    this.tennisCdsContent$ = combineLatest([this.fixtureData$, this.tennisContentFromSitecore$, this.gantryMarkets$]).
      pipe(
        map(([fixtureData, contentFromSitecore, gantryMarkets]) => {
          if (!!fixtureData && fixtureData?.fixture) {
            this.fixtureData = fixtureData;
            this.gantryMarkets = gantryMarkets;
            this.tennisContentFromSitecore = contentFromSitecore;
            this.tennisCdsContent.content = contentFromSitecore;
            this.tennisCdsContent = this.getTennisCdsContent(fixtureData, this.gantryMarkets, contentFromSitecore);
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
          }
          else {
            throw 'Could not find Tennis data for Url - ' + this.cdsPushService.fixtureViewUrl;
          }
          return this.tennisCdsContent;
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

  public getTennisCdsContent(fixture: FixtureView, gantryMarkets: Array<Markets>, tennisContentFromSitecore: TennisContentParams): TennisCdsContent {
    if (!!fixture && fixture?.fixture && fixture?.fixture?.games?.length > 0) {
      if (this.errorService.isStaleDataAvailable) {
        this.errorService.unSetError();
      }
      if (fixture?.fixture?.games?.length > 0) {
        this.tennisCdsContent.sportName = fixture?.fixture?.sport?.name?.value?.toUpperCase();
        this.tennisCdsContent.title = StringHelper.getCdsFixtureTitle(fixture?.fixture?.name?.value);
        this.tennisCdsContent.eventStartDate = fixture?.fixture?.startDate;
        this.tennisCdsContent.competitionName = fixture?.fixture?.competition?.name?.value?.toUpperCase();
        this.tennisCdsContent.context = fixture?.fixture?.context;
        let matchBettingTemplate = gantryMarkets?.find(x => x.sport == Sports.CdsTennis)?.markets?.find(y => y.matches?.includes(TennisCdsTemplate.matchBetting))
        let setBettingTemplate = gantryMarkets?.find(x => x.sport == Sports.CdsTennis)?.markets?.find(y => y.matches?.includes(TennisCdsTemplate.setBetting))
        fixture?.fixture?.games?.forEach(x => {
          if (!!matchBettingTemplate && matchBettingTemplate?.matches?.includes(x?.templateId?.toString())) {
            x.isMatchBetting = true;
          }
          else if (!!setBettingTemplate && setBettingTemplate?.matches?.includes(x?.templateId?.toString())) {
            x.isSetBetting = true;
          }
        });
        this.tennisCdsContent.games = []
        var gamesArray = fixture?.fixture?.games;

        gamesArray?.forEach((x, index) => {
          if (x.isSetBetting) {
            for (var i = 0; i < x.results.length; i++) {
              let reverseIndex = -1;
              let isSetBetting = this.tennisCdsContent?.games[index]?.setBetting?.some(y => {
                return y.scorePoint == x.results[i]?.name?.value?.replace(':', '-')
              });
              let reversedValue = x.results[i]?.name?.value?.replace(':', '-').split("").reverse().join("");
              let isReverseSetBetting = this.tennisCdsContent?.games[index]?.setBetting?.some((y, rIndex) => {
                reverseIndex = rIndex;
                return y.scorePoint == reversedValue
              });

              if (!isSetBetting && !isReverseSetBetting) {
                if (!!this.tennisCdsContent?.games[index]) {
                  this.tennisCdsContent?.games[index]?.setBetting.push(
                    {
                      homeBettingPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[i]?.visibility, x?.results[i]?.numerator, x?.results[i]?.denominator),
                      awayBettingPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[i]?.visibility, x?.results[i]?.numerator, x?.results[i]?.denominator),
                      scorePoint: x.results[i]?.name?.value?.replace(':', '-'),
                      isMatchedPair: false
                    })
                }
                else {
                  this.tennisCdsContent.games.push(
                    {
                      id: x.id,
                      gameName: tennisContentFromSitecore?.contentParameters["SetBetting"],
                      isSetBetting: true,
                      setBetting: [{
                        homeBettingPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[i]?.visibility, x?.results[i]?.numerator, x?.results[i]?.denominator),
                        awayBettingPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[i]?.visibility, x?.results[i]?.numerator, x?.results[i]?.denominator),
                        scorePoint: x.results[i]?.name?.value?.replace(':', '-'),
                        isMatchedPair: false
                      }]
                    })
                }
              }

              if (isReverseSetBetting && reverseIndex > -1) {
                this.tennisCdsContent.games[index].setBetting[reverseIndex].isMatchedPair = true;
                this.tennisCdsContent.games[index].setBetting[reverseIndex].awayBettingPrice = SportBookMarketHelper.getCdsPriceStr(x?.results[i]?.visibility, x?.results[i]?.numerator, x?.results[i]?.denominator);
              }
            }
            this.tennisCdsContent.games[index].setBetting.forEach(
              x => {
                let gameScore = x.scorePoint.split('-');
                if (!x.isMatchedPair) {
                  x.homeBettingPrice = (gameScore[0] > gameScore[1]) ? x.homeBettingPrice : '',
                    x.awayBettingPrice = (gameScore[0] > gameScore[1]) ? '' : x.awayBettingPrice
                }
              })

          }
          else if (x.isMatchBetting) {
            this.tennisCdsContent.games.push(
              {
                id: x.id,
                gameName: tennisContentFromSitecore?.contentParameters["MatchBetting"],
                isMatchBetting: true,
                matchBetting: {
                  homeBettingPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[0]?.visibility, x?.results[0]?.numerator, x?.results[0]?.denominator),
                  homePlayer: x.results[0]?.name?.value?.toUpperCase(),
                  awayBettingPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[1]?.visibility, x?.results[1]?.numerator, x?.results[1]?.denominator),
                  awayPlayer: x.results[1]?.name?.value?.toUpperCase(),
                  scorePoint: ''
                },
                setBetting: []
              })
          }
        })
        return this.tennisCdsContent;
      }
    }
    else {
      const errorMessage = 'Could not find Tennis Content for Url - ' + this.cdsPushService.fixtureViewUrl;
      this.errorService.setError(errorMessage);
    }

  }

  public GetUpdatedTennisCdsContent(messageEnvelope: MessageEnvelope): TennisCdsContent {
    var gameIndex = 0;
    if (!!this.fixtureData && !!messageEnvelope.messageType) {
      if (messageEnvelope.messageType == CdsPushConstants.gameUpdate) {
        if (!!messageEnvelope?.payload?.game?.id) {
          gameIndex = this.fixtureData?.fixture?.games?.findIndex(x => x.id == messageEnvelope?.payload?.game?.id);
          if (gameIndex != -1) {
            this.fixtureData.fixture.games[gameIndex] = messageEnvelope?.payload?.game;
          }
          else {
            if (messageEnvelope?.payload?.game?.templateId == TennisCdsTemplate.matchBetting) {
              this.fixtureData?.fixture?.games?.splice(0, 0, messageEnvelope?.payload?.game);
            }
            else {
              this.fixtureData?.fixture?.games?.push(messageEnvelope?.payload?.game);
            }
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
      return this.getTennisCdsContent(this.fixtureData, this.gantryMarkets, this.tennisContentFromSitecore);
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
}
