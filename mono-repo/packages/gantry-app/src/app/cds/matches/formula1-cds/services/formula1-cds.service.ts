import { Injectable } from '@angular/core';

import { MessageEnvelope } from '@cds/push';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay } from 'rxjs';

import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { CdsPushConstants } from '../../../../common/cds-client/models/cds-push-updates.constant';
import { Fixture, Fixtures, Game } from '../../../../common/cds-client/models/fixture.model';
import { SportBookMarketHelper } from '../../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../../common/helpers/string.helper';
import { Markets, Sports } from '../../../../common/models/gantrymarkets.model';
import { ContentItemPaths } from '../../../../common/models/sport-content/sport-content-parameters.constants';
import { ErrorService } from '../../../../common/services/error.service';
import { GantryMarketsService } from '../../../../common/services/gantry-markets.service';
import { Log, LogType, LoggerService } from '../../../../common/services/logger.service';
import { SportContentService } from '../../../../common/services/sport-content/sport-content.service';
import { FormulaOneMarkets } from '../../../../formula1/model/formula1-constant.model';
import { SportCdsTemplateService } from '../../../common/services/sport-cds-template.service';
import { BetDetails, EachWayText, Formula1CdsContent, Formula1ContentParams, RacerBetName, Racers } from '../models/formula1-cds-content.model';
import { Formula1CdsTemplate } from '../models/formula1-cds-template.constant';

@Injectable({
    providedIn: 'root',
})
export class Formula1CdsService extends SportCdsTemplateService {
    errorMessage$ = this.errorService.errorMessage$;
    formula1CdsContent: Formula1CdsContent = new Formula1CdsContent();
    fixtures$: Observable<Fixtures>;
    formula1ContentFromSitecore$: Observable<Formula1ContentParams>;
    formula1CdsContent$: Observable<Formula1CdsContent>;
    fixture: Fixture;
    fixtures: Fixtures;
    gantryMarkets$: Observable<Array<Markets>>;
    gantryMarkets: Array<Markets>;
    constructor(
        private cdsClientService: CdsClientService,
        private errorService: ErrorService,
        private loggerService: LoggerService,
        private sportContentService: SportContentService,
        gantryMarketsService: GantryMarketsService,
    ) {
        super(gantryMarketsService);
    }

    public getFormula1CdsContent(fixtureId: any, marketId: any, gameIds: any) {
        this.fixtures$ = this.cdsClientService.getFixtures(fixtureId, marketId, gameIds);
        this.formula1ContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.formula1Cds);
        this.gantryMarkets$ = super.getGantryMarketDataContent();

