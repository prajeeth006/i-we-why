import { Injectable } from '@angular/core';

import { MessageEnvelope } from '@cds/push';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay } from 'rxjs';

import { CdsClientService } from '../../../../../common/cds-client/cds-client-service.service';
import { CdsPushConstants } from '../../../../../common/cds-client/models/cds-push-updates.constant';
import { EventDateTime, Fixtures } from '../../../../../common/cds-client/models/fixture.model';
import { SportBookMarketHelper } from '../../../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../../../common/helpers/string.helper';
import { Draw, EventStatus, sourceName } from '../../../../../common/models/general-codes-model';
import { ContentItemPaths } from '../../../../../common/models/sport-content/sport-content-parameters.constants';
import { ErrorService } from '../../../../../common/services/error.service';
import { SportContentService } from '../../../../../common/services/sport-content/sport-content.service';
import { FootBallContentParams, HomeDrawAway, HomeDrawAwayResult } from '../models/home-draw-away-content.model';

@Injectable({
    providedIn: 'root',
})
export class HomeDrawAwayService {
    errorMessage$ = this.errorService.errorMessage$;
    homeDrawAwayResult: HomeDrawAwayResult = new HomeDrawAwayResult();
    fixtureData$: Observable<Fixtures>;
    nflContentFromSitecore$: Observable<FootBallContentParams>;
    homeDrawAwayResult$: Observable<HomeDrawAwayResult>;
    fixtureData: Fixtures;

    constructor(
        private cdsPushService: CdsClientService,
        private errorService: ErrorService,
        private sportContentService: SportContentService,
    ) {}

    public getFixtureViewData(fixtureId: string[], marketId: string[], gameIds: string) {
        return this.cdsPushService.getFixtures(fixtureId.join(','), marketId.join(','), gameIds);
    }

