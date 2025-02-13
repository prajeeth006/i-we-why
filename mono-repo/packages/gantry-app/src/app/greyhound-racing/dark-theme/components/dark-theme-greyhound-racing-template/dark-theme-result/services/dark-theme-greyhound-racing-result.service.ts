import { Injectable } from '@angular/core';

import { EMPTY, catchError, combineLatest, map, startWith, tap } from 'rxjs';

import { RunnerDetailsRacingEvent } from '../../../../../../common/helpers/runner-details-racing-event.helper';
import { SportBookSelectionHelper } from '../../../../../../common/helpers/sport-book-selection-helper';
import { StringHelper } from '../../../../../../common/helpers/string.helper';
import { MeetingResultContent, MeetingResultMap, ResultSelection } from '../../../../../../common/models/data-feed/meeting-results.model';
import { SelectionNameLength } from '../../../../../../common/models/general-codes-model';
import { QueryParamEvent } from '../../../../../../common/models/query-param.model';
import { RunnerType } from '../../../../../../common/models/racing-tags.model';
import { EventResultService } from '../../../../../../common/services/data-feed/event-result-service/event-result.service';
import { EachwayPositionsService } from '../../../../../../common/services/eachway-positions.service';
import { ErrorService } from '../../../../../../common/services/error.service';
import { GreyhoundRacingContentService } from '../../../../../components/greyhound-racing-template/services/greyhound-racing-content.service';
import { GreyhoundRacingResultPage, GreyhoundResultEntry, GreyhoundStaticContent } from '../../../../../models/greyhound-racing-template.model';
import { RunnerReserve } from '../../../../../models/greyhound-racing.enum';
import { RacingContentGreyhoundResult } from '../../../../../models/racing-content.model';
import { RacingContentGreyhoundService } from '../../../../../services/data-feed/racing-content-greyhound.service';

@Injectable({
    providedIn: 'root',
})
export class DarkThemeGreyhoundRacingResultService {
    meetingName: string = '';
    isVirtualRaceFlag: boolean;
    isUkEvent: boolean;

    errorMessage$ = this.errorService.errorMessage$;

    eventResult$ = this.eventResultService.data$.pipe(
        tap(() => {
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
        }),
        catchError((err) => {
            this.errorService.logError(err);
            return EMPTY;
        }),
    );

    greyHoundData$ = this.greyhoundRacingContentService.data$.pipe(
        tap((greyHoundData: GreyhoundStaticContent) => {
            console.log(greyHoundData);
        }),
        startWith({} as GreyhoundStaticContent), // Initial Value
    );

    racingContent$ = this.racingContentGreyhoundService.data$.pipe(
        catchError(() => {
            return EMPTY;
        }),
    );

