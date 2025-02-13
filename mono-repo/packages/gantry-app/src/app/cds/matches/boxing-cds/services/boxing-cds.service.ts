import { Injectable } from '@angular/core';

import { MessageEnvelope } from '@cds/push';
import { groupBy } from 'lodash-es';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay } from 'rxjs';

import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { CdsPushConstants } from '../../../../common/cds-client/models/cds-push-updates.constant';
import { Fixture, Fixtures } from '../../../../common/cds-client/models/fixture.model';
import { SportBookMarketHelper } from '../../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../../common/helpers/string.helper';
import { Markets, Sports } from '../../../../common/models/gantrymarkets.model';
import { ContentItemPaths } from '../../../../common/models/sport-content/sport-content-parameters.constants';
import { ErrorService } from '../../../../common/services/error.service';
import { GantryMarketsService } from '../../../../common/services/gantry-markets.service';
import { Log, LogType, LoggerService } from '../../../../common/services/logger.service';
import { SportContentService } from '../../../../common/services/sport-content/sport-content.service';
import { SportCdsTemplateService } from '../../../common/services/sport-cds-template.service';
import { BoxingCdsTemplateIds, RoundBetting } from '../models/boxing-cds-constants.model';
import {
    BetDetails,
    BoxingCdsContent,
    BoxingContentParams,
    FinalResult,
    Game,
    IndividualBetting,
    MethodOfVictory,
    Result,
    RoundBettingDetails,
    RoundGroupBetting,
} from '../models/boxing-cds-content.model';

@Injectable({
    providedIn: 'root',
})
export class BoxingCdsService extends SportCdsTemplateService {
    boxingCdsContent: BoxingCdsContent = new BoxingCdsContent();
    fixtures$: Observable<Fixtures>;
    boxingContentFromSitecore$: Observable<BoxingContentParams>;
    boxingCdsContent$: Observable<BoxingCdsContent>;
    errorMessage$ = this.errorService.errorMessage$;
    gantryMarkets$: Observable<Array<Markets>>;
    gantryMarkets: Array<Markets>;
    fixture: Fixture;
    fixtures: Fixtures;
    drawTitle: string;
    constructor(
        private cdsClientService: CdsClientService,
        private errorService: ErrorService,
        private loggerService: LoggerService,
        private sportContentService: SportContentService,
        gantryMarketsService: GantryMarketsService,
    ) {
        super(gantryMarketsService);
    }

    public GetBoxingCdsContent(fixtureId: any, marketId: any, gameIds: any) {
        this.fixtures$ = this.cdsClientService.getFixtures(fixtureId, marketId, gameIds);
        this.boxingContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.boxingCds);
        this.gantryMarkets$ = super.getGantryMarketDataContent();

