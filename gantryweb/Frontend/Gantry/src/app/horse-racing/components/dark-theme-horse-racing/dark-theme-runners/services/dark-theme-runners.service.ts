import { Injectable } from '@angular/core';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SportBookResult, SportBookSelection } from 'src/app/common/models/data-feed/sport-bet-models';
import { SelectionNameLength, SelectionStatusCode } from 'src/app/common/models/general-codes-model';
import { SisSelectionStatus } from 'src/app/common/models/sis-model';
import { BaseRacingTemplateService } from 'src/app/common/services/base-racing-template.service';
import { EvrAvrConfigurationService } from 'src/app/common/services/evr-avr-configuration.service';
import { GantryCommonContentService } from 'src/app/common/services/gantry-common-content.service';
import { GantryMarketsService } from 'src/app/common/services/gantry-markets.service';
import { RaceOffService } from 'src/app/common/services/race-off.service';
import { ScreenTypeService } from 'src/app/common/services/screen-type.service';
import { HorseRacingMarkets } from 'src/app/horse-racing/models/common.model';
import { RacingContentResult, HorseDetails } from 'src/app/horse-racing/models/data-feed/racing-content.model';
import { ImageStatus } from 'src/app/horse-racing/models/fallback-src.constant';
import { RunnerImages, HorseRacingEntry, HorseRacingRunnersResult } from 'src/app/horse-racing/models/horse-racing-template.model';
import { HorseRacingContent } from 'src/app/horse-racing/models/horseracing-content.model';
import { HorseRacing } from 'src/app/horse-racing/models/hose-racing-common.enum';

@Injectable({
  providedIn: 'root'
})
export class DarkThemeRunnersService extends BaseRacingTemplateService {

  virtualRaceSilkImage: RunnerImages;
  isVirtualRaceFlag: boolean;
  horseRacingEntry: HorseRacingEntry;
  matchingSisWithdrawnSelectionStatus: SisSelectionStatus;
  isVoidHorse: boolean = false;
  replaceNrString: string;

  constructor(gantryCommonContentService: GantryCommonContentService,
    evrAvrConfigurationService: EvrAvrConfigurationService, private screenTypeService: ScreenTypeService,
    public raceOffService: RaceOffService,
    public gantryMarketsService: GantryMarketsService) {
    super(gantryCommonContentService, evrAvrConfigurationService, raceOffService, gantryMarketsService);
  }

