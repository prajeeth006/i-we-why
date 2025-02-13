import { Injectable } from '@angular/core';

import { MessageEnvelope } from '@cds/push';
import { EMPTY, catchError } from 'rxjs';

import { CdsPushConstants } from '../../../common/cds-client/models/cds-push-updates.constant';
import { Fixture, Participant } from '../../../common/cds-client/models/fixture.model';
import { SportBookMarketHelper } from '../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../common/helpers/string.helper';
import { EventStatus } from '../../../common/models/general-codes-model';
import { MarketParameters } from '../../../common/models/market-parameters.model';
import { GantryMarketsService } from '../../../common/services/gantry-markets.service';
import { TradingPartition } from '../models/sport-cds-template.constant';
import { BetDetails, MarketSelection, VisibilityFlags } from '../models/sport-cds-template.model';

@Injectable({
    providedIn: 'root',
})
export class SportCdsTemplateService {
    constructor(public gantryMarketsService: GantryMarketsService) {}

    getGantryMarketDataContent() {
        return this.gantryMarketsService.gantryMarkets$.pipe(
            catchError(() => {
                return EMPTY;
            }),
        );
    }

    checkRemovecountry(stringToModify: string): string {
        return stringToModify?.split('(')[0]?.trim();
    }

    sortRunScorerList(topScorerList: Array<BetDetails>) {
        if (topScorerList?.length > 1) {
            topScorerList?.sort((first, second) => {
                const firstNumber = StringHelper.getPriceFromOdds(first?.betOdds);
                const secondNumber = StringHelper.getPriceFromOdds(second?.betOdds);
                return firstNumber - secondNumber;
            });
        }
        return topScorerList;
    }

    updateBaseMarketDetails(marketDetails: any, optionMarket: any, tradingPartition: string) {
        marketDetails.id = optionMarket.id;
        marketDetails.marketName = optionMarket.name?.value?.toUpperCase();
        marketDetails.status = tradingPartition === TradingPartition.TV2 ? optionMarket?.status : optionMarket?.visibility;
    }

    hasAnyRecordVisible(records: any[], flag: string = VisibilityFlags.Status || VisibilityFlags.Visibility) {
        return records?.length > 0 && records.some((record) => record[flag]?.toLowerCase() == EventStatus.Visible.toLowerCase());
    }

    isAnyMarketPresent(optionMarkets: any[], flag: string = VisibilityFlags.Status) {
        return this.hasAnyRecordVisible(optionMarkets, flag);
    }

    isAnyOptionPresent(options: any[], flag: string = VisibilityFlags.Status) {
        return this.hasAnyRecordVisible(options, flag);
    }

    getMarketSelections(tradingPartition: string, optionMarket: any) {
        return tradingPartition === TradingPartition.TV1 ? this.transformTv1GameToOptionMarketInfo(optionMarket) : optionMarket?.options;
    }

    setParticipantsToMarkets(optionMarkets: any[], participants: Participant[] = []) {
        optionMarkets = optionMarkets.map((optionMarket) => {
            optionMarket['participants'] = participants;
            return optionMarket;
        });
        return optionMarkets;
    }

    getTeamTypeByParticipantId(participants: Participant[], fixtureParticipantId: string) {
        const participant = participants.find((participant) => participant.id === parseInt(fixtureParticipantId));
        return participant?.properties?.type;
    }

    transformMarketParameters(parameters: any): MarketParameters {
        const marketParameters: MarketParameters = new MarketParameters();
        parameters?.length > 0 &&
            parameters?.forEach((parameter: { [attr: string]: string }) => {
                marketParameters[parameter.key] = parameter?.value;
            });
        return marketParameters;
    }

    transformTv1GameToOptionMarketInfo(optionMarket: any) {
        const selections = optionMarket?.results?.map((result: any, index: number) => {
            const selection = {
                id: result?.id,
                status: result?.visibility,
                name: result?.name,
                price: {
                    id: index,
                    odds: result?.odds,
                    numerator: result?.numerator,
                    denominator: result?.denominator,
                    americanOdds: result?.americanOdds,
                },
                parameters: {
                    fixtureParticipant: result?.playerId ?? '',
                },
            };
            return selection;
        });
        return selections;
    }

