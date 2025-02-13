import { Injectable } from '@angular/core';

import { startWith, tap } from 'rxjs';

import { Greyhounds } from '../../greyhound-racing/models/greyhound.constant';
import { HorseRacingMarkets, ResultCode } from '../../horse-racing/models/common.model';
import { IBaseRacingTemplateResult, IBaseRacingTemplateResultEntry } from '../contracts/base-racing-template.models';
import { JsonStringifyHelper } from '../helpers/json-stringify.helper';
import { SportBookEventHelper } from '../helpers/sport-book-event.helper';
import { SportBookMarketHelper } from '../helpers/sport-book-market.helper';
import { StringHelper } from '../helpers/string.helper';
import {
    NCastDividend,
    SportBookEventStructured,
    SportBookMarketStructured,
    SportBookResult,
    SportBookSelection,
} from '../models/data-feed/sport-bet-models';
import { CheckEvrAvrByTypeId } from '../models/evr-avr-configuration.model';
import { GantryCommonContent } from '../models/gantry-commom-content.model';
import { Markets, Racing } from '../models/gantrymarkets.model';
import { SisData } from '../models/sis-model';
import { EvrAvrConfigurationService } from './evr-avr-configuration.service';
import { GantryCommonContentService } from './gantry-common-content.service';
import { GantryMarketsService } from './gantry-markets.service';
import { RaceOffService } from './race-off.service';

@Injectable({
    providedIn: 'root',
})
export abstract class BaseRacingTemplateService {
    evrRaceCheckInitialized: boolean = false;
    isEvrSetTimeoutInitialized: boolean = false;
    isEvrSetTimeoutCalled: boolean = false;
    gantryCommonContent: GantryCommonContent;
    evravrSubject: CheckEvrAvrByTypeId;

    constructor(
        private gantryCommonContentService: GantryCommonContentService,
        public evrAvrConfigurationService: EvrAvrConfigurationService,
        public raceOffService: RaceOffService,
        public gantryMarketsService: GantryMarketsService,
    ) {
        this.gantryCommonContent$.subscribe((content: GantryCommonContent) => {
            this.gantryCommonContent = content;
        });
    }

    gantryCommonContent$ = this.gantryCommonContentService.data$.pipe(
        tap((gantryCommonContent: GantryCommonContent) => {
            JSON.stringify(gantryCommonContent, JsonStringifyHelper.replacer);
        }),
        startWith({} as GantryCommonContent), // Initial Value
    );

    setDeadHeadPositions(runners: Array<IBaseRacingTemplateResultEntry>, deadHeatPositions: Set<number>): void {
        deadHeatPositions = new Set<number>();
        const positions = new Set<number>();
        if (runners) {
            for (const runner of runners) {
                const position = +runner.position;
                if (positions.has(position)) {
                    deadHeatPositions.add(position);
                }
                positions.add(position);
            }
        }
    }

    setDividendsAndTotes(defaultMarketNCastDividends: NCastDividend[], dividends: NCastDividend[], totes: NCastDividend[]): void {
        dividends = [];
        totes = [];
        if (defaultMarketNCastDividends) {
            for (const nCastDividend of defaultMarketNCastDividends) {
                if (nCastDividend.ncastTypeCode === 'FC' || nCastDividend.ncastTypeCode === 'TC') {
                    dividends.push(nCastDividend);
                } else {
                    totes.push(nCastDividend);
                }
            }
        }
    }

