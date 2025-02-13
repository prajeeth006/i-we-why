import { Injectable } from '@angular/core';

import { MessageEnvelope } from '@cds/push';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay, startWith, tap } from 'rxjs';

import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { CdsPushConstants } from '../../../../common/cds-client/models/cds-push-updates.constant';
import { Fixture, Fixtures, Game } from '../../../../common/cds-client/models/fixture.model';
import { JsonStringifyHelper } from '../../../../common/helpers/json-stringify.helper';
import { SportBookMarketHelper } from '../../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../../common/helpers/string.helper';
import { GantryCommonContent } from '../../../../common/models/gantry-commom-content.model';
import { Markets, Sports } from '../../../../common/models/gantrymarkets.model';
import { SelectionNameLength } from '../../../../common/models/general-codes-model';
import { ContentItemPaths } from '../../../../common/models/sport-content/sport-content-parameters.constants';
import { ErrorService } from '../../../../common/services/error.service';
import { GantryCommonContentService } from '../../../../common/services/gantry-common-content.service';
import { GantryMarketsService } from '../../../../common/services/gantry-markets.service';
import { HybridFixtureService } from '../../../../common/services/hybrid-fixture.service';
import { SportContentService } from '../../../../common/services/sport-content/sport-content.service';
import { SportCdsTemplateService } from '../../../common/services/sport-cds-template.service';
import { NflCdsContent, NflContentParams } from '../models/nfl-cds-content.model';
import { NflCdsTemplate } from '../models/nfl-cds-template.constant';

@Injectable({
    providedIn: 'root',
})
export class NflCdsService extends SportCdsTemplateService {
    errorMessage$ = this.errorService.errorMessage$;
    nflCdsContent: NflCdsContent = new NflCdsContent();
    fixtures$: Observable<Fixtures>;
    nflContentFromSitecore$: Observable<NflContentParams>;
    nflCdsContent$: Observable<NflCdsContent>;
    fixture: Fixture;
    fixtures: Fixtures;
    gantryMarkets$: Observable<Array<Markets>>;
    gantryMarkets: Array<Markets>;
    gantryCommonContent: GantryCommonContent;

    constructor(
        private cdsClientService: CdsClientService,
        private errorService: ErrorService,
        private sportContentService: SportContentService,
        gantryMarketsService: GantryMarketsService,
        private hybridFixtureService: HybridFixtureService,
        private gantryCommonContentService: GantryCommonContentService,
    ) {
        super(gantryMarketsService);
    }

    gantryCommonContent$ = this.gantryCommonContentService.data$.pipe(
        tap((gantryCommonContent: GantryCommonContent) => {
            JSON.stringify(gantryCommonContent, JsonStringifyHelper.replacer);
        }),
        startWith({} as GantryCommonContent), // Initial Value
    );

    public GetNflCdsContent(fixtureId: any, marketId: any, gameIds: any) {
        this.fixtures$ = this.cdsClientService.getFixtures(fixtureId, marketId, gameIds);
        this.gantryCommonContent$ = this.gantryCommonContentService?.data$.pipe(
            startWith({} as GantryCommonContent), // Initial Value
        );
        this.nflContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.nflCds);
        this.gantryMarkets$ = super.getGantryMarketDataContent();

