
import { Injectable } from '@angular/core';
import { MessageEnvelope, SubscriptionRequest } from '@cds/push';
import { Fixtures } from 'src/app/common/cds-client/models/fixture.model';
import { FootBallContentParams, HomeDrawAway, HomeDrawAwayResult } from '../models/home-draw-away-content.model';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay } from 'rxjs';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { ErrorService } from "src/app/common/services/error.service";
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { EventDatetimePipe } from 'src/app/common/pipes/event-datetime.pipe';
import { CdsPushConstants } from 'src/app/common/cds-client/models/cds-push-updates.constant';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';


@Injectable({
  providedIn: 'root'
})
export class HomeDrawAwayService {
  errorMessage$ = this.errorService.errorMessage$;
  homeDrawAwayResult: HomeDrawAwayResult = new HomeDrawAwayResult();
  fixtureData$: Observable<Fixtures>;
  nflContentFromSitecore$: Observable<FootBallContentParams>;
  homeDrawAwayResult$: Observable<HomeDrawAwayResult>;
  fixtureData: Fixtures;
  Suspended = 'SUSPENDED';
  drawNameValue: string = 'X'

  constructor(private eventDatetimePipe: EventDatetimePipe, private cdsPushService: CdsClientService, private errorService: ErrorService, private sportContentService: SportContentService) { }

  public getFixtureViewData(fixtureId: any, marketId: any, gameIds: any) {
    return this.cdsPushService.getFixtures(fixtureId.join(','), marketId.join(','), gameIds);
  }

