import { Injectable } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { FillerPageMessage } from 'src/app/common/components/filler-page/models/filler-page-messages.model';
import { FillerPageService } from 'src/app/common/components/filler-page/services/filler-page.service';
import { RunnerDetailsRacingEvent } from 'src/app/common/helpers/runner-details-racing-event.helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { MeetingResultContent, MeetingResultMap, ResultingContent, ResultSelection } from 'src/app/common/models/data-feed/meeting-results.model';
import { QueryParamEvent } from 'src/app/common/models/query-param.model';
import { MeetingResultsService } from 'src/app/common/services/data-feed/meeting-result-service/meeting-results.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { GreyhoundMeetingResults, GreyhoundMeetingResultsTemplate, GreyhoundMeetingRunnerDetails } from 'src/app/greyhound-racing/models/greyhound-racing-meeting-results.model';
import { GreyhoundStaticContent } from 'src/app/greyhound-racing/models/greyhound-racing-template.model';
import { Positions, TypeFlagCode } from 'src/app/greyhound-racing/models/greyhound-racing.enum';
import { GreyhoundRacingContentService } from '../../greyhound-racing-template/services/greyhound-racing-content.service';

@Injectable({
    providedIn: 'root'
})
export class GreyhoundMeetingResultsService {
    fillerPageMessage$ = this.fillerPageService.fillerPageMessage$;
    errorMessage$ = this.errorService.errorMessage$;
    private countryFlags: string = "";

    meetingResult$ = this.meetingResultsService.data$
        .pipe(
            map((meetingResultMap: MeetingResultMap) => {
                return this.prepareResult(meetingResultMap);
            }),
            tap((greyhoundMeetingResultsTemplate: GreyhoundMeetingResultsTemplate) => {
                this.errorService.isStaleDataAvailable = true;
                this.errorService.unSetError();
            }),
            catchError(err => {
                this.errorService.logError(err);
                return EMPTY;
            })
        );

    greyHoundData$ = this.greyhoundRacingContentService.data$
        .pipe(
            tap((greyHoundData: GreyhoundStaticContent) => { }),
            catchError(err => {
                return EMPTY;
            })
        );

    data$ = combineLatest([
        this.meetingResult$,
        this.greyHoundData$
    ]).pipe(
        map(([meetingResult, greyHoundData]) => {
            return this.setPageContent(meetingResult, greyHoundData);
        }),
        tap((greyhoundMeetingResultsTemplate: GreyhoundMeetingResultsTemplate) => { }),
        catchError(err => {
            return EMPTY;
        })
    );

    constructor(
        private meetingResultsService: MeetingResultsService,
        private greyhoundRacingContentService: GreyhoundRacingContentService,
        private errorService: ErrorService,
        private fillerPageService: FillerPageService
    ) {
        this.greyhoundRacingContentService.setImageType(false);
    }

    setTypeId(typeId: string) {
        this.meetingResultsService.setTypeId(new QueryParamEvent(typeId));
    }

    prepareResult(meetingResultMap: MeetingResultMap): GreyhoundMeetingResultsTemplate {
        let resultingContentList: Array<MeetingResultContent> = new Array<MeetingResultContent>();
        meetingResultMap?.types?.forEach((value: MeetingResultContent) => {
            resultingContentList.push(value);
        });

        resultingContentList?.sort(function (a, b) {
            if (a.resultingContent?.eventDateTime > b.resultingContent?.eventDateTime) return 1;
            if (a.resultingContent?.eventDateTime < b.resultingContent?.eventDateTime) return -1;
            return 0;
        });
        return this.setGreyhoundMeetingResultsTemplate(resultingContentList);
    }

