import { Injectable } from "@angular/core";
import { SportBookMarketHelper } from "src/app/common/helpers/sport-book-market.helper";
import { StringHelper } from "src/app/common/helpers/string.helper";
import {
  SportBookMarketStructured,
  SportBookResult,
  SportBookSelection,
} from "src/app/common/models/data-feed/sport-bet-models";
import { SelectionNameLength } from "src/app/common/models/general-codes-model";
import { BaseRacingTemplateService } from "src/app/common/services/base-racing-template.service";
import { EvrAvrConfigurationService } from "src/app/common/services/evr-avr-configuration.service";
import { GantryCommonContentService } from "src/app/common/services/gantry-common-content.service";
import { RaceOffService } from "src/app/common/services/race-off.service";
import {
  FeatureMarketEntry,
  FeatureSelectionEntry,
  GreyhoundRacingEntry,
  GreyhoundRacingRunnersResult,
  GreyhoundStaticContent
} from "src/app/greyhound-racing/models/greyhound-racing-template.model";
import {
  RunnerReserve,
  Selections,
  TypeFlagCode,
} from "src/app/greyhound-racing/models/greyhound-racing.enum";
import {
  RacingContentGreyhoundResult,
  GreyhoundRunner,
} from "src/app/greyhound-racing/models/racing-content.model";
import { PostPickNbService } from "./post-pick-nb.service";
import { GantryMarketsService } from "src/app/common/services/gantry-markets.service";
import { Markets } from "src/app/common/models/gantrymarkets.model";

@Injectable({
  providedIn: "root",
})
export class GreyhoundRacingRunnersService extends BaseRacingTemplateService {

  constructor(
    gantryCommonContentService: GantryCommonContentService,
    public postPickNbService: PostPickNbService,
    evrAvrConfigurationService: EvrAvrConfigurationService,
    public raceOffService: RaceOffService,
    public gantryMarketsService: GantryMarketsService
  ) {
    super(gantryCommonContentService, evrAvrConfigurationService, raceOffService, gantryMarketsService);
  }

