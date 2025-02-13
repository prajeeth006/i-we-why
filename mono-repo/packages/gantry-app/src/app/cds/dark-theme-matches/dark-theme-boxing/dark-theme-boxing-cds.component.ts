import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { CdsPushProvider } from '../../../common/cds-client/cds-client-push.provider';
import { CdsClientService } from '../../../common/cds-client/cds-client-service.service';
import { RouteDataService } from '../../../common/services/route-data.service';
import { BoxingCdsContent } from '../../matches/boxing-cds/models/boxing-cds-content.model';
import { BoxingCdsService } from '../../matches/boxing-cds/services/boxing-cds.service';

@Component({
    selector: 'gn-dark-theme-boxing-cds',
    templateUrl: './dark-theme-boxing-cds.component.html',
    styleUrl: './dark-theme-boxing-cds.component.scss',
})
export class DarkThemeBoxingCdsComponent implements OnInit {
    boxingCDSContent: BoxingCdsContent = new BoxingCdsContent();
    fixtureId: any;
    marketIds: any;
    gameIds: any;
    boxingCDSContent$: Observable<BoxingCdsContent>;
    errorMessage$ = this.boxingCdsService.errorMessage$;
    sportsTypeImage: string;

    constructor(
        routeDataService: RouteDataService,
        private boxingCdsService: BoxingCdsService,
        private cdsPushProvider: CdsPushProvider,
        private cdsClientService: CdsClientService,
    ) {
        const queryParams = routeDataService.getQueryParams();
        this.fixtureId = queryParams['eventId'];
        this.marketIds = queryParams['marketIds'];
        this.gameIds = queryParams['marketIds'];
    }

    ngOnInit(): void {
        this.boxingCdsService.GetBoxingCdsContent(this.fixtureId, '', this.gameIds);
        this.boxingCDSContent$ = this.boxingCdsService.boxingCdsContent$;
        this.boxingCdsService.boxingCdsContent$.subscribe((result) => {
            this.boxingCDSContent = result;
            this.sportsTypeImage = this.getSportsTypeImage();
            const topics = this.cdsClientService.getSubscriptionRequestForFixtures(this.boxingCdsService?.fixtures);
            this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
                if (isConnection) {
                    this.cdsPushProvider.subscribe(topics);
                }
            });
        });

        this.cdsPushProvider.messageReceived$.subscribe((result) => {
            this.boxingCDSContent = { ...this.boxingCdsService.GetUpdatedBoxingCdsContent(result) };
        });
    }

    getSportsTypeImage(): string {
        const image = this.boxingCDSContent?.content?.boxingImage?.src ?? '';
        return image;
    }
}
