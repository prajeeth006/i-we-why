import { TestBed } from '@angular/core/testing';
import { RunningOnTotalsResultsService } from './running-on-totals-results.service';
import { MockContext } from 'moxxi';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RunningOnTotals, RunningOnTotalsContent, RunningResultContent, RunningTempResult } from '../../models/running-on-totals.model';

describe('RunningOnTotalsResultsService', () => {
  let service: RunningOnTotalsResultsService;
  let runningOnTotalsResults: RunningOnTotalsContent = {
    typeDetails: [
        {
            rpCourseName: "SEDGEFIELD",
            racesFinished: 7,
            rpCourseId: "5720220306",
            distanceToWinner: 31.5,
            openBetTypeIds: ["2208"],
            date: "123456",
            eventIds: new Map<string, Array<number>>(),
            isResulted: false,
            rpTrackId: "000",
            rpTrackName: "abc",
            selectionName: "SelectionName"
        },
        {
          rpCourseName: "SEDGEFIELD",
          racesFinished: 7,
          rpCourseId: "5720220306",
          distanceToWinner: 32.5,
          openBetTypeIds: ["2208"],
          date: "123456",
          eventIds: new Map<string, Array<number>>(),
          isResulted: false,
          rpTrackId: "000",
          rpTrackName: "abc",
          selectionName: "SelectionName"
      },
        {
            rpCourseName: "TAUNTON",
            racesFinished: 7,
            rpCourseId: "7320220303",
            distanceToWinner: 34.85,
            openBetTypeIds: ["1976"],
            date: "123456",
            eventIds: new Map<string, Array<number>>(),
            isResulted: false,
            rpTrackId: "000",
            rpTrackName: "abc",
            selectionName: "SelectionName"
        }
    ],
    horseRacingContent: null ,
    distanceAfterRace: "DistanceAfterRace",
    pageNumber: 0,
    totalPages: 0,
    paginationText: "",
    startIndex: 0,
    endIndex: 0,
    currentPageNumber: 0,
    pageSize: 0
}
let runningResultContent = new RunningResultContent();
runningResultContent.runningOnTotals = runningOnTotalsResults.typeDetails[0];
let tempResult : RunningTempResult= new RunningTempResult();
let newTempResult : RunningTempResult= new RunningTempResult();
tempResult.result.types.set("5720220306",runningResultContent);
runningResultContent.runningOnTotals = runningOnTotalsResults.typeDetails[1];
tempResult.result.types.set("5720220306",runningResultContent);
newTempResult.newItem = new RunningResultContent();
let newRunningOnTotals = new RunningOnTotals();
newRunningOnTotals.rpCourseId ="5720220306";
newRunningOnTotals.distanceToWinner=67.5;
newTempResult.newItem.runningOnTotals = newRunningOnTotals;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(RunningOnTotalsResultsService);
  });

  it('should be created RunningOnResultsService', () => {
    expect(service).toBeTruthy();
  });

   it('rpCourseId should not be null', () => {
    let market = runningOnTotalsResults.typeDetails[0];
    expect(market.rpCourseId).toBe("5720220306");
  });
  it('distanceToWinner should be latest ', () => {
    service.UpdateRunningOnTotalsIfExists(tempResult,newTempResult);
    expect(tempResult.result.types.get("5720220306")?.runningOnTotals.distanceToWinner).toBe(67.5);
  });

});

