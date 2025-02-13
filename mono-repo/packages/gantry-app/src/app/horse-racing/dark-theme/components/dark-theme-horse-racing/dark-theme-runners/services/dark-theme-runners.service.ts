import { Injectable } from '@angular/core';

import { SportBookMarketHelper } from '../../../../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../../../../common/helpers/string.helper';
import { SportBookResult, SportBookSelection } from '../../../../../../common/models/data-feed/sport-bet-models';
import { SelectionNameLength, SelectionStatusCode } from '../../../../../../common/models/general-codes-model';
import { SisSelectionStatus } from '../../../../../../common/models/sis-model';
import { BaseRacingTemplateService } from '../../../../../../common/services/base-racing-template.service';
import { EvrAvrConfigurationService } from '../../../../../../common/services/evr-avr-configuration.service';
import { GantryCommonContentService } from '../../../../../../common/services/gantry-common-content.service';
import { GantryMarketsService } from '../../../../../../common/services/gantry-markets.service';
import { RaceOffService } from '../../../../../../common/services/race-off.service';
import { ScreenTypeService } from '../../../../../../common/services/screen-type.service';
import { HorseRacingMarkets } from '../../../../../models/common.model';
import { HorseDetails, RacingContentResult } from '../../../../../models/data-feed/racing-content.model';
import { ImageStatus } from '../../../../../models/fallback-src.constant';
import { HorseRacingEntry, HorseRacingRunnersResult, RunnerImages } from '../../../../../models/horse-racing-template.model';
import { HorseRacingContent } from '../../../../../models/horseracing-content.model';
import { DarkThemeRcRunnersService } from '../../dark-theme-runner-count/dark-theme-rc-runners/services/dark-theme-rc-runners.service';

@Injectable({
    providedIn: 'root',
})
export class DarkThemeRunnersService extends BaseRacingTemplateService {
    virtualRaceSilkImage: RunnerImages;
    isVirtualRaceFlag: boolean;
    horseRacingEntry: HorseRacingEntry;
    matchingSisWithdrawnSelectionStatus?: SisSelectionStatus;
    isVoidHorse: boolean = false;
    replaceNrString: string;
    isRacingPostHorseSisStatus?: SisSelectionStatus;
    diomedSelectionName?: string;
    isDiomedPresent: boolean = false;

    spotlightHorseName: string;
    hasBackPrice = false;
    hasMultiMarket = false;

    constructor(
        gantryCommonContentService: GantryCommonContentService,
        evrAvrConfigurationService: EvrAvrConfigurationService,
        public override raceOffService: RaceOffService,
        public override gantryMarketsService: GantryMarketsService,
        public screenTypeService: ScreenTypeService,
        private darkThemeRcRunnersService: DarkThemeRcRunnersService,
    ) {
        super(gantryCommonContentService, evrAvrConfigurationService, raceOffService, gantryMarketsService);
    }

