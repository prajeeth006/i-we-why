import { Injectable } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { FillerPageService } from 'src/app/common/components/filler-page/services/filler-page.service';
import { AvrEventMap, AvrMarket, AvrMessageTypeMap, AvrRacers, AvrResult, AvrSelection, AvrSelections, AvrTags } from 'src/app/common/models/data-feed/avr.model';
import { QueryParamEvent } from 'src/app/common/models/query-param.model';
import { AvrImageService } from 'src/app/common/services/data-feed/avr-service/avr-image.service';
import { AvrDataFeedService } from 'src/app/common/services/data-feed/avr-service/avr-data-feed.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { AvrEventTypeEnum, AvrMarketEnum, AvrMessageTypeEnum, AvrTagsEnum } from '../models/avr-result-enum.model';
import { AvrTemplate, ResultDetails } from '../models/avr-template.model';
import { AvrContent } from '../models/avr-result-content.model';
import { AvrContentService } from './avr-result-content.service';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { FillerPageMessage } from 'src/app/common/components/filler-page/models/filler-page-messages.model';
import { RunnerDetailsRacingEvent } from 'src/app/common/helpers/runner-details-racing-event.helper';
import { VirtualRaceImageService } from 'src/app/common/services/virtual-race-image.service';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { RunnerType } from 'src/app/common/models/racing-tags.model';

@Injectable({
  providedIn: 'root'
})
export class AvrResultService {
  avrResultPage: AvrTemplate = new AvrTemplate();
  public isResultComplete: boolean = false;
  errorMessage$ = this.errorService.errorMessage$;
  fillerPageMessage$ = this.fillerPageService.fillerPageMessage$;

  virtualRaceImageService$ = this.virtualRaceImageService.runnerImage$.pipe(
    catchError(err => {
      this.virtualRaceImageService.logError(err);
      return EMPTY;
    })
  );

  avrBrandImage$ = this.avrImageService.brandImage$;

  avrBackgroundImage$ = this.avrImageService.backgroundImage$;

  avrService$ = this.avrService.data$.pipe(
    tap((resultMap: AvrEventMap) => {
      this.errorService.isStaleDataAvailable = true;
      this.errorService.unSetError();
    }),
    catchError(err => {
      this.errorService.logError(err);
      return EMPTY;
    })
  );

  staticContent$ = this.avrContentService.data$
    .pipe(
      tap((content: AvrContent) => { }),
      catchError(err => {
        return EMPTY;
      })
    );

  avrResult$ = combineLatest([
    this.avrService$
  ]).pipe(
    map(([resultMap]) => {
      resultMap.eventIds.forEach((data: AvrMessageTypeMap) => {
        this.avrResultPage = new AvrTemplate();
        let viewerEventCard: AvrResult = data.messageTypes?.get(AvrMessageTypeEnum.ViewerEventCard);
        if (!!viewerEventCard) {
          this.avrResultPage = this.createViewerEventCardData(this.avrResultPage, viewerEventCard);
        }
        let result: AvrResult = data.messageTypes?.get(AvrMessageTypeEnum.Result);
        if (!!result) {
          this.fillerPageService.unSetFillerPage();
          this.avrResultPage = this.createResultData(this.avrResultPage, result);
        }
        else {
          this.fillerPageService.setFillerPage(FillerPageMessage.ResultsToFollow);
        }
      });
      this.fillerPageService.unSetFillerPage();
      return this.avrResultPage;
    }),
    tap((avrResultTemplate: AvrTemplate) => { }),
    catchError(err => {
      return EMPTY;
    })
  );

