import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { CdsPushProvider } from '../../../common/cds-client/cds-client-push.provider';
import { CdsClientService } from '../../../common/cds-client/cds-client-service.service';
import { RouteDataService } from '../../../common/services/route-data.service';
import { FootBallCdsTemplateResult } from '../../matches/foot-ball/foot-ball-cds-template/models/foot-ball-cds-template.model';
import { FootBallCdsTemplateService } from '../../matches/foot-ball/foot-ball-cds-template/services/foot-ball-cds-template.service';

@Component({
    selector: 'gn-dark-theme-foot-ball-cds-template',
    templateUrl: './dark-theme-foot-ball-cds-template.component.html',
    styleUrl: './dark-theme-foot-ball-cds-template.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class DarkThemeFootBallCdsTemplateComponent implements OnInit {
    errorMessage$ = this.footBallCdsTemplateService.errorMessage$;

    footBallCDSContent: FootBallCdsTemplateResult = new FootBallCdsTemplateResult();
    fixtureId: string;
    marketIds: string;
    gameIds: string;
    tradingPartitionID: string;

    constructor(
        routeDataService: RouteDataService,
        private footBallCdsTemplateService: FootBallCdsTemplateService,
        private cdsPushProvider: CdsPushProvider,
        private cdsClientService: CdsClientService,
    ) {
        const queryParams = routeDataService.getQueryParams();
        this.tradingPartitionID = queryParams['tradingPartition'];
        this.fixtureId = (!!this.tradingPartitionID ? this.tradingPartitionID : '2') + ':' + queryParams['eventId'];
        this.marketIds = queryParams['marketIds'];
        this.gameIds = queryParams['marketIds'];
    }

    ngOnInit(): void {
        this.footBallCdsTemplateService.prepareFootBallCdsContent(this.fixtureId, this.marketIds, '');
        this.footBallCdsTemplateService.footBallCdsContent$.subscribe((result) => {
            this.footBallCDSContent = result;
            const topics = this.cdsClientService.getSubscriptionRequestForFixtures(this.footBallCdsTemplateService.fixtures);
            this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
                if (isConnection) {
                    this.cdsPushProvider.subscribe(topics);
                }
            });
        });

        this.cdsPushProvider.messageReceived$.subscribe((result) => {
            this.footBallCDSContent = { ...this.footBallCdsTemplateService.GetUpdatedFootBallCdsContent(result) };
        });
    }
}