    public createHorseRacingRunnersResult(
        sportBookResult: SportBookResult,
        racingContent: RacingContentResult,
        horseRacingContent: HorseRacingContent,
    ): HorseRacingRunnersResult {
        const horseRacingRunnersResult = new HorseRacingRunnersResult();
        horseRacingRunnersResult.horseRacingContent = horseRacingContent;
        horseRacingRunnersResult.racingContent = racingContent;
        const event = [...sportBookResult.events.values()][0];
        horseRacingRunnersResult.isEventStarted = event.isEventStarted;
        super.setIsRaceOff(horseRacingRunnersResult);
        horseRacingRunnersResult.isVirtualEvent = this.isVirtualRaceFlag;
        const runnerNumberMarketNameSelectionPvk: {
            [runnerNumber: string]: { [marketName: string]: SportBookSelection };
        } = super.setResultAndGetGeneratedSelections(horseRacingRunnersResult, [...sportBookResult.events.values()], racingContent.sisData);

        if (Object.keys(runnerNumberMarketNameSelectionPvk).length === 0) {
            return horseRacingRunnersResult;
        }

        if (!!horseRacingRunnersResult && !!horseRacingRunnersResult?.defaultPriceColumn) {
            horseRacingRunnersResult.defaultPriceColumn = StringHelper.updateRaceOffTimeToOffAt(
                horseRacingRunnersResult?.defaultPriceColumn,
                horseRacingContent?.contentParameters?.OffAt ?? '',
            );
        }

        horseRacingRunnersResult.runnerCount = event.runnerCount?.toString();
        horseRacingRunnersResult.eventStatus = event.eventStatus;
        horseRacingRunnersResult.showRaceStage = this.canShowRaceStage(
            event?.isEventStarted,
            event?.raceStage,
            event?.offTime,
            horseRacingRunnersResult?.isVirtualEvent,
        );
        horseRacingRunnersResult.displayStatus = event.displayStatus;
        horseRacingRunnersResult.eventDateTime = event.eventDateTime;
        horseRacingRunnersResult.typeFlagCode = event.typeFlagCode;
        horseRacingRunnersResult.eventTimePlusTypeName = event?.eventTimePlusTypeName;
        if (this.isVirtualRaceFlag && !!this.virtualRaceSilkImage) {
            horseRacingRunnersResult.virtualRaceSilkImage = this.virtualRaceSilkImage;
        }

        this.setRacingEntries(horseRacingRunnersResult, racingContent, runnerNumberMarketNameSelectionPvk);
        this.setPriceInfos(horseRacingRunnersResult);
        this.setAreExtraMarketsPresent(horseRacingRunnersResult);
        this.setSpotlightHorseName(racingContent, horseRacingRunnersResult);
        return horseRacingRunnersResult;
    }

    private getJockeySilkImage(horseRacingRunnersResult: HorseRacingRunnersResult, runnerNumber: string, horseContent: any = undefined) {
        let jockeySilkImage = ImageStatus.Default;

        if (this.isVirtualRaceFlag) {
            if (horseRacingRunnersResult?.virtualRaceSilkImage?.runnerImages?.length >= parseInt(runnerNumber)) {
                const silkImageUrl = horseRacingRunnersResult?.virtualRaceSilkImage?.runnerImages[parseInt(runnerNumber) - 1]?.src;
                jockeySilkImage = silkImageUrl ? silkImageUrl : ImageStatus.ImageNotPresent;
            } else {
                jockeySilkImage = ImageStatus.ImageNotPresent;
            }
        } else {
            if (horseContent) {
                jockeySilkImage = !horseContent?.silkCoral ? ImageStatus.ImageNotPresent : horseContent.silkCoral;
            }
        }

        return jockeySilkImage;
    }

