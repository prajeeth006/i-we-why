import { Injectable } from '@angular/core';

import { BehaviorSubject, EMPTY, catchError, combineLatest, map, startWith, tap } from 'rxjs';

import { RunnerDetailsRacingEvent } from '../../../../../../common/helpers/runner-details-racing-event.helper';
import { SportBookSelectionHelper } from '../../../../../../common/helpers/sport-book-selection-helper';
import { StringHelper } from '../../../../../../common/helpers/string.helper';
import { MeetingResultContent, MeetingResultMap, ResultSelection } from '../../../../../../common/models/data-feed/meeting-results.model';
import { VirtualRaceSilkRunnerImageContent } from '../../../../../../common/models/gantry-commom-content.model';
import { Addendum, SelectionNameLength, StewardType } from '../../../../../../common/models/general-codes-model';
import { QueryParamEvent } from '../../../../../../common/models/query-param.model';
import { RunnerType } from '../../../../../../common/models/racing-tags.model';
import { BaseRacingTemplateService } from '../../../../../../common/services/base-racing-template.service';
import { EventResultService } from '../../../../../../common/services/data-feed/event-result-service/event-result.service';
import { EachwayPositionsService } from '../../../../../../common/services/eachway-positions.service';
import { ErrorService } from '../../../../../../common/services/error.service';
import { EvrAvrConfigurationService } from '../../../../../../common/services/evr-avr-configuration.service';
import { GantryCommonContentService } from '../../../../../../common/services/gantry-common-content.service';
import { GantryMarketsService } from '../../../../../../common/services/gantry-markets.service';
import { RaceOffService } from '../../../../../../common/services/race-off.service';
import { VirtualRaceImageService } from '../../../../../../common/services/virtual-race-image.service';
import { RacingContentResult } from '../../../../../models/data-feed/racing-content.model';
import { ImageStatus } from '../../../../../models/fallback-src.constant';
import { HorseRacingResultDetails } from '../../../../../models/horse-racing-meeting-results.model';
import { HorseRacingResultPage, RunnerImages, Totes } from '../../../../../models/horse-racing-template.model';
import { HorseRacingContent } from '../../../../../models/horseracing-content.model';
import { RacingContentService } from '../../../../../services/data-feed/racing-content.service';
import { HorseRacingContentService } from '../../../../../services/horseracing-content.service';

@Injectable({
    providedIn: 'root',
})
export class DarkThemeResultService extends BaseRacingTemplateService {
    private meetingList: Array<string> = [];
    isVirtualRaceFlag: boolean;
    private virtualRaceSilkImages: RunnerImages = new RunnerImages();
    private virtualRaceSubject = new BehaviorSubject<RunnerImages>(new RunnerImages());
    meetingName: string = '';
    DividendText: string;
    horseRacingContentData: HorseRacingContent;

    errorMessage$ = this.errorService.errorMessage$;

    horseRacingContent$ = this.horseRacingContent.data$.pipe(
        tap((horseRacingContent: HorseRacingContent) => {
            this.DividendText = horseRacingContent?.contentParameters?.NotWon ?? '';
            this.horseRacingContentData = horseRacingContent;
        }),
        startWith({} as HorseRacingContent), // Initial value
    );

    eventResult$ = this.eventResultService.data$.pipe(
        map((eventResultMap: MeetingResultMap) => {
            return this.prepareEventResult(eventResultMap);
        }),
        tap(() => {
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
        }),
        catchError((err) => {
            this.errorService.logError(err);
            return EMPTY;
        }),
    );

    racingContent$ = this.racingContentService.data$.pipe(
        catchError(() => {
            return EMPTY;
        }),
    );

    virtualRaceImageService$ = this.virtualRaceImageService.runnerImage$.pipe(
        startWith({} as VirtualRaceSilkRunnerImageContent), // Initial Value
    );