    private setGreyhoundMeetingResultsTemplate(resultingContentList: Array<MeetingResultContent>): GreyhoundMeetingResultsTemplate {
        let greyhoundMeetingResultsTemplate: GreyhoundMeetingResultsTemplate = new GreyhoundMeetingResultsTemplate();
        greyhoundMeetingResultsTemplate.eventName = resultingContentList[0]?.resultingContent?.eventName;
        resultingContentList.forEach((meetingResultContent: MeetingResultContent) => {
            let greyhoundMeetingResults: GreyhoundMeetingResults = new GreyhoundMeetingResults();

            this.setIsVirtualRace(greyhoundMeetingResultsTemplate, meetingResultContent?.resultingContent);
            if (!this.countryFlags) {
                this.countryFlags = this.getFlag(meetingResultContent?.resultingContent?.typeFlagCode);
                if (this.countryFlags) {
                    this.greyhoundRacingContentService.setCountry(this.countryFlags);
                }
            }
            greyhoundMeetingResultsTemplate.isUKIrishCountry = this.countryFlags?.toUpperCase() == TypeFlagCode.Uk ? true : this.countryFlags?.toUpperCase() == TypeFlagCode.Irish ? true : false;
            greyhoundMeetingResults.eventDateTime = meetingResultContent.resultingContent?.eventDateTime;
            greyhoundMeetingResults.eventId = meetingResultContent.resultingContent?.eventId;
            greyhoundMeetingResults.foreCast = StringHelper.checkToteResults(meetingResultContent?.resultingContent?.resultMarket?.foreCast);
            greyhoundMeetingResults.triCast = StringHelper.checkToteResults(meetingResultContent?.resultingContent?.resultMarket?.triCast);
            greyhoundMeetingResults.eachWayTerms = meetingResultContent?.resultingContent?.resultMarket?.eachWays;
            greyhoundMeetingResults = this.setRunnerPositions(meetingResultContent.resultingContent?.resultMarket?.listOfSelections, greyhoundMeetingResults);
            greyhoundMeetingResults.runnerList = RunnerDetailsRacingEvent.setRunnerDetails("DOG", meetingResultContent?.resultingContent?.runnerCount, greyhoundMeetingResults?.eachWayTerms, greyhoundMeetingResults.foreCast, greyhoundMeetingResults.triCast, greyhoundMeetingResults?.runnerList);

            if (greyhoundMeetingResults?.runnerList?.length > 0) {
                greyhoundMeetingResultsTemplate.isMarketSettled = true;
                greyhoundMeetingResultsTemplate.greyhoundMeetingResultsTable.push(greyhoundMeetingResults);
                let findDeadHeat = greyhoundMeetingResults?.runnerList?.filter(runner => runner.isDeadHeat == true && (runner.position == Positions.One || runner.position == Positions.Two || runner.position == Positions.Three))?.length;
                if (findDeadHeat > 1) {  //Find deadheat runners
                    this.prepareDeadHeatRunners(greyhoundMeetingResultsTemplate.greyhoundMeetingResultsTable, greyhoundMeetingResults, greyhoundMeetingResultsTemplate.isUKIrishCountry);
                }
            }
        });
        !!greyhoundMeetingResultsTemplate.isMarketSettled ? this.fillerPageService.unSetFillerPage() : this.fillerPageService.setFillerPage(FillerPageMessage.ResultsToFollow);
        return greyhoundMeetingResultsTemplate;
    }

    private prepareDeadHeatRunners(greyhoundMeetingResultsTable: GreyhoundMeetingResults[], greyhoundMeetingResults: GreyhoundMeetingResults, isUKIrishCountry: boolean) {

        let greyhoundDeadHeatResults: GreyhoundMeetingResults = new GreyhoundMeetingResults();
        greyhoundDeadHeatResults.eventId = greyhoundMeetingResults.eventId;
        greyhoundDeadHeatResults.isDeadHeat = true;
        // set forcast and tricast values
        this.setForcastAndTricast(greyhoundMeetingResults, greyhoundDeadHeatResults);
        // set deadheat runners
        this.setDeadHeatRunner(greyhoundMeetingResults.runnerList, greyhoundDeadHeatResults);
        greyhoundDeadHeatResults?.runnerList?.forEach((item, index) => {
            if (!!item.isDeadHeat) {
                // swapping the runner numbers if the deadheat is found at 2nd position
                greyhoundDeadHeatResults.runnerList[index] = greyhoundDeadHeatResults?.runnerList?.splice(1, 1, greyhoundDeadHeatResults?.runnerList[index])[0];
                if (item?.position != Positions.One) {
                    greyhoundDeadHeatResults.runnerList[index].price = '';
                    greyhoundDeadHeatResults.runnerList[index].favourite = '';
                    if (!isUKIrishCountry) {
                        item.price = '';
                        item.favourite = '';
                    }
                }

                // set the highest runner number if the deadheat is found at 3rd position
                if (!!item?.isDeadHeat && item?.position === Positions.Three && item?.eventId == greyhoundMeetingResults?.eventId) {
                    item.runnerNumber = '';
                    item.price = '';
                    item.favourite = '';
                    greyhoundDeadHeatResults.foreCast = '';
                    let listRunners = greyhoundDeadHeatResults?.runnerList?.filter(x => x.isDeadHeat == true);
                    let highestRunnerNumber = listRunners?.sort((a, b) => Number(a.runnerNumber) - Number(b.runnerNumber))[0];
                    greyhoundDeadHeatResults.runnerList[index] = greyhoundDeadHeatResults?.runnerList?.splice(greyhoundDeadHeatResults?.runnerList?.length - 1, 1, highestRunnerNumber)[0];
                }
            }
        });

        greyhoundMeetingResultsTable.push(greyhoundDeadHeatResults)
    }

