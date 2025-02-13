import { Injectable } from '@angular/core';
import { Formula1CdsContent, Formula1ContentParams, RacerBetName, EachWayText, Racers, BetDetails } from '../models/formula1-cds-content.model';
import { FixtureView, Game } from 'src/app/common/cds-client/models/fixture-view.model';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay, tap } from 'rxjs';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { Formula1CdsTemplate } from '../models/formula1-cds-template.constant';
import { MessageEnvelope } from '@cds/push';
import { CdsPushConstants } from 'src/app/common/cds-client/models/cds-push-updates.constant';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { ErrorService } from 'src/app/common/services/error.service';
import { Log, LogType, LoggerService } from 'src/app/common/services/logger.service';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { Markets, Sports } from 'src/app/common/models/gantrymarkets.model';
import { FormulaOneMarkets } from 'src/app/formula1/model/formula1-constant.model';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';
@Injectable({
  providedIn: 'root'
})
export class Formula1CdsService {
  errorMessage$ = this.errorService.errorMessage$;
  formula1CdsContent: Formula1CdsContent = new Formula1CdsContent();
  fixtureData$: Observable<FixtureView>;
  formula1ContentFromSitecore$: Observable<Formula1ContentParams>;
  formula1CdsContent$: Observable<Formula1CdsContent>;
  fixtureData: FixtureView;
  gantryMarkets$: Observable<Array<Markets>>;
  gantryMarkets: Array<Markets>;

  constructor(
    private cdsPushService: CdsClientService,
    private gantryMarketsService: GantryMarketsService,
    private errorService: ErrorService,
    private loggerService: LoggerService,
    private sportContentService: SportContentService
  ) { }