  data$ = combineLatest([
    this.virtualRaceImageService$,
    this.avrBrandImage$,
    this.avrBackgroundImage$,
    this.staticContent$
  ]).pipe(
    map(([
      runnerImageContent, brandImageContent, backgroundImageContent, staticContent]) => {
      this.avrResultPage?.resultsTable.forEach(runner => {
        if (runnerImageContent?.runnerImages?.length >= Number(runner.runnerNumber)) {
          runner.imageSourceUrl = runnerImageContent?.runnerImages[Number(runner.runnerNumber) - 1]?.src;
        }
      });
      this.avrResultPage.brandImageUrl = brandImageContent?.brandImage?.src;
      this.avrResultPage.backgroundImageUrl = backgroundImageContent?.brandImage?.src;
      this.avrResultPage.staticContent = staticContent;
      this.isResultComplete = this.checkResultComplete();
      if (this.avrResultPage?.resultsTable?.length <= 0) {
        throw `Couldn't find data for resultPage runners`;
      }
      this.errorService.unSetError();
      return this.avrResultPage;
    }),
    catchError(err => {
      this.errorService.logError(err);
      return EMPTY;
    }),
    tap((avrResultTemplate: AvrTemplate) => { }),
    catchError(err => {
      return EMPTY;
    })
  );

  constructor(private avrService: AvrDataFeedService, private errorService: ErrorService, private avrContentService: AvrContentService, private fillerPageService: FillerPageService,
    private avrImageService: AvrImageService, private virtualRaceImageService: VirtualRaceImageService) { }

  setControllerId(controllerId: string) {
    this.avrService.setControllerId(new QueryParamEvent(controllerId));
  }

  setViewerEventCardTemplate(result: AvrResult) {
    this.avrImageService.setEventType(result?.avr?.eventType);
    this.avrResultPage = new AvrTemplate();
    this.avrResultPage = this.createViewerEventCardData(this.avrResultPage, result);
    this.isResultComplete = this.checkResultComplete();
  }

  setResultTemplate(result: AvrResult) {
    if (!this.avrResultPage?.eventName) {
      this.isResultComplete = false;
      return;
    }
    this.avrImageService.setEventType(result?.avr?.eventType);
    this.avrResultPage = this.createResultData(this.avrResultPage, result);
    this.isResultComplete = this.checkResultComplete();
  }

  private createViewerEventCardData(avrResultPage: AvrTemplate, result: AvrResult): AvrTemplate {
    avrResultPage.isResultedOrOff = false;
    this.avrImageService.setEventType(result?.avr?.eventType);
    avrResultPage.avrEventType = result?.avr?.eventType;
    avrResultPage.runnerCount = !!result.avr?.numOfRacers ? result.avr?.numOfRacers : "0";
    avrResultPage.numEachWay = result.avr?.numEachWay;
    avrResultPage.distance = result.avr?.distance.toUpperCase();
    avrResultPage.eventName = this.setEventName(result.avr?.eventName, result.avr?.eventDateTime);
    avrResultPage = this.setRunnerDetails(avrResultPage, result.avr?.racers);
    avrResultPage = this.setEachWayDetails(avrResultPage, result.avr?.tags);
    return avrResultPage;
  }

  private createResultData(avrResultPage: AvrTemplate, result: AvrResult): AvrTemplate {
    avrResultPage.isResultedOrOff = true;
    let runnerType = this.getRaceType(result?.avr?.eventType);
    this.avrImageService.setEventType(result?.avr?.eventType);

    avrResultPage.forecast = !!result?.avr?.markets?.market[0]?.fcDividend ? StringHelper.checkToteResults(result?.avr?.markets?.market[0]?.fcDividend?.toString()) : "";
    avrResultPage.tricast = !!result?.avr?.markets?.market[0]?.tcDividend ? StringHelper.checkToteResults(result?.avr?.markets?.market[0]?.tcDividend?.toString()) : "";
    avrResultPage = this.setRunnersByPosition(avrResultPage, result);
    avrResultPage.resultsTable = RunnerDetailsRacingEvent.setRunnerDetails(runnerType, Number(avrResultPage.runnerCount), "EACH-WAY " + avrResultPage.eachWay, "", "", avrResultPage.resultsTable);
    return avrResultPage;
  }