    setResultAndGetGeneratedSelections(
        baseRacingTemplateResult: IBaseRacingTemplateResult,
        events: SportBookEventStructured[],
        sisData: SisData,
        sortSelections: boolean = false,
        gantryMarkets: Array<Markets> = [],
    ) {
        const selections: { [runnerNumber: string]: { [marketName: string]: SportBookSelection } } = {};

        for (const event of events) {
            baseRacingTemplateResult.eventName = event.eventName;
            baseRacingTemplateResult.raceStage = event.raceStage;
            const isEventVirtualRace = this.isEventVirtualRace(event.typeFlagCode);
            baseRacingTemplateResult.categoryName = isEventVirtualRace
                ? (this.gantryCommonContent?.contentParameters?.VirtualRacing ?? '')
                : event.categoryName;
            baseRacingTemplateResult.defaultPriceColumn = SportBookEventHelper.getPriceHeader(
                event,
                baseRacingTemplateResult.raceStage,
                this.gantryCommonContent,
                sisData,
                isEventVirtualRace,
            );
            if (this.isEvrRaceCheck() && this.isEvrSetTimeoutInitialized && !this.isEvrSetTimeoutCalled) {
                baseRacingTemplateResult.defaultPriceColumn = '';
            }
            for (const [, market] of event.markets) {
                const marketName = StringHelper.removeAllPipeSymbols(market.marketName);
                market.marketName = marketName;
                const isFeatureMarket = this.checkFeatureMarket(marketName, gantryMarkets);
                if (isFeatureMarket) {
                    baseRacingTemplateResult?.featureMarkets!.push(market);
                } else {
                    baseRacingTemplateResult.markets.push(market);
                }

                baseRacingTemplateResult.marketEachWayString =
                    baseRacingTemplateResult.marketEachWayString == null || baseRacingTemplateResult.marketEachWayString == undefined
                        ? SportBookMarketHelper.getEachWayString(market, this.gantryCommonContent)
                        : baseRacingTemplateResult.marketEachWayString;

                baseRacingTemplateResult.darkThemeEachWayString =
                    baseRacingTemplateResult.darkThemeEachWayString == null || baseRacingTemplateResult.darkThemeEachWayString == undefined
                        ? SportBookMarketHelper.prepareEachWayString(market, this.gantryCommonContent)
                        : baseRacingTemplateResult.darkThemeEachWayString;

                if (!market.selections) {
                    console.info(`Warning: Market with doesn't have any selections. EventId: '${event.eventKey}', MarketId: '${market.marketKey}'`);
                }

                let marketHasOneCorrectSelection = false;

                if (sortSelections) market.selections = new Map([...market.selections].sort()); // Sorting based on selection key to get latest selection.

                for (const [, selection] of market.selections) {
                    let runnerNumber = selection?.runnerNumber?.toString();
                    if (!!baseRacingTemplateResult?.featureMarkets && baseRacingTemplateResult?.featureMarkets?.length > 0) {
                        baseRacingTemplateResult?.featureMarkets?.forEach((featureMarket: SportBookMarketStructured) => {
                            featureMarket?.selections?.forEach((featureSelection: SportBookSelection) => {
                                if (featureSelection?.marketKey == selection?.marketKey) {
                                    runnerNumber = '';
                                }
                            });
                        });
                    }

                    if (!runnerNumber) {
                        console.info(
                            `Warning: Selection with doesn't have any runnerNumber. Skipping selection. EventId: '${event.eventKey}', MarketId: '${market.marketKey}', SelectionId: ${selection.selectionKey}`,
                        );

                        continue;
                    }

                    marketHasOneCorrectSelection = true;

                    if (!selections[runnerNumber]) {
                        selections[runnerNumber] = {};
                    }

                    selections[runnerNumber][marketName] = selection;
                }

                if (!marketHasOneCorrectSelection) {
                    console.info(
                        `Warning: Market doesn't have any valid Selection. Skipping Market. EventId: '${event.eventKey}', MarketId: '${market.marketKey}'`,
                    );
                }
            }
        }

        return selections;
    }

    checkFeatureMarket(marketName: string, gantryMarkets: Array<Markets> = []): boolean {
        let isFeatureMarket = false;
        if (
            marketName == this.gantryMarketsService.hasMarket(Racing.Greyhounds, Greyhounds.INSIDEVSOUTSIDE, marketName, gantryMarkets) ||
            marketName == this.gantryMarketsService.hasMarket(Racing.Greyhounds, Greyhounds.ODDSVSEVENS, marketName, gantryMarkets)
        ) {
            isFeatureMarket = true;
        }
        return isFeatureMarket;
    }

