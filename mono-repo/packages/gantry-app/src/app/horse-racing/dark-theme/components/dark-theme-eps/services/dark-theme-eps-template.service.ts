import { Injectable } from '@angular/core';

//import * as moment from 'moment-timezone';
import { EMPTY, catchError, combineLatest, map, startWith, tap } from 'rxjs';

import { BrandImageContent } from '../../../../../common/components/error/models/error-content.model';
import { JsonStringifyHelper } from '../../../../../common/helpers/json-stringify.helper';
import { RunnerDetailsRacingEvent } from '../../../../../common/helpers/runner-details-racing-event.helper';
import { SportBookMarketHelper } from '../../../../../common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from '../../../../../common/helpers/sport-book-selection-helper';
import { StringHelper } from '../../../../../common/helpers/string.helper';
import { ResultSelection } from '../../../../../common/models/data-feed/meeting-results.model';
import { SportBookMarketStructured } from '../../../../../common/models/data-feed/sport-bet-models';
import { PriceType, SelectionNameLength, StewardType, StewardsStatus } from '../../../../../common/models/general-codes-model';
import { FavouriteTags, RunnerType } from '../../../../../common/models/racing-tags.model';
import { ErrorService } from '../../../../../common/services/error.service';
import { LoggerService } from '../../../../../common/services/logger.service';
import { HorseRacingMarkets, ResultCode } from '../../../../models/common.model';
import { HorseRacingContent } from '../../../../models/horseracing-content.model';
import { HorseRacingContentService } from '../../../../services/horseracing-content.service';
import {
    EPSHorseRacingMeetingResults,
    EPSHorseRacingResultDetails,
    EpsResultGroupedSorted,
    EpsResultsContent,
    Totes,
} from '../models/dark-theme-epsContent.model';
import { DarkThemeEpsImageService } from './dark-theme-eps-image.service';
import { EpsResult, SportBookEPSEventStructured } from './data-feed/dark-theme-eps-models';
import { DarkThemeEpsResultsService } from './eps-results/dark-theme-eps-results.service';

@Injectable({
    providedIn: 'root',
})
export class DarkThemeEpsTemplateService {
    favourite: string;
    horseRacingContentData: HorseRacingContent;
    constructor(
        private errorService: ErrorService,
        private epsImageService: DarkThemeEpsImageService,
        private epsResultsService: DarkThemeEpsResultsService,
        private loggerService: LoggerService,
        private horseRacingContent: HorseRacingContentService,
    ) {}

    errorMessage$ = this.errorService.errorMessage$;

    brandImageContent$ = this.epsImageService.brandImage$;

    promoImageContent$ = this.epsImageService.promoImage$;

    epsResult$ = this.epsResultsService.data$.pipe(
        map((epsResultMap: EpsResult) => {
            return this.prepareResult(epsResultMap);
        }),
        tap((epsResultsContent: EpsResultsContent) => {
            this.errorService.isStaleDataAvailable = true;
            JSON.stringify(epsResultsContent, JsonStringifyHelper.replacer);
            this.errorService.unSetError();
        }),
        catchError((err) => {
            this.errorService.logError(err);
            return EMPTY;
        }),
    );

    horseRacingContent$ = this.horseRacingContent.data$.pipe(
        tap((result) => {
            this.horseRacingContentData = result;
        }),
        startWith({} as HorseRacingContent), // Initial value
    );

    data$ = combineLatest([this.epsResult$, this.horseRacingContent$, this.brandImageContent$, this.promoImageContent$]).pipe(
        map(([epsResultMap, horseRacingContent, brandImageContent, promoImageContent]) => {
            return this.prepareCombinedResult(epsResultMap, horseRacingContent, brandImageContent, promoImageContent);
        }),
        tap((epsResultsTemplate: EpsResultsContent) => JSON.stringify(epsResultsTemplate, JsonStringifyHelper.replacer)),
        catchError((err) => {
            this.loggerService.logError(err);
            return EMPTY;
        }),
    );