    getMarketInfo(optionMarket: any, selections: any, participantEnums: any, hasDrawAvailable: boolean = false) {
        let homeTeamDetails;
        let drawDetails;
        let awayTeamDetails;

        selections.forEach((selection: any) => {
            if (selection?.parameters?.fixtureParticipant) {
                const teamType = this.getTeamTypeByParticipantId(optionMarket?.participants, selection?.parameters?.fixtureParticipant?.toString());
                if (teamType === participantEnums.HomeTeam) {
                    homeTeamDetails = selection;
                } else {
                    awayTeamDetails = selection;
                }
            } else {
                if (hasDrawAvailable) {
                    drawDetails = selection;
                }
            }
        });
        const marketInfo = {
            homeTeamDetails,
            drawDetails,
            awayTeamDetails,
        };

        return marketInfo;
    }

    prepareMarketSelections(marketInfo: any) {
        const { homeTeamDetails, drawDetails, awayTeamDetails } = marketInfo;
        let marketSelection = new MarketSelection();

        if (!!homeTeamDetails) {
            marketSelection.home = {
                betName: homeTeamDetails?.name?.value ?? '',
                betOdds: SportBookMarketHelper.getCdsPriceOdds(homeTeamDetails?.status, homeTeamDetails?.price),
                status: homeTeamDetails.status,
            } as BetDetails;
        }

        if (!!drawDetails) {
            marketSelection.draw = {
                betName: drawDetails?.name?.value?.toUpperCase() ?? '',
                betOdds: SportBookMarketHelper.getCdsPriceOdds(drawDetails?.status, drawDetails?.price),
                status: drawDetails.status,
            } as BetDetails;
        }

        if (!!awayTeamDetails) {
            marketSelection.away = {
                betName: awayTeamDetails?.name?.value ?? '',
                betOdds: SportBookMarketHelper.getCdsPriceOdds(awayTeamDetails?.status, awayTeamDetails?.price),
                status: awayTeamDetails.status,
            } as BetDetails;
        }

        return marketSelection;
    }

    onIncomingCdsMessageUpdateFixture(messageEnvelope: MessageEnvelope, fixture: Fixture): Fixture {
        let marketIndex = 0;
        switch (messageEnvelope.messageType) {
            case CdsPushConstants.gameUpdate:
                if (messageEnvelope?.payload?.game?.id && fixture?.games) {
                    marketIndex = fixture?.games?.findIndex((game) => game.id == messageEnvelope?.payload?.game?.id);
                    if (marketIndex != -1) {
                        fixture.games[marketIndex] = messageEnvelope?.payload?.game;
                    } else {
                        fixture?.games?.push(messageEnvelope?.payload?.game);
                    }
                }
                break;
            case CdsPushConstants.gameDelete:
                if (messageEnvelope?.payload?.gameId && fixture?.games) {
                    marketIndex = fixture?.games?.findIndex((game) => game.id == messageEnvelope?.payload?.gameId);
                    if (marketIndex != -1) {
                        fixture?.games.splice(marketIndex, 1);
                    }
                }
                break;
            case CdsPushConstants.fixtureUpdate:
                fixture.startDate = messageEnvelope?.payload?.startDate;
                break;
            case CdsPushConstants.optionMarketUpdate:
                if (messageEnvelope?.payload?.optionMarket?.id && fixture?.optionMarkets) {
                    marketIndex = fixture?.optionMarkets?.findIndex((x) => x.id == messageEnvelope?.payload?.optionMarket?.id);
                    if (marketIndex != -1) {
                        fixture.optionMarkets[marketIndex] = messageEnvelope?.payload?.optionMarket;
                    } else {
                        fixture?.optionMarkets?.push(messageEnvelope?.payload?.optionMarket);
                    }
                }
                break;
            case CdsPushConstants.optionMarketDelete:
                if (messageEnvelope?.payload?.marketId && fixture?.optionMarkets) {
                    marketIndex = fixture?.optionMarkets?.findIndex((x) => x.id == messageEnvelope?.payload?.marketId);
                    if (marketIndex != -1) {
                        fixture?.optionMarkets?.splice(marketIndex, 1);
                    }
                }
                break;
        }
        return fixture;
    }
}