  public createHorseRacingRunnersResult(sportBookResult: SportBookResult, racingContent: RacingContentResult, horseRacingContent: HorseRacingContent):
    HorseRacingRunnersResult {
    let horseRacingRunnersResult = new HorseRacingRunnersResult();
    horseRacingRunnersResult.horseRacingContent = horseRacingContent;
    horseRacingRunnersResult.racingContent = racingContent;
    let event = [...sportBookResult.events.values()][0];
    horseRacingRunnersResult.isEventStarted = event?.isEventStarted;
    super.setIsRaceOff(horseRacingRunnersResult);
    horseRacingRunnersResult.isVirtualEvent = this.isVirtualRaceFlag;
    let runnerNumberMarketNameSelectionPvk: { [runnerNumber: string]: { [marketName: string]: SportBookSelection } } =
      super.setResultAndGetGeneratedSelections(horseRacingRunnersResult, [...sportBookResult.events.values()], racingContent.sisData);

    if (Object.keys(runnerNumberMarketNameSelectionPvk).length === 0) {
      return horseRacingRunnersResult;
    }


    horseRacingRunnersResult.runnerCount = event.runnerCount?.toString();
    horseRacingRunnersResult.eventStatus = event.eventStatus;
    horseRacingRunnersResult.showRaceStage = this.canShowRaceStage(event?.isEventStarted, event?.raceStage, event?.offTime, horseRacingRunnersResult?.isVirtualEvent);
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
      if (horseRacingRunnersResult?.virtualRaceSilkImage?.runnerImages?.length >= (parseInt(runnerNumber))) {
        let silkImageUrl = horseRacingRunnersResult?.virtualRaceSilkImage?.runnerImages[parseInt(runnerNumber) - 1]?.src;
        jockeySilkImage = !!silkImageUrl ? silkImageUrl : ImageStatus.ImageNotPresent;
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
    let inactiveRunners: Array<HorseRacingEntry> = [];
    let horseContentDict: { [runnerNumber: string]: HorseDetails } =
      horseRacingRunnersResult.racingContent?.horses?.reduce((prevDict, currValHorseDetails) => ({
        ...prevDict,
        [currValHorseDetails.saddle]: currValHorseDetails
      }), {});

    let horseRacingContent = horseRacingRunnersResult.horseRacingContent;

    for (let runnerNumber in runnerNumberMarketNameSelectionPvk) {
      let marketNameSelectionPvk = runnerNumberMarketNameSelectionPvk[runnerNumber];
      let horseContent;

      if (horseContentDict) {
        horseContent = horseContentDict[runnerNumber];
      }

      this.replaceNrString = this.getMatchingSisWithdrawnSelectionStatus(racingContent, runnerNumber, horseRacingContent);

      if (horseContent) {
        this.horseRacingEntry.jockeySilkImage = this.getJockeySilkImage(horseRacingRunnersResult, runnerNumber, horseContent);
        this.horseRacingEntry.horseNumber = horseContent.saddle;
        this.horseRacingEntry.horseName = `${StringHelper.checkSelectionNameLengthAndTrimEnd(horseContent.horseName, SelectionNameLength.Eighteen)}`;
        this.horseRacingEntry.nonRunner = horseContent.nonRunner;
        this.horseRacingEntry.isWithdrawn = horseContent.isWithdrawn;
      }
      else {
        let selectionFirst = Object.values(marketNameSelectionPvk)[0];
        if (marketNameSelectionPvk) {
          this.horseRacingEntry.horseNumber = selectionFirst.runnerNumber?.toString();
          this.horseRacingEntry.horseName = StringHelper.checkSelectionNameLengthAndTrimEnd(selectionFirst.selectionName?.replace('N/R', this.replaceNrString)?.trim(), SelectionNameLength.Eighteen);
        }
        this.horseRacingEntry.jockeySilkImage = this.getJockeySilkImage(horseRacingRunnersResult, runnerNumber);
      }


      let marketNames = Object.keys(marketNameSelectionPvk);
      if (marketNames.length > 0) {
        function calculatedPrice(numPrice: number, denPrice: number): number {
          let price = numPrice / denPrice;
          return isNaN(price) ? 0 : price;
        }

        let defaultMarketName = marketNames[0];
        let defaultMarketSelectionPrices = marketNameSelectionPvk[defaultMarketName]?.prices?.price;
        if (defaultMarketSelectionPrices) {
          this.horseRacingEntry.currentPrice = calculatedPrice(defaultMarketSelectionPrices[0]?.numPrice, defaultMarketSelectionPrices[0]?.denPrice);
          this.horseRacingEntry.pastPrice1Str = SportBookMarketHelper.getPreparePrice(defaultMarketSelectionPrices[1]);
          this.horseRacingEntry.prices[defaultMarketName] = SportBookMarketHelper.getPreparePrice(defaultMarketSelectionPrices[0]);
          this.horseRacingEntry.hidePrice[defaultMarketName] = marketNameSelectionPvk[defaultMarketName]?.hidePrice;
          this.horseRacingEntry.hideEntry[defaultMarketName] = marketNameSelectionPvk[defaultMarketName]?.hideEntry;
        } else {
          this.horseRacingEntry.hidePrice[defaultMarketName] = marketNameSelectionPvk[defaultMarketName]?.hidePrice;
          this.horseRacingEntry.hideEntry[defaultMarketName] = marketNameSelectionPvk[defaultMarketName]?.hideEntry;
        }

        for (let i = 1; i < marketNames?.length; i++) {
          let additionalMarketName = marketNames[i];
          let selection = marketNameSelectionPvk[additionalMarketName];
          let selectionPrices = selection?.prices?.price;
          if (selectionPrices?.length > 0) {
            this.horseRacingEntry.prices[additionalMarketName] = SportBookMarketHelper.getPreparePrice(selectionPrices[0]);
          }
          this.horseRacingEntry.hidePrice[additionalMarketName] = selection?.hidePrice;
          this.horseRacingEntry.hideEntry[additionalMarketName] = selection?.hideEntry;
        }

        for (let i = 0; i < marketNames?.length; i++) {
          let marketName = marketNames[i];
          let selection = marketNameSelectionPvk[marketName];
          if (marketName?.toUpperCase() == HorseRacingMarkets.WinOrEachWay || marketName?.toUpperCase() == HorseRacingMarkets.WinOnly) {
            if (selection?.resultCode == "Void") {
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
          if (selection?.selectionName?.includes(HorseRacing.Reserve)) {
            this.horseRacingEntry.isReserved = true;
            this.horseRacingEntry.horseName = StringHelper.SelectionNameLengthAndTrimEnd(selection?.selectionName?.split("(")[0]?.trim(), SelectionNameLength.THIRTEEN);
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
    horseRacingRunnersResult.horseRacingEntries =
      horseRacingRunnersResult.horseRacingEntries.concat(inactiveRunners);
  }

  private setPriceInfos(horseRacingRunnersResult: HorseRacingRunnersResult) {

    if (horseRacingRunnersResult?.markets?.length > 0 && horseRacingRunnersResult?.horseRacingEntries?.filter(x => !x.hidePrice[horseRacingRunnersResult?.markets[0]?.marketName])?.length > 0) {
      horseRacingRunnersResult.bettingFavouritePrice = horseRacingRunnersResult?.horseRacingEntries?.filter(x => !x.hidePrice[horseRacingRunnersResult?.markets[0]?.marketName])[0]?.currentPrice
    } else {
      horseRacingRunnersResult.bettingFavouritePrice = horseRacingRunnersResult?.horseRacingEntries[0]?.currentPrice
    }

    horseRacingRunnersResult.areCurrentPricesPresent =
      horseRacingRunnersResult?.horseRacingEntries?.some(x => x.currentPrice);
    horseRacingRunnersResult.arePastPricesPresent =
      horseRacingRunnersResult?.horseRacingEntries?.some(x => !!x.pastPrice1Str);
  }

  private setAreExtraMarketsPresent(horseRacingRunnersResult: HorseRacingRunnersResult) {
    let distinctMarketsWithPricesLength: number = new Set<string>(
      horseRacingRunnersResult.horseRacingEntries.reduce((prevVal, currVal) => [...prevVal, ...Object.keys(currVal.prices)], [])
    ).size;

    horseRacingRunnersResult.arePlus1MarketPricesPresent = distinctMarketsWithPricesLength >= 2;
    horseRacingRunnersResult.arePlus2MarketPricesPresent = distinctMarketsWithPricesLength === 3;
  }

  setSpotlightHorseName(racingContent: RacingContentResult, horseRacingRunnersResult: HorseRacingRunnersResult) {
    const spotlightTip = racingContent?.newspapers?.find(n => n.name?.toLowerCase() === HorseRacing.SpotLight);
    const isDiomedContainsSpotlightRunner = SportBookSelectionHelper.isSelectionExist(racingContent?.diomed, spotlightTip?.selection);

    if (isDiomedContainsSpotlightRunner) {
      const racingPostTip = racingContent?.diomed?.toLowerCase().split(spotlightTip?.selection?.toLowerCase());
      if (racingPostTip?.length === 2) {
        horseRacingRunnersResult.diomedStart = racingPostTip[0];
        horseRacingRunnersResult.diomedEnd = racingPostTip[1];
      }
    } else {
      horseRacingRunnersResult.diomed = racingContent?.diomed;
    }

    horseRacingRunnersResult.spotlightHorseName = this.getNonRunnerDetails(racingContent, spotlightTip?.rpSelectionUid, horseRacingRunnersResult, spotlightTip?.selection?.toUpperCase());
    horseRacingRunnersResult.isNonRunner = this.getNonRunnerDetails(racingContent, spotlightTip?.rpSelectionUid, horseRacingRunnersResult, spotlightTip?.selection?.toUpperCase()) == HorseRacing.NonRunner ? true : false;
  }

  private getNonRunnerDetails(racingContent: RacingContentResult, spotlightTipId: number, horseRacingRunnersResult: HorseRacingRunnersResult, spotlightTipName: string) {
    if (horseRacingRunnersResult?.horseRacingEntries?.find(race => race.horseName === spotlightTipName)) {
      return (horseRacingRunnersResult?.horseRacingEntries?.find(race => race.horseName === spotlightTipName && race.nonRunner === true) && this.screenTypeService.isHalfScreenType === false) ? HorseRacing.NonRunner
        : horseRacingRunnersResult?.horseRacingEntries?.find(race => race.horseName === spotlightTipName)?.horseName;
    }
    else if (racingContent?.horses?.find(horse => horse.rpHorseId === spotlightTipId)) {
      return racingContent?.horses?.find(horse => horse.rpHorseId === spotlightTipId && horse.nonRunner === true) ? HorseRacing.NonRunner
        : racingContent?.horses?.find(horse => horse.rpHorseId === spotlightTipId)?.horseName;
    }
  }
  private getMatchingSisWithdrawnSelectionStatus(racingContent: RacingContentResult, runnerNumber: string, horseRacingContent: HorseRacingContent): string {
    this.horseRacingEntry = new HorseRacingEntry();
    this.isVoidHorse = false;
    this.matchingSisWithdrawnSelectionStatus = racingContent?.sisData?.selectionStatus?.find(selectionStatus =>
      selectionStatus.status === SelectionStatusCode.Withdrawn && selectionStatus.runnerNumber === runnerNumber)
    return !!this.matchingSisWithdrawnSelectionStatus ? horseRacingContent?.contentParameters?.WD : "";
  }
}
