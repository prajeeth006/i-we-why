import { Injectable } from '@angular/core';

import { SportBookMarketHelper } from '../../../../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../../../../common/helpers/string.helper';
import {
    SportBookEventStructured,
    SportBookMarketStructured,
    SportBookResult,
    SportBookSelection,
} from '../../../../../../common/models/data-feed/sport-bet-models';
import { Markets } from '../../../../../../common/models/gantrymarkets.model';
import { SelectionNameLength } from '../../../../../../common/models/general-codes-model';
import { BaseRacingTemplateService } from '../../../../../../common/services/base-racing-template.service';
import { EvrAvrConfigurationService } from '../../../../../../common/services/evr-avr-configuration.service';
import { GantryCommonContentService } from '../../../../../../common/services/gantry-common-content.service';
import { GantryMarketsService } from '../../../../../../common/services/gantry-markets.service';
import { RaceOffService } from '../../../../../../common/services/race-off.service';
import {
    FeatureMarketEntry,
    FeatureSelectionEntry,
    GreyhoundRacingEntry,
    GreyhoundRacingRunnersResult,
    GreyhoundStaticContent,
} from '../../../../../models/greyhound-racing-template.model';
import { RunnerReserve, Selections, TypeFlagCode } from '../../../../../models/greyhound-racing.enum';
import { RacingContentGreyhoundResult } from '../../../../../models/racing-content.model';
import { VacantCheckTransformPipe } from '../../../../../pipes/vacant-check-transform.pipe';
import { DarkThemeGreyhoundRacingResultService } from '../../dark-theme-result/services/dark-theme-greyhound-racing-result.service';
import { DarkThemePostPickNbService } from './dark-theme-post-pick-nb.service';

@Injectable({
    providedIn: 'root',
})
export class DarkThemeGreyhoundRacingRunnersService extends BaseRacingTemplateService {
    constructor(
        gantryCommonContentService: GantryCommonContentService,
        evrAvrConfigurationService: EvrAvrConfigurationService,
        raceOffService: RaceOffService,
        gantryMarketsService: GantryMarketsService,
        private darkThemePostPickNbService: DarkThemePostPickNbService,
        private vacantCheckTransformPipe: VacantCheckTransformPipe,
        private darkThemeGreyhoundRacingResultService: DarkThemeGreyhoundRacingResultService,
    ) {
        super(gantryCommonContentService, evrAvrConfigurationService, raceOffService, gantryMarketsService);
    }

