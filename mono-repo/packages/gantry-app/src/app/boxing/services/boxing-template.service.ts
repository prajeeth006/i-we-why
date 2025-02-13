import { Injectable } from '@angular/core';

import { EMPTY, catchError, combineLatest, map, startWith, tap } from 'rxjs';

import { SportCdsTemplateService } from '../../cds/common/services/sport-cds-template.service';
import { JsonStringifyHelper } from '../../common/helpers/json-stringify.helper';
import { SportBookResultHelper } from '../../common/helpers/sport-book-result.helper';
import { StringHelper } from '../../common/helpers/string.helper';
import { SportBookResult, SportBookSelection } from '../../common/models/data-feed/sport-bet-models';
import { Markets, Sports } from '../../common/models/gantrymarkets.model';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from '../../common/models/query-param.model';
import { SportBookService } from '../../common/services/data-feed/sport-book.service';
import { ErrorService } from '../../common/services/error.service';
import { GantryMarketsService } from '../../common/services/gantry-markets.service';
import { BoxingEnumContent, BoxingMarkets, SelectionName } from '../models/boxing-constants.model';
import { BoxingDataContent } from '../models/boxing-content.model';
import { BoxingTemplateContent } from '../models/boxing-template.model';
import { BoxingContentService } from './boxing-content.service';
import { FightBettingService } from './fight-betting-service/fight-betting.service';
import { GroupRoundBettingService } from './group-round-betting/group-round-betting.service';
import { MethodOfVicotryService } from './method-of-victory/method-of-vicotry.service';
import { RoundBettingService } from './round-betting-service/round-betting.service';

@Injectable({
    providedIn: 'root',
})
export class BoxingTemplateService extends SportCdsTemplateService {
    constructor(
        private sportBookService: SportBookService,
        private boxingContentService: BoxingContentService,
        private fightBettingService: FightBettingService,
        private roundBettingService: RoundBettingService,
        private groupRoundBettingService: GroupRoundBettingService,
        gantryMarketsService: GantryMarketsService,
        private methodOfVictory: MethodOfVicotryService,
        private errorService: ErrorService,
    ) {
        super(gantryMarketsService);
    }

    errorMessage$ = this.errorService.errorMessage$;

    boxingResult$ = this.sportBookService.data$.pipe(
        tap((sportBookResult: SportBookResult) => {
            this.errorService.isStaleDataAvailable = true;
            JSON.stringify(sportBookResult, JsonStringifyHelper.replacer);
            this.errorService.unSetError();
        }),
        catchError((err) => {
            this.errorService.logError(err);
            return EMPTY;
        }),
    );

    boxingContent$ = this.boxingContentService.data$.pipe(
        tap((boxingContent: BoxingDataContent) => {
            JSON.stringify(boxingContent, JsonStringifyHelper.replacer);
        }),
        startWith({} as BoxingDataContent), // Initial Value
    );

    gantryMarkets$ = super.getGantryMarketDataContent();

