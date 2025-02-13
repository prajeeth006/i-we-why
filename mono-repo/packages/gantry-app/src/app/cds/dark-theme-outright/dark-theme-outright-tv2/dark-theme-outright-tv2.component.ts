import { Component, OnInit } from '@angular/core';

import { FixtureView } from '@cds/betting-offer/domain-specific';

import { CdsPushProvider } from '../../../common/cds-client/cds-client-push.provider';
import { CdsClientService } from '../../../common/cds-client/cds-client-service.service';
import { SelectionNameLength } from '../../../common/models/general-codes-model';
import { RouteDataService } from '../../../common/services/route-data.service';
import { OutRightCdsContent } from '../../outright/models/outright-cds.model';
import { OutrighCdsTv2SpecialService } from '../../outright/service/outrigh-cds-tv2-special.service';
import { OutrightCdsTv2Service } from '../../outright/service/outright-cds-tv2.service';

@Component({
    selector: 'gn-dark-theme-outright-tv2',
    templateUrl: './dark-theme-outright-tv2.component.html',
    styleUrl: './dark-theme-outright-tv2.component.scss',
})
export class DarkThemeOutrightTv2Component implements OnInit {
    outRightCDSTv2Content: OutRightCdsContent = new OutRightCdsContent();
    updatedFixture: FixtureView;
    fixtureId: any;
    marketIds: any;
    gameIds: any;
    errorMessage$ = this.outrightCdsTv2Service.errorMessage$;
    nameLength = SelectionNameLength.Seventeen;
    isSpecial: any;
    tradingPartitionID: any;

    constructor(
        routeDataService: RouteDataService,
        private cdsPushProvider: CdsPushProvider,
        private cdsClientService: CdsClientService,
        private outrightCdsTv2Service: OutrightCdsTv2Service,
        private outrighCdsTv2SpecialService: OutrighCdsTv2SpecialService,
    ) {
        const queryParams = routeDataService.getQueryParams();
        this.tradingPartitionID = queryParams['tradingPartition'];
        this.fixtureId = (!!this.tradingPartitionID ? this.tradingPartitionID : '2') + ':' + queryParams['eventId'];
        this.marketIds = queryParams['marketIds'];
        this.gameIds = queryParams['marketIds'];
        this.isSpecial = queryParams['isSpecial'];
    }

    ngOnInit(): void {
        if (this.isSpecial == 'true') this.outrightCdsTv2Service.getOutRightCdsTv2Content(this.fixtureId, this.marketIds, '', true, '');
        else this.outrightCdsTv2Service.getOutRightCdsTv2Content(this.fixtureId, this.marketIds, '');

        this.outrightCdsTv2Service.outRightCDSTv2Content$.subscribe((result) => {
            this.outRightCDSTv2Content = result;
            const topics = this.cdsClientService.getSubscriptionRequestForFixtures(this.outrightCdsTv2Service.fixtures);
            this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
                if (isConnection) {
                    this.cdsPushProvider.subscribe(topics);
                }
            });
        });

        this.cdsPushProvider.messageReceived$.subscribe((result) => {
            this.outRightCDSTv2Content =
                this.isSpecial == 'true'
                    ? { ...this.outrighCdsTv2SpecialService.getUpdatedOutRightCdsTv2Content(result) }
                    : { ...this.outrightCdsTv2Service.getUpdatedOutRightCdsTv2Content(result) };
        });
    }
}
