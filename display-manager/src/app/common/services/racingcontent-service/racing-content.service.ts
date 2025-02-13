import { Injectable } from '@angular/core';
import { QueryParamEvent } from '../../models/query-param.model';
import { EventSourceDataFeedService } from '../eventfeed-service/event-source-data-feed.service';
import { concatMap, map } from 'rxjs/operators';
import { RacingContentTempResult } from '../../models/racing-content-models';
import { Observable, concat } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RacingContentService {
  getEventDataFromRacingContent(event: QueryParamEvent, racingContentAPI: string, snapShotTimeout: number) {
    var allUrls: string[] = [];
    let tempResult = new RacingContentTempResult();
    let url = racingContentAPI?.replace("{event}", !!event.key ? event.key : "");
    allUrls.push(url);

    return concat(allUrls.map(url => this.eventSourceDataFeedService.getServerSentEvent(url, snapShotTimeout, true)))
      .pipe(
        concatMap((dataString: Observable<any>) => {
          return dataString.pipe(
            map((dataString: string) => {
              let parsedData = JSON.parse(dataString);
              if (parsedData.racingContent) {
                tempResult.result = parsedData.racingContent;
              }
              tempResult.isFinished = parsedData?.isFinished;
              return tempResult;
            }))
        }),
      );
  }

  constructor(private eventSourceDataFeedService: EventSourceDataFeedService) { }
}