    setIsRaceOff(baseRacingTemplateResult: IBaseRacingTemplateResult) {
        //Below functionality is related to EVR delay in showing off message. We only need to set delay when event is EVR and there is not off. If event is EVR and already Off then there should not be any delay in showing off message.
        let delay = this.getEvrOffPageDelay();
        if (baseRacingTemplateResult.isEventStarted) {
            if (this.isEvrSetTimeoutCalled) {
                this.evrAvrConfigurationService.setDelay(0);
                delay = 0;
            }
            if (delay > 0) {
                if (!this.isEvrSetTimeoutInitialized) {
                    this.isEvrSetTimeoutInitialized = true;
                    setTimeout(() => {
                        this.isEvrSetTimeoutCalled = true;
                        baseRacingTemplateResult.isRaceOff = baseRacingTemplateResult?.isEventStarted;
                        if (baseRacingTemplateResult?.isEventStarted) {
                            this.setRaceOff(baseRacingTemplateResult?.isEventStarted);
                        }
                    }, delay);
                }
            } else {
                baseRacingTemplateResult.isRaceOff = baseRacingTemplateResult?.isEventStarted;
                this.setRaceOff(baseRacingTemplateResult?.isEventStarted);
            }
        } else {
            baseRacingTemplateResult.isRaceOff = baseRacingTemplateResult?.isEventStarted;
            if (baseRacingTemplateResult?.isEventStarted) {
                this.setRaceOff(baseRacingTemplateResult?.isEventStarted);
            }
        }
    }

    setRaceOff(isRaceOff: boolean) {
        if (isRaceOff != this.raceOffService.isRaceOffSubject.value) {
            this.raceOffService.isRaceOffSubject.next(isRaceOff);
        }
    }

    canShowRaceStage = (isEventStarted: boolean, raceStage: string, offTime: Date, isVirtualEvent: boolean) => {
        if (isEventStarted && offTime?.toString()?.trim()?.length > 0 && !!raceStage && raceStage[0] == 'O') {
            return true;
        } else if (isEventStarted && offTime?.toString()?.trim()?.length > 0 && !raceStage) {
            return true;
        } else if (isEventStarted && !offTime && !raceStage) {
            return false;
        } else if (raceStage && raceStage[0] !== 'O') {
            return true;
        }
        // else if (isEventStarted && !offTime && !raceStage) {
        //   return true;
        // }
        else if (!raceStage && !isVirtualEvent) {
            return true;
        }
        return false;
    };
    isEventResulted(sportBookResult: SportBookResult): boolean {
        let isEventResulted = false;
        for (const [, event] of sportBookResult.events) {
            for (const [, market] of event.markets) {
                if (market.marketName?.toUpperCase() == HorseRacingMarkets.WinOrEachWay) {
                    for (const [, selection] of market.selections) {
                        if (selection.resultCode?.toUpperCase() == ResultCode.Win) {
                            isEventResulted = true;
                            break;
                        }
                    }
                }
            }
        }
        return isEventResulted;
    }

    getFlag(sportBookResult: SportBookResult): string {
        let eventFlags: string[] = [];
        const countryList = ['UK', 'AU', 'US', 'AE', 'INT', 'IE', 'ZA', 'IN', 'FR'];
        for (const [, event] of sportBookResult.events) {
            eventFlags = event?.typeFlagCode?.split(',');
            break;
        }
        const countryFlags = countryList.filter(function (country) {
            return eventFlags?.indexOf(country) > -1;
        });

        if (countryFlags?.length > 0) {
            return countryFlags[0];
        } else return 'UK';
    }

    isEventVirtualRace(flags?: string) {
        return flags?.toUpperCase()?.includes('VR') ? true : false;
    }

    isEventPGRTrack(flags?: string) {
        return flags?.toUpperCase()?.includes('RD') ? true : false;
    }

    setEvrAvrRaceCheck(eventTypeKey: string) {
        if (!this.evrRaceCheckInitialized) {
            this.evrRaceCheckInitialized = true;
            this.evrAvrConfigurationService.setTypeId(eventTypeKey);
            this.evrAvrConfigurationService.isEvrAvrRace$.subscribe((isEvrRace: any) => {
                this.evrAvrConfigurationService.setEvrAvrRaceCheck(isEvrRace);
            });
        }
    }

    isEvrRaceCheck(): boolean {
        return this.evrAvrConfigurationService.isEvrRace();
    }

    setEvrOffPageDelay() {
        if (this.evrAvrConfigurationService?.isEvrRace() && !this.evrAvrConfigurationService.delay) {
            this.evrAvrConfigurationService.evrOffPageDelay$.subscribe((delay: any) => {
                this.evrAvrConfigurationService.setDelay(delay);
            });
        }
    }

    getEvrOffPageDelay(): number {
        return this.evrAvrConfigurationService.delay;
    }
}
