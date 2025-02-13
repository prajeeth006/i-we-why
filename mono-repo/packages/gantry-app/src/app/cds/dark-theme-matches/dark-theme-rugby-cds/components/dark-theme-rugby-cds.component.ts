import { Component, OnInit } from '@angular/core';

import { CdsPushProvider } from '../../../../common/cds-client/cds-client-push.provider';
import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { GameType } from '../../../matches/rugby-cds/models/rugby-cds-template.constant';
import { RugbyCdsTemplateResult } from '../../../matches/rugby-cds/models/rugby-cds-template.model';
import { RugbyCdsService } from '../../../matches/rugby-cds/services/rugby-cds.service';

@Component({
    selector: 'gn-dark-theme-rugby-cds',
    templateUrl: './dark-theme-rugby-cds.component.html',
    styleUrls: ['./dark-theme-rugby-cds.component.scss'],
})
export class DarkThemeRubyCdsComponent implements OnInit {
    errorMessage$ = this.rugbyCdsService.errorMessage$;
    rugbyCDSContent: RugbyCdsTemplateResult = new RugbyCdsTemplateResult();
    fixtureId: any;
    marketIds: any;
    gameIds: any;
    sportsTypeImage: string;

    constructor(
        routeDataService: RouteDataService,
        private rugbyCdsService: RugbyCdsService,
        private cdsPushProvider: CdsPushProvider,
        private cdsClientService: CdsClientService,
    ) {
        const queryParams = routeDataService.getQueryParams();
        this.fixtureId = queryParams['eventId'];
        this.marketIds = queryParams['marketIds'];
        this.gameIds = queryParams['marketIds'];
    }
    ngOnInit(): void {
        this.rugbyCdsService.GetRugbyContent(this.fixtureId, '', this.gameIds);
        this.rugbyCdsService.rugbyCdsContent$.subscribe((result) => {
            this.rugbyCDSContent = result;
            this.sportsTypeImage = this.getSportsTypeImage(this.rugbyCDSContent);
            const topics = this.cdsClientService.getSubscriptionRequestForFixtures(this.rugbyCdsService.fixtures);
            this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
                if (isConnection) {
                    this.cdsPushProvider.subscribe(topics);
                }
            });
        });

        this.cdsPushProvider.messageReceived$.subscribe((result) => {
            this.rugbyCDSContent = { ...this.rugbyCdsService.GetUpdatedRugbyCdsContent(result) };
        });
    }

    getSportsTypeImage(resultContent: RugbyCdsTemplateResult): string {
        const image =
            resultContent?.sportName?.toLowerCase() == GameType.rugbyleague
                ? this.rugbyCDSContent?.content?.rugbyLeagueImage?.src
                : this.rugbyCDSContent?.content?.rugbyUnionImage?.src;
        return image ? image : '';
    }
}