    private prepareCombinedResult(
        epsResultsContent: EpsResultsContent,
        horseRacingContent: HorseRacingContent,
        brandImageContent: BrandImageContent,
        promoImageContent: BrandImageContent,
    ): EpsResultsContent {
        epsResultsContent.title = horseRacingContent?.contentParameters?.EpsTitle ?? '';
        epsResultsContent.currentTime = new Date();
        epsResultsContent.bottomRightText = horseRacingContent?.contentParameters?.EpsBottomRightText ?? '';
        epsResultsContent.bestOddsGuaranteed = horseRacingContent?.contentParameters?.NewDesignEpsBestOddsGuaranteed ?? '';
        epsResultsContent.brandImageSrc = brandImageContent?.brandImage?.src;
        epsResultsContent.promoImageSrc = promoImageContent?.brandImage?.src;
        epsResultsContent.epsTermsBottomRightText = horseRacingContent?.contentParameters?.NewDesignEpsTermsBottomRightText ?? '';
        epsResultsContent.epsFooterText = horseRacingContent?.contentParameters?.EpsFooterText ?? '';
        epsResultsContent.epsFooterLogoSrc = horseRacingContent?.epsFooterLogoNewDesign?.src;
        epsResultsContent.Runners = horseRacingContent?.contentParameters?.EpsRunner ?? '';
        epsResultsContent.Ran = horseRacingContent?.contentParameters?.EpsRan ?? '';
        this.favourite = horseRacingContent?.contentParameters?.Favourite ?? '';
        const todayDate = new Date();
        epsResultsContent.showBestOddsLevel =
            todayDate.getHours() >=
            (horseRacingContent?.contentParameters?.NewDesignEpsBOGMinTime && Number(horseRacingContent?.contentParameters?.NewDesignEpsBOGMinTime)
                ? Number(horseRacingContent?.contentParameters?.NewDesignEpsBOGMinTime)
                : 8);
        return epsResultsContent;
    }

