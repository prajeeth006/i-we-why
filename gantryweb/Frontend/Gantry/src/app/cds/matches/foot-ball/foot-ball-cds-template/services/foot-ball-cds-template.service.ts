import { Injectable } from '@angular/core';
import { EMPTY, catchError, combineLatest, map, shareReplay, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { ErrorService } from 'src/app/common/services/error.service';
import { Log, LogType, LoggerService } from 'src/app/common/services/logger.service';
import { FootBallContentParams, FootBallCdsTemplateResult, FinalResult, BothTeamToScore, MatchResultBothTeamToScore, FirstGoalScorer, OptionalMarket, CorrectScore, Option, HomeDrawAwaySelection, MatchSelection } from './../models/foot-ball-cds-template.model'
import { MessageEnvelope } from '@cds/push';
import { CdsPushConstants } from 'src/app/common/cds-client/models/cds-push-updates.constant';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { MarketParameters, footBallCdsTemplateIds } from '../models/foot-ball-cds-constants-model';
import { Markets } from 'src/app/common/models/gantrymarkets.model';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { FootballContentService } from 'src/app/foot-ball/services/football-content.service';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { FootBallDataContent } from '../models/foot-ball-model';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';
import { FootballCDSConstants } from '../models/football-cds-constants';
import { Draw, EventStatus, sourceName } from 'src/app/common/models/general-codes-model';

@Injectable({
  providedIn: 'root'
})
export class FootBallCdsTemplateService {
  fixtureData$: Observable<FixtureView>;
  footBallCdsContent: FootBallCdsTemplateResult = new FootBallCdsTemplateResult();
  footBallCdsContent$: Observable<FootBallCdsTemplateResult>;
  footBallContentFromSitecore$: Observable<FootBallContentParams>;
  fixtureData: FixtureView;
  errorMessage$ = this.errorService.errorMessage$;
  gantryMarkets$: Observable<Array<Markets>>;
  gantryMarkets: Array<Markets>;
  footballContent: FootBallDataContent;
  validSelections: string[] = ["1:0", "2:0", "2:1", "3:0", "3:1", "3:2", "4:0", "4:1"];
  validDrawSelections: string[] = ["0:0", "1:1", "2:2", "3:3"];

  constructor(
    private cdsPushService: CdsClientService,
    private errorService: ErrorService,
    private loggerService: LoggerService,
    private gantryMarketsService: GantryMarketsService,
    private footballContentService: FootballContentService,
    private sportContentService: SportContentService


  ) { }

  public getFixtureViewData(fixtureId: any, marketId: any, gameIds: any) {
    return this.cdsPushService.getFixture_View(fixtureId, marketId, gameIds);
  }


  footballContent$ = this.footballContentService.data$
    .pipe(
      tap((footballRacingContent: FootBallDataContent) => {
        JSON.stringify(footballRacingContent, JsonStringifyHelper.replacer);
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  public GetFootBallCdsContent(fixtureId: any, marketId: any, gameIds: any) {
    this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, "");
    this.gantryMarkets$ = this.getGantryMarketDataContent();
    this.footBallContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.footBallCds)
    this.footBallCdsContent$ = combineLatest([this.fixtureData$, this.footballContent$, this.gantryMarkets$, this.footBallContentFromSitecore$]).
      pipe(
        map(([fixtureData, footballContent, gantryMarkets, contentFromSitecore]) => {
          if (!!fixtureData && fixtureData?.fixture) {
            this.fixtureData = fixtureData;
            this.footballContent = footballContent;
            this.footBallCdsContent.footBallContent = footballContent;
            this.gantryMarkets = gantryMarkets;
            this.footBallCdsContent.content = contentFromSitecore;
            this.footBallCdsContent = this.getFootBallCdsContent(fixtureData, this.gantryMarkets);
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
          } else {
            throw 'Could not find Football CDS Content for Url - ' + this.cdsPushService?.fixtureViewUrl;
          }
          return this.footBallCdsContent;
        }),
        catchError(err => {
          this.errorService.logError(err);
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

  getMatchResult(optionalMarket: OptionalMarket): FinalResult {
    let finalResult: FinalResult = new FinalResult();
    let selections: MatchSelection[] = this.SuspendSelections(optionalMarket?.options);
    finalResult.selections = selections;
    return finalResult
  }

  getTotalGoals = (optionalMarket: OptionalMarket): any => {
    return {
      homePrice: SportBookMarketHelper.getCdsPriceStr(optionalMarket?.options?.[0]?.status, optionalMarket?.options?.[0]?.price?.numerator, optionalMarket?.options?.[0]?.price?.denominator),
      name: (optionalMarket?.options?.[0]?.name?.value).split(' ')[1]?.replace(',', '.'),
      awayPrice: SportBookMarketHelper.getCdsPriceStr(optionalMarket?.options?.[1]?.status, optionalMarket?.options?.[1]?.price?.numerator, optionalMarket?.options?.[1]?.price?.denominator)
    }
  }


  getBothTeamToScoreData = (optionalMarket: OptionalMarket): BothTeamToScore => {
    return {
      gameName: optionalMarket?.name?.value?.toUpperCase(),
      selections: [{
        homePrice: SportBookMarketHelper.getCdsPriceStr(optionalMarket?.options?.[0]?.status, optionalMarket?.options?.[0]?.price?.numerator, optionalMarket?.options?.[0]?.price?.denominator),
        homeSelectionTitle: StringHelper.getCdsFixtureTitle(optionalMarket?.options?.[0]?.name?.value?.toUpperCase()?.replace(',', '.')),
        awayPrice: SportBookMarketHelper.getCdsPriceStr(optionalMarket?.options?.[1]?.status, optionalMarket?.options?.[1]?.price?.numerator, optionalMarket?.options?.[1]?.price?.denominator),
        awaySelectionTitle: StringHelper.getCdsFixtureTitle(optionalMarket?.options?.[1]?.name?.value?.toUpperCase()?.replace(',', '.')),
      }]
    }
  }

  getMatchResultAndBothTeamToScoreData = (optionalMarket: OptionalMarket): MatchResultBothTeamToScore => {
    return {
      gameName: optionalMarket?.name?.value?.toUpperCase(),
      selections: [{
        homePrice: SportBookMarketHelper.getCdsPriceStr(optionalMarket?.options?.[0]?.status, optionalMarket?.options?.[0]?.price?.numerator, optionalMarket?.options?.[0]?.price?.denominator),
        homeSelectionTitle: StringHelper.getCdsFixtureTitle(optionalMarket?.options?.[0]?.name?.value?.toUpperCase()?.replace(',', '.')?.split(FootballCDSConstants.TO_WIN)[0]?.trim()),
        awayPrice: SportBookMarketHelper.getCdsPriceStr(optionalMarket?.options?.[1]?.status, optionalMarket?.options?.[1]?.price?.numerator, optionalMarket?.options?.[1]?.price?.denominator),
        awaySelectionTitle: StringHelper.getCdsFixtureTitle(optionalMarket?.options?.[1]?.name?.value?.toUpperCase()?.replace(',', '.')?.split(FootballCDSConstants.TO_WIN)[0]?.trim()),
      }]
    }
  }

  getCorrectScore(optionalMarket: OptionalMarket): CorrectScore {
    const MAX_LIMIT = 8;
    const home: any = [];
    const away: any = [];
    const draw: any = [];

    optionalMarket?.options?.forEach((optionalMarket: Option) => {
      const nameValue = optionalMarket?.name?.value;
      const [x, y] = nameValue?.split(":");

      if (x && y) {
        const cdsPriceStr = SportBookMarketHelper.getCdsPriceStr(
          optionalMarket?.status,
          optionalMarket?.price?.numerator,
          optionalMarket?.price?.denominator
        );
        if (this.validSelections?.includes(nameValue)) {
          home?.push({
            homeName: this.validSelections[this.validSelections?.indexOf(nameValue)]?.replace(":", "-"),
            homePrice: cdsPriceStr,
          });
        } else if (this.validDrawSelections?.includes(nameValue)) {
          draw?.push({
            drawName: nameValue?.replace(":", "-"),
            drawPrice: cdsPriceStr,
          });
        } else if (this.validSelections?.includes(nameValue?.split("")?.reverse()?.join(""))) {
          away?.push({
            awayName: nameValue?.replace(":", "-")?.split("")?.reverse()?.join(""),
            awayPrice: cdsPriceStr,
          });
        }
      }
    });

    // Sort away selections by name
    home?.sort((a: any, b: any) => a?.homeName?.localeCompare(b?.homeName));
    away?.sort((a: any, b: any) => a?.awayName?.localeCompare(b?.awayName));

    // Ensure arrays do not exceed MAX_LIMIT
    home.length = Math?.min(home?.length, MAX_LIMIT);
    away.length = Math?.min(away?.length, MAX_LIMIT);
    draw.length = Math?.min(draw?.length, MAX_LIMIT);

    const correctScore = new CorrectScore();
    const selections = [];

    for (let i = 0; i < MAX_LIMIT; i++) {
      const selection = new HomeDrawAwaySelection();
      selection.homePrice = home[i]?.homePrice;
      selection.homeSelectionTitle = home[i]?.homeName;
      selection.drawPrice = draw[i]?.drawPrice;
      selection.drawSelectionTitle = draw[i]?.drawName;
      selection.awayPrice = away[i]?.awayPrice;
      selection.awaySelectionTitle = away[i]?.awayName;
      selections.push(selection);
    }

    correctScore.selections = selections;
    return correctScore;
  }


  getFirstGoalScorer = (optionalMarket: OptionalMarket): FirstGoalScorer => {
    const leftBetList = optionalMarket?.options?.slice(0, 8);
    const rightBetList = optionalMarket?.options?.slice(8, 15);
    const selections: any = []
    if (leftBetList?.length > 0 || rightBetList?.length > 0)
      Array.from({ length: 7 }).map((x, i) => {
        selections?.push({
          homePrice: SportBookMarketHelper.getCdsPriceStr(optionalMarket?.options?.[i]?.status, optionalMarket?.options?.[i]?.price?.numerator, optionalMarket?.options?.[i]?.price?.denominator),
          homeSelectionTitle: optionalMarket?.options?.[i]?.name?.value?.toUpperCase(),
          awayPrice: SportBookMarketHelper.getCdsPriceStr(optionalMarket?.options?.[i + 7]?.status, optionalMarket?.options?.[i + 7]?.price?.numerator, optionalMarket?.options?.[i + 7]?.price?.denominator),
          awaySelectionTitle: optionalMarket?.options?.[i + 7]?.name?.value?.toUpperCase(),
        })
        selections?.sort((a: any, b: any) => a?.homePrice - b?.homePrice);
      });

    return { selections };
  }


  public GetUpdatedFootBallCdsContent(messageEnvelope: MessageEnvelope): FootBallCdsTemplateResult {
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
      return this.getFootBallCdsContent(this.fixtureData, this.gantryMarkets);
    }
  }



  public getFootBallCdsContent(fixture: FixtureView, gantryMarkets: Array<Markets>): FootBallCdsTemplateResult {
    if (!!fixture && fixture?.fixture) {
      if (this.errorService.isStaleDataAvailable) {
        this.errorService.unSetError();
      }
      this.footBallCdsContent.marketResult = {}
      this.footBallCdsContent.totalGoals = { selections: [] }
      const gamesArray = fixture?.fixture?.optionMarkets;
      this.footBallCdsContent.marketResult.eventName = StringHelper.getCdsFixtureTitle(fixture?.fixture?.name?.value);
      this.footBallCdsContent.marketResult.eventStartDate = fixture?.fixture?.startDate;
      this.footBallCdsContent.marketResult.competition = fixture?.fixture?.competition?.name?.value;

      gamesArray?.map(optionMarkets => {

        let market = this.getMarketName(optionMarkets);

        if (market === footBallCdsTemplateIds.FIGHTBETTING) {
          this.footBallCdsContent.finalResult = this.getMatchResult(optionMarkets);
        }
        if (market === footBallCdsTemplateIds.TOTALGOALSFINISH) {
          this.footBallCdsContent?.totalGoals?.selections?.push(this.getTotalGoals(optionMarkets));
        }
        if (market === footBallCdsTemplateIds.BOTHTEAMTOSCORE) {
          this.footBallCdsContent.bothTeamScore = this.getBothTeamToScoreData(optionMarkets);
        }
        if (market === footBallCdsTemplateIds.MATCHRESULTBOTHTEAMTOSCORE) {
          this.footBallCdsContent.matchResultBothTeamScore = this.getMatchResultAndBothTeamToScoreData(optionMarkets);
        }
        if (market === footBallCdsTemplateIds.FIRSTGOALSCORER) {
          this.footBallCdsContent.firstGoalScorer = this.getFirstGoalScorer(optionMarkets);
        }
        if (market === footBallCdsTemplateIds.CORRECTSCORE) {
          this.footBallCdsContent.correctScore = this.getCorrectScore(optionMarkets);
        }
      })
      return this.footBallCdsContent;
    }
    else {
      const errorMessage = 'Could not find Football CDS Content for Url - ' + this.cdsPushService?.fixtureViewUrl;
      this.errorService.setError(errorMessage);
    }

  }

  getMarketName(optionalMarket: OptionalMarket) {
    let marketName = '';
    let marketParameters: MarketParameters = new MarketParameters();
    let marketDetails = this.footBallCdsContent?.content?.contentParameters?.Football;
    if (!!marketDetails) {
      let footballMarketDetails = JSON.parse(marketDetails)[0];
      optionalMarket?.parameters?.forEach(parameter => {
        marketParameters[parameter.key] = parameter?.value;
      })

      for (let market in footballMarketDetails) {
        let marketData = footballMarketDetails[market];
        if (!!marketData?.MarketType && marketParameters?.MarketType === marketData?.MarketType) {
          if (!!marketData?.Happening && marketParameters?.Happening === marketData?.Happening) {
            if (!!marketData?.Period && marketParameters?.Period === marketData?.Period) {
              if (!!marketData?.DecimalValue && !!marketParameters?.DecimalValue && marketData?.DecimalValue?.indexOf(marketParameters?.DecimalValue) !== -1) {
                marketName = market;
                break;
              } else {
                marketName = market;
                break;
              }
            }
          }
        }
      }
    }
    return marketName;
  }


  SuspendSelections(optionsArray: Option[]): MatchSelection[] {
    const selections = {
      draw: { name: '', price: '' },
      home: { name: '', price: '' },
      away: { name: '', price: '' },
    };

    for (const option of optionsArray) {
      const name = StringHelper.getCdsFixtureTitle(
        option?.name?.value?.toUpperCase()?.replace(',', '.')
      );
      const price = SportBookMarketHelper.getCdsPriceStr(
        option?.status,
        option?.price?.numerator,
        option?.price?.denominator
      );
      const isSuspended = option?.status?.toUpperCase() === EventStatus.Suspended;

      if (option.name?.value?.toUpperCase() === Draw.drawNameValue) {
        selections.draw.name = name;
        selections.draw.price = isSuspended ? '' : price;
      } else if (option.sourceName?.value === sourceName.home) {
        selections.home.name = name;
        selections.home.price = isSuspended ? '' : price;
      } else if (option.sourceName?.value === sourceName.away) {
        selections.away.name = name;
        selections.away.price = isSuspended ? '' : price;
      }
    }

    return [{
      homePrice: selections?.home?.price,
      homeSelectionTitle: selections?.home?.name,
      awayPrice: selections?.away?.price,
      awaySelectionTitle: selections?.away?.name,
      drawPrice: selections?.draw?.price,
      drawSelectionTitle: selections?.draw?.name,
    }]
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