  public createGreyhoundRacingRunnersResult(
    sportBookResult: SportBookResult,
    racingContent: RacingContentGreyhoundResult,
    greyHoundImageData: GreyhoundStaticContent,
    countryFlags: string,
    gantryMarkets: Array<Markets>,

  ): GreyhoundRacingRunnersResult {
    let greyhoundRacingRunnersResult = new GreyhoundRacingRunnersResult();

    greyhoundRacingRunnersResult.racingContent = racingContent;
    greyhoundRacingRunnersResult.isVirtualEvent = super.isEventVirtualRace([...sportBookResult.events.values()][0]?.typeFlagCode);
    if (!!racingContent?.postPick) {
      greyhoundRacingRunnersResult.isUKEvent = true;
      greyhoundRacingRunnersResult.napOrNb =
        this.postPickNbService.setPostPickNb(
          racingContent?.postPickNap,
          racingContent?.postPickNextBest,
          greyHoundImageData,
          racingContent?.postPick
        );
    }
    if (countryFlags == TypeFlagCode.Aus) {
      greyhoundRacingRunnersResult.isUKEvent = false;
    }
    else if (countryFlags == TypeFlagCode.Uk) {
      greyhoundRacingRunnersResult.isUKEvent = true;
    }
    let selections: {
      [runnerNumber: string]: { [marketName: string]: SportBookSelection };
    } = super.setResultAndGetGeneratedSelections(
      greyhoundRacingRunnersResult,
      [...sportBookResult.events.values()],
      racingContent.sisData,
      true, //To sort the selections.
      gantryMarkets
    );

    if (Object.keys(selections).length === 0) {
      return greyhoundRacingRunnersResult;
    }

    let event = [...sportBookResult.events.values()][0];
    greyhoundRacingRunnersResult.runnerCount = event.runnerCount?.toString();
    greyhoundRacingRunnersResult.eventStatus = event.eventStatus;
    greyhoundRacingRunnersResult.isEventStarted = event?.isEventStarted;
    greyhoundRacingRunnersResult.showRaceStage = this.canShowRaceStage(event?.isEventStarted, event?.raceStage, event?.offTime, greyhoundRacingRunnersResult?.isVirtualEvent);
    let isApprochingTraps = this.isCheckApprochingTraps(event?.raceStage, greyHoundImageData);
    if (isApprochingTraps) {
      greyhoundRacingRunnersResult.isApproachingTraps = true;
    }

    greyhoundRacingRunnersResult.displayStatus = event.displayStatus;
    super.setIsRaceOff(greyhoundRacingRunnersResult);
    greyhoundRacingRunnersResult.eventTimePlusTypeName =
      event?.eventTimePlusTypeName;
    // Set Greyhound Racing Entries
    greyhoundRacingRunnersResult.greyhoundRacingEntries = [];
    greyhoundRacingRunnersResult.featureMarketList = [];
    let inactiveRunners: Array<GreyhoundRacingEntry> = [];
    let greyhoundContentDict = {};

    for (let runnerNumber in selections) {
      let selectionKvp = selections[runnerNumber];
      let greyhoundContent = greyhoundContentDict[runnerNumber];

      let greyhoundRacingEntry = new GreyhoundRacingEntry();
      let selection = Object.values(selectionKvp)[0];
      greyhoundRacingEntry.trapImage =
        this.postPickNbService.greyhoundRacingPostTipImage(
          runnerNumber,
          greyHoundImageData
        );

      let racingContentRunner: GreyhoundRunner = racingContent?.runners?.find(
        (runner: GreyhoundRunner) => {
          return runner.trap && parseInt(runner.trap) == selection.runnerNumber;
        }
      );

      greyhoundRacingEntry.comment =
        countryFlags == TypeFlagCode.Aus
          ? ""
          : racingContentRunner?.comment?.toUpperCase();
      greyhoundRacingEntry.last5Runs = racingContentRunner?.last5Runs
        ?.split("")
        .join("-");
      greyhoundRacingEntry.isReserved = racingContentRunner?.reserve;

      if (selection) {
        greyhoundRacingEntry.greyhoundNumber =
          selection.runnerNumber?.toString();
        greyhoundRacingEntry.greyhoundName =
          StringHelper.checkSelectionNameLengthAndTrimEnd(selection.selectionName, SelectionNameLength.Eighteen);
      }
      if (selection && selection?.selectionName?.includes("N/R")) {
        greyhoundRacingEntry.nonRunner = true;
        greyhoundRacingRunnersResult.isNonRunner = true;
        greyhoundRacingEntry.greyhoundName = selection?.selectionName;
      }
      if (selection && selection?.selectionName?.includes(RunnerReserve.Reserve)) {
        greyhoundRacingEntry.isReserved = true;
        greyhoundRacingRunnersResult.hasAnyReservedRunner = true;
        greyhoundRacingEntry.greyhoundName =
          StringHelper.checkSelectionNameLengthAndTrimEnd(
            selection?.selectionName?.split("(")[0], SelectionNameLength.Eighteen
          );
      }

      if (greyhoundRacingRunnersResult?.markets?.length > 0) {
        let defaultMarketName = greyhoundRacingRunnersResult?.markets[0]?.marketName;
        let defaultMarketSelectionPrices =
          selectionKvp[defaultMarketName]?.prices?.price;
        if (defaultMarketSelectionPrices) {
          let price =
            defaultMarketSelectionPrices[0]?.numPrice /
            defaultMarketSelectionPrices[0]?.denPrice;
          greyhoundRacingEntry.currentPrice = isNaN(price) ? 0 : price;
          greyhoundRacingEntry.pastPrice1Str =
            SportBookMarketHelper.getPriceStr(defaultMarketSelectionPrices[1]);
          greyhoundRacingEntry.pastPrice2Str =
            SportBookMarketHelper.getPriceStr(defaultMarketSelectionPrices[2]);
          greyhoundRacingEntry.prices[defaultMarketName] =
            SportBookMarketHelper.getPriceStr(defaultMarketSelectionPrices[0]);

          greyhoundRacingEntry.hidePrice[defaultMarketName] = selection?.hidePrice;
          greyhoundRacingEntry.hideEntry[defaultMarketName] = selection?.hideEntry;

        } else {
          greyhoundRacingEntry.hidePrice[defaultMarketName] = selection?.hidePrice;
          greyhoundRacingEntry.hideEntry[defaultMarketName] = selection?.hideEntry;
        }


        if (greyhoundRacingRunnersResult?.markets?.length > 1) {
          for (let i = 1; i < greyhoundRacingRunnersResult?.markets?.length; i++) {
            let additionalMarketName = greyhoundRacingRunnersResult?.markets[i]?.marketName;
            let selection = selectionKvp[additionalMarketName];
            let selectionPrices = selection?.prices?.price;
            if (selectionPrices?.length > 0) {
              greyhoundRacingEntry.prices[additionalMarketName] =
                SportBookMarketHelper.getPriceStr(selectionPrices[0]);
            }

            greyhoundRacingEntry.hidePrice[additionalMarketName] = selection?.hidePrice;
            greyhoundRacingEntry.hideEntry[additionalMarketName] = selection?.hideEntry;

          }
        }
      }

      if (
        greyhoundContent &&
        (greyhoundRacingEntry.nonRunner || greyhoundContent.isWithdrawn)
      ) {
        inactiveRunners.push(greyhoundRacingEntry);
        continue;
      }
      greyhoundRacingRunnersResult.greyhoundRacingEntries.push(
        greyhoundRacingEntry
      );
    }

    let horseRunners: Array<GreyhoundRacingEntry> = [];
    greyhoundRacingRunnersResult.greyhoundRacingEntries.forEach((val) =>
      horseRunners.push(Object.assign({}, val))
    );

    let top3Positions: Array<string> = [];
    horseRunners.sort(function (a, b) {
      return a.currentPrice - b.currentPrice;
    });

    let horseWithRunners = horseRunners?.filter((x) => !x.nonRunner);
    if (horseWithRunners.length > 0) {
      if (greyhoundRacingRunnersResult?.markets?.length > 0 && horseWithRunners.filter(x => !x.hidePrice[greyhoundRacingRunnersResult?.markets[0]?.marketName]).length > 0) {
        greyhoundRacingRunnersResult.bettingFavouritePrice = horseWithRunners.filter(x => !x.hidePrice[greyhoundRacingRunnersResult?.markets[0]?.marketName])[0].currentPrice
      } else {
        greyhoundRacingRunnersResult.bettingFavouritePrice = horseWithRunners[0].currentPrice
      }
    }

    this.postPickNbService.getPostPick(
      racingContent,
      horseRunners,
      top3Positions,
      greyhoundRacingRunnersResult,
      greyHoundImageData
    );
    greyhoundRacingRunnersResult.areCurrentPricesPresent =
      greyhoundRacingRunnersResult.greyhoundRacingEntries.some(
        (x) => x.currentPrice
      );
    greyhoundRacingRunnersResult.arePastPricesPresent =
      greyhoundRacingRunnersResult.greyhoundRacingEntries.some(
        (x) => !!x.pastPrice1Str || !!x.pastPrice2Str
      );

    let distinctMarketsWithPricesLength: number = new Set<string>(
      greyhoundRacingRunnersResult.greyhoundRacingEntries.reduce(
        (prevVal, currVal) => [...prevVal, ...Object.keys(currVal.prices)],
        []
      )
    ).size;

    greyhoundRacingRunnersResult.arePlus1MarketPricesPresent =
      distinctMarketsWithPricesLength >= 2;
    greyhoundRacingRunnersResult.arePlus2MarketPricesPresent =
      distinctMarketsWithPricesLength === 3;
    greyhoundRacingRunnersResult.greyHoundImageData = greyHoundImageData;

    if (greyhoundRacingRunnersResult?.featureMarkets?.length > 0) {
      this.getOddsEvensData(greyhoundRacingRunnersResult.featureMarketList, greyhoundRacingRunnersResult.featureMarkets, greyhoundRacingRunnersResult.eventStatus, greyhoundRacingRunnersResult.isRaceOff);
      if (greyhoundRacingRunnersResult?.featureMarketList?.length > 0) {
        greyhoundRacingRunnersResult.isAdditionalMarket = true;
      }
    }
    return greyhoundRacingRunnersResult;
  }

