import { Injectable } from '@angular/core';

import { Log, LogType, LoggerService } from 'packages/gantry-app/src/app/common/services/logger.service';

import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { Fixture } from '../../../../common/cds-client/models/fixture.model';
import { EventStatus } from '../../../../common/models/general-codes-model';
import { ErrorService } from '../../../../common/services/error.service';
import { GantryMarketsService } from '../../../../common/services/gantry-markets.service';
import { CricketCdsTemplateModel, GameInfo } from '../../../common/models/cricket-cds-template.model';
import { SportCdsTemplate } from '../../../common/models/sport-cds-template.constant';
import { VisibilityFlags } from '../../../common/models/sport-cds-template.model';
import { SportCdsTemplateService } from '../../../common/services/sport-cds-template.service';
import { CricketCdsCommonService } from './cricket-cds-common.service';

@Injectable({
    providedIn: 'root',
})
export class CricketTv2CdsService extends SportCdsTemplateService {
    contentParameters: {
        [attr: string]: string;
    };
    constructor(
        gantryMarketsService: GantryMarketsService,
        private cdsClientService: CdsClientService,
        private errorService: ErrorService,
        private cricketCdsCommonService: CricketCdsCommonService,
        private loggerService: LoggerService,
    ) {
        super(gantryMarketsService);
    }

    public prepareCricketTv2CdsContent(fixture: Fixture, cricketCdsResult: CricketCdsTemplateModel) {
        const isAnyMarketsPresent = super.isAnyMarketPresent(fixture?.optionMarkets, VisibilityFlags.Status);
        if (isAnyMarketsPresent) {
            this.contentParameters = cricketCdsResult?.content?.contentParameters ?? {};
            this.cricketCdsCommonService.contentParameters = cricketCdsResult?.content?.contentParameters ?? {};
            const gameInfo = this.prepareCdsTv2GameInfo(fixture);
            cricketCdsResult.gameInfo = gameInfo;
        } else {
            const errorMessage = 'Could not find Cricket CDS Content for Url - ' + this.cdsClientService?.fixturesUrl;
            this.errorService.setError(errorMessage);
        }
    }

    prepareCdsTv2GameInfo(fixture: Fixture): GameInfo {
        let gameInfo = new GameInfo();
        const optionMarkets = super.setParticipantsToMarkets(fixture?.optionMarkets, fixture?.participants);

        for (const optionMarket of optionMarkets) {
            if (optionMarket?.status?.toLowerCase() == EventStatus.Visible.toLowerCase()) {
                const options = optionMarket?.options;

                const isAnyOptionPresent = super.isAnyOptionPresent(options, VisibilityFlags.Status);
                if (isAnyOptionPresent) {
                    this.errorService.unSetErrorOnStaleDataAvailable();

                    const marketName = this.getMarketName(optionMarket);
                    this.cricketCdsCommonService.updateGameFlags(gameInfo.gameFlags, optionMarket);

                    switch (marketName) {
                        case SportCdsTemplate?.cticket?.MATCHBETTING:
                            gameInfo.markets.matchBetting = this.cricketCdsCommonService.prepareMatchBetting(optionMarket, gameInfo.gameFlags);
                            break;
                        case SportCdsTemplate?.cticket?.TOPHOMEBATTER:
                            gameInfo.markets.topHomeRunScorer = this.cricketCdsCommonService.prepareHomeAwayTeamTopRunScorer(optionMarket);
                            break;
                        case SportCdsTemplate?.cticket?.TOPAWAYBATTER:
                            gameInfo.markets.topAwayRunScorer = this.cricketCdsCommonService.prepareHomeAwayTeamTopRunScorer(optionMarket);
                            break;
                        case SportCdsTemplate?.cticket?.TOTALMATCHSIXES:
                            gameInfo.markets.totalSixes = this.cricketCdsCommonService.prepareTotalSixes(optionMarket);
                            break;
                        case SportCdsTemplate?.cticket?.TESTMATCHBETTING:
                            gameInfo.markets.matchBetting = this.cricketCdsCommonService.prepareMatchBetting(optionMarket, gameInfo.gameFlags);
                            break;
                        case SportCdsTemplate?.cticket?.TESTMATCHTOPHOMEBATTER:
                            gameInfo.markets.topHomeRunScorer = this.cricketCdsCommonService.prepareHomeAwayTeamTopRunScorer(optionMarket);
                            break;
                        case SportCdsTemplate?.cticket?.TESTMATCHTOPAWAYBATTER:
                            gameInfo.markets.topAwayRunScorer = this.cricketCdsCommonService.prepareHomeAwayTeamTopRunScorer(optionMarket);
                            break;
                    }
                } else {
                    optionMarket.status = EventStatus.Suspended;
                    const errorMessage = 'Could not find Cricket CDS Content for Url - ' + this.cdsClientService?.fixturesUrl;
                    this.errorService.setError(errorMessage);
                }
            }
        }
        return gameInfo;
    }

    getMarketName(optionMarket: any): string {
        const martketParameters = super.transformMarketParameters(optionMarket?.parameters);
        let marketName = '';

        try {
            const marketDetails = this.contentParameters?.CricketParameters;
            if (!!marketDetails) {
                const cricketMarketDetails = JSON.parse(marketDetails)[0];
                for (const market in cricketMarketDetails) {
                    const marketData = cricketMarketDetails[market];
                    if (!!marketData?.MarketType && marketData?.MarketType == martketParameters?.MarketType) {
                        if (!!marketData?.Happening && marketData?.Happening == martketParameters?.Happening) {
                            if (!!marketData?.Period && marketData?.Period == martketParameters?.Period) {
                                if (!!martketParameters?.FixtureParticipant && !!marketData.FixtureParticipant) {
                                    const teamType = super.getTeamTypeByParticipantId(
                                        optionMarket?.participants,
                                        martketParameters?.FixtureParticipant?.toString(),
                                    );
                                    if (marketData.FixtureParticipant == teamType) {
                                        if (!!marketData?.Position && marketData?.Position == martketParameters?.Position) {
                                            if (!!marketData?.Places && marketData?.Places == martketParameters?.Places) {
                                                marketName = market;
                                            }
                                        }
                                    }
                                } else {
                                    marketName = market;
                                }
                            }
                        }
                    }
                }
            } else {
                this.logError('no marketDetails available', 'Error');
            }
        } catch (e) {
            this.logError('Unable to process marketDetails', 'Error');
        }

        return marketName;
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