    prepareResult(epsResultMap: EpsResult): EpsResultsContent {
        const epsResultsContent = new EpsResultsContent();
        const meetingList: Array<EPSHorseRacingMeetingResults> = new Array<EPSHorseRacingMeetingResults>();

        for (const [, event] of epsResultMap.events) {
            if (event.typeFlagCode?.includes('IE') || event?.typeFlagCode?.includes('UK')) {
                const horseRacingMeetingResults = new EPSHorseRacingMeetingResults();
                horseRacingMeetingResults.isEventResulted = false;
                horseRacingMeetingResults.eventTime = event?.eventDateTime;
                horseRacingMeetingResults.typeName = event?.typeName?.replaceAll('|', '');
                horseRacingMeetingResults.runnerCount = event?.runnerCount ? event?.runnerCount?.toString() : '';
                horseRacingMeetingResults.eventId = event?.eventKey;
                horseRacingMeetingResults.raceOffTime = event?.offTime || null;
                horseRacingMeetingResults.isAbandonedRace = !!event?.resultingContent?.isAbandonedRace;

                if (horseRacingMeetingResults?.isAbandonedRace) {
                    horseRacingMeetingResults.stewardsState = StewardsStatus.Abandoned;
                    horseRacingMeetingResults.hideHeader = true;
                    horseRacingMeetingResults.backgroundColor = 'bg-red';
                }

                for (const [, market] of event.markets) {
                    const reserve = this.horseRacingContentData?.contentParameters?.NewDesignReserve ?? '';
                    if (market.marketName?.replaceAll('|', '').toUpperCase() == HorseRacingMarkets.WinOrEachWay) {
                        horseRacingMeetingResults.winOrEachWayText = this.getEachWayString(market);
                        horseRacingMeetingResults.eachWays = event?.resultingContent?.resultMarket?.eachWays;
                        horseRacingMeetingResults.sortedTricast = event?.resultingContent?.resultMarket?.sortedTricast;
                        for (const [, selection] of market.selections) {
                            if (selection.resultCode?.toUpperCase() == ResultCode.Win) {
                                horseRacingMeetingResults.isEventResulted = true;
                            }
                            if (selection.runnerNumber) {
                                const horseDetails: EPSHorseRacingResultDetails = new EPSHorseRacingResultDetails();

                                horseDetails.currentPrice = SportBookSelectionHelper.getLatestPrice(selection);
                                horseDetails.horseOdds = SportBookMarketHelper.getPreparePrice(horseDetails?.currentPrice);

                                horseDetails.horseOddsTwo = SportBookMarketHelper.getPreparePrice(
                                    SportBookSelectionHelper.getPriceByPosition(selection, 1),
                                );

                                horseDetails.horseName = selection?.selectionName?.replaceAll('|', '')?.toLocaleUpperCase();
                                horseDetails.horseRunnerNumber = selection?.runnerNumber?.toString();
                                horseDetails.favourite = '';
                                horseDetails.hideEntry = selection?.hideEntry;
                                horseDetails.hidePrice = selection?.hidePrice;

                                if (selection.selectionName?.includes(PriceType.nonRunner)) {
                                    horseDetails.horseOdds = PriceType.nonRunner;
                                    horseDetails.horseName = StringHelper.checkSelectionNameLengthAndTrimEnd(
                                        horseDetails.horseName.toUpperCase().replace(PriceType.nonRunner, ''),
                                        SelectionNameLength.Eighteen,
                                    );
                                    horseDetails.horseOddsTwo = '';
                                    horseDetails.isNonRunner = true;
                                    horseRacingMeetingResults.nonRunnerList?.push(horseDetails);
                                } else if (horseDetails.horseName?.toLowerCase()?.includes(reserve?.toLowerCase())) {
                                    horseDetails.horseName = StringHelper.selectionNameLengthAndTrimEnd(
                                        StringHelper.checkReserveRunner(horseDetails?.horseName),
                                        SelectionNameLength?.Thirteen,
                                    );
                                    horseDetails.horseName = horseDetails?.horseName + reserve?.toLocaleUpperCase();
                                    horseRacingMeetingResults?.allRunnerSelections?.push(horseDetails);
                                } else {
                                    horseDetails.horseName = StringHelper.selectionNameLengthAndTrimEnd(
                                        horseDetails?.horseName?.toUpperCase(),
                                        SelectionNameLength.Eighteen,
                                    );
                                    horseRacingMeetingResults?.allRunnerSelections?.push(horseDetails);
                                }
                            }
                        }
                    }
                }

                if (event?.resultingContent && horseRacingMeetingResults?.isEventResulted) {
                    this.prepareMeetingResult(event, horseRacingMeetingResults);
                } else {
                    if (event?.raceStage && !horseRacingMeetingResults?.isEventResulted) {
                        horseRacingMeetingResults.isLiveNowEvent = true;
                        horseRacingMeetingResults.isRaceOff = event?.raceStage[0]?.toUpperCase() == 'O';
                        if (!horseRacingMeetingResults?.isRaceOff) {
                            this.removeSuspendedSelections(horseRacingMeetingResults);
                        }
                    } else if (!horseRacingMeetingResults?.isEventResulted && !horseRacingMeetingResults?.isLiveNowEvent) {
                        horseRacingMeetingResults.isEarlyPrice = true;
                        this.removeSuspendedSelections(horseRacingMeetingResults);
                    }
                }

                if (horseRacingMeetingResults.allRunnerSelections.length > 0 && !horseRacingMeetingResults?.isEventResulted) {
                    horseRacingMeetingResults.allRunnerSelections = this.sortSelectionsByFavorite(horseRacingMeetingResults?.allRunnerSelections);
                }
                meetingList?.push(horseRacingMeetingResults);
            }
        }

        meetingList.sort((a, b) => new Date(a?.eventTime)?.getTime() - new Date(b?.eventTime)?.getTime());

        const groupByName: { [key: string]: any } = {};
        const sortedTypes: string[] = [];

        meetingList.forEach(function (a) {
            a.typeName = StringHelper.removeAllPipeSymbols(a?.typeName);
            groupByName[a?.typeName] = groupByName[a?.typeName] || [];
            groupByName[a?.typeName]?.push(a);
            if (!sortedTypes.find((x) => x == a?.typeName)) {
                sortedTypes?.push(a?.typeName);
            }
        });
        const epsContentSortedList: Array<EpsResultGroupedSorted> = [];
        sortedTypes.forEach(function (itm) {
            const resultGrp = new EpsResultGroupedSorted();
            resultGrp.meetingName = itm;
            resultGrp.events = groupByName[itm];
            epsContentSortedList?.push(resultGrp);
        });
        epsResultsContent.epsResultGroupedSorted = epsContentSortedList;
        return epsResultsContent;
    }