    data$ = combineLatest([this.eventResult$, this.racingContent$, this.horseRacingContent$, this.virtualRaceImageService$]).pipe(
        map(([eventResult, racingContent, horseRacingContent, virtualRaceSilkImageContent]) => {
            if (this.isVirtualRaceFlag && !!virtualRaceSilkImageContent) {
                this.virtualRaceSilkImages = virtualRaceSilkImageContent;
            }
            const horseRacingResultPage: HorseRacingResultPage = this.setEventResult(eventResult, racingContent, horseRacingContent);
            if (horseRacingContent?.contentParameters && horseRacingResultPage?.addendumMessageKey) {
                horseRacingResultPage.addendumMessage = horseRacingContent.contentParameters[horseRacingResultPage.addendumMessageKey];
            }
            if (racingContent?.hasRacingContent !== undefined && !racingContent?.hasRacingContent) {
                horseRacingResultPage.runners.map((runner) => {
                    if (runner.jockeySilkImage === ImageStatus.Default) {
                        runner.jockeySilkImage = ImageStatus.ImageNotPresent;
                    }
                });
            }

            return horseRacingResultPage;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(
        private eventResultService: EventResultService,
        private horseRacingContent: HorseRacingContentService,
        private racingContentService: RacingContentService,
        private errorService: ErrorService,
        private virtualRaceImageService: VirtualRaceImageService,
        evrAvrConfigurationService: EvrAvrConfigurationService,
        gantryCommonContentService: GantryCommonContentService,
        private eachwayPositionsService: EachwayPositionsService,
        public override raceOffService: RaceOffService,
        public override gantryMarketsService: GantryMarketsService,
    ) {
        super(gantryCommonContentService, evrAvrConfigurationService, raceOffService, gantryMarketsService);
    }

    prepareEventResult(eventResultMap: MeetingResultMap): HorseRacingResultPage {
        let resultingContent: MeetingResultContent = new MeetingResultContent();
        eventResultMap?.types?.forEach((value: MeetingResultContent) => {
            resultingContent = value;
        });
        return this.setHorseRacingEventResultsTemplate(resultingContent);
    }

    private setHorseRacingEventResultsTemplate(resultingContent: MeetingResultContent): HorseRacingResultPage {
        let horseRacingeventResults: HorseRacingResultPage = new HorseRacingResultPage();
        horseRacingeventResults.horseRacingContent = this.horseRacingContentData;

        horseRacingeventResults.eventName = resultingContent.resultingContent?.eventName;
        horseRacingeventResults.eventDateTime = resultingContent.resultingContent?.eventDateTime;
        const eventName = resultingContent.resultingContent?.eventName?.toUpperCase();
        if (this.isVirtualRaceFlag) {
            if (!this.meetingList?.includes(this.meetingName)) {
                this.meetingList.push(this.meetingName);
                this.virtualRaceImageService.setEventAndMeetingName('0', this.meetingName, eventName);
                this.virtualRaceImageService$.subscribe((runnerImageContent) => {
                    this.virtualRaceSubject.next(runnerImageContent);
                });
            }
        }

        horseRacingeventResults.raceOffTime = StringHelper.getRaceOffTimeAtResult(resultingContent?.resultingContent?.raceOffTime);
        horseRacingeventResults.eventTime = resultingContent?.resultingContent?.eventTime;
        horseRacingeventResults.eachWays = resultingContent?.resultingContent?.resultMarket?.eachWays;
        horseRacingeventResults.runnerCount = resultingContent?.resultingContent?.runnerCount?.toString();
        horseRacingeventResults.foreCast = StringHelper.checkToteResults(resultingContent?.resultingContent?.resultMarket?.foreCast);
        horseRacingeventResults.triCast = StringHelper.checkToteResults(resultingContent?.resultingContent?.resultMarket?.triCast);
        horseRacingeventResults.win = StringHelper.checkToteResults(resultingContent?.resultingContent?.resultMarket?.win);
        horseRacingeventResults.place = resultingContent?.resultingContent?.resultMarket?.place;
        let placeDividend = resultingContent?.resultingContent?.resultMarket?.placeDividends;
        placeDividend?.forEach((place) => {
            if (place?.runnerNumber) {
                if (place?.position == 'null' || place?.position == '' || place?.position == 'undefined') {
                    place.position = resultingContent?.resultingContent?.resultMarket?.listOfSelections?.find(
                        (selection) => Number(selection?.runnerNumber) == Number(place?.runnerNumber),
                    )?.position;
                }
            }
        });
        horseRacingeventResults.placeDividends = placeDividend ? RunnerDetailsRacingEvent.setPlaceDividends(placeDividend) : [];
        horseRacingeventResults.totePlaceDividends = StringHelper.checkTotePlaceDividends(
            resultingContent?.resultingContent?.resultMarket?.placeDividends,
        );
        horseRacingeventResults.totes = new Totes();
        horseRacingeventResults.totes.exacta = StringHelper.checkToteDividendResults(
            resultingContent?.resultingContent?.resultMarket?.exacta,
            this.DividendText,
        );
        horseRacingeventResults.totes.trifecta = StringHelper.checkToteDividendResults(
            resultingContent?.resultingContent?.resultMarket?.trifecta,
            this.DividendText,
        );
        horseRacingeventResults = this.setEventRunners(resultingContent?.resultingContent?.resultMarket?.listOfSelections, horseRacingeventResults);
        horseRacingeventResults.runners = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            resultingContent?.resultingContent?.resultMarket?.eachWays,
            horseRacingeventResults.runners,
            resultingContent?.resultingContent?.resultMarket?.sortedTricast,
        );
        horseRacingeventResults.isResultAmended = resultingContent.resultingContent?.isResultAmended;
        horseRacingeventResults = this.getaddendumMessageKey(resultingContent, horseRacingeventResults);
        return horseRacingeventResults;
    }

    private setEventRunners(selections: Array<ResultSelection>, horseRacingResultPage: HorseRacingResultPage): HorseRacingResultPage {
        const nonRunnerList: Number[] = [];
        selections?.forEach((selection) => {
            const horseDetails: HorseRacingResultDetails = new HorseRacingResultDetails();
            horseDetails.position = selection.position;
            horseDetails.horseName = selection.selectionName?.replaceAll('|', '')?.toLocaleUpperCase();
            horseDetails.horseRunnerNumber = selection.runnerNumber?.toString();
            const reserve = horseRacingResultPage?.horseRacingContent?.contentParameters?.NewDesignReserve ?? '';

            if (SportBookSelectionHelper.isNonRunner(selection.selectionName)) {
                nonRunnerList.push(Number(horseDetails.horseRunnerNumber));
            }
            if (horseDetails.horseName?.toUpperCase()?.includes(reserve?.toUpperCase())) {
                horseDetails.isReserved = true;
                horseDetails.horseName = StringHelper.selectionNameLengthAndTrimEnd(
                    StringHelper.checkReserveRunner(horseDetails.horseName),
                    SelectionNameLength.Thirteen,
                );
            } else {
                horseDetails.horseName = StringHelper.selectionNameLengthAndTrimEnd(horseDetails.horseName?.trim(), SelectionNameLength.Eighteen);
            }
            horseDetails.favourite = selection.favourite;
            horseDetails.isFavourite = StringHelper.checkFavouriteTag(selection?.favourite);
            horseDetails.isDeadHeat = selection.isDeadHeat;
            horseDetails.price = selection?.startingPriceFraction;
            if (horseDetails.position) horseRacingResultPage.runners.push(horseDetails);
        });
        horseRacingResultPage.horseRaceNonRunnerList = this.showNonRunners(nonRunnerList);
        horseRacingResultPage.runners?.sort(
            (a, b) => Number(a.position) - Number(b.position) || Number(a.horseRunnerNumber) - Number(b.horseRunnerNumber),
        );
        return horseRacingResultPage;
    }

    showNonRunners(nonRunnerList: Array<Number>) {
        return nonRunnerList.sort((a: number, b: number) => a - b).join(', ');
    }

    getJockeySilkImage(imageUrl: string) {
        return !imageUrl ? ImageStatus.ImageNotPresent : imageUrl;
    }

    setEventResult(
        eventResult: HorseRacingResultPage,
        racingContent: RacingContentResult,
        horseRacingContent: HorseRacingContent,
    ): HorseRacingResultPage {
        eventResult.racingContent = racingContent;
        eventResult.horseRacingContent = horseRacingContent;
        eventResult.eachWayResult = this.eachwayPositionsService.prepareEachWay(
            eventResult.eachWays!,
            horseRacingContent?.contentParameters?.WinOnly ?? '',
            horseRacingContent?.contentParameters?.Odds ?? '',
        );
        eventResult.isVirtualEvent = this.isVirtualRaceFlag;
        if (this.isVirtualRaceFlag) {
            if (this.virtualRaceSilkImages) {
                for (const eventRunnerList of eventResult.runners) {
                    eventRunnerList.jockeySilkImage = this.getJockeySilkImage(
                        this.virtualRaceSilkImages?.runnerImages[Number(eventRunnerList?.horseRunnerNumber) - 1]?.src,
                    );
                }
            }
        } else {
            const horseRunners = eventResult.racingContent?.horses;
            if (horseRunners) {
                for (const eventRunnerList of eventResult.runners) {
                    const runnerNumber = eventResult.racingContent?.horses?.find((a) => a?.saddle === eventRunnerList?.horseRunnerNumber);
                    if (runnerNumber) {
                        eventRunnerList.jockeySilkImage = this.getJockeySilkImage(runnerNumber.silkCoral);
                    }
                }
            }
        }
        return eventResult;
    }

    public setEventId(eventId: string) {
        this.eventResultService.setEventId(new QueryParamEvent(eventId));
    }

    private getaddendumMessageKey(resultingContent: MeetingResultContent, horseRacingResultPage: HorseRacingResultPage): HorseRacingResultPage {
        horseRacingResultPage.addendumColor = '#ffffff';
        if (resultingContent.resultingContent?.isAbandonedRace) {
            horseRacingResultPage.addendumMessageKey = Addendum.raceAbandoned;
        } else if (resultingContent.resultingContent?.isVoidRace) {
            horseRacingResultPage.addendumMessageKey = Addendum.voidRace;
        } else if (
            resultingContent.resultingContent?.isStewardEnquiry &&
            (resultingContent.resultingContent?.stewardsState === StewardType.stewardsState_S ||
                resultingContent.resultingContent?.stewardsState === StewardType.stewardsState_R)
        ) {
            horseRacingResultPage.addendumMessageKey = Addendum.stewardsEnquiry;
        } else if (
            resultingContent.resultingContent?.isStewardEnquiry &&
            resultingContent.resultingContent?.stewardsState === StewardType.stewardsState_V
        ) {
            horseRacingResultPage.addendumMessageKey = Addendum.resultStands;
        } else if (
            resultingContent.resultingContent?.isStewardEnquiry &&
            resultingContent.resultingContent?.stewardsState === StewardType.stewardsState_Z
        ) {
            horseRacingResultPage.addendumColor = '#FFCD00';
            horseRacingResultPage.addendumMessageKey = Addendum.amendedResult;
        } else if (resultingContent.resultingContent?.isPhotoFinish) {
            horseRacingResultPage.addendumMessageKey = Addendum.photo;
        } else if (!resultingContent.resultingContent?.isPhotoFinish && resultingContent.resultingContent?.isMarketResulted) {
            horseRacingResultPage.addendumMessageKey = '';
        }
        return horseRacingResultPage;
    }
}