        this.formula1CdsContent$ = combineLatest([this.fixtures$, this.formula1ContentFromSitecore$, this.gantryMarkets$]).pipe(
            map(([fixtures, contentFromSitecore, gantryMarkets]) => {
                if (fixtures && fixtures?.fixtures?.length) {
                    this.fixtures = fixtures;
                    this.fixture = fixtures.fixtures[0];
                    this.formula1CdsContent.content = contentFromSitecore;
                    this.gantryMarkets = gantryMarkets;
                    this.getRaceBetNames(this.formula1CdsContent);
                    this.formula1CdsContent = this.prepareFormula1CdsContent(this.formula1CdsContent, this.fixture, this.gantryMarkets);
                } else {
                    throw 'Could not find Formula1 Content for Url - ' + this.cdsClientService.fixturesUrl;
                }
                return this.formula1CdsContent;
            }),
            catchError((err) => {
                this.errorService.logError(err);
                this.logError(err, 'Error');
                return EMPTY;
            }),
            shareReplay(),
        );
    }

    prepareFormula1CdsContent(formula1CdsContent: Formula1CdsContent, fixture: Fixture, gantryMarkets: Array<Markets>): Formula1CdsContent {
        if (fixture && fixture?.games?.length > 0) {
            if (this.errorService.isStaleDataAvailable) {
                this.errorService.unSetError();
            }
            formula1CdsContent.sportName = formula1CdsContent?.content?.contentParameters?.LeadTitle ?? '';
            formula1CdsContent.title = StringHelper.getValueWithoutBracket(fixture?.name?.value);
            formula1CdsContent.eventStartDate = fixture?.startDate;
            formula1CdsContent.competitionName = fixture?.competition?.name?.value;
            formula1CdsContent.context = fixture?.context;

            const formula1Market = gantryMarkets?.find((x) => x.sport == Sports.CdsFormula1);
            const getTradingBetnamesList: string[] = [];
            if (formula1Market && formula1Market?.markets?.length > 0) {
                const fastestLapMatch = formula1Market?.markets?.find((y) => y.name === FormulaOneMarkets.FASTESTLAP)?.matches[0];
                if (fastestLapMatch) {
                    getTradingBetnamesList.push(fastestLapMatch);
                }
                const pointsFinishMatch = formula1Market?.markets?.find((y) => y.name === FormulaOneMarkets.POINTSFINISH)?.matches[0];
                if (pointsFinishMatch) {
                    getTradingBetnamesList.push(pointsFinishMatch);
                }
                const podiumFinishMatch = formula1Market?.markets?.find((y) => y.name === FormulaOneMarkets.PODIUMFINISH)?.matches[0];
                if (podiumFinishMatch) {
                    getTradingBetnamesList.push(podiumFinishMatch);
                }
                const raceWinnerMarket = formula1Market?.markets?.find((y) => y.name === FormulaOneMarkets.RACEWINNER)?.matches[0];
                if (raceWinnerMarket) {
                    getTradingBetnamesList.push(raceWinnerMarket);
                }

                formula1CdsContent.racerList = [];

                const gamesArray: Game[] = fixture?.games;
                if (gamesArray && gamesArray.length > 0) {
                    const fastestLapDataOrder1 = fixture?.games?.find((x) => x.templateId == +getTradingBetnamesList[0]);
                    const pointsDataOrder2 = fixture?.games?.find((x) => x.templateId == +getTradingBetnamesList[1]);
                    const top3BetDataOrder3 = fixture?.games?.find((x) => x.templateId == +getTradingBetnamesList[2]);
                    const raceWinnerDataOrder4 = fixture?.games?.find((x) => x.templateId == +getTradingBetnamesList[3]);
                    raceWinnerDataOrder4?.results.forEach((x) => {
                        const racer = new Racers();
                        racer.driverName = StringHelper.getValueWithoutBracket(x?.name?.value);
                        const racerWinBetdetails = new BetDetails(
                            4,
                            x?.name?.value,
                            SportBookMarketHelper.getCdsPriceStr(x?.visibility, x?.numerator, x?.denominator),
                        );
                        racer.selectionDetails.push(racerWinBetdetails);
                        if (fastestLapDataOrder1) {
                            this.addOddsDataInSelectionList(racer, x.name.value, 1, fastestLapDataOrder1);
                        }
                        if (pointsDataOrder2) {
                            this.addOddsDataInSelectionList(racer, x.name.value, 2, pointsDataOrder2);
                        }
                        if (top3BetDataOrder3) {
                            this.addOddsDataInSelectionList(racer, x.name.value, 3, top3BetDataOrder3);
                        }

                        formula1CdsContent.racerList.push(racer);
                    });

                    if (formula1CdsContent.racerList && formula1CdsContent.racerList.length > 0) {
                        formula1CdsContent?.racerList?.map((obj) => {
                            obj.selectionDetails?.sort((a, b) => (a.order < b.order ? -1 : 1));
                        });

                        this.arrangeMissingSelections(formula1CdsContent);
                        this.sortRaceWinnerList(formula1CdsContent);
                    }
                }
            }
            return formula1CdsContent;
        } else {
            const errorMessage = 'Could not find Formula1 data for Url - ' + this.cdsClientService.fixturesUrl;
            this.errorService.setError(errorMessage);
        }
        return new Formula1CdsContent();
    }

    public getUpdatedFormula1CdsContent(messageEnvelope: MessageEnvelope): Formula1CdsContent {
        let gameIndex = 0;
        if (messageEnvelope.messageType) {
            if (messageEnvelope.messageType == CdsPushConstants.gameUpdate) {
                if (messageEnvelope?.payload?.game?.id) {
                    gameIndex = this.fixture?.games?.findIndex((x) => x.id == messageEnvelope?.payload?.game?.id);
                    if (gameIndex != -1) {
                        this.fixture.games[gameIndex] = messageEnvelope?.payload?.game;
                    } else {
                        if (messageEnvelope?.payload?.game?.templateCategory?.name?.value == Formula1CdsTemplate.matchBetting) {
                            this.fixture?.games?.splice(0, 0, messageEnvelope?.payload?.game);
                        } else {
                            this.fixture?.games?.push(messageEnvelope?.payload?.game);
                        }
                    }
                }
            } else if (messageEnvelope.messageType == CdsPushConstants.gameDelete) {
                gameIndex = this.fixture?.games?.findIndex((x) => x.id == messageEnvelope?.payload?.gameId);
                this.fixture?.games.splice(gameIndex, 1);
            } else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
                this.fixture.startDate = messageEnvelope?.payload?.startDate;
            }
            return this.prepareFormula1CdsContent(this.formula1CdsContent, this.fixture, this.gantryMarkets);
        }
        return new Formula1CdsContent();
    }

    addOddsDataInSelectionList(racer: Racers, racerName: string, order: number, fastestLapDataOrder1: Game) {
        if (fastestLapDataOrder1 && fastestLapDataOrder1.results.length > 0) {
            const fastestLapData = fastestLapDataOrder1?.results?.find((g) => g?.name?.value == racerName);
            if (fastestLapData) {
                const fastestBetdetails = new BetDetails(
                    order,
                    fastestLapData?.name?.value,
                    SportBookMarketHelper.getCdsPriceStr(fastestLapData?.visibility, fastestLapData?.numerator, fastestLapData?.denominator),
                );

                racer.selectionDetails.push(fastestBetdetails);
            }
        }
    }

    private getRaceBetNames(formulaContent: Formula1CdsContent) {
        if (formulaContent) {
            const BetNames = formulaContent?.content?.contentParameters ?? {};
            const getBetnamesList = BetNames?.BetNamesListNew?.split('|');
            if (getBetnamesList && getBetnamesList?.length > 0) {
                for (const name of getBetnamesList) {
                    const racerBetName = new RacerBetName();
                    racerBetName.betName = name;
                    formulaContent.racerBetNameList.push(racerBetName);
                    const eachWayText = new EachWayText();
                    eachWayText.winOrEachWayText = formulaContent?.content?.contentParameters?.WinOnly ?? '';
                    formulaContent.winOrEachWayTextList.push(eachWayText);
                }
            }
        }
    }

    private arrangeMissingSelections(formula1TempContent: Formula1CdsContent) {
        if (formula1TempContent?.racerList) {
            formula1TempContent.racerList.forEach((resList) => {
                if (resList?.selectionDetails?.length < 4) {
                    const orders: Array<number> = [];
                    const missingNumbers: Array<number> = [];
                    resList?.selectionDetails?.forEach((x) => orders?.push(x.order));
                    for (let j = 1; j <= 4; j++) {
                        if (orders.indexOf(j) == -1) {
                            missingNumbers.push(j);
                        }
                    }
                    missingNumbers.forEach((x) => {
                        const racerSelections = new BetDetails(x, '', '');

                        resList?.selectionDetails?.push(racerSelections);
                    });
                    resList.selectionDetails = resList?.selectionDetails?.sort((a, b) => (a.order < b.order ? -1 : 1));
                }
            });
        }
    }

    private sortRaceWinnerList(formula1TempContent: Formula1CdsContent) {
        if (formula1TempContent.racerList && formula1TempContent.racerList?.length > 1) {
            formula1TempContent.racerList?.sort(function (first, second) {
                const firstNumber = StringHelper.getPriceFromOdds(first?.selectionDetails[3]?.betOdds);
                const secondNumber = StringHelper.getPriceFromOdds(second?.selectionDetails[3].betOdds);
                return firstNumber - secondNumber;
            });
        }
        return formula1TempContent;
    }

    private logError(message: string, status: string, fatal: boolean = false) {
        const errorLog: Log = {
            level: LogType.Error,
            message: message,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(errorLog);
    }
}