    private getEachWayString(market: SportBookMarketStructured | null): string {
        if (
            (!!market && market?.eachWayFactorNum == market?.eachWayFactorDen) ||
            (!!market && market?.eachWayFactorNum == '') ||
            (!!market && market?.eachWayFactorDen == '')
        ) {
            return 'WIN ONLY';
        } else {
            let eachwayText = '';
            if (market) {
                eachwayText = market?.eachWayFactorNum + '/' + market?.eachWayFactorDen + ' E/W ';
                if (parseInt(market?.eachWayPlaces) > 0) {
                    for (let i = 1; i <= parseInt(market?.eachWayPlaces); i++) {
                        eachwayText = eachwayText + i;
                        if (i != parseInt(market?.eachWayPlaces)) {
                            eachwayText = eachwayText + '-';
                        }
                    }
                }
            }
            return eachwayText;
        }
    }

    private sortSelectionsByFavorite(selections: EPSHorseRacingResultDetails[]): EPSHorseRacingResultDetails[] {
        selections.sort((a, b) => {
            return parseInt(a?.horseRunnerNumber) - parseInt(b?.horseRunnerNumber);
        });

        if (selections[0]?.currentPrice) {
            selections?.sort((first, second) => {
                if (!first?.currentPrice) {
                    return 1;
                } else if (!second?.currentPrice) {
                    return -1;
                }
                const firstNumber = SportBookSelectionHelper.getCalculatedPrice(first?.currentPrice?.numPrice, first?.currentPrice?.denPrice);
                const secondNumber = SportBookSelectionHelper.getCalculatedPrice(second?.currentPrice?.numPrice, second?.currentPrice?.denPrice);

                return firstNumber - secondNumber;
            });

            const firstFavorite = selections?.find((x) => x?.horseOdds != '');
            if (firstFavorite) {
                const favorites = selections?.filter(
                    (x) =>
                        x.horseOdds != '' &&
                        x.currentPrice?.numPrice == firstFavorite?.currentPrice?.numPrice &&
                        x.currentPrice?.denPrice == firstFavorite?.currentPrice?.denPrice,
                );

                favorites?.forEach((favoriteSel) => {
                    if (favoriteSel) {
                        if (favorites?.length == 1) favoriteSel.favourite = this.favourite;
                        else if (favorites?.length == 2) favoriteSel.favourite = FavouriteTags.jointFavourite;
                        else if (favorites?.length > 2) favoriteSel.favourite = FavouriteTags.combinedFavorite;
                    }
                });
            }
        }
        return selections;
    }

