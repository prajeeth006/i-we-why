import { Injectable } from '@angular/core';

import { MessageEnvelope } from '@cds/push';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay } from 'rxjs';

import { CdsClientService } from '../../../common/cds-client/cds-client-service.service';
import { CdsPushConstants } from '../../../common/cds-client/models/cds-push-updates.constant';
import { Fixture, Fixtures, Game, Result } from '../../../common/cds-client/models/fixture.model';
import { SportBookMarketHelper } from '../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../common/helpers/string.helper';
import { Markets } from '../../../common/models/gantrymarkets.model';
import { ContentItemPaths } from '../../../common/models/sport-content/sport-content-parameters.constants';
import { ErrorService } from '../../../common/services/error.service';
import { GantryMarketsService } from '../../../common/services/gantry-markets.service';
import { Log, LogType, LoggerService } from '../../../common/services/logger.service';
import { SportContentService } from '../../../common/services/sport-content/sport-content.service';
import { SportCdsTemplateService } from '../../common/services/sport-cds-template.service';
import { FinalResult, OutRightCdsContent, OutRightContentParams, Selections, SeriesCorrectScore } from '../models/outright-cds.model';

@Injectable({
    providedIn: 'root',
})
export class OutrightCdsService extends SportCdsTemplateService {
    outRightCDSContent: OutRightCdsContent = new OutRightCdsContent();
    fixtures$: Observable<Fixtures>;
    outRightContentFromSitecore$: Observable<OutRightContentParams>;
    outRightCDSContent$: Observable<OutRightCdsContent>;
    errorMessage$ = this.errorService.errorMessage$;
    gantryMarkets$: Observable<Array<Markets>>;
    gantryMarkets: Array<Markets>;
    fixtures: Fixtures;
    fixture: Fixture;

    constructor(
        gantryMarketsService: GantryMarketsService,
        private cdsClientService: CdsClientService,
        private errorService: ErrorService,
        private loggerService: LoggerService,
        private sportContentService: SportContentService,
    ) {
        super(gantryMarketsService);
    }

    public GetOutRightCdsContent(fixtureId: any, marketId: any, gameIds: any) {
        this.fixtures$ = this.cdsClientService.getFixtures(fixtureId, marketId, gameIds);
        this.outRightContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.outrightCds);
        this.gantryMarkets$ = super.getGantryMarketDataContent();
        this.outRightCDSContent$ = combineLatest([this.fixtures$, this.outRightContentFromSitecore$, this.gantryMarkets$]).pipe(
            map(([fixtures, contentFromSitecore, gantryMarkets]) => {
                if (!!fixtures && fixtures?.fixtures?.length) {
                    this.fixtures = fixtures;
                    this.fixture = fixtures?.fixtures[0];
                    this.gantryMarkets = gantryMarkets;
                    this.outRightCDSContent.content = contentFromSitecore;
                    this.outRightCDSContent = this.getOutRightCdsContent(this.fixture);
                } else {
                    throw 'Could not find OutRight Content for Url - ' + this.cdsClientService.fixturesUrl;
                }
                return this.outRightCDSContent;
            }),
            catchError((err) => {
                this.errorService.logError(err);
                this.logError(err, 'Error');
                return EMPTY;
            }),
            shareReplay(),
        );
    }

    public GetUpdatedOutRightCdsContent(messageEnvelope: MessageEnvelope): OutRightCdsContent {
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
            this.errorService.unSetError();
            if (!this.fixture?.games || this.fixture?.games?.length === 0) {
                const errorMessage = 'No games available for Url: ' + this.cdsClientService.fixturesUrl;
                this.errorService.logError(errorMessage);
                this.errorService.setError(errorMessage);
                return new OutRightCdsContent();
            }

            return this.getOutRightCdsContent(this.fixture);
        }
        return new OutRightCdsContent();
    }

    prepareSelections = (results: Result[]): Selections[] => {
        let selections: Selections[] = results.map((result) => {
            return {
                selectionPrice: SportBookMarketHelper.getCdsPriceStr(result?.visibility, result?.numerator, result?.denominator),
                selectionName: StringHelper.getCdsFixtureTitle(result?.name?.value?.replace(',', '.')),
            };
        });

        selections = SportBookMarketHelper.sortSelectionsByPrice(selections);
        const activeSelections = StringHelper.getValidSelections(selections);
        return activeSelections;
    };

    prepareSeriesCorrectScore = (results: Result[]): Selections[] => {
        let selections: Selections[] = results.map((result) => {
            return {
                selectionPrice: SportBookMarketHelper.getCdsPriceStr(result?.visibility, result?.numerator, result?.denominator),
                selectionName: result?.name?.value?.toUpperCase()?.replace(',', '.'),
            };
        });

        selections = SportBookMarketHelper.sortSelectionsByPrice(selections);
        const activeSelections = StringHelper.getValidSelections(selections);

        return activeSelections;
    };

    getOutrightSelectionData = (game: Game, typeId?: number): FinalResult => {
        return {
            id: game.id,
            gameName:
                !!typeId && !!this.outRightCDSContent?.content?.contentParameters
                    ? this.outRightCDSContent?.content?.contentParameters[typeId]?.toUpperCase()
                    : '',
            selections: this.prepareSelections(game?.results),
        };
    };

    getSeriesCorrectScore = (game: Game, typeId?: number): SeriesCorrectScore => {
        return {
            id: game.id,
            gameName:
                !!typeId && !!this.outRightCDSContent?.content?.contentParameters
                    ? this.outRightCDSContent?.content?.contentParameters[typeId]?.toUpperCase()
                    : '',
            selections: this.prepareSeriesCorrectScore(game?.results),
        };
    };

    public getOutRightCdsContent(fixture: Fixture): OutRightCdsContent {
        if (this.errorService.isSnapshotDataAvailable) {
            this.errorService.unSetError();
        }
        this.outRightCDSContent.sportName = fixture?.sport?.name?.value?.toUpperCase();
        this.outRightCDSContent.title = StringHelper.getCdsOutrightFixtureTitle(fixture?.name?.value?.toUpperCase());
        this.outRightCDSContent.eventStartDate = fixture?.startDate;
        this.outRightCDSContent.games = [];
        this.outRightCDSContent.typeId = fixture?.games[0]?.templateId;
        const gamesArray = fixture?.games;

        gamesArray?.map((game) => {
            this.outRightCDSContent.finalResult =
                game?.name?.value === this.outRightCDSContent?.content?.contentParameters?.seriesCorrectScore
                    ? this.getSeriesCorrectScore(game)
                    : this.getOutrightSelectionData(game, this.outRightCDSContent?.typeId);
        });

        return this.outRightCDSContent;
    }

    logError(message: string, status: string, fatal: boolean = false) {
        const errorLog: Log = {
            level: LogType.Error,
            message: message,
            status: status,
            fatal: fatal,
        };
        this.loggerService?.log(errorLog);
    }
}
