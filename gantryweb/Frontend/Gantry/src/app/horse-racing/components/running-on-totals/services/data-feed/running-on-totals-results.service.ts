import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, map, scan, shareReplay } from 'rxjs';
import { EventSourceDataFeedService } from 'src/app/common/services/event-source-data-feed.service';
import { RunningResultContent, RunningTempResult } from '../../models/running-on-totals.model';

@Injectable({
  providedIn: 'root'
})
export class RunningOnTotalsResultsService {

  private urlSubject = new BehaviorSubject<any[]>([]);
  constructor(
      private eventSourceDataFeedService: EventSourceDataFeedService
  ) { }

  data$ = this.urlSubject.pipe(
    concatMap(url => {
        return this.eventSourceDataFeedService.getServerSentEvent(url[0], true, url[1], url[2])
            .pipe(dataString => {
                return dataString.pipe(
                    map(dataString => {
                        let parsedData = JSON.parse(dataString);
                        let tempResult = new RunningTempResult();

                        if (parsedData.runningOnTotals) {
                            let runningOnTotals: RunningResultContent = Object.assign(new RunningResultContent, parsedData);
                            tempResult.newItem = runningOnTotals;
                        }
                        return tempResult;
                    }
                    ))
            }, scan((tempResultSum: RunningTempResult, newTempResult: RunningTempResult) => {
                if (newTempResult.newItem instanceof RunningResultContent) {
                    this.UpdateRunningOnTotalsIfExists(tempResultSum,newTempResult);
                }
                return tempResultSum;
            }, new RunningTempResult()),
                map((meetingResult: RunningTempResult) => meetingResult.result),
                shareReplay()
            );
    })
);

  setUrl(url: string, snapShotDataTimeOut?: number, checkForSnapShot?: boolean) {
      this.urlSubject.next([url, snapShotDataTimeOut, true]);
  }

  UpdateRunningOnTotalsIfExists(tempResultSum: RunningTempResult, newTempResult: RunningTempResult) {
    let newMeetingResult = newTempResult?.newItem;
    let existingMeetingResult = tempResultSum?.result?.types?.get(newMeetingResult?.runningOnTotals?.rpCourseId) || tempResultSum?.result?.types?.get(newMeetingResult?.runningOnTotals?.rpTrackId);
    if (!!existingMeetingResult) {
        newMeetingResult.runningOnTotals = { ...existingMeetingResult?.runningOnTotals, ...newMeetingResult?.runningOnTotals };
        tempResultSum?.result?.types?.set(newMeetingResult?.runningOnTotals?.rpCourseId, newMeetingResult);
    } else {
        tempResultSum?.result?.types?.set(newMeetingResult?.runningOnTotals?.rpCourseId, newMeetingResult);
    }
}
}