    prepareMeetingResult(event: SportBookEPSEventStructured, horseRacingMeetingResults: EPSHorseRacingMeetingResults): EPSHorseRacingMeetingResults {
        horseRacingMeetingResults.foreCast = event?.resultingContent?.resultMarket?.foreCast;
        horseRacingMeetingResults.triCast = event?.resultingContent?.resultMarket?.triCast;
        horseRacingMeetingResults.win = event?.resultingContent?.resultMarket?.win;
        horseRacingMeetingResults.totes = new Totes();
        horseRacingMeetingResults.totes.exacta = event?.resultingContent?.resultMarket?.exacta;
        horseRacingMeetingResults.totes.trifecta = event?.resultingContent?.resultMarket?.trifecta;

        horseRacingMeetingResults = this.setRunnersAndNonRunners(event?.resultingContent?.resultMarket?.listOfSelections, horseRacingMeetingResults);
        horseRacingMeetingResults.isStewardEnquiry = !!event?.resultingContent?.isStewardEnquiry;
        horseRacingMeetingResults.isVoidRace = !!event?.resultingContent?.isVoidRace;
        horseRacingMeetingResults.isMarketSettled = true;
        horseRacingMeetingResults.showStewardsState = event?.resultingContent?.stewardsState;
        horseRacingMeetingResults.isAbandonedRace = !!event?.resultingContent?.isAbandonedRace;
        horseRacingMeetingResults.isPhotoFinish = !!event?.resultingContent?.isPhotoFinish;

        if (horseRacingMeetingResults?.isAbandonedRace) {
            horseRacingMeetingResults.stewardsState = StewardsStatus.Abandoned;
            horseRacingMeetingResults.hideHeader = true;
            horseRacingMeetingResults.backgroundColor = 'bg-red';
        } else if (horseRacingMeetingResults?.isVoidRace) {
            horseRacingMeetingResults.stewardsState = StewardsStatus.voidRace;
            horseRacingMeetingResults.hideHeader = true;
            horseRacingMeetingResults.backgroundColor = 'bg-red';
        } else if (
            horseRacingMeetingResults.isStewardEnquiry &&
            (horseRacingMeetingResults?.showStewardsState === StewardType.stewardsState_S ||
                horseRacingMeetingResults?.showStewardsState === StewardType.stewardsState_R)
        ) {
            horseRacingMeetingResults.stewardsState = StewardsStatus.stewardsEnquiry;
            horseRacingMeetingResults.backgroundColor = 'bg-yellow';
        } else if (horseRacingMeetingResults.isStewardEnquiry && horseRacingMeetingResults?.showStewardsState === StewardType.stewardsState_V) {
            horseRacingMeetingResults.stewardsState = StewardsStatus.resultStands;
            horseRacingMeetingResults.backgroundColor = 'bg-yellow';
        } else if (horseRacingMeetingResults.isStewardEnquiry && horseRacingMeetingResults?.showStewardsState === StewardType.stewardsState_Z) {
            horseRacingMeetingResults.stewardsState = StewardsStatus.amendedResult;
            horseRacingMeetingResults.backgroundColor = 'bg-yellow';
        } else if (horseRacingMeetingResults?.isStewardEnquiry && horseRacingMeetingResults?.isPhotoFinish) {
            horseRacingMeetingResults.stewardsState = StewardsStatus.stewardsEnquiry;
            horseRacingMeetingResults.backgroundColor = 'bg-yellow';
        } else if (horseRacingMeetingResults?.isPhotoFinish) {
            horseRacingMeetingResults.stewardsState = StewardsStatus.photo;
            horseRacingMeetingResults.backgroundColor = 'bg-yellow';
        } else if (!horseRacingMeetingResults?.isPhotoFinish && horseRacingMeetingResults?.isMarketSettled) {
            horseRacingMeetingResults.stewardsState = StewardsStatus.result;
            horseRacingMeetingResults.backgroundColor = 'bg-naviblue';
        }
        return horseRacingMeetingResults;
    }