    data$ = combineLatest([this.racingContent$, this.greyHoundData$, this.eventResult$]).pipe(
        map(([racingContent, greyHoundData, eventResult]) => {
            const greyhoundRacingResultPage: GreyhoundRacingResultPage = this.createGreyhoundRacingResultPage(
                racingContent,
                greyHoundData,
                eventResult,
            );
            return greyhoundRacingResultPage;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(
        private eventResultService: EventResultService,
        private racingContentGreyhoundService: RacingContentGreyhoundService,
        private greyhoundRacingContentService: GreyhoundRacingContentService,
        private errorService: ErrorService,
        private eachwayPositionsService: EachwayPositionsService,
    ) {}

    setEventId(eventId: QueryParamEvent) {
        this.eventResultService.setEventId(eventId);
    }

    createGreyhoundRacingResultPage(
        racingContent: RacingContentGreyhoundResult,
        greyhoundStaticContent: GreyhoundStaticContent,
        eventResult: MeetingResultMap,
    ): GreyhoundRacingResultPage {
        let greyhoundRacingResultPage = new GreyhoundRacingResultPage();
        greyhoundRacingResultPage.greyhoundStaticContent = greyhoundStaticContent;
        eventResult?.types?.forEach((meetingResultContent: MeetingResultContent) => {
            meetingResultContent.resultingContent.resultMarket.listOfSelections = SportBookSelectionHelper.prepareSelections(
                meetingResultContent?.resultingContent?.resultMarket?.listOfSelections,
            );
            greyhoundRacingResultPage.eventName = meetingResultContent.resultingContent?.eventName;
            greyhoundRacingResultPage.eventDateTime = meetingResultContent.resultingContent?.eventDateTime;
            greyhoundRacingResultPage.isVirtualEvent = this.isVirtualRaceFlag;

            greyhoundRacingResultPage.runnerCount = meetingResultContent.resultingContent?.runnerCount?.toString();
            greyhoundRacingResultPage.forecast = StringHelper.checkToteResults(meetingResultContent.resultingContent?.resultMarket?.foreCast);
            greyhoundRacingResultPage.tricast = StringHelper.checkToteResults(meetingResultContent.resultingContent?.resultMarket?.triCast);
            greyhoundRacingResultPage.eachWay = this.eachwayPositionsService.prepareEachWay(
                meetingResultContent.resultingContent?.resultMarket?.eachWays,
                greyhoundStaticContent?.contentParameters?.WinOnly ?? '',
                greyhoundStaticContent?.contentParameters?.Odds ?? '',
            );
            greyhoundRacingResultPage.raceOff = StringHelper.getRaceOffTimeAtResult(meetingResultContent.resultingContent?.raceOffTime);
            greyhoundRacingResultPage = this.setRunnersAndNonRunners(
                meetingResultContent.resultingContent?.resultMarket?.listOfSelections,
                greyhoundRacingResultPage,
            );
            greyhoundRacingResultPage.runners = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
                RunnerType.Dog,
                meetingResultContent?.resultingContent?.resultMarket?.eachWays,
                greyhoundRacingResultPage.runners,
                meetingResultContent?.resultingContent?.resultMarket?.sortedTricast,
            );
            greyhoundRacingResultPage.isUKEvent = this.isUkEvent;
        });
        this.setPageStaticContent(racingContent, greyhoundStaticContent, greyhoundRacingResultPage);
        return greyhoundRacingResultPage;
    }

    private setRunnersAndNonRunners(
        selections: Array<ResultSelection>,
        greyhoundRacingResultPage: GreyhoundRacingResultPage,
    ): GreyhoundRacingResultPage {
        const vacantRunners: string[] = [];
        selections.forEach((selection) => {
            const greyhoundDetails: GreyhoundResultEntry = new GreyhoundResultEntry();
            greyhoundDetails.position = selection?.position;
            greyhoundDetails.runnerNumber = selection.runnerNumber?.toString();
            greyhoundDetails.greyhoundName = selection.selectionName?.replaceAll('|', '')?.toLocaleUpperCase();
            greyhoundDetails.price = selection?.startingPriceFraction;
            greyhoundDetails.jointFavourite = selection.favourite;
            greyhoundDetails.isJointFavourite = StringHelper.checkFavouriteTag(selection?.favourite);
            greyhoundDetails.isDeadHeat = !!selection.isDeadHeat;

            if (greyhoundDetails.greyhoundName?.includes('N/R')) {
                vacantRunners.push(selection?.runnerNumber?.toString());
            }

            if (greyhoundDetails.greyhoundName?.includes(RunnerReserve.Reserve)) {
                greyhoundDetails.isReserved = true;
                greyhoundDetails.greyhoundName = StringHelper.checkReserveRunner(greyhoundDetails.greyhoundName);
            }
            greyhoundDetails.greyhoundName = StringHelper.selectionNameLengthAndTrimEnd(greyhoundDetails.greyhoundName, SelectionNameLength.Sixteen);

            if (!greyhoundDetails.greyhoundName?.includes('N/R') && !!greyhoundDetails?.position) {
                greyhoundRacingResultPage.runners?.push(greyhoundDetails);
            }
        });
        greyhoundRacingResultPage.vacantRunners = vacantRunners?.sort()?.toString().replaceAll(',', ', ');
        greyhoundRacingResultPage?.runners?.sort(
            (a: GreyhoundResultEntry, b: GreyhoundResultEntry) =>
                Number(a.position) - Number(b.position) || Number(a.runnerNumber) - Number(b.runnerNumber),
        );
        return greyhoundRacingResultPage;
    }

    private setPageStaticContent(
        racingContent: RacingContentGreyhoundResult,
        staticContent: GreyhoundStaticContent,
        greyhoundRacingResultPage: GreyhoundRacingResultPage,
    ) {
        greyhoundRacingResultPage.title = this.isVirtualRaceFlag
            ? (staticContent?.contentParameters?.VirtualRacing ?? '')
            : (staticContent?.contentParameters?.Title ?? '');
        greyhoundRacingResultPage.forecastTitle = staticContent?.contentParameters?.Forecast ?? '';
        greyhoundRacingResultPage.tricastTitle = staticContent?.contentParameters?.Tricast ?? '';

        greyhoundRacingResultPage.runners.forEach((greyhound) => {
            greyhound.trapImage = this.setGreyhoundTrapImages(greyhound.runnerNumber, staticContent);
            greyhound.deadHeat = staticContent?.contentParameters?.DeadHeat ?? '';
        });
        greyhoundRacingResultPage.raceNumber = racingContent.raceNo
            ? (staticContent?.contentParameters?.Race ?? '') + ' ' + racingContent?.raceNo
            : '';
        greyhoundRacingResultPage.distance = racingContent?.distance;
        greyhoundRacingResultPage.grade = racingContent?.grade ? (staticContent?.contentParameters?.Grade ?? '') + ' ' + racingContent?.grade : '';
        greyhoundRacingResultPage.vacantRunners = greyhoundRacingResultPage?.vacantRunners?.length
            ? (staticContent?.contentParameters?.Vacant ?? '') + ': ' + greyhoundRacingResultPage.vacantRunners
            : '';
    }

    private setGreyhoundTrapImages(runnerNo: string, staticContent: GreyhoundStaticContent): string {
        if (staticContent?.greyHoundImages?.runnerImages?.length >= parseInt(runnerNo) && parseInt(runnerNo) !== 0) {
            return staticContent?.greyHoundImages?.runnerImages[parseInt(runnerNo) - 1]?.src;
        }
        return '';
    }
}
