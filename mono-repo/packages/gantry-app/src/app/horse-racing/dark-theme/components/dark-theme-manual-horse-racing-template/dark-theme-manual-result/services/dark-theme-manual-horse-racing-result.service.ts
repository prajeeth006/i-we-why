import { Injectable } from '@angular/core';

import { EMPTY, catchError, combineLatest, map } from 'rxjs';

import { StringHelper } from '../../../../../../common/helpers/string.helper';
import { SelectionNameLength } from '../../../../../../common/models/general-codes-model';
import {
    ManualHorseRacingResultDetails,
    ManualHorseRacingResults,
    ManualHorseRunners,
    RacingContentData,
} from '../../../../../models/horse-racing-manual-template.model';
import { Totes } from '../../../../../models/horse-racing-meeting-results.model';
import { DarkThemeManualHorseRacingTemplateService } from '../../services/dark-theme-manual-horse-racing-template.service';

@Injectable({
    providedIn: 'root',
})
export class DarkThemeManualHorseRacingResultService {
    data$ = combineLatest([
        this.manualHorseRacingTemplateService.horseRacingContent$,
        this.manualHorseRacingTemplateService.racingContent$,
        this.manualHorseRacingTemplateService.manualHorseRacingImage$,
    ]).pipe(
        map(([horseRacingContent, racingContent, manualHorseRacingImageContent]) => {
            const manualHorseRacingResults = new ManualHorseRacingResults();

            manualHorseRacingResults.horseRacingContent = horseRacingContent;

            if (racingContent?.meetingName) {
                manualHorseRacingResults.eventName = racingContent?.meetingName;
            }

            if (!!racingContent?.timehrs && !!racingContent?.timemins) {
                manualHorseRacingResults.eventTime = StringHelper.convertTo12HrsFormat(racingContent?.timehrs, racingContent?.timemins);
            }

            manualHorseRacingResults.racingContent = new RacingContentData();
            manualHorseRacingResults.racingContent.raceNo = racingContent?.race ? parseInt(racingContent.race) : null;
            manualHorseRacingResults.racingContent.distance = racingContent?.distance;
            manualHorseRacingResults.racingContent.going = racingContent?.going;
            const manualHorseRacingImage = manualHorseRacingImageContent?.brandImage?.src;
            this.setHorseRacingResultDetails(manualHorseRacingResults, racingContent?.Runners, manualHorseRacingImage);

            manualHorseRacingResults.runnerCount = racingContent?.run;
            manualHorseRacingResults.foreCast = StringHelper.checkToteResults(racingContent.forecast);
            manualHorseRacingResults.triCast = StringHelper.checkToteResults(racingContent.tricast);
            manualHorseRacingResults.win = StringHelper.checkToteResults(racingContent.win);
            manualHorseRacingResults.place = racingContent.place;

            manualHorseRacingResults.totes = new Totes();
            manualHorseRacingResults.totes.exacta = racingContent?.exacta?.toUpperCase();
            manualHorseRacingResults.totes.trifecta = racingContent?.trifecta?.toUpperCase();

            manualHorseRacingResults.eachWayResult = this.manualHorseRacingTemplateService.setEachWay(racingContent?.eachway);
            // limit rows based on activerows
            manualHorseRacingResults.runners = manualHorseRacingResults.runners?.splice(0, racingContent?.activerows);
            manualHorseRacingResults.nonRunners = this.prepareNonRunners(racingContent?.Runners);
            return manualHorseRacingResults;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(private manualHorseRacingTemplateService: DarkThemeManualHorseRacingTemplateService) {}

    public setHorseRacingResultDetails(
        horseRacingResultPage: ManualHorseRacingResults,
        runnerResults: ManualHorseRunners[],
        manualHorseRacingImage: string,
    ) {
        const favouriteRunners = runnerResults.filter((runner) => runner?.isFavourite);
        const favouriteFlag = StringHelper.getFavouriteFlag(favouriteRunners?.length);
        for (const result of runnerResults) {
            const horseDetails = new ManualHorseRacingResultDetails();

            horseDetails.position = result?.finished;
            horseDetails.jockeySilkImage = manualHorseRacingImage;
            horseDetails.horseRunnerNumber = result?.horseNumber;
            horseDetails.horseName = result?.horseName;
            const reserve = horseRacingResultPage?.horseRacingContent?.contentParameters?.NewDesignReserve ?? '';
            if (reserve && horseDetails?.horseName?.toLowerCase().includes(reserve?.toLowerCase())) {
                horseDetails.isReserved = true;
                horseDetails.horseName = StringHelper.selectionNameLengthAndTrimEnd(
                    StringHelper.checkReserveRunner(horseDetails?.horseName),
                    SelectionNameLength?.Thirteen,
                );
            }
            horseDetails.horseName = StringHelper.selectionNameLengthAndTrimEnd(horseDetails?.horseName, SelectionNameLength?.Eighteen);

            horseDetails.price = result?.result_odds_sp;
            horseDetails.fractionPrice = result?.result_odds_sp;

            horseDetails.isFavourite = result?.isFavourite;
            if (result?.isFavourite) {
                horseDetails.favourite = favouriteFlag;
            }

            horseDetails.nonRunner = result?.isNonRunner;
            horseDetails.isStartPrice = result?.isStartPrice;
            horseRacingResultPage.runners.push(horseDetails);
        }

        horseRacingResultPage.runners = horseRacingResultPage.runners.filter((_runner) => !_runner.nonRunner);

        horseRacingResultPage.runners?.sort(
            (a, b) => Number(a?.position) - Number(b?.position) || Number(a?.horseRunnerNumber) - Number(b?.horseRunnerNumber),
        );
    }

    public prepareNonRunners(runnerResults: ManualHorseRunners[]): string {
        const nonRunners = runnerResults
            .filter((nr) => nr?.isNonRunner)
            .map((p) => p?.horseNumber)
            .join(', ');
        if (nonRunners?.length > 0) {
            return nonRunners;
        }
        return '';
    }
}
