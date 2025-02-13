import { Component, OnInit } from '@angular/core';

import { CdsPushProvider } from '../../../../common/cds-client/cds-client-push.provider';
import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { DartCdsTemplateResult } from '../../../matches/dart-cds/models/dart-cds-template.model';
import { DartCdsService } from '../../../matches/dart-cds/services/dart-cds.service';

@Component({
    selector: 'gn-dart-cds',
    templateUrl: './dark-theme-dart-cds.component.html',
    styleUrls: ['./dark-theme-dart-cds.component.scss'],
})
export class DarkThemeDartCdsComponent implements OnInit {
    errorMessage$ = this.dartCdsService.errorMessage$;
    dartCDSContent: DartCdsTemplateResult = new DartCdsTemplateResult();
    fixtureId: any;
    marketIds: any;
    gameIds: any;
    sportsTypeImage: string;

    constructor(
        routeDataService: RouteDataService,
        private dartCdsService: DartCdsService,
        private cdsPushProvider: CdsPushProvider,
        private cdsClientService: CdsClientService,
    ) {
        const queryParams = routeDataService.getQueryParams();
        this.fixtureId = queryParams['eventId'];
        this.marketIds = queryParams['marketIds'];
        this.gameIds = queryParams['marketIds'];
    }

    ngOnInit(): void {
        this.dartCdsService.GetDartContent(this.fixtureId, '', this.gameIds);
        this.dartCdsService.dartCdsContent$.subscribe((result) => {
            this.dartCDSContent = result;
            this.sportsTypeImage = this.getSportsTypeImage();
            const topics = this.cdsClientService.getSubscriptionRequestForFixtures(this.dartCdsService.fixtures);
            this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
                if (isConnection) {
                    this.cdsPushProvider.subscribe(topics);
                }
            });
        });

        this.cdsPushProvider.messageReceived$.subscribe((result) => {
            this.dartCDSContent = { ...this.dartCdsService.GetUpdatedDartCdsContent(result) };
        });
    }

    getSportsTypeImage(): string {
        const image = this.dartCDSContent?.content?.dartsImage?.src ? this.dartCDSContent?.content?.dartsImage?.src : '';
        return image;
    }
}