  getOddsEvensData(featureMarketList: Array<FeatureMarketEntry> = [], markets: Array<SportBookMarketStructured>, eventStatus: string, isRaceOff: boolean) {
    if (markets?.length > 0) {
      markets?.forEach((market: SportBookMarketStructured, index) => {
        let featureMarketEntry = new FeatureMarketEntry();
        featureMarketEntry.marketName = market?.marketName;
        featureMarketEntry.marketIndex = index;
        featureMarketEntry.featureSelectionEntry = [];
        market?.selections?.forEach((selection: SportBookSelection) => {
          let featureSelectionEntry = new FeatureSelectionEntry();
          if (!(selection?.selectionStatus?.toLowerCase() === Selections.selectionStatus && selection?.displayStatus?.toLowerCase() === Selections.displayStatus)) {
            if (selection?.prices?.price?.length) {
              featureSelectionEntry.selectionName = selection.selectionName;
              if ((eventStatus?.toLowerCase() != Selections.selectionStatus) || (isRaceOff && eventStatus?.toLowerCase() == Selections.selectionStatus)) {
                featureSelectionEntry.price = SportBookMarketHelper.getPriceStr(selection?.prices?.price[0]);
              }
              else {
                featureSelectionEntry.price = "";
              }

              featureSelectionEntry.isSuspended = selection?.selectionStatus?.toLowerCase() === Selections.selectionStatus;
            }
            else {
              featureSelectionEntry.selectionName = selection.selectionName;
              featureSelectionEntry.price = "";
            }
          }
          if (Object.keys(featureSelectionEntry)?.length) {
            featureMarketEntry.featureSelectionEntry.push(featureSelectionEntry);
          }
        });
        if (featureMarketEntry.featureSelectionEntry?.length) {
          featureMarketList.push(featureMarketEntry);
        }

      })

    }
  }

  isCheckApprochingTraps(raceStage: string, greyhoundStaticContent?: GreyhoundStaticContent): boolean {
    let isApproching = false;
    if (!!raceStage) {
      let approchingTraps = raceStage?.toLowerCase()?.includes(greyhoundStaticContent?.contentParameters?.Approaching?.toLowerCase());
      if (!!approchingTraps) {
        isApproching = true;
      }
      return isApproching;
    }

  }
}
