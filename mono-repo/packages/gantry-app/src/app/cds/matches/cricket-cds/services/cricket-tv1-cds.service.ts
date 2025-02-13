import { Injectable } from '@angular/core';

import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { Fixture } from '../../../../common/cds-client/models/fixture.model';
import { Markets, Sports } from '../../../../common/models/gantrymarkets.model';
import { EventStatus } from '../../../../common/models/general-codes-model';
import { ErrorService } from '../../../../common/services/error.service';
import { GantryMarketsService } from '../../../../common/services/gantry-markets.service';
import { CricketCdsTemplateModel, GameInfo } from '../../../common/models/cricket-cds-template.model';
import { TradingPartition } from '../../../common/models/sport-cds-template.constant';
import { VisibilityFlags } from '../../../common/models/sport-cds-template.model';
import { SportCdsTemplateService } from '../../../common/services/sport-cds-template.service';
import { CricketCdsTemplate } from '../models/cricket-cds-template.constant';
import { CricketCdsCommonService } from './cricket-cds-common.service';

@Injectable({
    providedIn: 'root',
})
export class CricketTv1CdsService extends SportCdsTemplateService {
    constructor(
        gantryMarketsService: GantryMarketsService,
        private cdsClientService: CdsClientService,
        private errorService: ErrorService,
        private cricketCdsCommonService: CricketCdsCommonService,
    ) {
        super(gantryMarketsService);
    }

    public prepareCricketTv1CdsContent(fixture: Fixture, gantryMarkets: Array<Markets>, cricketCdsResult: CricketCdsTemplateModel) {
        const isAnyMarketsPresent = super.isAnyMarketPresent(fixture?.games, VisibilityFlags.Visibility);
        if (isAnyMarketsPresent) {
            this.cricketCdsCommonService.contentParameters = cricketCdsResult?.content?.contentParameters ?? {};
            let gameInfo = this.prepareCdsTv1GameInfo(fixture, gantryMarkets);
            cricketCdsResult.gameInfo = gameInfo;
        } else {
            const errorMessage = 'Could not find Cricket CDS Content for Url - ' + this.cdsClientService?.fixturesUrl;
            this.errorService.setError(errorMessage);
        }
    }

    prepareCdsTv1GameInfo(fixture: Fixture, gantryMarkets: Array<Markets>): GameInfo {
        let gameInfo = new GameInfo();
        const optionMarkets = super.setParticipantsToMarkets(fixture?.games, fixture?.participants);
        for (const optionMarket of optionMarkets) {
            if (optionMarket?.visibility?.toLowerCase() == EventStatus.Visible.toLowerCase()) {
                const options = optionMarket?.results;

                const isAnyOptionPresent = super.isAnyOptionPresent(options, VisibilityFlags.Visibility);
                if (isAnyOptionPresent) {
                    this.errorService.unSetErrorOnStaleDataAvailable();

                    if (
                        this.gantryMarketsService.hasMarket(
                            Sports.CdsCricket,
                            CricketCdsTemplate.MATCHBETTING,
                            optionMarket?.templateId?.toString(),
                            gantryMarkets,
                        )
                    ) {
                        gameInfo.markets.matchBetting = this.cricketCdsCommonService.prepareMatchBetting(
                            optionMarket,
                            gameInfo.gameFlags,
                            TradingPartition.TV1,
                        );
                    } else if (
                        this.gantryMarketsService.hasMarket(
                            Sports.CdsCricket,
                            CricketCdsTemplate.TOPHOMERUNSCORER,
                            optionMarket?.templateId?.toString(),
                            gantryMarkets,
                        )
                    ) {
                        gameInfo.markets.topHomeRunScorer = this.cricketCdsCommonService.prepareHomeAwayTeamTopRunScorer(
                            optionMarket,
                            TradingPartition.TV1,
                        );
                    } else if (
                        this.gantryMarketsService.hasMarket(
                            Sports.CdsCricket,
                            CricketCdsTemplate.TOPAWAYRUNSCORER,
                            optionMarket?.templateId?.toString(),
                            gantryMarkets,
                        )
                    ) {
                        gameInfo.markets.topAwayRunScorer = this.cricketCdsCommonService.prepareHomeAwayTeamTopRunScorer(
                            optionMarket,
                            TradingPartition.TV1,
                        );
                    } else if (
                        this.gantryMarketsService.hasMarket(
                            Sports.CdsCricket,
                            CricketCdsTemplate.TOTALMATCHSIXES,
                            optionMarket?.templateId?.toString(),
                            gantryMarkets,
                        )
                    ) {
                        gameInfo.markets.totalSixes = this.cricketCdsCommonService.prepareTotalSixes(optionMarket, TradingPartition.TV1);
                    } else if (
                        this.gantryMarketsService.hasMarket(
                            Sports.CdsCricket,
                            CricketCdsTemplate.TESTMATCHBETTING,
                            optionMarket?.templateId?.toString(),
                            gantryMarkets,
                        )
                    ) {
                        gameInfo.gameFlags.isTestMatch = true;
                        gameInfo.markets.matchBetting = this.cricketCdsCommonService.prepareMatchBetting(
                            optionMarket,
                            gameInfo.gameFlags,
                            TradingPartition.TV1,
                        );
                    } else if (
                        this.gantryMarketsService.hasMarket(
                            Sports.CdsCricket,
                            CricketCdsTemplate.SUPEROVER,
                            optionMarket?.templateId?.toString(),
                            gantryMarkets,
                        )
                    ) {
                        gameInfo.gameFlags.isSuperOver = true;
                        gameInfo.markets.matchBetting = this.cricketCdsCommonService.prepareMatchBetting(
                            optionMarket,
                            gameInfo.gameFlags,
                            TradingPartition.TV1,
                        );
                    }
                } else {
                    optionMarket.status = EventStatus.Suspended;
                    const errorMessage = 'Could not find Cricket CDS Content for Url - ' + this.cdsClientService?.fixturesUrl;
                    this.errorService.setError(errorMessage);
                }
            } else {
                optionMarket.status = EventStatus.Suspended;
                const errorMessage = 'Could not find Cricket CDS Content for Url - ' + this.cdsClientService?.fixturesUrl;
                this.errorService.setError(errorMessage);
            }
        }
        return gameInfo;
    }
}