    public GetHomeDrawAwayContent(fixtureId: string[], marketId: string[], gameIds: string) {
        this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, gameIds);
        this.nflContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.footballMultiMarketCDS);

        this.homeDrawAwayResult$ = combineLatest([this.fixtureData$, this.nflContentFromSitecore$]).pipe(
            map(([fixtureData, contentFromSitecore]) => {
                if (fixtureData && fixtureData?.fixtures?.length > 0) {
                    this.fixtureData = fixtureData;
                    this.homeDrawAwayResult.content = contentFromSitecore;
                    this.homeDrawAwayResult = this.getHomeDrawAwayContent(fixtureData);
                } else {
                    throw 'Could not find HomeDrawAway CDS Content for Url - ' + this.cdsPushService?.fixturesUrl;
                }
                return this.homeDrawAwayResult;
            }),
            catchError((err) => {
                this.errorService.logError(err);
                return EMPTY;
            }),
            shareReplay(),
        );
    }

    public getFixtureIds(eventMarketPairs: string, fixtureId: string[], marketIds: string[], tradingPartitionID: string) {
        if (!!eventMarketPairs) {
            const splitPairs = eventMarketPairs?.split(',');
            splitPairs.forEach((marketPair: string) => {
                if (marketPair?.split(':')?.length == 3) {
                    fixtureId?.push(marketPair?.split(':')[0] + ':' + marketPair?.split(':')[1]);
                    marketIds?.push(marketPair?.split(':')[2]);
                } else {
                    fixtureId?.push((!!tradingPartitionID ? tradingPartitionID : '2') + ':' + marketPair?.split(':')[0]);
                    marketIds?.push(marketPair?.split(':')[1]);
                }
            });
        }
    }

    public GetUpdatedHomeDrawAwayContent(messageEnvelope: MessageEnvelope): HomeDrawAwayResult {
        let marketIndex = 0;
        let fixtureIndex = 0;
        if (messageEnvelope.messageType) {
            if (messageEnvelope.messageType == CdsPushConstants.optionMarketUpdate) {
                if (messageEnvelope?.payload?.optionMarket?.id) {
                    fixtureIndex = this.fixtureData?.fixtures?.findIndex((x) => x.id == messageEnvelope?.payload?.fixtureId);
                    if (fixtureIndex != -1) {
                        marketIndex =
                            this.fixtureData.fixtures[fixtureIndex].optionMarkets?.findIndex(
                                (y) => y.id == messageEnvelope?.payload?.optionMarket?.id,
                            ) ?? -1;
                        if (marketIndex != -1) {
                            this.fixtureData.fixtures[fixtureIndex].optionMarkets[marketIndex] = messageEnvelope?.payload?.optionMarket;
                        } else {
                            this.fixtureData?.fixtures?.push(messageEnvelope?.payload?.optionMarket);
                        }
                    } else {
                        this.fixtureData?.fixtures?.push(messageEnvelope?.payload?.optionMarket);
                    }
                }
            } else if (messageEnvelope.messageType == CdsPushConstants?.fixtureUpdate) {
                fixtureIndex = this.fixtureData?.fixtures?.findIndex((x) => x.id == messageEnvelope?.payload?.fixtureId);
                if (fixtureIndex != -1) {
                    this.fixtureData.fixtures[fixtureIndex].startDate = messageEnvelope?.payload?.startDate;
                }
            } else if (messageEnvelope.messageType == CdsPushConstants.optionMarketDelete) {
                marketIndex = this.fixtureData?.fixtures?.findIndex((x) => x.id == messageEnvelope?.payload?.optionMarket?.id);
                fixtureIndex = this.fixtureData?.fixtures?.findIndex((x) => x.id == messageEnvelope?.payload?.fixtureId);
                if (fixtureIndex != -1 && marketIndex != -1) {
                    this.fixtureData?.fixtures?.splice(fixtureIndex, 1);
                }
            }
            return this.getHomeDrawAwayContent(this.fixtureData);
        }
        return new HomeDrawAwayResult();
    }

    prepareHomeDrawAwayResult(optionsArray: any[], eventName: string, eventDateTime: Date) {
        const selections = {
            home: { name: '', price: '' },
            draw: { name: '', price: '' },
            away: { name: '', price: '' },
        };
        for (const option of optionsArray) {
            const name = option?.name?.value ?? '';
            const price = SportBookMarketHelper.getCdsPriceStr(option?.price?.visibility, option?.price?.numerator, option?.price?.denominator);
            const isSuspended = option?.status?.toUpperCase() === EventStatus.Suspended;

            if (name === Draw.drawNameValue?.toUpperCase() || name === Draw.drawName?.toUpperCase()) {
                selections.draw.name = isSuspended ? '' : name;
                selections.draw.price = isSuspended ? '' : price;
            } else if (option.sourceName?.value === sourceName.home) {
                selections.home.name = isSuspended ? '' : name;
                selections.home.price = isSuspended ? '' : price;
            } else if (option.sourceName?.value === sourceName.away) {
                selections.away.name = isSuspended ? '' : name;
                selections.away.price = isSuspended ? '' : price;
            }
        }

        // Check if prices are not empty before pushing the selections
        if (selections?.home?.price !== '' || selections?.draw?.price !== '' || selections?.away?.price !== '') {
            this.homeDrawAwayResult?.homeDrawAwayEvent?.push({
                eventName: eventName?.toUpperCase(),
                eventTime: '',
                eventDateTime: eventDateTime,

                homeSelection: {
                    selectionName: selections?.home?.name,
                    price: selections?.home?.price,
                },
                drawSelection: {
                    selectionName: selections?.draw?.name,
                    price: selections?.draw?.price,
                },
                awaySelection: {
                    selectionName: selections?.away?.name,
                    price: selections?.away?.price,
                },
            });
        }
    }

    public getHomeDrawAwayContent(fixture: Fixtures): HomeDrawAwayResult {
        if (fixture && fixture?.fixtures?.length > 0) {
            if (this.errorService.isStaleDataAvailable) {
                this.errorService.unSetError();
            }
            this.homeDrawAwayResult.homeDrawAwayEvent = [];
            for (let i = 0; i < fixture?.fixtures?.length; i++) {
                const optionMarkets = fixture?.fixtures[i] ? fixture?.fixtures[i]?.optionMarkets[0] : undefined;
                if (optionMarkets !== undefined) {
                    this.homeDrawAwayResult.marketName = optionMarkets?.name?.value?.toUpperCase();
                    this.homeDrawAwayResult.categoryName = fixture?.fixtures[i]?.sport?.name?.value.toUpperCase();
                    const optionsArray = optionMarkets?.options;
                    this.prepareHomeDrawAwayResult(optionsArray, fixture?.fixtures[i]?.name?.value, new Date(fixture?.fixtures[i]?.startDate));
                }
            }
            if (this.homeDrawAwayResult?.homeDrawAwayEvent?.length > 0) {
                if (this.errorService.isStaleDataAvailable) {
                    this.errorService.unSetError();
                }
                this.sortHomeDrawAwayEvent(this.homeDrawAwayResult.homeDrawAwayEvent);
                const eventDateTimes: EventDateTime[] = this.homeDrawAwayResult?.homeDrawAwayEvent;
                this.homeDrawAwayResult.eventDateTimeInputValue = StringHelper.getDarkThemeEventTimeDateFromPipe(
                    eventDateTimes,
                    this.homeDrawAwayResult?.content,
                );
            } else {
                const errorMessage = 'Could not find Football Home draw away Content for Url - ' + this.cdsPushService?.fixturesUrl;
                this.errorService.setError(errorMessage);
            }
        } else {
            const errorMessage = 'Could not find Football Home draw away Content for Url - ' + this.cdsPushService?.fixturesUrl;
            this.errorService.setError(errorMessage);
        }

        return this.homeDrawAwayResult;
    }

    sortHomeDrawAwayEvent(homeDrawAwayEventData: HomeDrawAway[]) {
        homeDrawAwayEventData?.sort((b, a) => {
            const dataComparision = new Date(b.eventDateTime).getTime() - new Date(a.eventDateTime).getTime();
            if (dataComparision !== 0) {
                return dataComparision;
            } else {
                return b.homeSelection?.selectionName?.localeCompare(a.homeSelection?.selectionName);
            }
        });
    }
}
