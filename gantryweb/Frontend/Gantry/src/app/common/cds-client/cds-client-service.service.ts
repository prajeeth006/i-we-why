import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { HttpParams } from '@angular/common/http';

import { mergeMap, shareReplay, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ContentDeliveryConfig } from './models/cds-client-config.model';
import { Fixtures } from './models/fixture.model';
import { FixtureView } from './models/fixture-view.model';
import { SubscriptionRequest } from '@cds/push';
import { ErrorService } from '../services/error.service';
import { Log, LogType, LoggerService } from '../services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class CdsClientService {

  constructor(private httpService: HttpService, private errorService: ErrorService, private loggerService: LoggerService) { }
  offerMappings: string = 'Filtered';
  fixtureViewUrl: string;
  fixturesUrl: string;
  cdsClientConnetionId: NodeJS.Timeout;

  public getFixture_View(fixtureId: number, marketIds: string, gameIds: string): Observable<FixtureView> {
    return this.getContentDeliveryConfig().pipe(mergeMap((result) => {
      if (!!fixtureId) {
        if (marketIds.length == 0 && gameIds.length == 0) {
          this.fixtureViewUrl = result.fixtureViewUrl + '?OfferMapping=All' + '&FixtureIds=' + fixtureId + '&x-bwin-accessid=' + result.accessId + '&lang=' + result.lang + '&country=' + result.country;
          this.setTimeOutWhenDataIsNotAvailable(this.fixtureViewUrl, result);
          return this.httpService.get<FixtureView>(result.fixtureViewUrl,
            new HttpParams().set("OfferMapping", "All").set("FixtureIds", fixtureId).set("x-bwin-accessid", result.accessId).set("lang", result.lang).
              set("country", result.country)).pipe(
                tap(data => {
                  if (!!data?.fixture) {
                    this.setStaleDataIfDataExists();
                  }
                  else {
                    this.unSetStaleDataIfDataDoesnotExists(this.fixtureViewUrl);
                  }
                })
              );
        }
        else if (gameIds.length > 0) {
          this.fixtureViewUrl = result.fixtureViewUrl + '?OfferMapping=' + this.offerMappings + '&FixtureIds=' + fixtureId + '&GameIds=' + gameIds + '&x-bwin-accessid=' + result.accessId + '&lang=' + result.lang + '&country=' + result.country;
          this.setTimeOutWhenDataIsNotAvailable(this.fixtureViewUrl, result);
          return this.httpService.get<FixtureView>(result.fixtureViewUrl,
            new HttpParams().set("OfferMapping", this.offerMappings).set("FixtureIds", fixtureId).
              set("GameIds", gameIds).set("x-bwin-accessid", result.accessId).set("lang", result.lang).
              set("country", result.country)).pipe(
                tap(data => {
                  if (!!data?.fixture) {
                    this.setStaleDataIfDataExists();
                  }
                  else {
                    this.unSetStaleDataIfDataDoesnotExists(this.fixtureViewUrl);
                  }
                })
              );
        }
        else if (marketIds.length > 0) {
            this.fixtureViewUrl = result.fixtureViewUrl + '?OfferMapping=' + this.offerMappings + '&FixtureIds=' + fixtureId + '&OptionMarketIds=' + marketIds + '&x-bwin-accessid=' + result.accessId + '&lang=' + result.lang + '&country=' + result.country;
          this.setTimeOutWhenDataIsNotAvailable(this.fixtureViewUrl, result);          
          return this.httpService.get<FixtureView>(result.fixtureViewUrl,
            new HttpParams().set("OfferMapping", this.offerMappings).set("FixtureIds", fixtureId).
              set("OptionMarketIds", marketIds).set("x-bwin-accessid", result.accessId).set("lang", result.lang).
              set("country", result.country)).pipe(
                tap(data => {
                  if (!!data?.fixture) {
                    this.setStaleDataIfDataExists();
                  }
                  else {
                    this.unSetStaleDataIfDataDoesnotExists(this.fixtureViewUrl);
                  }
                })
              );
        }
      }
      else {
        throw 'Couldn' + `'` + 't find Data for url - ' + result.fixtureViewUrl + '? eventId =' + fixtureId + '& marketIds=' + marketIds + '& x-bwin-accessid=' + result.accessId + '& lang=' + result.lang + '& country=' + result.country;
      }
    }), shareReplay());
  }
  public getFixtures(fixtureIds: string, marketIds: string, gameIds: string): Observable<Fixtures> {
    return this.getContentDeliveryConfig().pipe(
      mergeMap((result) => {
        if (!!fixtureIds && !!marketIds) {
          let requestBody = {
            offerMapping: this.offerMappings,
            fixtureIds: fixtureIds,
            optionMarketIds: marketIds
          }
          this.fixturesUrl = result.fixturesUrl + '&x-bwin-accessid=' + result.accessId + '&lang=' + result.lang + '&country=' + result.country;
          this.setTimeOutWhenDataIsNotAvailable(this.fixturesUrl, result);
          return this.getFixturesUsingPOST(result, requestBody);
        }
        else if (!!fixtureIds && !!gameIds) {
          let requestBody = {
            offerMapping: this.offerMappings,
            fixtureIds: fixtureIds,
            gameIds: gameIds
          }
          this.fixturesUrl = result.fixturesUrl + '&x-bwin-accessid=' + result.accessId + '&lang=' + result.lang + '&country=' + result.country;
          this.setTimeOutWhenDataIsNotAvailable(this.fixturesUrl, result);
          return this.getFixturesUsingPOST(result, requestBody);
        }
      }), shareReplay());
  }

  public getSubscriptionRequestForFixtureView(fixture: FixtureView): SubscriptionRequest {
    var request: SubscriptionRequest = { topics: [] }
    var topicsArray: Array<string> = []
    if (!!fixture?.fixture) {
      topicsArray.push(fixture?.fixture?.context + '|fxt')
      if (!!fixture?.fixture?.games && fixture?.fixture?.games?.length > 0) {
        fixture?.fixture?.games.forEach((y: { id: number; }) => {
          topicsArray.push(fixture?.fixture?.context + '|gam-' + y.id)
        })
      }
      else if (!!fixture?.fixture?.optionMarkets && fixture?.fixture?.optionMarkets?.length > 0) {
        fixture?.fixture?.optionMarkets.forEach((y: { id: number; }) => {
          topicsArray.push(fixture?.fixture?.context + '|fxm-' + y.id)
        })
      }

    }
    request = { topics: topicsArray } as SubscriptionRequest;
    return request;
  }
  public getSubscriptionRequestForFixtures(fixtures: Fixtures): SubscriptionRequest {
    var request: SubscriptionRequest = { topics: [] }
    var topicsArray: Array<string> = []

    if (!!fixtures?.fixtures) {
      fixtures?.fixtures.forEach((fixture, index) => {
        var optionMarketsArray = fixtures?.fixtures[index]?.optionMarkets;
        var gamesMarketsArray = fixtures?.fixtures[index]?.games;
        if (!!optionMarketsArray && optionMarketsArray?.length > 0) {
          optionMarketsArray.forEach((optionMarket, optionIndex) => {
            topicsArray.push(fixtures?.fixtures[index]?.context + '|fxt');
            topicsArray.push(fixtures?.fixtures[index]?.context + '|fxm-' + optionMarketsArray[optionIndex]?.id);
          });
        }
        else if (!!gamesMarketsArray && gamesMarketsArray?.length > 0) {
          gamesMarketsArray.forEach((gamesMarket, gamesIndex) => {
            topicsArray.push(fixtures?.fixtures[index]?.context + '|fxt');
            topicsArray.push(fixtures?.fixtures[index]?.context + '|gam-' + gamesMarketsArray[gamesIndex]?.id);
          });
        }
      });
    }
    request = { topics: topicsArray } as SubscriptionRequest;
    return request;

  }

  private getContentDeliveryConfig(): Observable<ContentDeliveryConfig> {
    return this.httpService.get<ContentDeliveryConfig>('en/api/getCDSConfig');
  }


  private getFixturesUsingPOST(result: ContentDeliveryConfig, requestBody: any): Observable<Fixtures> {
    let params = new HttpParams().append('x-bwin-accessid', result.accessId).append('lang', result.lang).append('country', result.country);
    return this.httpService.post<Fixtures>(result.fixturesUrl, requestBody, params).pipe(
      tap(data => {
        if (!!data?.fixtures) {
          this.setStaleDataIfDataExists();
        }
        else {
          this.unSetStaleDataIfDataDoesnotExists(this.fixturesUrl);
        }
      })
    );
  }

  private setStaleDataIfDataExists() {
    console.log("Data is available for the CDS client");
    this.errorService.isStaleDataAvailable = true;
    this.errorService.unSetError();
  }
  private unSetStaleDataIfDataDoesnotExists(url: string) {
    console.log("Data is not available for the CDS client url: " + url)
    this.errorService.logError("Data is not available for the CDS client url: " + url);
    this.errorService.isStaleDataAvailable = false;
  }
  private setTimeOutWhenDataIsNotAvailable(url: string, result: ContentDeliveryConfig) {
    this.cdsClientConnetionId = setTimeout(() => {
      clearTimeout(this.cdsClientConnetionId);
      if (!this.errorService.isStaleDataAvailable) {
        this.logError(url, "Data is not available for the CDS client url: ", "Status is Unknown", false, LogType.Error);
        this.errorService.setError("Data is not available for the CDS client Url: " + url);
      }
    }, result.cdsRetryDelay);
  }

  logError(url: string, message: string, status: string, fatal: boolean = false, logType: LogType = LogType.Error) {
    let errorLog: Log = {
      level: logType,
      message: message + ' : ' + url,
      status: status,
      fatal: fatal
    };
    this.loggerService.log(errorLog);
  }
}
