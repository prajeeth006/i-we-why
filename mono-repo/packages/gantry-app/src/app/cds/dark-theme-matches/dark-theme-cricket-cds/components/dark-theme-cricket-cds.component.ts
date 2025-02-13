import { Component, OnInit } from '@angular/core';

import { CdsPushProvider } from '../../../../common/cds-client/cds-client-push.provider';
import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { CricketCdsTemplateModel } from '../../../common/models/cricket-cds-template.model';
import { CricketCdsService } from '../../../matches/cricket-cds/services/cricket-cds.service';

@Component({
    selector: 'gn-dark-cricket-cds',
    templateUrl: './dark-theme-cricket-cds.component.html',
    styleUrls: ['./dark-theme-cricket-cds.component.scss'],
})
export class DarkThemeCricketCdsComponent implements OnInit {
    errorMessage$ = this.cricketCdsService.errorMessage$;
    cricketCDSContent: CricketCdsTemplateModel = new CricketCdsTemplateModel();
    fixtureId: any;
    marketIds: any;
    gameIds: any;
    sportsTypeImage: string;
    tradingPartitionId: string;
    eventId: string;

    constructor(
        routeDataService: RouteDataService,
        private cricketCdsService: CricketCdsService,
        private cdsPushProvider: CdsPushProvider,
        private cdsClientService: CdsClientService,
    ) {
        const queryParams = routeDataService.getQueryParams();
        this.tradingPartitionId = queryParams['tradingPartition'];
        this.eventId = queryParams['eventId'];
        this.marketIds = queryParams['marketIds'];
        this.gameIds = queryParams['marketIds'];
    }

    ngOnInit(): void {
        if (!this.tradingPartitionId || this.tradingPartitionId == '1') {
            this.cricketCdsService.prepareCricketCdsContent(this.eventId, '', this.gameIds);
        } else {
            this.fixtureId = this.tradingPartitionId + ':' + this.eventId;
            this.cricketCdsService.prepareCricketCdsContent(this.fixtureId, this.marketIds, '');
        }

        this.cricketCdsService.cricketCdsContent$.subscribe((result: CricketCdsTemplateModel) => {
            this.cricketCDSContent = result;
            this.sportsTypeImage = this.getSportsTypeImage(this.cricketCDSContent);
            const topics = this.cdsClientService.getSubscriptionRequestForFixtures(this.cricketCdsService?.fixtures);
            this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
                if (isConnection) {
                    this.cdsPushProvider.subscribe(topics);
                }
            });
        });

        this.cdsPushProvider.messageReceived$.subscribe((result) => {
            this.cricketCDSContent = { ...this.cricketCdsService.GetUpdatedCricketCdsContent(result) };
        });
    }

    getSportsTypeImage(resultContent: CricketCdsTemplateModel): string {
        const image = resultContent?.gameInfo?.gameFlags?.isTestMatch
            ? (this.cricketCDSContent?.content?.cricketRedImage?.src ?? '')
            : (this.cricketCDSContent?.content?.cricketWhiteImage?.src ?? '');
        return image;
    }
}
