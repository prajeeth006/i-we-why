import { Component, OnInit } from '@angular/core';

import { FixtureView } from '@cds/betting-offer/domain-specific';
import { Observable } from 'rxjs';

import { CdsPushProvider } from '../../../common/cds-client/cds-client-push.provider';
import { CdsClientService } from '../../../common/cds-client/cds-client-service.service';
import { SelectionNameLength } from '../../../common/models/general-codes-model';
import { RouteDataService } from '../../../common/services/route-data.service';
import { OutRightCdsContent } from '../../outright/models/outright-cds.model';
import { OutrightCdsService } from '../../outright/service/outright-cds.service';

@Component({
    selector: 'gn-dark-theme-outright-tv1',
    templateUrl: './dark-theme-outright-tv1.component.html',
    styleUrl: './dark-theme-outright-tv1.component.scss',
})
export class DarkThemeOutrightTv1Component implements OnInit {
    outRightCDSContent: OutRightCdsContent = new OutRightCdsContent();
    updatedFixture: FixtureView;
    fixtureId: any;
    marketIds: any;
    gameIds: any;
    outRightCDSContent$: Observable<OutRightCdsContent>;
    errorMessage$ = this.outRightCdsService.errorMessage$;
    nameLength = SelectionNameLength.Seventeen;
    constructor(
        routeDataService: RouteDataService,
        private outRightCdsService: OutrightCdsService,
        private cdsPushProvider: CdsPushProvider,
        private cdsClientService: CdsClientService,
    ) {
        const queryParams = routeDataService.getQueryParams();
        this.fixtureId = queryParams['eventId'];
        this.marketIds = queryParams['marketIds'];
        this.gameIds = queryParams['marketIds'];
    }

    ngOnInit(): void {
        this.outRightCdsService.GetOutRightCdsContent(this.fixtureId, '', this.gameIds);
        this.outRightCDSContent$ = this.outRightCdsService.outRightCDSContent$;
        this.outRightCdsService.outRightCDSContent$.subscribe((result) => {
            this.outRightCDSContent = result;
            const topics = this.cdsClientService.getSubscriptionRequestForFixtures(this.outRightCdsService.fixtures);
            this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
                if (isConnection) {
                    this.cdsPushProvider.subscribe(topics);
                }
            });
        });

        this.cdsPushProvider.messageReceived$.subscribe((result) => {
            this.outRightCDSContent = this.outRightCdsService.GetUpdatedOutRightCdsContent(result)
                ? { ...this.outRightCdsService.GetUpdatedOutRightCdsContent(result) }
                : new OutRightCdsContent();
        });
    }
}