        this.nflCdsContent$ = combineLatest([this.fixtures$, this.nflContentFromSitecore$, this.gantryMarkets$, this.gantryCommonContent$]).pipe(
            map(([fixtures, contentFromSitecore, gantryMarkets, gantryCommonContent]) => {
                if (!!fixtures && fixtures?.fixtures?.length) {
                    this.fixtures = fixtures;
                    this.fixture = fixtures?.fixtures[0];
                    this.gantryCommonContent = gantryCommonContent;
                    this.gantryMarkets = gantryMarkets;
                    this.nflCdsContent.content = contentFromSitecore;
                    if (!this.fixture?.hybridFixtureData) {
                        this.nflCdsContent = this.getNflCdsContent(this.fixture, this.gantryMarkets);
                    } else {
                        this.nflCdsContent = this.hybridFixtureService?.getUpdateHybridCdsContent(
                            this.fixture,
                            this.gantryMarkets,
                            gantryCommonContent,
                            contentFromSitecore,
                        );
                    }
                } else {
                    throw 'Could not find Nfl Content for Url - ' + this.cdsClientService.fixturesUrl;
                }
                return this.nflCdsContent;
            }),
            catchError((err) => {
                this.errorService.logError(err);
                return EMPTY;
            }),
            shareReplay(),
        );
    }

    public GetUpdatedNflCdsContent(messageEnvelope: MessageEnvelope): NflCdsContent {
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
                gameIndex = this.fixture?.games?.findIndex((x) => x.id == messageEnvelope?.payload?.gameId);
                this.fixture?.games.splice(gameIndex, 1);
            } else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
                this.fixture.startDate = messageEnvelope?.payload?.startDate;
            }
            return this.getNflCdsContent(this.fixture, this.gantryMarkets);
        }
        return new NflCdsContent();
    }

    getPlayerNames(inputString?: string, isNotHandicap?: boolean): string {
        inputString = inputString?.replace(',', '.');
        inputString = StringHelper.getValueWithoutBracket(inputString!);
        let formattedString = inputString?.trim();

        const regex = /([+-][\d.]+)/;
        const extractedValue = inputString?.match(regex);
        let result: string | null = null;

        if (extractedValue && extractedValue?.length > 1) {
            result = extractedValue[1];
            const playerNameString = inputString?.replace(result, '');
            return (formattedString =
                StringHelper.checkSelectionNameLengthAndTrimEnd(
                    playerNameString?.trim(),
                    !isNotHandicap ? SelectionNameLength.Fifteen : SelectionNameLength.Seventeen,
                ) +
                ' ' +
                result);
        }
        return (formattedString = StringHelper.checkSelectionNameLengthAndTrimEnd(
            formattedString,
            !isNotHandicap ? SelectionNameLength.Fifteen : SelectionNameLength.Seventeen,
        ));
    }

    prepareMatchBetting(nflCdsResult: NflCdsContent, game: Game, gantryMarkets: Array<Markets>) {
        let homePlayer_Name = this.getPlayerNames(game?.results[0]?.name?.value);
        let awayPlayer_Name = this.getPlayerNames(game?.results[1]?.name?.value);

        const game_Name = this.getGameNames(game?.templateId?.toString(), gantryMarkets);
        if (this.gantryMarketsService.hasMarket(Sports.CdsNfl, NflCdsTemplate.TOTALPOINTS, game?.templateId?.toString(), gantryMarkets)) {
            homePlayer_Name = this.getPlayerNames(game?.results[1]?.name?.value);
            awayPlayer_Name = this.getPlayerNames(game?.results[0]?.name?.value);
        } else if (this.gantryMarketsService.hasMarket(Sports.CdsNfl, NflCdsTemplate.MONEYLINE, game?.templateId?.toString(), gantryMarkets)) {
            const isNotHandicap: boolean = true;
            homePlayer_Name = this.getPlayerNames(game?.results[0]?.name?.value, isNotHandicap);
            awayPlayer_Name = this.getPlayerNames(game?.results[1]?.name?.value, isNotHandicap);
        } else if (
            this.gantryMarketsService.hasMarket(Sports.CdsNfl, NflCdsTemplate.FIRSTHALFMONEYLINE, game?.templateId?.toString(), gantryMarkets)
        ) {
            const isNotHandicap: boolean = true;
            homePlayer_Name = this.getPlayerNames(game?.results[0]?.name?.value, isNotHandicap);
            awayPlayer_Name = this.getPlayerNames(game?.results[1]?.name?.value, isNotHandicap);
        }
        nflCdsResult?.games?.push({
            id: game.id,
            gameName: game_Name,
            matchBetting: {
                homeBettingPrice: SportBookMarketHelper.getCdsPriceStr(
                    game?.results[0]?.visibility,
                    game?.results[0]?.numerator,
                    game?.results[0]?.denominator,
                ),
                homePlayer: homePlayer_Name,
                awayBettingPrice: SportBookMarketHelper.getCdsPriceStr(
                    game?.results[1]?.visibility,
                    game?.results[1]?.numerator,
                    game?.results[1]?.denominator,
                ),
                awayPlayer: awayPlayer_Name,
            },
        });
    }

    getGameNames(templateId: string, gantryMarkets: Array<Markets>): string {
        if (this.nflCdsContent?.content?.contentParameters) {
            if (this.gantryMarketsService.hasMarket(Sports.CdsNfl, NflCdsTemplate.TOTALPOINTS, templateId, gantryMarkets)) {
                return this.nflCdsContent?.content?.contentParameters?.TotalPoints;
            } else if (this.gantryMarketsService.hasMarket(Sports.CdsNfl, NflCdsTemplate.MONEYLINE, templateId, gantryMarkets)) {
                return this.nflCdsContent?.content?.contentParameters?.MoneyLine1;
            } else if (this.gantryMarketsService.hasMarket(Sports.CdsNfl, NflCdsTemplate.SPREAD, templateId, gantryMarkets)) {
                return this.nflCdsContent?.content?.contentParameters?.Spread;
            } else if (this.gantryMarketsService.hasMarket(Sports.CdsNfl, NflCdsTemplate.FIRSTHALFMONEYLINE, templateId, gantryMarkets)) {
                return this.nflCdsContent?.content?.contentParameters?.FirstHalfMoneyLine;
            } else if (this.gantryMarketsService.hasMarket(Sports.CdsNfl, NflCdsTemplate.FIRSTHALFSPREAD, templateId, gantryMarkets)) {
                return this.nflCdsContent?.content?.contentParameters?.FirstHalfSpread;
            }
        }
        return '';
    }

    public getNflCdsContent(fixture: Fixture, gantryMarkets: Array<Markets>): NflCdsContent {
        if (fixture && fixture?.games?.length > 0) {
            if (this.errorService.isStaleDataAvailable) {
                this.errorService.unSetError();
            }
            if (fixture?.sport?.name?.value) {
                this.nflCdsContent.sportName = fixture?.sport?.name?.value;
                this.nflCdsContent.title = StringHelper.getValueWithoutBracket(fixture?.name?.value)?.replace('-', '@')?.trim();
                this.nflCdsContent.eventStartDate = fixture?.startDate;
                this.nflCdsContent.competitionName = fixture?.competition?.name?.value;
                this.nflCdsContent.context = fixture?.context;

                this.nflCdsContent.games = [];
                const gamesArray = fixture?.games;
                const gamesSortedArray = [];
                for (let i = 0; i < gamesArray?.length; i++) {
                    if (
                        this.gantryMarketsService.hasMarket(
                            Sports.CdsNfl,
                            NflCdsTemplate.MONEYLINE,
                            gamesArray[i]?.templateId?.toString(),
                            gantryMarkets,
                        )
                    ) {
                        gamesSortedArray[0] = gamesArray[i];
                    } else if (
                        this.gantryMarketsService.hasMarket(
                            Sports.CdsNfl,
                            NflCdsTemplate.SPREAD,
                            gamesArray[i]?.templateId?.toString(),
                            gantryMarkets,
                        )
                    ) {
                        gamesSortedArray[1] = gamesArray[i];
                    } else if (
                        this.gantryMarketsService.hasMarket(
                            Sports.CdsNfl,
                            NflCdsTemplate.TOTALPOINTS,
                            gamesArray[i]?.templateId?.toString(),
                            gantryMarkets,
                        )
                    ) {
                        gamesSortedArray[2] = gamesArray[i];
                    } else if (
                        this.gantryMarketsService.hasMarket(
                            Sports.CdsNfl,
                            NflCdsTemplate.FIRSTHALFMONEYLINE,
                            gamesArray[i]?.templateId?.toString(),
                            gantryMarkets,
                        )
                    ) {
                        gamesSortedArray[3] = gamesArray[i];
                    } else if (
                        this.gantryMarketsService.hasMarket(
                            Sports.CdsNfl,
                            NflCdsTemplate.FIRSTHALFSPREAD,
                            gamesArray[i]?.templateId?.toString(),
                            gantryMarkets,
                        )
                    ) {
                        gamesSortedArray[4] = gamesArray[i];
                    }
                }
                gamesSortedArray?.forEach((x) => {
                    this.prepareMatchBetting(this.nflCdsContent, x, gantryMarkets);
                });
            }
            return this.nflCdsContent;
        } else {
            const errorMessage = 'Could not find Nfl Content for Url - ' + this.cdsClientService.fixturesUrl;
            this.errorService.setError(errorMessage);
        }
        return new NflCdsContent();
    }
}
