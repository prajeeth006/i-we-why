import { Injectable } from '@angular/core';

import { MessageEnvelope } from '@cds/push';
import { Observable } from 'rxjs';

import { NflContentParams } from '../../cds/matches/nfl-cds/models/nfl-cds-content.model';
import { CdsClientService } from '../cds-client/cds-client-service.service';
import { CdsPushConstants } from '../cds-client/models/cds-push-updates.constant';
import { Fixture } from '../cds-client/models/fixture.model';
import { SportBookMarketHelper } from '../helpers/sport-book-market.helper';
import { StringHelper } from '../helpers/string.helper';
import { GantryCommonContent } from '../models/gantry-commom-content.model';
import { Markets, Sports } from '../models/gantrymarkets.model';
import { SelectionNameLength } from '../models/general-codes-model';
import { hbridCdsTemplate } from '../models/hybrid-cds-template.constant';
import { HybridContent, optionMarkets } from '../models/hybrid-fixture.model';
import { ErrorService } from './error.service';
import { GantryMarketsService } from './gantry-markets.service';

@Injectable({
    providedIn: 'root',
})
export class HybridFixtureService {
    errorMessage$ = this.errorService.errorMessage$;
    hybridContent: HybridContent = new HybridContent();
    gantryCommonContent: GantryCommonContent;
    gantryCommonContent$: Observable<GantryCommonContent>;

    constructor(
        private cdsPushService: CdsClientService,
        private errorService: ErrorService,
        private gantryMarketsService: GantryMarketsService,
    ) {}

    public GetUpdateHybridCdsContent(
        messageEnvelope: MessageEnvelope,
        fixture: Fixture,
        gantryMarkets: Markets[],
        gantryCommonContent: GantryCommonContent,
        contentFromSitecore: NflContentParams,
    ): HybridContent {
        let marketIndex = 0;
        if (messageEnvelope.messageType) {
            if (messageEnvelope.messageType == CdsPushConstants.optionMarketUpdate) {
                if (messageEnvelope?.payload?.optionMarket?.id && fixture?.optionMarkets) {
                    marketIndex = fixture?.optionMarkets?.findIndex((x) => x.id == messageEnvelope?.payload?.optionMarket?.id);
                    if (marketIndex != -1) {
                        fixture.optionMarkets[marketIndex] = messageEnvelope?.payload?.optionMarket;
                    } else {
                        fixture?.optionMarkets?.push(messageEnvelope?.payload?.optionMarket);
                    }
                }
            } else if (messageEnvelope.messageType == CdsPushConstants.optionMarketDelete) {
                if (messageEnvelope?.payload?.marketId && fixture?.optionMarkets) {
                    marketIndex = fixture?.optionMarkets?.findIndex((x) => x.id == messageEnvelope?.payload?.marketId);
                    if (marketIndex != -1) {
                        fixture?.optionMarkets?.splice(marketIndex, 1);
                    }
                }
            } else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
                fixture.startDate = messageEnvelope?.payload?.startDate;
            }
            return this.getUpdateHybridCdsContent(fixture, gantryMarkets, gantryCommonContent, contentFromSitecore);
        }
        return new HybridContent();
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

    prepareMatchBettingHybrid(
        hybridCdsResult: HybridContent,
        optionalMarket: optionMarkets,
        gantryMarkets: Array<Markets>,
        gantryCommonContent: GantryCommonContent,
    ) {
        let homePlayer_Name = this.getPlayerNames(optionalMarket?.options[0]?.name?.value);
        let awayPlayer_Name = this.getPlayerNames(optionalMarket?.options[1]?.name?.value);
        const game_Name = this.getGameNames(optionalMarket?.parameters[0]?.value.toString(), gantryMarkets, gantryCommonContent);
        if (
            this.gantryMarketsService.hasMarket(
                Sports.CdsNfl,
                hbridCdsTemplate.TOTALPOINTS,
                optionalMarket?.parameters[0]?.value?.toString(),
                gantryMarkets,
            )
        ) {
            homePlayer_Name = this.getPlayerNames(optionalMarket?.options[1]?.name?.value);
            awayPlayer_Name = this.getPlayerNames(optionalMarket?.options[0]?.name?.value);
        } else if (
            this.gantryMarketsService.hasMarket(
                Sports.CdsNfl,
                hbridCdsTemplate.MONEYLINE,
                optionalMarket?.parameters[0]?.value?.toString(),
                gantryMarkets,
            )
        ) {
            const isNotHandicap: boolean = true;
            homePlayer_Name = this.getPlayerNames(optionalMarket?.options[0]?.name?.value, isNotHandicap);
            awayPlayer_Name = this.getPlayerNames(optionalMarket?.options[1]?.name?.value, isNotHandicap);
        } else if (
            this.gantryMarketsService.hasMarket(
                Sports.CdsNfl,
                hbridCdsTemplate.FIRSTHALFMONEYLINE,
                optionalMarket?.parameters[0]?.value?.toString(),
                gantryMarkets,
            )
        ) {
            const isNotHandicap: boolean = true;
            homePlayer_Name = this.getPlayerNames(optionalMarket?.options[0]?.name?.value, isNotHandicap);
            awayPlayer_Name = this.getPlayerNames(optionalMarket?.options[1]?.name?.value, isNotHandicap);
        }

        hybridCdsResult?.games?.push({
            id: optionalMarket.id,
            gameName: game_Name,
            matchBetting: {
                homeBettingPrice: SportBookMarketHelper.getCdsPriceStr(
                    optionalMarket?.options[0]?.status,
                    optionalMarket?.options[0]?.price?.numerator,
                    optionalMarket?.options[0]?.price?.denominator,
                ),
                homePlayer: homePlayer_Name,
                awayBettingPrice: SportBookMarketHelper.getCdsPriceStr(
                    optionalMarket?.options[1]?.status,
                    optionalMarket?.options[1]?.price?.numerator,
                    optionalMarket?.options[1]?.price?.denominator,
                ),
                awayPlayer: awayPlayer_Name,
            },
        });
    }

