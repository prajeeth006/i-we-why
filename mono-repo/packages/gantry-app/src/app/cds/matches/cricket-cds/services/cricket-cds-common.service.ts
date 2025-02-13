import { Injectable } from '@angular/core';

import { SportBookMarketHelper } from '../../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../../common/helpers/string.helper';
import { SelectionStatus } from '../../../../common/models/general-codes-model';
import { GantryMarketsService } from '../../../../common/services/gantry-markets.service';
import { GameFlags } from '../../../common/models/cricket-cds-template.model';
import { TradingPartition } from '../../../common/models/sport-cds-template.constant';
import { BetDetails, MarketDetails, TopTeamRunScorer } from '../../../common/models/sport-cds-template.model';
import { SportCdsTemplateService } from '../../../common/services/sport-cds-template.service';

@Injectable({
    providedIn: 'root',
})
export class CricketCdsCommonService extends SportCdsTemplateService {
    drawTitle: string;

    contentParameters: {
        [attr: string]: string;
    } = {};

    constructor(gantryMarketsService: GantryMarketsService) {
        super(gantryMarketsService);
    }

    /**
     * ? If the Match Betting market is hidden or suspended in WebTc(Tv2) we won't be getting the match betting market info in the fixture response.
     * * So we can't determine if the event is a Test Match or an ODI
     */
    updateGameFlags(gameFlags: GameFlags, optionMarket: any) {
        const martketParameters = super.transformMarketParameters(optionMarket?.parameters);
        switch (martketParameters.MarketType) {
            case this.contentParameters.TwoWay:
                gameFlags.isSuperOver = true;
                break;
            case this.contentParameters.ThreeWay:
                gameFlags.isTestMatch = true;
                break;
        }
    }

    prepareMatchBetting(optionMarket: any, gameFlags: GameFlags, tradingPartition: string = TradingPartition.TV2) {
        let marketDetails: MarketDetails = new MarketDetails();
        super.updateBaseMarketDetails(marketDetails, optionMarket, tradingPartition);

        const selections = super.getMarketSelections(tradingPartition, optionMarket);
        const marketInfo = this.getMatchBettingMarketInfo(tradingPartition, optionMarket, selections, gameFlags?.isTestMatch);
        marketDetails.marketSelections = super.prepareMarketSelections(marketInfo);
        marketDetails.drawTitle = this.updateDrawTitle(marketInfo.drawDetails, gameFlags);

        return marketDetails;
    }

    getMatchBettingMarketInfo(tradingPartition: string, optionMarket: any, selections: any, hasDrawAvailable: boolean = false) {
        let homeTeamDetails;
        let drawDetails;
        let awayTeamDetails;

        if (tradingPartition === TradingPartition.TV1) {
            if (hasDrawAvailable) {
                homeTeamDetails = selections[0];
                drawDetails = selections[1];
                awayTeamDetails = selections[2];
            } else {
                homeTeamDetails = selections[0];
                awayTeamDetails = selections[1];
            }
            const marketInfo = {
                homeTeamDetails,
                drawDetails,
                awayTeamDetails,
            };
            return marketInfo;
        } else {
            let participantEnums = JSON.parse(this.contentParameters.Participants);
            let marketInfo = super.getMarketInfo(optionMarket, selections, participantEnums, hasDrawAvailable);
            return marketInfo;
        }
    }

    prepareTotalSixes(optionMarket: any, tradingPartition: string = TradingPartition.TV2) {
        let marketDetails: MarketDetails = new MarketDetails();
        super.updateBaseMarketDetails(marketDetails, optionMarket, tradingPartition);
        let selections = super.getMarketSelections(tradingPartition, optionMarket);
        // Over 8,5 converted to  Over 8.5
        selections?.forEach((selection: any) => (selection.name.value = selection?.name?.value?.replace(',', '.')));

        const marketInfo = this.getTotalSixesMarketInfo(tradingPartition, selections);

        marketDetails.marketSelections = super.prepareMarketSelections(marketInfo);

        return marketDetails;
    }

    getTotalSixesMarketInfo(tradingPartition: string, selections: any) {
        let homeTeamDetails;
        let awayTeamDetails;
        const optionTypeEnums = JSON.parse(this.contentParameters.OptionTypes);
        if (tradingPartition === TradingPartition.TV1) {
            homeTeamDetails = selections[0];
            awayTeamDetails = selections[1];
        } else {
            selections?.forEach((selection: any) => {
                if (selection?.parameters?.optionTypes[0].toLowerCase() === optionTypeEnums.Over.toLowerCase()) {
                    homeTeamDetails = selection;
                } else {
                    awayTeamDetails = selection;
                }
            });
        }
        const marketInfo = {
            homeTeamDetails,
            awayTeamDetails,
        };
        return marketInfo;
    }

    prepareHomeAwayTeamTopRunScorer(optionMarket: any, tradingPartition: string = TradingPartition.TV2) {
        let topRunScorer: TopTeamRunScorer = new TopTeamRunScorer();
        super.updateBaseMarketDetails(topRunScorer, optionMarket, tradingPartition);

        const selections = super.getMarketSelections(tradingPartition, optionMarket);
        topRunScorer.topRunScorer = this.prepareTopRunScorer(selections);
        return topRunScorer;
    }

    prepareTopRunScorer(options: any): Array<BetDetails> {
        let topRunScorersList: Array<BetDetails> = [];

        if (!!options && options.length) {
            options?.forEach((option: any) => {
                if (option?.status?.toLowerCase() !== SelectionStatus?.Suspended?.toLowerCase()) {
                    const betDetails = {
                        betName: super.checkRemovecountry(option?.name?.value),
                        betOdds: SportBookMarketHelper.getCdsPriceOdds(option?.status, option?.price),
                        status: option?.status,
                    } as BetDetails;
                    topRunScorersList.push(betDetails);
                }
            });
            super.sortRunScorerList(topRunScorersList);
        }
        return topRunScorersList;
    }

    updateDrawTitle(selection: any, gameFlags: GameFlags) {
        if (gameFlags?.isTestMatch) {
            return StringHelper.setDrawValue(selection?.name?.value, this?.contentParameters?.DRAW ?? '');
        }
        return this.drawTitle;
    }
}
