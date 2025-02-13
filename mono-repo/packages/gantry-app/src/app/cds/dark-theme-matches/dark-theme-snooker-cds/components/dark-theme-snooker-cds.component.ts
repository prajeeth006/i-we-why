import { Component, OnInit } from '@angular/core';

import { CdsPushProvider } from '../../../../common/cds-client/cds-client-push.provider';
import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { StringHelper } from '../../../../common/helpers/string.helper';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { SnookerCdsTemplateResult } from '../../../matches/snooker-cds/models/snooker-cds-template.model';
import { SnookerCdsService } from '../../../matches/snooker-cds/services/snooker-cds.service';

@Component({
    selector: 'gn-dark-theme-snooker-cds',
    templateUrl: './dark-theme-snooker-cds.component.html',
    styleUrls: ['./dark-theme-snooker-cds.component.scss'],
})
export class DarkThemeSnookerCdsComponent implements OnInit {
    errorMessage$ = this.snookerCdsService.errorMessage$;
    snookerCDSContent: SnookerCdsTemplateResult = new SnookerCdsTemplateResult();
    fixtureId: any;
    marketIds: any;
    gameIds: any;
    sportsTypeImage: string;
    isDrawMarketListed: boolean = false;

    constructor(
        routeDataService: RouteDataService,
        private snookerCdsService: SnookerCdsService,
        private cdsPushProvider: CdsPushProvider,
        private cdsClientService: CdsClientService,
    ) {
        const queryParams = routeDataService.getQueryParams();
        this.fixtureId = queryParams['eventId'];
        this.marketIds = queryParams['marketIds'];
        this.gameIds = queryParams['marketIds'];
    }

    ngOnInit(): void {
        this.snookerCdsService.GetSnookerContent(this.fixtureId, '', this.gameIds);
        this.snookerCdsService.snookerCdsContent$.subscribe((result) => {
            this.snookerCDSContent = result;
            if (result?.games && result?.games.length > 0) {
                this.isDrawMarketListed = StringHelper.checkDrawMarketListed(result?.games);
            }
            this.sportsTypeImage = this.getSportsTypeImage();
            const topics = this.cdsClientService.getSubscriptionRequestForFixtures(this.snookerCdsService.fixtures);
            this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
                if (isConnection) {
                    this.cdsPushProvider.subscribe(topics);
                }
            });
        });

        this.cdsPushProvider.messageReceived$.subscribe((result) => {
            this.snookerCDSContent = { ...this.snookerCdsService.GetUpdatedSnookerCdsContent(result) };
            if (this.snookerCDSContent?.games && this.snookerCDSContent?.games.length > 0) {
                this.isDrawMarketListed = StringHelper.checkDrawMarketListed(this.snookerCDSContent?.games);
            }
        });
    }

    getSportsTypeImage(): string {
        const image = this.snookerCDSContent?.content?.snookerImage?.src ? this.snookerCDSContent?.content?.snookerImage?.src : '';
        return image;
    }
}