    public createGreyhoundRacingRunnersResult(
        sportBookResult: SportBookResult,
        racingContent: RacingContentGreyhoundResult,
        greyHoundStaticContent: GreyhoundStaticContent,
        countryFlags: string,
        gantryMarkets: Array<Markets>,
    ): GreyhoundRacingRunnersResult {
        const greyhoundRacingRunnersResult = new GreyhoundRacingRunnersResult();

        greyhoundRacingRunnersResult.racingContent = racingContent;
        greyhoundRacingRunnersResult.isVirtualEvent = super.isEventVirtualRace([...sportBookResult.events.values()][0]?.typeFlagCode);
        greyhoundRacingRunnersResult.isEventPGRTrack = super.isEventPGRTrack([...sportBookResult.events.values()][0]?.flags?.toString());

        // post pick logic
        if (racingContent?.postPick) {
            greyhoundRacingRunnersResult.isUKEvent = true; // irish country
            greyhoundRacingRunnersResult.napOrNb = this.darkThemePostPickNbService.setPostPickNb(
                racingContent?.postPickNap,
                racingContent?.postPickNextBest,
                greyHoundStaticContent,
                racingContent?.postPick,
            );
        }

        if (countryFlags == TypeFlagCode.Aus) {
            greyhoundRacingRunnersResult.isUKEvent = false;
        } else if (countryFlags == TypeFlagCode.Uk) {
            greyhoundRacingRunnersResult.isUKEvent = true;
        }

        this.darkThemeGreyhoundRacingResultService.isUkEvent = greyhoundRacingRunnersResult.isUKEvent;

        const selections: {
            [runnerNumber: string]: { [marketName: string]: SportBookSelection };
        } = super.setResultAndGetGeneratedSelections(
            greyhoundRacingRunnersResult,
            [...sportBookResult.events.values()],
            racingContent.sisData,
            true, //To sort the selections.
            gantryMarkets,
        );

        if (Object.keys(selections).length === 0) {
            return greyhoundRacingRunnersResult;
        }

        const event: SportBookEventStructured = [...sportBookResult.events.values()][0];
        greyhoundRacingRunnersResult.runnerCount = event.runnerCount?.toString();
        greyhoundRacingRunnersResult.eventStatus = event.eventStatus;
        greyhoundRacingRunnersResult.isEventStarted = event?.isEventStarted;
        greyhoundRacingRunnersResult.showRaceStage = this.canShowRaceStage(
            event?.isEventStarted,
            event?.raceStage,
            event?.offTime,
            greyhoundRacingRunnersResult?.isVirtualEvent,
        );
        const isApprochingTraps = this.isCheckApprochingTraps(event?.raceStage, greyHoundStaticContent);
        if (isApprochingTraps) {
            greyhoundRacingRunnersResult.isApproachingTraps = true;
        }
        greyhoundRacingRunnersResult.defaultPriceColumn = StringHelper.updateRaceOffTimeToOffAt(
            greyhoundRacingRunnersResult?.defaultPriceColumn,
            greyHoundStaticContent?.contentParameters?.OffAt ?? '',
        );

        greyhoundRacingRunnersResult.displayStatus = event.displayStatus;
        super.setIsRaceOff(greyhoundRacingRunnersResult);
        greyhoundRacingRunnersResult.eventTimePlusTypeName = event?.eventTimePlusTypeName;
        // Set Greyhound Racing Entries
        greyhoundRacingRunnersResult.greyhoundRacingEntries = [];
        greyhoundRacingRunnersResult.featureMarketList = [];
        const inactiveRunners: Array<GreyhoundRacingEntry> = [];
        const greyhoundContentDict: { [key: string]: any } = {};
        const postPicks: string[] = racingContent?.postPick?.trim().split('-') ?? [];
        for (const runnerNumber in selections) {
            const selectionKvp = selections[runnerNumber];
            const greyhoundContent = greyhoundContentDict[runnerNumber];

            const greyhoundRacingEntry = new GreyhoundRacingEntry();
            const selection = Object.values(selectionKvp)[0];

            if (selection) {
                greyhoundRacingEntry.greyhoundNumber = selection.runnerNumber?.toString();
                greyhoundRacingEntry.greyhoundName = StringHelper.selectionNameLengthAndTrimEnd(selection.selectionName, SelectionNameLength.Sixteen);
                if (greyhoundRacingEntry.greyhoundNumber === postPicks[0]) {
                    greyhoundRacingEntry.hasPostPic = true;
                }
            }

            if (selection && selection?.selectionName?.includes('N/R')) {
                greyhoundRacingEntry.nonRunner = true;
                greyhoundRacingRunnersResult.isNonRunner = true;
                greyhoundRacingEntry.greyhoundName = selection?.selectionName;
            }
            if (selection && selection?.selectionName?.includes(RunnerReserve.Reserve)) {
                greyhoundRacingEntry.isReserved = true;
                greyhoundRacingRunnersResult.hasAnyReservedRunner = true;

                greyhoundRacingEntry.greyhoundName = StringHelper.selectionNameLengthAndTrimEnd(
                    selection?.selectionName?.split('(')[0]?.trim(),
                    SelectionNameLength.Sixteen,
                );
            }

            greyhoundRacingEntry.greyhoundName = this.vacantCheckTransformPipe.transform(greyhoundRacingEntry.greyhoundName);

            if (greyhoundRacingRunnersResult?.markets?.length > 0) {
                const defaultMarketName = greyhoundRacingRunnersResult?.markets[0]?.marketName;
                const defaultMarketSelectionPrices = selectionKvp[defaultMarketName]?.prices?.price;
                if (defaultMarketSelectionPrices) {
                    const price = defaultMarketSelectionPrices[0]?.numPrice / defaultMarketSelectionPrices[0]?.denPrice;
                    greyhoundRacingEntry.currentPrice = isNaN(price) ? 0 : price;
                    greyhoundRacingEntry.pastPrice1Str = SportBookMarketHelper.getPreparePrice(defaultMarketSelectionPrices[1]);
                    greyhoundRacingEntry.pastPrice2Str = SportBookMarketHelper.getPreparePrice(defaultMarketSelectionPrices[2]);
                    greyhoundRacingEntry.prices[defaultMarketName] = SportBookMarketHelper.getPreparePrice(defaultMarketSelectionPrices[0]);

                    greyhoundRacingEntry.hidePrice[defaultMarketName] = selection?.hidePrice;
                    greyhoundRacingEntry.hideEntry[defaultMarketName] = selection?.hideEntry;
                } else {
                    greyhoundRacingEntry.hidePrice[defaultMarketName] = selection?.hidePrice;
                    greyhoundRacingEntry.hideEntry[defaultMarketName] = selection?.hideEntry;
                }

                if (greyhoundRacingRunnersResult?.markets?.length > 1) {
                    for (let i = 1; i < greyhoundRacingRunnersResult?.markets?.length; i++) {
                        const additionalMarketName = greyhoundRacingRunnersResult?.markets[i]?.marketName;
                        const selection = selectionKvp[additionalMarketName];
                        const selectionPrices = selection?.prices?.price;
                        if (!!selectionPrices && selectionPrices?.length > 0) {
                            greyhoundRacingEntry.prices[additionalMarketName] = SportBookMarketHelper.getPreparePrice(selectionPrices[0]);
                        }

                        greyhoundRacingEntry.hidePrice[additionalMarketName] = selection?.hidePrice;
                        greyhoundRacingEntry.hideEntry[additionalMarketName] = selection?.hideEntry;
                    }
                }
            }

            if (greyhoundContent && (greyhoundRacingEntry.nonRunner || greyhoundContent.isWithdrawn)) {
                inactiveRunners.push(greyhoundRacingEntry);
                continue;
            }

            // Adding each greyhoundRacingEntry
            greyhoundRacingRunnersResult.greyhoundRacingEntries.push(greyhoundRacingEntry);
        }

        const greyhoundRunners: Array<GreyhoundRacingEntry> = [];
        greyhoundRacingRunnersResult.greyhoundRacingEntries.forEach((val) => greyhoundRunners.push(Object.assign({}, val)));

        greyhoundRunners.sort(function (a, b) {
            return a.currentPrice - b.currentPrice;
        });

        const horseWithRunners = greyhoundRunners?.filter((x) => !x.nonRunner);
        if (horseWithRunners.length > 0) {
            if (
                greyhoundRacingRunnersResult?.markets?.length > 0 &&
                horseWithRunners.filter((x) => !x.hidePrice[greyhoundRacingRunnersResult?.markets[0]?.marketName]).length > 0
            ) {
                greyhoundRacingRunnersResult.bettingFavouritePrice = horseWithRunners.filter(
                    (x) => !x.hidePrice[greyhoundRacingRunnersResult?.markets[0]?.marketName],
                )[0].currentPrice;
            } else {
                greyhoundRacingRunnersResult.bettingFavouritePrice = horseWithRunners[0].currentPrice;
            }
        }

        this.darkThemePostPickNbService.getPostPick(racingContent, greyhoundRunners, greyhoundRacingRunnersResult);

        greyhoundRacingRunnersResult.areCurrentPricesPresent = greyhoundRacingRunnersResult.greyhoundRacingEntries.some((x) => x.currentPrice);
        greyhoundRacingRunnersResult.arePastPricesPresent = greyhoundRacingRunnersResult.greyhoundRacingEntries.some(
            (x) => !!x.pastPrice1Str || !!x.pastPrice2Str,
        );

        const distinctMarketsWithPricesLength: number = new Set<string>(
            greyhoundRacingRunnersResult.greyhoundRacingEntries.reduce((prevVal, currVal) => [...prevVal, ...Object.keys(currVal.prices)], []),
        ).size;

        greyhoundRacingRunnersResult.arePlus1MarketPricesPresent = distinctMarketsWithPricesLength >= 2;
        greyhoundRacingRunnersResult.arePlus2MarketPricesPresent = distinctMarketsWithPricesLength === 3;
        greyhoundRacingRunnersResult.greyHoundImageData = greyHoundStaticContent;

        if (greyhoundRacingRunnersResult?.featureMarkets?.length > 0) {
            this.getOddsEvensData(
                greyhoundRacingRunnersResult.featureMarketList,
                greyhoundRacingRunnersResult.featureMarkets,
                greyhoundRacingRunnersResult.eventStatus,
                greyhoundRacingRunnersResult.isRaceOff,
            );
            if (greyhoundRacingRunnersResult?.featureMarketList?.length > 0) {
                greyhoundRacingRunnersResult.isAdditionalMarket = true;
            }
        }

        return greyhoundRacingRunnersResult;
    }