    private setRacingEntries(
        horseRacingRunnersResult: HorseRacingRunnersResult,
        racingContent: RacingContentResult,
        runnerNumberMarketNameSelectionPvk: { [runnerNumber: string]: { [marketName: string]: SportBookSelection } },
    ) {
        horseRacingRunnersResult.horseRacingEntries = [];
        const inactiveRunners: Array<HorseRacingEntry> = [];
        const horseContentDict: {
            [runnerNumber: string]: HorseDetails;
        } = horseRacingRunnersResult?.racingContent?.horses
            ? horseRacingRunnersResult?.racingContent?.horses?.reduce(
                  (prevDict, currValHorseDetails) => ({
                      ...prevDict,
                      [currValHorseDetails.saddle]: currValHorseDetails,
                  }),
                  {},
              )
            : {};

        const horseRacingContent = horseRacingRunnersResult.horseRacingContent;

        for (const runnerNumber in runnerNumberMarketNameSelectionPvk) {
            const marketNameSelectionPvk = runnerNumberMarketNameSelectionPvk[runnerNumber];
            let horseContent;

            if (horseContentDict) {
                horseContent = horseContentDict[runnerNumber];
            }

            this.replaceNrString = this.getMatchingSisWithdrawnSelectionStatus(racingContent, runnerNumber, horseRacingContent);

            if (horseContent) {
                this.horseRacingEntry.jockeySilkImage = this.getJockeySilkImage(horseRacingRunnersResult, runnerNumber, horseContent);
                this.horseRacingEntry.horseNumber = horseContent.saddle;
                this.horseRacingEntry.nonRunner = horseContent.nonRunner;
                this.horseRacingEntry.isWithdrawn = horseContent.isWithdrawn;
            } else {
                const selectionFirst = Object.values(marketNameSelectionPvk)[0];
                if (marketNameSelectionPvk) {
                    this.horseRacingEntry.horseNumber = selectionFirst.runnerNumber?.toString();
                }
                this.horseRacingEntry.jockeySilkImage = this.getJockeySilkImage(horseRacingRunnersResult, runnerNumber);
            }
            const selectionFirst = Object.values(marketNameSelectionPvk)[0];
            if (marketNameSelectionPvk) {
                const formattedSelectionName = selectionFirst.selectionName?.replace('N/R', this.replaceNrString)?.replace('W/D', '')?.trim();
                this.horseRacingEntry.horseName = StringHelper.selectionNameLengthAndTrimEnd(
                    formattedSelectionName,
                    this.getMaxCharacterLength(formattedSelectionName),
                );
            } else if (horseContent) {
                this.horseRacingEntry.horseName = `${StringHelper.selectionNameLengthAndTrimEnd(
                    horseContent.horseName,
                    SelectionNameLength.Eighteen,
                )}`;
            }

            const marketNames = Object.keys(marketNameSelectionPvk);
            if (marketNames.length > 0) {
                const defaultMarketName = marketNames[0];
                const defaultMarketSelectionPrices = marketNameSelectionPvk[defaultMarketName]?.prices?.price;
                if (defaultMarketSelectionPrices) {
                    this.horseRacingEntry.currentPrice = this.calculatedPrice(
                        defaultMarketSelectionPrices[0]?.numPrice,
                        defaultMarketSelectionPrices[0]?.denPrice,
                    );
                    this.horseRacingEntry.pastPrice1Str = SportBookMarketHelper.getPreparePrice(defaultMarketSelectionPrices[1]);
                    this.horseRacingEntry.prices[defaultMarketName] = SportBookMarketHelper.getPreparePrice(defaultMarketSelectionPrices[0]);
                    this.horseRacingEntry.hidePrice[defaultMarketName] = marketNameSelectionPvk[defaultMarketName].hidePrice;
                    this.horseRacingEntry.hideEntry[defaultMarketName] = marketNameSelectionPvk[defaultMarketName].hideEntry;
                } else {
                    this.horseRacingEntry.hidePrice[defaultMarketName] = marketNameSelectionPvk[defaultMarketName].hidePrice;
                    this.horseRacingEntry.hideEntry[defaultMarketName] = marketNameSelectionPvk[defaultMarketName].hideEntry;
                }

                for (let i = 1; i < marketNames?.length; i++) {
                    const additionalMarketName = marketNames[i];
                    const selection = marketNameSelectionPvk[additionalMarketName];
                    const selectionPrices = selection?.prices?.price;
                    if (!!selectionPrices && selectionPrices.length) {
                        this.horseRacingEntry.prices[additionalMarketName] = SportBookMarketHelper.getPreparePrice(selectionPrices[0]);
                    }
                    this.horseRacingEntry.hidePrice[additionalMarketName] = selection.hidePrice;
                    this.horseRacingEntry.hideEntry[additionalMarketName] = selection.hideEntry;
                }

                for (let i = 0; i < marketNames?.length; i++) {
                    const marketName = marketNames[i];
                    const selection = marketNameSelectionPvk[marketName];
                    if (marketName?.toUpperCase() == HorseRacingMarkets.WinOrEachWay || marketName?.toUpperCase() == HorseRacingMarkets.WinOnly) {
                        if (selection?.resultCode == 'Void') {
                            this.isVoidHorse = true;
                        }
                    }
                    if (marketName?.toLocaleUpperCase()?.includes(HorseRacingMarkets.BettingWithout)) {
                        horseRacingRunnersResult.isBettingWithout = true;
                    }
                    if (selection?.selectionName?.includes('N/R')) {
                        this.horseRacingEntry.nonRunner = true;
                    }
                    if (selection?.selectionName?.includes('W/D') || this.matchingSisWithdrawnSelectionStatus?.status?.includes('W')) {
                        this.horseRacingEntry.nonRunner = false;
                        this.horseRacingEntry.isWithdrawn = true;
                    }
                    if (
                        horseRacingContent?.contentParameters?.NewDesignReserve &&
                        horseRacingContent?.contentParameters?.NewDesignReserve &&
                        selection?.selectionName?.includes(horseRacingContent?.contentParameters?.NewDesignReserve)
                    ) {
                        this.horseRacingEntry.isReserved = true;
                        this.horseRacingEntry.horseName = StringHelper.selectionNameLengthAndTrimEnd(
                            selection?.selectionName?.split('(')[0]?.trim(),
                            SelectionNameLength.Thirteen,
                        );
                    }
                }
            }

            if (this.horseRacingEntry.nonRunner || this.horseRacingEntry.isWithdrawn) {
                inactiveRunners.push(this.horseRacingEntry);
                continue;
            }
            if (!this.isVoidHorse) {
                horseRacingRunnersResult.horseRacingEntries.push(this.horseRacingEntry);
            }
        }

        horseRacingRunnersResult.horseRacingEntries.sort((a, b) => a.currentPrice - b.currentPrice);
        horseRacingRunnersResult.horseRacingEntries = horseRacingRunnersResult.horseRacingEntries.concat(inactiveRunners);
    }