    private setForcastAndTricast(greyhoundMeetingResults: GreyhoundMeetingResults, greyhoundDeadHeatResults: GreyhoundMeetingResults) {
        let foreCast = greyhoundMeetingResults?.foreCast?.trim()?.split("/");
        if (!!foreCast) {
            greyhoundDeadHeatResults.foreCast = foreCast?.length >= 1 ? foreCast[1]?.trim() : '';
            greyhoundMeetingResults.foreCast = foreCast[0]?.trim();
        }
        let triCast = greyhoundMeetingResults?.triCast?.trim()?.split("/");
        if (!!triCast) {
            greyhoundDeadHeatResults.triCast = triCast?.length >= 1 ? triCast[1]?.trim() : '';
            greyhoundMeetingResults.triCast = triCast[0]?.trim();
        }
    }

    private setDeadHeatRunner(listOfSelections: Array<GreyhoundMeetingRunnerDetails>, greyhoundMeetingResults: GreyhoundMeetingResults) {
        listOfSelections.forEach((runner: GreyhoundMeetingRunnerDetails) => {
            let runnerDetails: GreyhoundMeetingRunnerDetails = new GreyhoundMeetingRunnerDetails();
            runnerDetails.eventId = greyhoundMeetingResults.eventId;
            runnerDetails.position = runner.position;
            runnerDetails.isDeadHeat = !!runner?.isDeadHeat;
            runnerDetails.runnerNumber = !!runner.isDeadHeat ? runner?.runnerNumber?.toString() : '';
            runnerDetails.favourite = !!runner.isDeadHeat ? runner.favourite : '';
            runnerDetails.price = !!runner.isDeadHeat ? runner.price : '';
            greyhoundMeetingResults?.runnerList?.push(runnerDetails);
        });
    }

    private setRunnerPositions(listOfSelections: Array<ResultSelection>, greyhoundMeetingResults: GreyhoundMeetingResults): GreyhoundMeetingResults {
        listOfSelections.forEach((runner: ResultSelection) => {
            let runnerDetails: GreyhoundMeetingRunnerDetails = new GreyhoundMeetingRunnerDetails();
            runnerDetails.eventId = greyhoundMeetingResults.eventId;
            runnerDetails.position = runner.position;
            runnerDetails.runnerNumber = runner?.runnerNumber?.toString();
            runnerDetails.favourite = runner.favourite;
            runnerDetails.price = runner?.startingPriceFraction?.endsWith('/1') ? runner?.startingPriceFraction?.substring(0, runner?.startingPriceFraction?.indexOf('/')) : runner?.startingPriceFraction;
            greyhoundMeetingResults?.runnerList?.push(runnerDetails);
        });
        greyhoundMeetingResults?.runnerList?.sort((a, b) => {
            return Number(a.position) - Number(b.position);
        });

        return greyhoundMeetingResults;
    }

    private setPageContent(meetingResult: GreyhoundMeetingResultsTemplate, racingContent: GreyhoundStaticContent): GreyhoundMeetingResultsTemplate {
        meetingResult = this.setPageTitle(meetingResult, racingContent);
        meetingResult = this.setTrapImagesForPositions(meetingResult, racingContent);
        meetingResult.greyhoundStaticContent = racingContent;
        return meetingResult;
    }

    private setPageTitle(meetingResult: GreyhoundMeetingResultsTemplate, racingContent: GreyhoundStaticContent): GreyhoundMeetingResultsTemplate {
        meetingResult.title = meetingResult?.isVirtualRace ?
            racingContent?.contentParameters?.VirtualRacing :
            racingContent?.contentParameters?.Title;

        return meetingResult;
    }

    private setTrapImagesForPositions(meetingResult: GreyhoundMeetingResultsTemplate, racingContent: GreyhoundStaticContent): GreyhoundMeetingResultsTemplate {
        meetingResult?.greyhoundMeetingResultsTable.forEach((row: GreyhoundMeetingResults) => {
            row?.runnerList?.forEach((runner: GreyhoundMeetingRunnerDetails) => {
                if (!!runner.position) { runner.imgSrc = racingContent?.greyHoundImages?.runnerImages[Number(runner.runnerNumber) - 1]?.src; }
            })
        });
        return meetingResult;
    }

    private getFlag(typeFlagCode: string): string {
        if (typeFlagCode?.includes(TypeFlagCode.Aus)) {
            return TypeFlagCode.Aus;
        }
        else if (typeFlagCode?.includes(TypeFlagCode.Usa)) {
            return TypeFlagCode.Usa;
        }
        else
            return TypeFlagCode.Uk;
    }

    public setIsVirtualRace(meetingResult: GreyhoundMeetingResultsTemplate, resultingContent: ResultingContent) {
      let typesCodes = resultingContent?.typeFlagCode?.split(",");
      meetingResult.isVirtualRace = typesCodes?.indexOf('VR') > -1
    }
}