  public getFormula1CdsContent(fixtureId: any, marketId: any, gameIds: any) {

    this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, gameIds);
    this.formula1ContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.formula1Cds)
    this.gantryMarkets$ = this.getGantryMarketDataContent();

    this.formula1CdsContent$ = combineLatest([this.fixtureData$, this.formula1ContentFromSitecore$, this.gantryMarkets$]).
      pipe(
        map(([fixtureData, contentFromSitecore, gantryMarkets]) => {
          if (!!fixtureData && fixtureData?.fixture) {
            this.fixtureData = fixtureData;
            this.formula1CdsContent.content = contentFromSitecore;
            this.gantryMarkets = gantryMarkets;
            this.getRaceBetNames(this.formula1CdsContent);
            this.formula1CdsContent = this.prepareFormula1CdsContent(this.formula1CdsContent, fixtureData, this.gantryMarkets);
          }
          else {
            throw 'Could not find Formula1 Content for Url - ' + this.cdsPushService.fixtureViewUrl;
          }
          return this.formula1CdsContent;
        }),
        catchError(err => {
          this.errorService.logError(err);
          this.logError(err, 'Error');
          return EMPTY;
        })
      ), shareReplay();


  }

  public getFixtureViewData(fixtureId: any, marketId: any, gameIds: any) {
    return this.cdsPushService.getFixture_View(fixtureId, '', gameIds);
  }

  prepareFormula1CdsContent(formula1CdsContent: Formula1CdsContent, fixture: FixtureView, gantryMarkets: Array<Markets>): Formula1CdsContent {
    if (!!fixture && fixture?.fixture && fixture?.fixture?.games?.length > 0) {
      if (this.errorService.isStaleDataAvailable) {
        this.errorService.unSetError();
      }
      formula1CdsContent.sportName = formula1CdsContent?.content?.contentParameters?.LeadTitle;
      formula1CdsContent.title = StringHelper.getValueWithoutBracket(fixture?.fixture?.name?.value);
      formula1CdsContent.eventStartDate = fixture?.fixture?.startDate;
      formula1CdsContent.competitionName = fixture?.fixture?.competition?.name?.value;
      formula1CdsContent.context = fixture?.fixture?.context;

      let formula1Market = gantryMarkets?.find(x => x.sport == Sports.CdsFormula1);
      let getTradingBetnamesList: string[] = [];
      if (!!formula1Market && formula1Market.markets.length > 0) {
        getTradingBetnamesList.push(formula1Market?.markets?.find(y => y.name == FormulaOneMarkets.FASTESTLAP)?.matches[0]);
        getTradingBetnamesList.push(formula1Market?.markets?.find(y => y.name == FormulaOneMarkets.POINTSFINISH)?.matches[0]);
        getTradingBetnamesList.push(formula1Market?.markets?.find(y => y.name == FormulaOneMarkets.PODIUMFINISH)?.matches[0]);
        getTradingBetnamesList.push(formula1Market?.markets?.find(y => y.name == FormulaOneMarkets.RACEWINNER)?.matches[0]);

        formula1CdsContent.racerList = [];

        var gamesArray: Game[] = fixture?.fixture?.games;
        if (!!gamesArray && gamesArray.length > 0) {
          let fastestLapDataOrder1 = fixture?.fixture?.games?.find(x => x.templateId == +getTradingBetnamesList[0]);
          let pointsDataOrder2 = fixture?.fixture?.games?.find(x => x.templateId == +getTradingBetnamesList[1]);
          let top3BetDataOrder3 = fixture?.fixture?.games?.find(x => x.templateId == +getTradingBetnamesList[2]);
          let raceWinnerDataOrder4 = fixture?.fixture?.games?.find(x => x.templateId == +getTradingBetnamesList[3]);
          raceWinnerDataOrder4?.results.forEach((x, index) => {

            let racer = new Racers();
            racer.driverName = StringHelper.getValueWithoutBracket(x?.name?.value);
            let racerWinBetdetails = new BetDetails(4, x?.name?.value, SportBookMarketHelper.getCdsPriceStr(x?.visibility, x?.numerator, x?.denominator));
            racer.selectionDetails.push(racerWinBetdetails);

            this.addOddsDataInSelectionList(racer, x.name.value, 1, fastestLapDataOrder1);
            this.addOddsDataInSelectionList(racer, x.name.value, 2, pointsDataOrder2);
            this.addOddsDataInSelectionList(racer, x.name.value, 3, top3BetDataOrder3);
            formula1CdsContent.racerList.push(racer);
          });

          if (formula1CdsContent.racerList.length > 0) {
            formula1CdsContent?.racerList?.map(
              obj => {
                obj.selectionDetails?.sort((a, b) => (a.order < b.order ? -1 : 1));
              }
            );

            this.arrangeMissingSelections(formula1CdsContent);
            this.sortRaceWinnerList(formula1CdsContent);
          }
        }
      }
      return formula1CdsContent;
    }
    else {
      const errorMessage = 'Could not find Formula1 data for Url - ' + this.cdsPushService.fixtureViewUrl;
      this.errorService.setError(errorMessage);
    }

  }

  public getUpdatedFormula1CdsContent(messageEnvelope: MessageEnvelope): Formula1CdsContent {
    var gameIndex = 0;
    if (!!messageEnvelope.messageType) {
      if (messageEnvelope.messageType == CdsPushConstants.gameUpdate) {
        if (!!messageEnvelope?.payload?.game?.id) {
          gameIndex = this.fixtureData?.fixture?.games?.findIndex(x => x.id == messageEnvelope?.payload?.game?.id);
          if (gameIndex != -1) {
            this.fixtureData.fixture.games[gameIndex] = messageEnvelope?.payload?.game;
          }
          else {
            if (messageEnvelope?.payload?.game?.templateCategory?.name?.value == Formula1CdsTemplate.matchBetting) {
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
      return this.prepareFormula1CdsContent(this.formula1CdsContent, this.fixtureData, this.gantryMarkets);
    }
  }

  addOddsDataInSelectionList(racer: Racers, racerName: string, order: number, fastestLapDataOrder1: Game) {
    if (!!fastestLapDataOrder1 && fastestLapDataOrder1.results.length > 0) {
      let fastestLapData = fastestLapDataOrder1?.results?.find(g => g?.name?.value == racerName);
      if (!!fastestLapData) {
        let fastestBetdetails = new BetDetails(order, fastestLapData?.name?.value, SportBookMarketHelper.getCdsPriceStr(fastestLapData?.visibility, fastestLapData?.numerator, fastestLapData?.denominator));

        racer.selectionDetails.push(fastestBetdetails);
      }
    }
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

  private getRaceBetNames(formulaContent: Formula1CdsContent) {
    if (formulaContent) {
      let getBetnamesList = formulaContent?.content?.contentParameters?.BetNamesList?.split('|');
      if (getBetnamesList?.length > 0) {
        for (let name of getBetnamesList) {
          let racerBetName = new RacerBetName();
          racerBetName.betName = name;
          formulaContent.racerBetNameList.push(racerBetName);
          let eachWayText = new EachWayText();
          eachWayText.winOrEachWayText = racerBetName.betName == formulaContent?.content?.contentParameters?.RaceWinner ? formulaContent?.content?.contentParameters?.WinOnly : formulaContent?.content?.contentParameters?.WinOnly;
          formulaContent.winOrEachWayTextList.push(eachWayText);

        }
      }
    }
  }

  private arrangeMissingSelections(formula1TempContent: Formula1CdsContent) {
    formula1TempContent.racerList.forEach(resList => {
      if (resList?.selectionDetails?.length < 4) {
        let orders: Array<number> = [];
        let missingNumbers: Array<number> = [];
        resList?.selectionDetails?.forEach(x => orders?.push(x.order));
        for (let j = 1; j <= 4; j++) {
          if (orders.indexOf(j) == -1) {
            missingNumbers.push(j)
          }
        }
        missingNumbers.forEach(x => {
          let racerSelections = new BetDetails(x, '', '');

          resList?.selectionDetails?.push(racerSelections);
        })
        resList.selectionDetails = resList?.selectionDetails?.sort((a, b) => (a.order < b.order ? -1 : 1));
      }
    });
  }

  private sortRaceWinnerList(formula1TempContent: Formula1CdsContent) {
    if (formula1TempContent.racerList?.length > 1) {
      formula1TempContent.racerList?.sort(
        function (first, second) {
          let firstNumber = StringHelper.getPriceFromOdds(first?.selectionDetails[3]?.betOdds);
          let secondNumber = StringHelper.getPriceFromOdds(second?.selectionDetails[3].betOdds);
          return firstNumber - secondNumber;
        }
      );
    }
    return formula1TempContent;
  }

  private logError(message: string, status: string, fatal: boolean = false) {
    let errorLog: Log = {
      level: LogType.Error,
      message: message,
      status: status,
      fatal: fatal
    };
    this.loggerService.log(errorLog);
  }

}