        this.boxingCdsContent$ = combineLatest([this.fixtures$, this.boxingContentFromSitecore$, this.gantryMarkets$]).pipe(
            map(([fixtures, contentFromSitecore, gantryMarkets]) => {
                if (!!fixtures && fixtures?.fixtures[0]) {
                    this.fixtures = fixtures;
                    this.fixture = fixtures?.fixtures[0];
                    this.gantryMarkets = gantryMarkets;
                    this.boxingCdsContent.content = contentFromSitecore;
                    this.boxingCdsContent = this.getBoxingCdsContent(this.fixture, this.gantryMarkets);
                    this.boxingCdsContent.drawTitle = this.drawTitle;
                } else {
                    throw 'Could not find Boxing Content for Url - ' + this.cdsClientService.fixturesUrl;
                }
                return this.boxingCdsContent;
            }),
            catchError((err) => {
                this.errorService.logError(err);
                this.logError(err, 'Error');
                return EMPTY;
            }),
            shareReplay(),
        );
    }

    public GetUpdatedBoxingCdsContent(messageEnvelope: MessageEnvelope): BoxingCdsContent {
        let gameIndex = 0;
        if (messageEnvelope.messageType) {
            if (messageEnvelope.messageType == CdsPushConstants.gameUpdate) {
                if (messageEnvelope?.payload?.game?.id) {
                    gameIndex = this.fixture?.games?.findIndex((x) => x.id == messageEnvelope?.payload?.game?.id);
                    if (gameIndex != -1) {
                        this.fixture.games[gameIndex] = messageEnvelope?.payload?.game;
                    } else {
                        this.fixture?.games?.push(messageEnvelope?.payload?.game);
                    }
                }
            } else if (messageEnvelope.messageType == CdsPushConstants.gameDelete) {
                gameIndex = this?.fixture?.games?.findIndex((x) => x.id == messageEnvelope?.payload?.gameId);
                this?.fixture?.games.splice(gameIndex, 1);
            } else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
                this.fixture.startDate = messageEnvelope?.payload?.startDate;
            }
            return this.getBoxingCdsContent(this.fixture, this.gantryMarkets);
        }
        return new BoxingCdsContent();
    }

    private getTitleNameFromSelection(name: string) {
        if (!name) return '';
        return name.replaceAll('/', ' / ');
    }

    private extractNumbersFromString(inputString: string): string {
        if (inputString) {
            const regexMatch = inputString?.match(/\d+-\d+/);
            return regexMatch ? regexMatch[0] : '';
        } else {
            return '';
        }
    }

    getIndividualRoundBettingData(arr: Result[]): IndividualBetting {
        const individualBetting = new IndividualBetting();
        individualBetting.homeTeamListDetails = Array<RoundBettingDetails>();
        individualBetting.awayTeamListDetails = Array<RoundBettingDetails>();
        if (arr.length) {
            const updateRoundNames = arr.map((item: Result): RoundBettingDetails => {
                let splitName = [];
                let updatedName = '';
                if (item?.name?.value?.toLowerCase()?.includes(RoundBetting.POINTSNAME)) {
                    updatedName = item?.name?.value?.toLowerCase()?.slice(item?.name?.value?.toLowerCase()?.indexOf(RoundBetting.POINTSNAME));
                    updatedName = updatedName
                        ?.toLowerCase()
                        ?.includes(this.boxingCdsContent?.content?.contentParameters?.OnPointsValue?.toLowerCase() ?? '')
                        ? updatedName
                        : `${updatedName} ${this.boxingCdsContent?.content?.contentParameters?.OnPointsValue ?? ''}`;
                } else {
                    splitName = item?.name?.value?.split(' ');
                    updatedName = splitName[splitName?.length - 2] + ' ' + splitName[splitName?.length - 1];
                }
                if (updatedName.includes(RoundBetting.ROUND) || updatedName.includes(RoundBetting.POINTSNAME)) {
                    return {
                        betName: updatedName?.toUpperCase(),
                        betOdds: SportBookMarketHelper.getCdsPriceStr(item?.visibility, item?.numerator, item?.denominator),
                    };
                }
                return new RoundBettingDetails();
            });
            const roundBettingBetName = groupBy(updateRoundNames, RoundBetting.BETNAME);
            const homeTeamListDetails = Object.values(roundBettingBetName)?.length
                ? Object.values(roundBettingBetName)?.map((details) => details?.length && details[0])
                : [];
            const awayTeamListDetails = Object.values(roundBettingBetName)?.length
                ? Object.values(roundBettingBetName)?.map((details) => details?.length && details[1])
                : [];

            individualBetting.homeTeamListDetails = homeTeamListDetails as RoundBettingDetails[];
            individualBetting.awayTeamListDetails = awayTeamListDetails as RoundBettingDetails[];
            individualBetting.marketTitle = this.boxingCdsContent?.content?.contentParameters
                ? this.boxingCdsContent?.content?.contentParameters?.RoundBetting
                : '';
        }
        return individualBetting;
    }

    getFightBettingData = (game: Game): FinalResult => {
        return {
            id: game?.id,
            gameName: game?.name?.value?.toUpperCase(),
            selections: [
                {
                    homePrice: SportBookMarketHelper.getCdsPriceStr(
                        game?.results?.[0]?.visibility,
                        game?.results?.[0]?.numerator,
                        game?.results?.[0]?.denominator,
                    ),
                    homeSelectionTitle: StringHelper.getCdsFixtureTitle(game?.results?.[0].name?.value?.replace(',', '.')),
                    awayPrice: SportBookMarketHelper.getCdsPriceStr(
                        game?.results?.[2]?.visibility,
                        game?.results?.[2]?.numerator,
                        game?.results?.[2]?.denominator,
                    ),
                    awaySelectionTitle: StringHelper.getCdsFixtureTitle(game?.results?.[2]?.name?.value?.replace(',', '.')),
                    drawTitle: game?.results?.[1].name?.value?.replace(',', '.'),
                    drawPrice: SportBookMarketHelper.getCdsPriceStr(
                        game?.results?.[1]?.visibility,
                        game?.results?.[1]?.numerator,
                        game?.results?.[1]?.denominator,
                    ),
                },
            ],
        };
    };

    getRoundGroupBetting = (game: Game): RoundGroupBetting => {
        return {
            id: game.id,
            gameName: game.name?.value?.toUpperCase(),
            selections: [
                {
                    homePrice: SportBookMarketHelper.getCdsPriceStr(
                        game?.results?.[0]?.visibility,
                        game?.results?.[0]?.numerator,
                        game?.results?.[0]?.denominator,
                    ),
                    name: this.extractNumbersFromString(game?.results?.[0]?.name?.value),
                    awayPrice: SportBookMarketHelper.getCdsPriceStr(
                        game?.results?.[5]?.visibility,
                        game?.results?.[5]?.numerator,
                        game?.results?.[5]?.denominator,
                    ),
                },
                {
                    homePrice: SportBookMarketHelper.getCdsPriceStr(
                        game?.results?.[1]?.visibility,
                        game?.results?.[1]?.numerator,
                        game?.results?.[1]?.denominator,
                    ),
                    name: this.extractNumbersFromString(game.results?.[1].name?.value),
                    awayPrice: SportBookMarketHelper.getCdsPriceStr(
                        game?.results?.[6]?.visibility,
                        game?.results?.[6]?.numerator,
                        game?.results?.[6]?.denominator,
                    ),
                },
                {
                    homePrice: SportBookMarketHelper.getCdsPriceStr(
                        game?.results?.[2]?.visibility,
                        game?.results?.[2]?.numerator,
                        game?.results?.[2]?.denominator,
                    ),
                    name: this.extractNumbersFromString(game?.results?.[2]?.name?.value),
                    awayPrice: SportBookMarketHelper.getCdsPriceStr(
                        game?.results?.[7]?.visibility,
                        game?.results?.[7]?.numerator,
                        game?.results?.[7]?.denominator,
                    ),
                },
                {
                    homePrice: SportBookMarketHelper.getCdsPriceStr(
                        game?.results?.[3]?.visibility,
                        game?.results?.[3]?.numerator,
                        game?.results?.[3]?.denominator,
                    ),
                    name: this.extractNumbersFromString(game?.results?.[3]?.name?.value),
                    awayPrice: SportBookMarketHelper.getCdsPriceStr(
                        game?.results?.[8]?.visibility,
                        game?.results?.[8]?.numerator,
                        game?.results?.[8]?.denominator,
                    ),
                },
            ],
        };
    };

    getMethodOfVictory = (game: Game, marketsList?: string[]): MethodOfVictory => {
        const siteCoreMethodOfVictoryList = this.boxingCdsContent?.content?.contentParameters?.MethodOfVictoryList ?? '';
        let marketArray: string[] = [];
        const tempSelections: BetDetails[] = [];
        if (siteCoreMethodOfVictoryList) {
            marketArray = JSON.parse(siteCoreMethodOfVictoryList);
        }
        if (marketsList && marketsList?.length > 0) {
            marketArray = marketsList;
        }
        marketArray?.forEach((market) => {
            const tempArray: Result[] = SportBookMarketHelper.getCdsMethodOfVictoryArray(game?.results, market);
            tempSelections?.push({
                homePrice: SportBookMarketHelper.getCdsPriceStr(tempArray[0]?.visibility, tempArray[0]?.numerator, tempArray[0]?.denominator),
                name:
                    this.getTitleNameFromSelection(market) +
                    (market?.includes(this.boxingCdsContent?.content?.contentParameters?.OnPoints ?? '')
                        ? ' ' + (this.boxingCdsContent?.content?.contentParameters?.NewDesignOnPointsValue ?? '')
                        : ''),
                awayPrice: SportBookMarketHelper.getCdsPriceStr(tempArray[1]?.visibility, tempArray[1]?.numerator, tempArray[1]?.denominator),
            });
        });
        return {
            id: game?.id,
            gameName: game?.name?.value?.toUpperCase(),
            selections: tempSelections,
            marketName: game?.name?.value?.toUpperCase(),
            marketDisplayTitle: game?.name?.value?.toUpperCase(),
        };
    };

    public getBoxingCdsContent(fixture: Fixture, gantryMarkets: Array<Markets>): BoxingCdsContent {
        if (!!fixture && fixture?.games?.length > 0) {
            if (this.errorService.isStaleDataAvailable) {
                this.errorService.unSetError();
            }
            this.boxingCdsContent.sportName = fixture?.sport?.name?.value?.toUpperCase();
            this.boxingCdsContent.title = StringHelper.getCdsFixtureTitle(fixture?.name?.value?.toUpperCase());
            this.boxingCdsContent.eventStartDate = fixture?.startDate;
            this.boxingCdsContent.competitionName = fixture?.competition?.name?.value;
            this.boxingCdsContent.context = fixture?.context;
            this.boxingCdsContent.games = [];

            const gamesArray = fixture?.games;
            if (gamesArray?.length) {
                this.boxingCdsContent.finalResult = new FinalResult();
                this.boxingCdsContent.roundGroupBetting = new RoundGroupBetting();
                this.boxingCdsContent.methodOfVictory = new MethodOfVictory();
                this.boxingCdsContent.individualRoundBetting = new IndividualBetting();
            }

            gamesArray?.map((game) => {
                const fightBetting = gantryMarkets
                    ?.find((x) => x.sport == Sports.CdsBoxing)
                    ?.markets?.find((y) => y.matches?.includes(BoxingCdsTemplateIds.FIGHTBETTING));
                if (!!fightBetting && fightBetting?.matches?.includes(game?.templateId?.toString())) {
                    this.boxingCdsContent.finalResult = this.getFightBettingData(game);
                }

                const roundGroupBetting = gantryMarkets
                    ?.find((x) => x.sport == Sports.CdsBoxing)
                    ?.markets?.find((y) => y.matches?.includes(BoxingCdsTemplateIds.ROUNDGROUPBETTING));
                if (!!roundGroupBetting && roundGroupBetting?.matches?.includes(game?.templateId?.toString())) {
                    this.boxingCdsContent.roundGroupBetting = this.getRoundGroupBetting(game);
                }

                const methodOfVictory = gantryMarkets
                    ?.find((x) => x.sport == Sports.CdsBoxing)
                    ?.markets?.find((y) => y.matches?.includes(BoxingCdsTemplateIds.METHODOFVICTORY));
                if (!!methodOfVictory && methodOfVictory?.matches?.includes(game?.templateId?.toString())) {
                    this.boxingCdsContent.methodOfVictory = this.getMethodOfVictory(game);
                }

                const individualRoundBetting = gantryMarkets
                    ?.find((x) => x.sport == Sports.CdsBoxing)
                    ?.markets?.find((y) => y.matches?.includes(BoxingCdsTemplateIds.ROUNDBETTING));
                if (!!individualRoundBetting && individualRoundBetting?.matches?.includes(game?.templateId?.toString())) {
                    this.boxingCdsContent.individualRoundBetting = this.getIndividualRoundBettingData(game?.results);
                }
            });
            return this.boxingCdsContent;
        } else {
            const errorMessage = 'Could not find Boxing Content for Url - ' + this.cdsClientService.fixturesUrl;
            this.errorService.setError(errorMessage);
        }
        return new BoxingCdsContent();
    }

    setDrawTitle(game: Game) {
        if (!!game?.results && !!game?.results?.[1]) {
            return (this.drawTitle = StringHelper.setDrawValue(
                game?.results?.[1].name?.value?.replace(',', '.'),
                this.boxingCdsContent?.content?.contentParameters ? this.boxingCdsContent?.content?.contentParameters?.Draw : '',
            ));
        }
        return '';
    }

    logError(message: string, status: string, fatal: boolean = false) {
        const errorLog: Log = {
            level: LogType.Error,
            message: message,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(errorLog);
    }
}