  public GetHomeDrawAwayContent(fixtureId: any, marketId: any, gameIds: any) {
    this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, gameIds);
    this.nflContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.footballMultiMarketCDS);
    this.homeDrawAwayResult$ = combineLatest([this.fixtureData$, this.nflContentFromSitecore$]).
      pipe(
        map(([fixtureData, contentFromSitecore]) => {
          if (!!fixtureData && fixtureData?.fixtures?.length > 0) {
            this.fixtureData = fixtureData;
            this.homeDrawAwayResult.content = contentFromSitecore;
            this.homeDrawAwayResult = this.getHomeDrawAwayContent(fixtureData);
          }
          else {
            throw 'Could not find HomeDrawAway CDS Content for Url - ' + this.cdsPushService?.fixtureViewUrl;
          }
          return this.homeDrawAwayResult;
        }),
        catchError(err => {
          this.errorService.logError(err);
          return EMPTY;
        })
      ), shareReplay()
  }

  public getSubscritionRequest(fixture: Fixtures): SubscriptionRequest {
    var request: SubscriptionRequest = { topics: [] }
    var topicsArray: Array<string> = []
    fixture?.fixtures?.forEach(x => {
      x.games.forEach((y: { id: number; }) => {
        (x.source === 'V1') ? topicsArray.push(x.context + '|gam-' + y.id) :
          topicsArray.push(x.context + '|fxm-' + y.id)
      })
    })
    request = { topics: topicsArray } as SubscriptionRequest
    return request;
  }
  public GetUpdatedHomeDrawAwayContent(messageEnvelope: MessageEnvelope): HomeDrawAwayResult {
    var marketIndex = 0;
    var fixtureIndex = 0;
    if (!!messageEnvelope.messageType) {
      if (messageEnvelope.messageType == CdsPushConstants.optionMarketUpdate) {
        if (!!messageEnvelope?.payload?.optionMarket?.id) {
          fixtureIndex = this.fixtureData?.fixtures?.findIndex(x => x.id == messageEnvelope?.payload?.fixtureId);
          if (fixtureIndex != -1) {
            marketIndex = this.fixtureData.fixtures[fixtureIndex].optionMarkets?.findIndex(y => y.id == messageEnvelope?.payload?.optionMarket?.id);
            if (marketIndex != -1) {
              this.fixtureData.fixtures[fixtureIndex].optionMarkets[marketIndex] = messageEnvelope?.payload?.optionMarket;
            }
            else {
              this.fixtureData?.fixtures?.push(messageEnvelope?.payload?.optionMarket);
            }
          }
          else {
            this.fixtureData?.fixtures?.push(messageEnvelope?.payload?.optionMarket);
          }
        }
      }
      else if (messageEnvelope.messageType == CdsPushConstants?.fixtureUpdate) {
        fixtureIndex = this.fixtureData?.fixtures?.findIndex(x => x.id == messageEnvelope?.payload?.fixtureId);
        if (fixtureIndex != -1) {

          this.fixtureData.fixtures[fixtureIndex].startDate = messageEnvelope?.payload?.startDate;
        }
      }
      else if (messageEnvelope.messageType == CdsPushConstants.optionMarketDelete) {
        marketIndex = this.fixtureData?.fixtures?.findIndex(x => x.id == messageEnvelope?.payload?.optionMarket?.id);
        fixtureIndex = this.fixtureData?.fixtures?.findIndex(x => x.id == messageEnvelope?.payload?.fixtureId);
        if (fixtureIndex != -1 && marketIndex != -1) {
          this.fixtureData?.fixtures?.splice(fixtureIndex, 1);
        }
      }
      return this.getHomeDrawAwayContent(this.fixtureData);
    }
  }

  getPlayerNames(inputString?: string): string {
    inputString = inputString.replace(',', '.');
    inputString = StringHelper.getValueWithoutBracket(inputString);
    let formattedString = inputString.trim();

    const regex = /([+-][\d.]+)/;
    const extractedValue = inputString.match(regex);
    let result: string | null = null;

    if (extractedValue && extractedValue.length > 1) {
      result = extractedValue[1];

      let playerNameString = inputString.replace(result, '')
      if (playerNameString.trim().length > 17) {
        formattedString = playerNameString.substring(0, 18).trim() + "' " + result;
      }
    }
    return formattedString;
  }


  private getPrice(numerator: number, denominator: number): string {
    if (isNaN(numerator) && isNaN(denominator)) {
      return '';
    }
    else if (numerator == 1 && denominator == 1) {
      return 'EVS';
    }
    else if (numerator > 0 && denominator == 1) {
      return numerator.toString();
    }
    else {
      return numerator + '/' + denominator;
    }
  }

  prepareHomeDrawAwayResult(
    optionsArray: any[],
    homeDrawAwayResult: HomeDrawAwayResult,
    eventName: string,
    eventDateTime: Date
  ) {
    const selections = {
      home: { name: '', price: '' },
      draw: { name: '', price: '' },
      away: { name: '', price: '' },
    };

    for (const option of optionsArray) {
      const name = option?.name?.value?.toUpperCase();
      const price = this.getPrice(option?.price?.numerator, option?.price?.denominator);
      const isSuspended = option?.status?.toUpperCase() === this.Suspended;

      if (option.name?.value?.toUpperCase() === this.drawNameValue) {
        selections.draw.name = name;
        selections.draw.price = isSuspended ? '' : price;
      } else if (option.sourceName?.value === '1') {
        selections.home.name = name;
        selections.home.price = isSuspended ? '' : price;
      } else if (option.sourceName?.value === '2') {
        selections.away.name = name;
        selections.away.price = isSuspended ? '' : price;
      }
    }

    this.homeDrawAwayResult.homeDrawAwayEvent.push({
      eventName: eventName.toUpperCase(),
      eventTime: '',
      eventDateTime: eventDateTime,

      homeSelection: {
        selectionName: selections.home.name,
        price: selections.home.price,
      },
      drawSelection: {
        selectionName: selections.draw.name,
        price: selections.draw.price,
      },
      awaySelection: {
        selectionName: selections.away.name,
        price: selections.away.price,
      },
    });
  }

  public getHomeDrawAwayContent(fixture: Fixtures): HomeDrawAwayResult {
    if (!!fixture && fixture?.fixtures?.length > 0) {
      if (this.errorService.isStaleDataAvailable) {
        this.errorService.unSetError();
      }
      this.homeDrawAwayResult.homeDrawAwayEvent = [];
      for (let i = 0; i < fixture?.fixtures?.length; i++) {
        var optionMarkets = fixture?.fixtures[i] ? fixture?.fixtures[i]?.optionMarkets[0] : undefined;
        if (optionMarkets !== undefined) {
          this.homeDrawAwayResult.marketName = optionMarkets?.name?.value?.toUpperCase();
          this.homeDrawAwayResult.categoryName = fixture?.fixtures[i]?.sport?.name?.value.toUpperCase();
          var optionsArray = optionMarkets?.options;
          this.prepareHomeDrawAwayResult(optionsArray, this.homeDrawAwayResult, fixture?.fixtures[i]?.name?.value, new Date(fixture?.fixtures[i]?.startDate))
        }
      }
      if (this.homeDrawAwayResult?.homeDrawAwayEvent?.length > 0) {
        this.sortHomeDrawAwayEvent(this.homeDrawAwayResult.homeDrawAwayEvent);
        this.homeDrawAwayResult.eventDateTimeInputValue = this.getEventTimeDateFromPipe(
          this.homeDrawAwayResult?.homeDrawAwayEvent, this.homeDrawAwayResult?.content?.contentParameters?.EventTimeInfo, this.homeDrawAwayResult?.content);
      }
      return this.homeDrawAwayResult;
    }
    else {
      const errorMessage = 'Could not find Football Home draw away Content for Url - ' + this.cdsPushService?.fixtureViewUrl;
      this.errorService.setError(errorMessage);
    }

  }

  sortHomeDrawAwayEvent(homeDrawAwayEventData: HomeDrawAway[]) {
    homeDrawAwayEventData?.sort((b, a) => {
      const dataComparision = new Date(b.eventDateTime).getTime() - new Date(a.eventDateTime).getTime();
      if (dataComparision !== 0) {
        return dataComparision;
      } else {
        return b.homeSelection?.selectionName?.localeCompare(a.homeSelection?.selectionName);
      }
    })

  }
  getEventTimeDateFromPipe(homeDrawAway: HomeDrawAway[], eventTimeInfo: string, gantryCommonContent: FootBallContentParams): string {
    if (homeDrawAway?.length > 1) {
      if (new Date(homeDrawAway[0]?.eventDateTime).getDate() != new Date(homeDrawAway[homeDrawAway?.length - 1].eventDateTime).getDate()
        || new Date(homeDrawAway[0]?.eventDateTime).getMonth() != new Date(homeDrawAway[homeDrawAway?.length - 1].eventDateTime).getMonth()
        || new Date(homeDrawAway[0]?.eventDateTime).getFullYear() != new Date(homeDrawAway[homeDrawAway?.length - 1].eventDateTime).getFullYear()) {
        return `${this.eventDatetimePipe.transform(eventTimeInfo, homeDrawAway[0]?.eventDateTime, gantryCommonContent)} - ${this.eventDatetimePipe.transform(eventTimeInfo, homeDrawAway.slice(-1)[0]?.eventDateTime, gantryCommonContent)}`;
      }
      else {
        return `${this.eventDatetimePipe.transform(eventTimeInfo, homeDrawAway[0]?.eventDateTime, gantryCommonContent)}`;
      }
    }
    else {
      return `${this.eventDatetimePipe.transform(eventTimeInfo, homeDrawAway[0]?.eventDateTime, gantryCommonContent)}`;
    }
  }

}
