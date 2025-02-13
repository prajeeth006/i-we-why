import { Injectable } from '@angular/core';

import { MessageEnvelope } from '@cds/push';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay } from 'rxjs';

import { CdsClientService } from '../../../common/cds-client/cds-client-service.service';
import { CdsPushConstants } from '../../../common/cds-client/models/cds-push-updates.constant';
import { Fixture, Fixtures } from '../../../common/cds-client/models/fixture.model';
import { SportBookMarketHelper } from '../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../common/helpers/string.helper';
import { EventStatus } from '../../../common/models/general-codes-model';
import { MarketParameters } from '../../../common/models/market-parameters.model';
import { ContentItemPaths } from '../../../common/models/sport-content/sport-content-parameters.constants';
import { ErrorService } from '../../../common/services/error.service';
import { Log, LogType, LoggerService } from '../../../common/services/logger.service';
import { SportContentService } from '../../../common/services/sport-content/sport-content.service';
import { FinalResult, Game, OutRightCdsContent, OutRightContentParams, Result, Selections } from '../models/outright-cds.model';
import { OutrighCdsTv2SpecialService } from './outrigh-cds-tv2-special.service';

@Injectable({
    providedIn: 'root',
})
export class OutrightCdsTv2Service {
    outRightCDSTv2Content: OutRightCdsContent = new OutRightCdsContent();
    fixtures$: Observable<Fixtures>;
    outRightTv2ContentFromSitecore$: Observable<OutRightContentParams>;
    outRightCDSTv2Content$: Observable<OutRightCdsContent>;
    errorMessage$ = this.errorService.errorMessage$;
    fixtures: Fixtures;
    fixture: Fixture;
    offerMappings: string = 'Filtered';

    constructor(
        private cdsClientService: CdsClientService,
        private errorService: ErrorService,
        private loggerService: LoggerService,
        private sportContentService: SportContentService,
        private outrighCdsTv2SpecialService: OutrighCdsTv2SpecialService,
    ) {}