    getOddsEvensData(
        featureMarketList: Array<FeatureMarketEntry> = [],
        markets: Array<SportBookMarketStructured>,
        eventStatus: string,
        isRaceOff: boolean,
    ) {
        if (markets?.length > 0) {
            markets?.forEach((market: SportBookMarketStructured, index) => {
                const featureMarketEntry = new FeatureMarketEntry();
                featureMarketEntry.marketName = market?.marketName;
                featureMarketEntry.marketIndex = index;
                featureMarketEntry.featureSelectionEntry = [];
                market?.selections?.forEach((selection: SportBookSelection) => {
                    const featureSelectionEntry = new FeatureSelectionEntry();
                    if (
                        !(
                            selection?.selectionStatus?.toLowerCase() === Selections.selectionStatus &&
                            selection?.displayStatus?.toLowerCase() === Selections.displayStatus
                        )
                    ) {
                        if (selection?.prices?.price?.length) {
                            featureSelectionEntry.selectionName = selection.selectionName;
                            if (
                                eventStatus?.toLowerCase() != Selections.selectionStatus ||
                                (isRaceOff && eventStatus?.toLowerCase() == Selections.selectionStatus)
                            ) {
                                featureSelectionEntry.price = SportBookMarketHelper.getPreparePrice(selection?.prices?.price[0]);
                            } else {
                                featureSelectionEntry.price = '';
                            }

                            featureSelectionEntry.isSuspended = selection?.selectionStatus?.toLowerCase() === Selections.selectionStatus;
                        } else {
                            featureSelectionEntry.selectionName = selection.selectionName;
                            featureSelectionEntry.price = '';
                        }
                    }
                    if (Object.keys(featureSelectionEntry)?.length) {
                        featureMarketEntry?.featureSelectionEntry?.push(featureSelectionEntry);
                    }
                });
                if (featureMarketEntry.featureSelectionEntry?.length) {
                    featureMarketList.push(featureMarketEntry);
                }
            });
        }
    }

    isCheckApprochingTraps(raceStage: string, greyhoundStaticContent?: GreyhoundStaticContent): boolean {
        let isApproching = false;
        if (raceStage) {
            if (greyhoundStaticContent?.contentParameters) {
                const approchingTraps = raceStage?.toLowerCase()?.includes(greyhoundStaticContent?.contentParameters?.Approaching?.toLowerCase());
                if (approchingTraps) {
                    isApproching = true;
                }
                return isApproching;
            }
        }
        return isApproching;
    }
}