    data$ = combineLatest([this.boxingResult$, this.boxingContent$, this.gantryMarkets$]).pipe(
        map(([boxingResult, boxingContent, gantryMarkets]) => {
            JSON.stringify(boxingResult, JsonStringifyHelper.replacer);
            SportBookResultHelper.removePipeSymbolsAndUpperCaseAllNames(boxingResult);
            return this.prepareResult(boxingResult, boxingContent, gantryMarkets);
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    setEvenKeyAndMarketKeys(eventKey: string, marketKeys: string) {
        const queryParamEventMarkets = new QueryParamEventMarkets(new QueryParamEvent(eventKey), new QueryParamMarkets(marketKeys));
        this.sportBookService.setEventMarketsList([queryParamEventMarkets]);
        this.sportBookService.setRemoveSuspendedSelections(false);
    }

    prepareResult(sportBookResult: SportBookResult, boxingDataContent: BoxingDataContent, gantryMarkets: Array<Markets>): BoxingTemplateContent {
        let boxingTemplateResult = new BoxingTemplateContent();
        boxingTemplateResult.boxingDataContent = boxingDataContent;
        boxingTemplateResult = this.setBoxingTemplateInfo(boxingTemplateResult, boxingDataContent);
        const selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } } = {};

        for (const [, event] of sportBookResult.events) {
            boxingTemplateResult.eventName = StringHelper.removeAllPipeSymbols(event.eventName);
            boxingTemplateResult.optionalInfo = event.typeName;
            boxingTemplateResult.eventDateTime = event.eventDateTime;
            boxingTemplateResult.leadTitle = event.categoryName;

            for (const [, market] of event.markets) {
                const marketName = StringHelper.removeAllPipeSymbols(market.marketName);
                market.marketName = marketName;
                for (const [, selection] of market.selections) {
                    let selectionName = StringHelper.removeAllPipeSymbols(selection.selectionName);
                    if (
                        marketName.trim().toUpperCase() ==
                            this.gantryMarketsService.hasMarket(Sports.Boxing, BoxingMarkets.FIGHTBETTING, market.marketName, gantryMarkets) &&
                        !!selectionName &&
                        selectionName == SelectionName.DRAWORTECHNICALDRAW
                    ) {
                        selectionName = SelectionName.DRAW;
                        selection.selectionName = SelectionName.DRAW;
                    }
                    if (!selections[marketName]) {
                        selections[marketName] = {};
                    }

                    selections[marketName][selectionName] = selection;
                }
            }

            if (Object.keys(selections).length === 0) {
                return boxingTemplateResult;
            }

            this.setBoxingPageEntries(boxingTemplateResult, selections, gantryMarkets);
        }

        if (boxingTemplateResult?.mainEventInfoPanel)
            boxingTemplateResult.mainEventInfoPanel.marketDisplayTitle = boxingDataContent?.contentParameters?.Draw ?? '';

        if (boxingTemplateResult?.roundBettingInfoPanel)
            boxingTemplateResult.roundBettingInfoPanel.marketDisplayTitle = boxingDataContent?.contentParameters?.RoundBetting ?? '';

        if (boxingTemplateResult?.groupRoundBettingInfoPanel)
            boxingTemplateResult.groupRoundBettingInfoPanel.marketDisplayTitle = boxingDataContent?.contentParameters?.RoundGroupBetting ?? '';

        if (boxingTemplateResult?.methodOfVictoryInfoPanel)
            boxingTemplateResult.methodOfVictoryInfoPanel.marketDisplayTitle = boxingDataContent?.contentParameters?.MethodOfVictory ?? '';

        return boxingTemplateResult;
    }

    private setBoxingPageEntries(
        boxingTemplateResult: BoxingTemplateContent,
        selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } },
        gantryMarkets: Array<Markets>,
    ) {
        for (const marketName in selections) {
            if (marketName) {
                if (
                    marketName.trim().toUpperCase() ==
                    this.gantryMarketsService.hasMarket(Sports.Boxing, BoxingMarkets.FIGHTBETTING, marketName, gantryMarkets)
                ) {
                    boxingTemplateResult = this.fightBettingService.setFightDetails(marketName, boxingTemplateResult, selections);
                } else if (
                    marketName.trim().toUpperCase() ==
                    this.gantryMarketsService.hasMarket(Sports.Boxing, BoxingMarkets.ROUNDBETTING, marketName, gantryMarkets)
                ) {
                    boxingTemplateResult = this.roundBettingService.setRoundDetails(marketName, boxingTemplateResult, selections);
                } else if (
                    marketName.trim().toUpperCase() ==
                    this.gantryMarketsService.hasMarket(Sports.Boxing, BoxingMarkets.ROUNDGROUPBETTING, marketName, gantryMarkets)
                ) {
                    boxingTemplateResult = this.groupRoundBettingService.setGroupRoundDetails(marketName, boxingTemplateResult, selections);
                } else if (
                    marketName.trim().toUpperCase() ==
                    this.gantryMarketsService.hasMarket(Sports.Boxing, BoxingMarkets.METHODOFVICTORY, marketName, gantryMarkets)
                ) {
                    boxingTemplateResult = this.methodOfVictory.setMethodOfVictory(marketName, boxingTemplateResult, selections);
                }
            }
        }
    }

    private setBoxingTemplateInfo(boxingTemplateResult: BoxingTemplateContent, boxingdataContent: BoxingDataContent): BoxingTemplateContent {
        boxingTemplateResult.additionalInfo = boxingdataContent?.contentParameters?.[BoxingEnumContent.AdditionalInfo] ?? '';
        boxingTemplateResult.onRequest = boxingdataContent?.contentParameters?.[BoxingEnumContent.OnRequest] ?? '';
        boxingTemplateResult.moreMarkets = boxingdataContent?.contentParameters?.[BoxingEnumContent.MoreMarkets] ?? '';
        return boxingTemplateResult;
    }
}