    private calculatedPrice(numPrice: number, denPrice: number): number {
        const price = numPrice / denPrice;
        return isNaN(price) ? 0 : price;
    }

    private setPriceInfos(horseRacingRunnersResult: HorseRacingRunnersResult) {
        if (
            horseRacingRunnersResult?.markets?.length > 0 &&
            horseRacingRunnersResult?.horseRacingEntries?.filter((x) => !x.hidePrice[horseRacingRunnersResult?.markets[0]?.marketName])?.length > 0
        ) {
            horseRacingRunnersResult.bettingFavouritePrice = horseRacingRunnersResult?.horseRacingEntries?.filter(
                (x) => !x.hidePrice[horseRacingRunnersResult?.markets[0]?.marketName],
            )[0]?.currentPrice;
        } else {
            horseRacingRunnersResult.bettingFavouritePrice = horseRacingRunnersResult?.horseRacingEntries[0]?.currentPrice;
        }

        horseRacingRunnersResult.areCurrentPricesPresent = this.hasBackPrice = horseRacingRunnersResult?.horseRacingEntries?.some(
            (x) => x.currentPrice,
        );
        horseRacingRunnersResult.arePastPricesPresent = horseRacingRunnersResult?.horseRacingEntries?.some((x) => !!x.pastPrice1Str);
    }

    private setAreExtraMarketsPresent(horseRacingRunnersResult: HorseRacingRunnersResult) {
        const distinctMarketsWithPricesLength = new Set<string>(
            horseRacingRunnersResult.horseRacingEntries.reduce((prevVal, currVal) => [...prevVal, ...Object.keys(currVal.prices)], []),
        ).size;

        horseRacingRunnersResult.arePlus1MarketPricesPresent = this.hasMultiMarket = distinctMarketsWithPricesLength >= 2;
    }

    setSpotlightHorseName(racingContent: RacingContentResult, horseRacingRunnersResult: HorseRacingRunnersResult) {
        const spotlightTip = racingContent?.newspapers?.find(
            (n) => n.name?.toLowerCase() === horseRacingRunnersResult?.horseRacingContent?.contentParameters?.NewDesignSpotlight,
        );
        if (this.darkThemeRcRunnersService?.isScrollingEnabled) {
            const racingPostTip = spotlightTip ? racingContent?.diomed?.split(new RegExp(spotlightTip?.selection, 'i')) : [];
            if (racingPostTip?.length === 2) {
                horseRacingRunnersResult.diomedStart = racingPostTip[0];
                horseRacingRunnersResult.diomedEnd = racingPostTip[1];
                this.diomedSelectionName = racingContent?.diomed?.replace(racingPostTip[0], '')?.replace(racingPostTip[1], '')?.trim();
            } else {
                horseRacingRunnersResult.diomed = racingContent?.diomed;
            }
            if (horseRacingRunnersResult.diomedStart || horseRacingRunnersResult.diomedEnd || horseRacingRunnersResult.diomed) {
                this.isDiomedPresent = true;
            }
        }
        this.spotlightHorseName = spotlightTip
            ? this.getNonRunnerDetails(racingContent, spotlightTip?.rpSelectionUid, horseRacingRunnersResult, spotlightTip?.selection)
            : '';

        if (this.spotlightHorseName) {
            horseRacingRunnersResult.spotlightHorseName = StringHelper.selectionNameLengthAndTrimEnd(
                this.spotlightHorseName,
                this.getMaxCharacterLength(this.spotlightHorseName),
            );
        }

        const isNonRunner =
            spotlightTip &&
            this.getNonRunnerDetails(racingContent, spotlightTip.rpSelectionUid, horseRacingRunnersResult, spotlightTip?.selection?.toUpperCase()) ==
                horseRacingRunnersResult?.horseRacingContent?.contentParameters?.NewDesignNonRunner;

        const isWithdrawn =
            spotlightTip &&
            this.getWithDrawnDetails(racingContent, spotlightTip.rpSelectionUid, horseRacingRunnersResult, spotlightTip?.selection?.toUpperCase()) ==
                horseRacingRunnersResult?.horseRacingContent?.contentParameters?.NewDesignWithdrawn;

        horseRacingRunnersResult.isNonRunner = !!isNonRunner;
        horseRacingRunnersResult.isWithdrawn = !!isWithdrawn;
    }