    private setRunnersAndNonRunners(
        selections: Array<ResultSelection>,
        horseRacingMeetingResults: EPSHorseRacingMeetingResults,
    ): EPSHorseRacingMeetingResults {
        if (!selections) {
            selections = Array<ResultSelection>();
        }
        horseRacingMeetingResults.nonRunnerList = [];
        horseRacingMeetingResults.allRunnerSelections = [];
        horseRacingMeetingResults.runnerList = [];
        const reserve = this.horseRacingContentData?.contentParameters?.NewDesignReserve ?? '';
        selections.forEach((selection) => {
            const horseDetails: EPSHorseRacingResultDetails = new EPSHorseRacingResultDetails();
            horseDetails.position = selection.position;
            horseDetails.horseOdds = SportBookMarketHelper.prepareEvs(selection?.startingPriceFraction);

            horseDetails.horseName = selection?.selectionName?.replaceAll('|', '')?.toLocaleUpperCase();
            horseDetails.horseRunnerNumber = selection?.runnerNumber?.toString();
            horseDetails.favourite = selection?.favourite;
            horseDetails.isDeadHeat = selection?.isDeadHeat;

            if (selection.selectionName?.includes(PriceType.nonRunner)) {
                horseDetails.horseOdds = PriceType.nonRunner;
                horseDetails.horseName = StringHelper.checkSelectionNameLengthAndTrimEnd(
                    horseDetails.horseName?.toUpperCase()?.replace(PriceType.nonRunner, ''),
                    SelectionNameLength.Eighteen,
                );
                horseDetails.isNonRunner = true;
                horseDetails.position = selections?.length?.toString();
                horseRacingMeetingResults?.nonRunnerList?.push(horseDetails);
            } else if (horseDetails.horseName?.toLowerCase().includes(reserve?.toLowerCase())) {
                horseDetails.horseName = StringHelper.selectionNameLengthAndTrimEnd(
                    StringHelper.checkReserveRunner(horseDetails?.horseName),
                    SelectionNameLength?.Thirteen,
                );
                horseDetails.horseName = horseDetails?.horseName + reserve?.toLocaleUpperCase();
                horseRacingMeetingResults?.allRunnerSelections?.push(horseDetails);
            } else {
                horseDetails.horseName = StringHelper.checkSelectionNameLengthAndTrimEnd(
                    horseDetails?.horseName?.toUpperCase(),
                    SelectionNameLength.Eighteen,
                );
                horseRacingMeetingResults?.allRunnerSelections?.push(horseDetails);
                horseRacingMeetingResults?.runnerList?.push(horseDetails);
            }
        });

        horseRacingMeetingResults.runnerList = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            horseRacingMeetingResults?.eachWays,
            horseRacingMeetingResults?.runnerList,
            horseRacingMeetingResults?.sortedTricast,
        );
        return horseRacingMeetingResults;
    }

    private removeSuspendedSelections(horseRacingMeetingResults: EPSHorseRacingMeetingResults) {
        horseRacingMeetingResults.runnerList = horseRacingMeetingResults?.runnerList.filter((x) => !x.hideEntry);
        horseRacingMeetingResults.nonRunnerList = horseRacingMeetingResults?.nonRunnerList.filter((x) => !x.hideEntry);
        horseRacingMeetingResults.allRunnerSelections = horseRacingMeetingResults?.allRunnerSelections.filter((x) => !x.hideEntry);
        if (!horseRacingMeetingResults?.isRaceOff) {
            horseRacingMeetingResults?.runnerList.forEach((x) => {
                x.horseOdds = x?.hidePrice ? '' : x?.horseOdds;
                x.horseOddsTwo = x?.hidePrice ? '' : x?.horseOddsTwo;
                return x;
            });
            horseRacingMeetingResults.nonRunnerList.forEach((x) => {
                x.horseOdds = x?.isNonRunner ? x?.horseOdds : x?.hidePrice ? '' : x?.horseOdds;
                x.horseOddsTwo = x?.hidePrice ? '' : x?.horseOddsTwo;
                return x;
            });
            horseRacingMeetingResults.allRunnerSelections.forEach((x) => {
                x.horseOdds = x?.hidePrice ? '' : x?.horseOdds;
                x.horseOddsTwo = x?.hidePrice ? '' : x?.horseOddsTwo;
                return x;
            });
        }
    }
}
