import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SubscriptionRequest } from '@cds/push';
import { EMPTY, Observable } from 'rxjs';
import { catchError, mergeMap, shareReplay, tap } from 'rxjs/operators';

import { ErrorService } from '../services/error.service';
import { HttpService } from '../services/http.service';
import { Log, LogType, LoggerService } from '../services/logger.service';
import { QueryParamsService } from '../services/query-params/query-params.service';
import { ContentDeliveryConfig } from './models/cds-client-config.model';
import { Fixture, Fixtures } from './models/fixture.model';

@Injectable({
    providedIn: 'root',
})
export class CdsClientService {
    constructor(
        private httpService: HttpService,
        private errorService: ErrorService,
        private loggerService: LoggerService,
        private queryParamsService: QueryParamsService,
    ) {}
    offerMappings: string = 'Filtered';
    fixturesUrl: string;
    cdsClientConnetionId: NodeJS.Timeout;
    isFixtureValues = false;

    public getFixtures(
        fixtureIds: string,
        marketIds: string,
        gameIds: string,
        offerMappings: string = this.offerMappings,
        isSpecial: boolean = false,
    ): Observable<Fixtures> {
        const fixturesData$ = this.getContentDeliveryConfig().pipe(
            mergeMap((result) => {
                let requestBody;
                if (!!fixtureIds && !!marketIds) {
                    requestBody = {
                        offerMapping: offerMappings,
                        fixtureIds: fixtureIds,
                        optionMarketIds: marketIds,
                    };
                } else if (!!fixtureIds && !!gameIds) {
                    requestBody = {
                        offerMapping: offerMappings,
                        fixtureIds: fixtureIds,
                        gameIds: gameIds,
                    };
                }
                let domainUrl = this.getDomainFromMainUrl(result);
                this.fixturesUrl = this.queryParamsService.addParams(domainUrl, {
                    'x-bwin-accessid': result.accessId,
                    'lang': result.lang,
                    'country': result.country,
                });
                this.setTimeOutWhenDataIsNotAvailable(this.fixturesUrl, result);
                return this.getFixturesUsingPOST(result, requestBody, isSpecial);
            }),
            catchError((error) => {
                console.log(error);
                return EMPTY;
            }),
            shareReplay(),
        );
        return fixturesData$;
    }
    public getSubscriptionRequestForFixtures(fixtures: Fixtures): SubscriptionRequest {
        let request: SubscriptionRequest = { topics: [] };
        const topicsArray: Array<string> = [];

        if (fixtures?.fixtures) {
            fixtures?.fixtures.forEach((fixture, index) => {
                const optionMarketsArray = fixtures?.fixtures[index]?.optionMarkets;
                const gamesMarketsArray = fixtures?.fixtures[index]?.games;
                const participantMarketsArray = fixtures?.fixtures[index]?.participants;
                const contexts = fixtures?.fixtures[index]?.contexts;
                if (!!optionMarketsArray && optionMarketsArray?.length > 0) {
                    optionMarketsArray.forEach((optionMarket, optionIndex) => {
                        contexts?.forEach((context, contextIndex) => {
                            console.log(context);
                            topicsArray.push(context + '|fxt');
                            topicsArray.push(context + '|fxm-' + optionMarketsArray[optionIndex]?.id);
                        });
                    });
                } else if (!!gamesMarketsArray && gamesMarketsArray?.length > 0) {
                    gamesMarketsArray.forEach((gamesMarket, gamesIndex) => {
                        contexts?.forEach((context) => {
                            topicsArray.push(context + '|fxt');
                            topicsArray.push(context + '|gam-' + gamesMarketsArray[gamesIndex]?.id);
                        });
                    });
                } else if (!!participantMarketsArray && participantMarketsArray?.length > 0) {
                    contexts?.forEach((context) => {
                        topicsArray.push(context + '|all');
                    });
                }
            });
        }
        const uniqueTopicsArray = [...new Set(topicsArray)];
        request = { topics: uniqueTopicsArray } as SubscriptionRequest;
        return request;
    }

    private getContentDeliveryConfig(): Observable<ContentDeliveryConfig> {
        return this.httpService.get<ContentDeliveryConfig>('en/api/getCDSConfig');
    }

    private getFixturesUsingPOST(result: ContentDeliveryConfig, requestBody: any, isSpecial: boolean = false): Observable<Fixtures> {
        const params = new HttpParams().append('x-bwin-accessid', result.accessId).append('lang', result.lang).append('country', result.country);
        let domainUrl = this.getDomainFromMainUrl(result);
        return this.httpService.post<Fixtures>(domainUrl, requestBody, params).pipe(
            tap((data) => {
                const fixtures = data?.fixtures;
                this.isFixtureValues = this.compareFixtureIds(fixtures, isSpecial);

                if (fixtures?.length && this.isFixtureValues) {
                    this.setStaleDataIfDataExists();
                } else {
                    this.unSetStaleDataIfDataDoesnotExists(domainUrl);
                }
            }),
        );
    }

    //Function to compare IDs
    private compareFixtureIds(fixtures: Fixture[], isSpecial: boolean = false): boolean {
        // Iterate through each fixture object
        for (const fixture of fixtures) {
            const hasSubData =
                (fixture?.hybridFixtureData?.length ?? 0) > 0 ||
                (fixture?.games?.length ?? 0) > 0 ||
                (fixture?.optionMarkets?.length ?? 0) > 0 ||
                (isSpecial ?? fixture?.participants?.length);

            if (hasSubData) {
                this.isFixtureValues = true;
                break; // Exit loop early if condition is met
            }
        }
        return this.isFixtureValues;
    }

    private setStaleDataIfDataExists() {
        console.log('Data is available for the CDS client');
        this.errorService.isStaleDataAvailable = true;
        this.errorService.unSetError();
    }
    private unSetStaleDataIfDataDoesnotExists(url: string) {
        console.log('Data is not available for the CDS client url: ' + url);
        this.errorService.logError('Data is not available for the CDS client url: ' + url);
        this.errorService.isStaleDataAvailable = false;
    }
    private setTimeOutWhenDataIsNotAvailable(url: string, result: ContentDeliveryConfig) {
        this.cdsClientConnetionId = setTimeout(() => {
            clearTimeout(this.cdsClientConnetionId);
            if (!this.errorService.isStaleDataAvailable) {
                this.logError(url, 'Data is not available for the CDS client url: ', 'Status is Unknown', false, LogType.Error);
                this.errorService.setError('Data is not available for the CDS client Url: ' + url);
            }
        }, result.cdsRetryDelay);
    }

    private getDomainFromMainUrl(result: ContentDeliveryConfig) {
        return result.isCdsDomainFromMainUrl ? `${window.location.origin}${result.cdsFixturesDomainUrl}` : result.fixturesUrl;
    }
    logError(url: string, message: string, status: string, fatal: boolean = false, logType: LogType = LogType.Error) {
        const errorLog: Log = {
            level: logType,
            message: message + ' : ' + url,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(errorLog);
    }
}