    public getOutRightCdsTv2Content(
        fixtureId: any,
        marketId: any,
        gameIds: any,
        isSpecial: boolean = false,
        offerMappings: string = this.offerMappings,
    ) {
        this.outRightTv2ContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.outrightCDS);
        gameIds = '';
        this.fixtures$ = this.cdsClientService.getFixtures(fixtureId, marketId, gameIds, offerMappings, isSpecial);
        this.outRightCDSTv2Content$ = combineLatest([this.fixtures$, this.outRightTv2ContentFromSitecore$]).pipe(
            map(([fixtures, outrightCdsContent]) => {
                if (!!fixtures && fixtures?.fixtures?.length) {
                    this.fixtures = fixtures;
                    this.fixture = fixtures?.fixtures[0];
                    this.outRightCDSTv2Content.content = outrightCdsContent;
                    this.outRightCDSTv2Content = isSpecial
                        ? this.outrighCdsTv2SpecialService.getOutRightTv2Content(this.fixture, outrightCdsContent)
                        : this.getOutRightTv2Content(this.fixture, outrightCdsContent);
                } else {
                    throw 'Could not find OutRight tv2 Content for Url - ' + this.cdsClientService.fixturesUrl;
                }
                return this.outRightCDSTv2Content;
            }),
            catchError((err) => {
                this.errorService.logError(err);
                return EMPTY;
            }),
            shareReplay(),
        );
    }

    public getOutRightTv2Content(fixture: Fixture, outrightCdsContent?: OutRightContentParams): OutRightCdsContent {
        if (outrightCdsContent) this.outRightCDSTv2Content.content = outrightCdsContent;
        this.outRightCDSTv2Content.sportName = fixture?.sport?.name?.value?.toUpperCase();
        this.outRightCDSTv2Content.title = StringHelper.getCdsOutrightFixtureTitle(fixture?.name?.value?.toUpperCase());
        this.outRightCDSTv2Content.eventStartDate = fixture?.startDate;
        this.outRightCDSTv2Content.games = [];
        const gamesArray = fixture?.optionMarkets;
        if (!fixture) {
            const errorMessage = 'Data is not available for the CDS client url: ' + this.cdsClientService.fixturesUrl;
            this.errorService.setError(errorMessage);
        } else {
            gamesArray?.map((game) => {
                if (!!game && game?.status?.toUpperCase() == EventStatus.Suspended) {
                    const errorMessage = 'This tournament has been Suspended : ' + this.cdsClientService.fixturesUrl;
                    this.errorService.setError(errorMessage);
                } else {
                    if (this.errorService.isSnapshotDataAvailable) {
                        this.errorService.unSetError();
                    }
                    this.outRightCDSTv2Content.finalResult = this.getOutrightSelectionData(game);
                }
            });

            if (!this.outRightCDSTv2Content?.finalResult?.selections || this.outRightCDSTv2Content?.finalResult?.selections?.length <= 0) {
                const errorMessage = 'No selections to display: ' + this.cdsClientService.fixturesUrl;
                this.errorService.setError(errorMessage);
            }

            if (fixture?.optionMarkets && fixture?.optionMarkets?.length > 0 && fixture.optionMarkets[0].placeTerms) {
                this.outRightCDSTv2Content.eachWayTerms = SportBookMarketHelper.getDarkThemeEachWayString(
                    fixture.optionMarkets[0].placeTerms,
                    this.outRightCDSTv2Content?.content,
                );
            }
        }
        return this.outRightCDSTv2Content;
    }

    public getUpdatedOutRightCdsTv2Content(messageEnvelope: MessageEnvelope): OutRightCdsContent {
        let marketIndex = 0;
        if (messageEnvelope.messageType) {
            if (messageEnvelope.messageType == CdsPushConstants.optionMarketUpdate) {
                if (messageEnvelope?.payload?.optionMarket?.id && this.fixture?.optionMarkets) {
                    marketIndex = this.fixture?.optionMarkets?.findIndex((x) => x.id == messageEnvelope?.payload?.optionMarket?.id);
                    if (marketIndex != -1) {
                        this.fixture.optionMarkets[marketIndex] = messageEnvelope?.payload?.optionMarket;
                    } else {
                        this.fixture?.optionMarkets?.push(messageEnvelope?.payload?.optionMarket);
                    }
                }
            } else if (messageEnvelope.messageType == CdsPushConstants.optionMarketDelete) {
                if (this.fixture?.optionMarkets) {
                    marketIndex = this.fixture?.optionMarkets?.findIndex((x) => x.id == messageEnvelope?.payload?.optionMarket);
                    this.fixture?.optionMarkets?.splice(marketIndex, 1);
                }
            } else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
                this.fixture.startDate = messageEnvelope?.payload?.startDate;
            }
            return this.getOutRightTv2Content(this.fixture);
        }
        return new OutRightCdsContent();
    }

    getOutrightSelectionData = (game: Game): FinalResult => {
        return {
            id: game.id,
            gameName: this.getMarketName(game),
            selections: game?.options?.length ? this.prepareSelections(game?.options) : [],
        };
    };

    prepareSelections = (results: Result[]): Selections[] => {
        let numerator: number;
        let denominator: number;
        let selections: Selections[] = results.map((result) => {
            return {
                selectionPrice: SportBookMarketHelper.getCdsPriceStr(
                    result?.status,
                    result?.price ? result?.price?.numerator : numerator,
                    result?.price ? result?.price?.denominator : denominator,
                ),
                selectionName: StringHelper.getCdsFixtureTitle(result?.name ? result?.name?.value?.replace(',', '.') : ''),
            };
        });
        selections = SportBookMarketHelper.sortSelectionsByPrice(selections);
        const activeSelections = StringHelper.getValidSelections(selections);
        return activeSelections;
    };

    getMarketName(game: Game) {
        const skippedMarkets: { [key: string]: any } = {};
        let marketName = '';
        let getXValue: number | undefined;
        const marketParameters: MarketParameters = new MarketParameters();
        const marketDetails = this.outRightCDSTv2Content?.content?.contentParameters?.Football ?? '';
        if (marketDetails) {
            const footballMarketDetails = JSON.parse(marketDetails)[0];
            game?.parameters?.forEach((parameter) => {
                marketParameters[parameter.key] = parameter.value;
                getXValue = marketParameters?.Places as number;
            });

            for (const market in footballMarketDetails) {
                const marketData = footballMarketDetails[market];
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
            for (const market in skippedMarkets) {
                const marketData = skippedMarkets[market];
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
            const newMarketName = getXValue && marketName ? marketName?.replace('$', getXValue?.toString()) : '';
            marketName = newMarketName;
        }
        return marketName?.toUpperCase();
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