  private setEventName(meetingName: string, eventDateTime: string): string {
    let eventName = "";
    if (!!meetingName && meetingName.trim().length > 2) {
      meetingName = meetingName.trim().substring(0, meetingName.length - 2);
    }
    let dateTime = eventDateTime.split(' ');
    if (dateTime.length > 1) {
      let time = dateTime[1].split(':');
      if (time.length >= 2) {
        eventName = time[0] + ":" + time[1] + " " + meetingName;
      }
    }
    return eventName;
  }

  private setRunnerDetails(avrResultPage: AvrTemplate, racers: Array<AvrRacers>): AvrTemplate {
    racers.forEach((racer: AvrRacers) => {
      let result = new ResultDetails();
      result.runnerNumber = racer.num;
      result.runnerName = StringHelper.checkSelectionNameLengthAndTrimEnd(racer.name, SelectionNameLength.Eighteen);
      result.price = this.setPriceDetails(racer?.price?.trim());
      result.favourite = racer.fav;
      result.isFavourite = StringHelper?.checkFavouriteTag(result.favourite);
      avrResultPage.resultsTable?.push(result);

    });
    return avrResultPage;
  }

  setPriceDetails(price: string) {
    if (!price) {
      return ' ';
    } else if (price == "1" || price == "1/1") {
      return 'EVS';
    } else {
      return price?.endsWith('/1') ? price?.substring(0, price?.indexOf('/')) : price;
    }
  }

  private setEachWayDetails(avrResultPage: AvrTemplate, tags: Array<AvrTags>): AvrTemplate {
    let eachWayFraction: string = "";
    let eachWayTerms: string = "";
    tags.forEach((tag: AvrTags) => {
      if (tag.name.toUpperCase() == AvrTagsEnum.EachWayTerms) {
        if (Number(tag.value) > 0) {
          eachWayFraction = "1/" + tag.value;
        }
      }
      else if (tag.name.toUpperCase() == AvrTagsEnum.NumEachWay) {
        if (Number(tag.value) > 0) {
          for (let i = 1; i <= Number(tag.value); i++) {
            eachWayTerms += i + "-";
          }
          eachWayTerms = eachWayTerms.substring(0, eachWayTerms.length - 1);
        }
      }
      if (!!eachWayFraction && !!eachWayTerms) {
        avrResultPage.eachWay = eachWayFraction + " " + eachWayTerms;
        return avrResultPage;
      }
    });
    return avrResultPage;
  }

  private setRunnersByPosition(avrResultPage: AvrTemplate, result: AvrResult): AvrTemplate {
    let selectionList: AvrSelections;
    let runnerList: Array<ResultDetails> = [];
    result?.avr?.markets?.market.forEach((market: AvrMarket) => {
      if (market?.marketTypeKey?.toUpperCase() == AvrMarketEnum.Win) {
        selectionList = market.selections;
      }
    });
    selectionList?.selection?.forEach((selection: AvrSelection) => {
      let racer = avrResultPage?.resultsTable?.find(racer => racer.runnerNumber == selection.runnerNumber.toString());
      racer.position = selection?.finalPosition.toString();
      runnerList.push(racer);
    });
    if (!!runnerList) { avrResultPage.resultsTable = runnerList; }

    avrResultPage?.resultsTable.sort((a, b) => {
      return Number(a.position) - Number(b.position);
    });
    return avrResultPage;
  }

  getRaceType(eventType: string): string {
    let raceType = "";
    switch (eventType) {
      case AvrEventTypeEnum.HorseRace:
        raceType = RunnerType.Horse;
        break;
      case AvrEventTypeEnum.DogRace:
        raceType = RunnerType.Dog;
        break;
      case AvrEventTypeEnum.MotorRace:
        raceType = RunnerType.Motor;
        break;
    }
    return raceType;
  }

  private checkResultComplete(): boolean {
    if (!!this.avrResultPage?.resultsTable[0]?.position
      && !!this.avrResultPage?.eventName) {
      return true;
    }
    return false;
  }
}