    getGameNames(templateId: string, gantryMarkets: Array<Markets>, gantryCommonContent: GantryCommonContent): string {
        if (gantryCommonContent?.contentParameters) {
            if (this.gantryMarketsService.hasMarket(Sports.CdsNfl, hbridCdsTemplate.TOTALPOINTS, templateId, gantryMarkets)) {
                return gantryCommonContent?.contentParameters?.TotalPoints;
            } else if (this.gantryMarketsService.hasMarket(Sports.CdsNfl, hbridCdsTemplate.MONEYLINE, templateId, gantryMarkets)) {
                return gantryCommonContent?.contentParameters?.MoneyLine1;
            } else if (this.gantryMarketsService.hasMarket(Sports.CdsNfl, hbridCdsTemplate.SPREAD, templateId, gantryMarkets)) {
                return gantryCommonContent?.contentParameters?.Spread;
            } else if (this.gantryMarketsService.hasMarket(Sports.CdsNfl, hbridCdsTemplate.FIRSTHALFMONEYLINE, templateId, gantryMarkets)) {
                return gantryCommonContent?.contentParameters?.FirstHalfMoneyLine;
            } else if (this.gantryMarketsService.hasMarket(Sports.CdsNfl, hbridCdsTemplate.FIRSTHALFSPREAD, templateId, gantryMarkets)) {
                return gantryCommonContent?.contentParameters?.FirstHalfSpread;
            }
        }
        return '';
    }

    public getUpdateHybridCdsContent(
        fixture: Fixture,
        gantryMarkets: Array<Markets>,
        gantryCommonContent: GantryCommonContent,
        contentFromSitecore: NflContentParams,
    ): HybridContent {
        if (fixture && fixture?.optionMarkets && fixture?.optionMarkets?.length > 0) {
            if (this.errorService.isStaleDataAvailable) {
                this.errorService.unSetError();
            }
            if (fixture?.sport?.name?.value) {
                this.hybridContent.sportName = fixture?.sport?.name?.value;
                this.hybridContent.title = StringHelper.getValueWithoutBracket(fixture?.name?.value)?.replace('-', '@')?.trim();
                this.hybridContent.eventStartDate = fixture?.startDate;
                this.hybridContent.competitionName = fixture?.competition?.name?.value;
                this.hybridContent.context = fixture?.context;
                this.hybridContent.content = contentFromSitecore;
                this.hybridContent.games = [];
                const gamesArray = fixture?.optionMarkets;

                const gamesSortedArray = [];
                for (let i = 0; i < gamesArray?.length; i++) {
                    if (
                        this.gantryMarketsService.hasMarket(
                            Sports.CdsNfl,
                            hbridCdsTemplate.MONEYLINE,
                            gamesArray[i]?.parameters[0]?.value?.toString(),
                            gantryMarkets,
                        )
                    ) {
                        gamesSortedArray[0] = gamesArray[i];
                    } else if (
                        this.gantryMarketsService.hasMarket(
                            Sports.CdsNfl,
                            hbridCdsTemplate.SPREAD,
                            gamesArray[i]?.parameters[0]?.value?.toString(),
                            gantryMarkets,
                        )
                    ) {
                        gamesSortedArray[1] = gamesArray[i];
                    } else if (
                        this.gantryMarketsService.hasMarket(
                            Sports.CdsNfl,
                            hbridCdsTemplate.TOTALPOINTS,
                            gamesArray[i]?.parameters[0]?.value?.toString(),
                            gantryMarkets,
                        )
                    ) {
                        gamesSortedArray[2] = gamesArray[i];
                    } else if (
                        this.gantryMarketsService.hasMarket(
                            Sports.CdsNfl,
                            hbridCdsTemplate.FIRSTHALFMONEYLINE,
                            gamesArray[i]?.parameters[0]?.value?.toString(),
                            gantryMarkets,
                        )
                    ) {
                        gamesSortedArray[3] = gamesArray[i];
                    } else if (
                        this.gantryMarketsService.hasMarket(
                            Sports.CdsNfl,
                            hbridCdsTemplate.FIRSTHALFSPREAD,
                            gamesArray[i]?.parameters[0]?.value?.toString(),
                            gantryMarkets,
                        )
                    ) {
                        gamesSortedArray[4] = gamesArray[i];
                    }
                }
                gamesSortedArray?.forEach((x) => {
                    this.prepareMatchBettingHybrid(this.hybridContent, x, gantryMarkets, gantryCommonContent);
                });
            }

            return this.hybridContent;
        } else {
            const errorMessage = 'Could not find Hybrid Fixture Nfl Content for Url - ' + this.cdsPushService.fixturesUrl;
            this.errorService.setError(errorMessage);
        }

        return new HybridContent();
    }
}
