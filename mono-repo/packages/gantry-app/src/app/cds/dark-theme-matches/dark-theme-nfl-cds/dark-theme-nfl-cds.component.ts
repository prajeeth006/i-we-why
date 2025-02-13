import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { CdsPushProvider } from '../../../common/cds-client/cds-client-push.provider';
import { CdsClientService } from '../../../common/cds-client/cds-client-service.service';
import { SelectionNameLength } from '../../../common/models/general-codes-model';
import { ErrorService } from '../../../common/services/error.service';
import { HybridFixtureService } from '../../../common/services/hybrid-fixture.service';
import { Log, LogType, LoggerService } from '../../../common/services/logger.service';
import { RouteDataService } from '../../../common/services/route-data.service';
import { NflCdsContent } from '../../matches/nfl-cds/models/nfl-cds-content.model';
import { NflCdsService } from '../../matches/nfl-cds/services/nfl-cds.service';

@Component({
    selector: 'gn-dark-theme-nfl-cds',
    templateUrl: './dark-theme-nfl-cds.component.html',
    styleUrl: './dark-theme-nfl-cds.component.scss',
})
export class DarkThemeNflCdsComponent implements OnInit {
    nameLength = SelectionNameLength.Seventeen;
    nflCDSContent: NflCdsContent = new NflCdsContent();
    fixtureId: any;
    marketIds: any;
    gameIds: any;
    errorMessage$ = this.nflCdsService.errorMessage$;
    nflCDSContent$: Observable<NflCdsContent>;

    constructor(
        routeDataService: RouteDataService,
        private loggerService: LoggerService,
        private errorService: ErrorService,
        private nflCdsService: NflCdsService,
        private cdsPushProvider: CdsPushProvider,
        private cdsClientService: CdsClientService,
        private hybridFixtureService: HybridFixtureService,
    ) {
        const queryParams = routeDataService.getQueryParams();
        this.fixtureId = queryParams['eventId'];
        this.marketIds = queryParams['marketIds'];
        this.gameIds = queryParams['marketIds'];
    }

    getCleanClassGameName(gameName: string): string {
        if (!gameName) return '';

        return ` ${gameName.replace(/\d+/g, '').replaceAll(' ', '-').toLowerCase()}`;
    }

    ngOnInit(): void {
        this.nflCdsService.GetNflCdsContent(this.fixtureId, '', this.gameIds);
        this.nflCDSContent$ = this.nflCdsService.nflCdsContent$;
        this.nflCDSContent$.subscribe((result) => {
            this.nflCDSContent = result;
            if (this.nflCDSContent.sportName) {
                this.logError(this.cdsClientService.fixturesUrl, 'Nfl content not found', 'ContentNotFound');
                this.errorService.logError(this.cdsClientService.fixturesUrl);
            }
            const topics = this.cdsClientService.getSubscriptionRequestForFixtures(this.nflCdsService.fixtures);
            this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
                if (isConnection) {
                    this.cdsPushProvider.subscribe(topics);
                }
            });
        });

        this.cdsPushProvider.messageReceived$.subscribe((result) => {
            if (this.nflCdsService?.fixture?.hybridFixtureData) {
                this.nflCDSContent = this.hybridFixtureService?.GetUpdateHybridCdsContent(
                    result,
                    this.nflCdsService?.fixture,
                    this.nflCdsService?.gantryMarkets,
                    this.nflCdsService?.gantryCommonContent,
                    this.nflCdsService?.nflCdsContent.content,
                );
            } else {
                this.nflCDSContent = this.nflCdsService?.GetUpdatedNflCdsContent(result);
            }
        });
    }

    logError(url: string, message: string, status: string, fatal: boolean = false) {
        const errorLog: Log = {
            level: LogType.Error,
            message: 'Could not find data for Url: ' + url + ' because ' + message,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(errorLog);
    }
}
