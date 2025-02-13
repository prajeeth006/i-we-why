import { Injectable } from '@angular/core';
import { catchError, combineLatest, EMPTY, map } from 'rxjs';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import {
  ManualHorseRacingResultDetails, ManualHorseRacingResults,
  ManualHorseRunners, RacingContentData
} from 'src/app/horse-racing/models/horse-racing-manual-template.model';
import { Totes } from 'src/app/horse-racing/models/horse-racing-meeting-results.model';
import { ManualHorseRacingTemplateService } from '../../services/manual-horse-racing-template.service';
import { HorseRacing } from 'src/app/horse-racing/models/hose-racing-common.enum';

@Injectable({
  providedIn: 'root'
})
export class ManualHorseRacingResultService {

  data$ = combineLatest([
    this.manualHorseRacingTemplateService.horseRacingContent$,
    this.manualHorseRacingTemplateService.racingContent$,
    this.manualHorseRacingTemplateService.manualHorseRacingImage$
  ])
    .pipe(
      map(([horseRacingContent, racingContent, manualHorseRacingImageContent]) => {

        let manualHorseRacingResults = new ManualHorseRacingResults();

        manualHorseRacingResults.horseRacingContent = horseRacingContent;

        if (!!racingContent?.meetingName) {
          manualHorseRacingResults.eventName = racingContent?.meetingName;
        }
        if (!!racingContent?.timehrs && racingContent?.timemins) {
          let eventTime = racingContent?.timehrs + ":" + racingContent?.timemins;
          manualHorseRacingResults.time = eventTime;
        }

        manualHorseRacingResults.racingContent = new RacingContentData();
        manualHorseRacingResults.racingContent.raceNo = parseInt(racingContent?.race);
        manualHorseRacingResults.racingContent.distance = racingContent?.distance;
        manualHorseRacingResults.racingContent.going = racingContent?.going;

        let manualHorseRacingImage = manualHorseRacingImageContent?.brandImage?.src;
        this.setHorseRacingResultDetails(manualHorseRacingResults, racingContent?.Runners, manualHorseRacingImage);

        manualHorseRacingResults.runnerCount = racingContent?.run;
        manualHorseRacingResults.foreCast = StringHelper.checkToteResults(racingContent?.forecast);
        manualHorseRacingResults.triCast = StringHelper.checkToteResults(racingContent?.tricast);
        manualHorseRacingResults.win = StringHelper.checkToteResults(racingContent?.win);
        manualHorseRacingResults.place = racingContent?.place;

        manualHorseRacingResults.totes = new Totes();
        manualHorseRacingResults.totes.exacta = racingContent?.exacta;
        manualHorseRacingResults.totes.trifecta = racingContent?.trifecta;

        manualHorseRacingResults.eachWayResult = this.manualHorseRacingTemplateService.setEachWay(racingContent?.eachway);
        // limit rows based on activerows
        manualHorseRacingResults.runners = manualHorseRacingResults.runners.splice(0, racingContent?.activerows);
        manualHorseRacingResults.nonRunners = this.prepareNonRunners(racingContent?.Runners);
        return manualHorseRacingResults;
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  constructor(
    private manualHorseRacingTemplateService: ManualHorseRacingTemplateService
  ) { }

  public getFavouriteFlag(favouriteRunnersCount: number) {
    if (favouriteRunnersCount === 1) {
      return 'F';
    } else if (favouriteRunnersCount === 2) {
      return 'JF';
    } else {
      return 'CF' + favouriteRunnersCount;
    }
  }

  public setHorseRacingResultDetails(
    horseRacingResultPage: ManualHorseRacingResults,
    runnerResults: ManualHorseRunners[],
    manualHorseRacingImage: string
  ) {
    let favouriteRunners = runnerResults.filter(runner => runner.isFavourite);
    let favouriteFlag = this.getFavouriteFlag(favouriteRunners.length);

    for (const result of runnerResults) {
      let horseDetails = new ManualHorseRacingResultDetails();

      horseDetails.position = result?.finished;
      horseDetails.jockeySilkImage = manualHorseRacingImage;
      horseDetails.horseRunnerNumber = result?.horseNumber;
      horseDetails.horseName = result?.horseName;
      if (result.horseName?.toLowerCase().includes(HorseRacing.Reserve.toLowerCase())) {
        horseDetails.isReserved = true;
        horseDetails.horseName = StringHelper.checkReserveRunner(horseDetails?.horseName);
      }
      horseDetails.horseName = StringHelper.checkSelectionNameLengthAndTrimEnd(horseDetails?.horseName, SelectionNameLength.Eighteen);

      horseDetails.price = result?.result_odds_sp;
      horseDetails.fractionPrice = result?.result_odds_sp;

      horseDetails.isFavourite = result?.isFavourite;
      if (result?.isFavourite) {
        horseDetails.favourite = favouriteFlag;
      }

      horseDetails.nonRunner = result.isNonRunner;
      horseDetails.isStartPrice = result.isStartPrice;
      horseRacingResultPage.runners.push(horseDetails);
    }

    horseRacingResultPage.runners = horseRacingResultPage.runners.filter(_runner => !_runner.nonRunner)

    horseRacingResultPage.runners?.sort((a, b) => Number(a.position) - Number(b.position) || Number(a.horseRunnerNumber) - Number(b.horseRunnerNumber));

  }

  public prepareNonRunners(
    runnerResults: ManualHorseRunners[]):string {
    var nonRunners = runnerResults.filter(nr=>nr.isNonRunner).map(p=>p.horseNumber).join(',');
    if (nonRunners.length > 0) {
      return nonRunners;
    }
    return "";
  }
}