    private getNonRunnerDetails(
        racingContent: RacingContentResult,
        spotlightTipId: number,
        horseRacingRunnersResult: HorseRacingRunnersResult,
        spotlightTipName: string,
    ) {
        const horseRacingHorseEntries = horseRacingRunnersResult?.horseRacingEntries?.filter(
            (race) => race.horseName?.toUpperCase() === spotlightTipName?.toUpperCase(),
        );

        if (horseRacingHorseEntries?.length) {
            return horseRacingHorseEntries[0]?.nonRunner === true
                ? (horseRacingRunnersResult?.horseRacingContent?.contentParameters?.NewDesignNonRunner ?? '')
                : horseRacingHorseEntries[0]?.horseName;
        } else {
            const racingContentHorseEntries = racingContent?.horses?.filter((horse) => horse?.rpHorseId === spotlightTipId);
            if (racingContentHorseEntries?.length) {
                return racingContentHorseEntries[0]?.nonRunner === true
                    ? (horseRacingRunnersResult?.horseRacingContent?.contentParameters?.NewDesignNonRunner ?? '')
                    : racingContentHorseEntries[0]?.horseName;
            }
        }
        return '';
    }

    public getMaxCharacterLength(formattedSelectionName: string) {
        return !this.screenTypeService.isHalfScreenType &&
            this.hasBackPrice &&
            this.hasMultiMarket &&
            formattedSelectionName?.toUpperCase() === this.spotlightHorseName?.toUpperCase()
            ? SelectionNameLength.Sixteen
            : SelectionNameLength.Eighteen;
    }

    private getWithDrawnDetails(
        racingContent: RacingContentResult,
        spotlightTipId: number,
        horseRacingRunnersResult: HorseRacingRunnersResult,
        spotlightTipName: string,
    ) {
        const horseRacingHorseEntries = horseRacingRunnersResult?.horseRacingEntries?.filter(
            (race) => race.horseName?.toUpperCase() === spotlightTipName?.toUpperCase(),
        );

        if (horseRacingHorseEntries?.length) {
            this.isRacingPostHorseSisStatus = racingContent?.sisData?.selectionStatus?.find(
                (selectionStatus) =>
                    selectionStatus.status === SelectionStatusCode.Withdrawn &&
                    selectionStatus?.runnerNumber === horseRacingHorseEntries[0]?.horseNumber,
            );
            if (horseRacingHorseEntries[0]?.isWithdrawn === true || !!this.isRacingPostHorseSisStatus) {
                return horseRacingRunnersResult?.horseRacingContent?.contentParameters?.NewDesignWithdrawn ?? '';
            }
        }
        return '';
    }

    private getMatchingSisWithdrawnSelectionStatus(
        racingContent: RacingContentResult,
        runnerNumber: string,
        horseRacingContent: HorseRacingContent,
    ): string {
        this.horseRacingEntry = new HorseRacingEntry();
        this.isVoidHorse = false;
        this.matchingSisWithdrawnSelectionStatus = racingContent?.sisData?.selectionStatus?.find(
            (selectionStatus) => selectionStatus.status === SelectionStatusCode.Withdrawn && selectionStatus.runnerNumber === runnerNumber,
        );
        return this.matchingSisWithdrawnSelectionStatus ? (horseRacingContent?.contentParameters?.WD ?? '') : '';
    }
}
