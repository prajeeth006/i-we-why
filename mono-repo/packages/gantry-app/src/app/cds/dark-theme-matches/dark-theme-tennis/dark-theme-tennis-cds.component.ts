import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { SubscriptionRequest } from '@cds/push';
import { EMPTY, catchError, tap } from 'rxjs';

import { CdsPushProvider } from '../../../common/cds-client/cds-client-push.provider';
import { CdsClientService } from '../../../common/cds-client/cds-client-service.service';
import { SelectionNameLength } from '../../../common/models/general-codes-model';
import { ErrorService } from '../../../common/services/error.service';
import { RouteDataService } from '../../../common/services/route-data.service';
import { TennisCdsContent } from '../../matches/tennis/models/tennis-cds-content.model';
import { TennisCdsService } from '../../matches/tennis/services/tennis-cds.service';

@Component({
    selector: 'gn-dark-theme-tennis-cds',
    templateUrl: './dark-theme-tennis-cds.component.html',
    styleUrl: './dark-theme-tennis-cds.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class DarkThemeTennisCdsComponent implements OnInit, OnDestroy {
    nameLength = SelectionNameLength.Seventeen;
    errorMessage$ = this.tennisCdsService.errorMessage$;
    tennisCDSContent: TennisCdsContent = new TennisCdsContent();
    fixtureId: any;
    marketIds: any;
    gameIds: any;
    topics: SubscriptionRequest;

    constructor(
        routeDataService: RouteDataService,
        private tennisCdsService: TennisCdsService,
        private cdsPushProvider: CdsPushProvider,
        private cdsClientService: CdsClientService,
        private errorService: ErrorService,
    ) {
        const queryParams = routeDataService.getQueryParams();
        this.fixtureId = queryParams['eventId'];
        this.marketIds = queryParams['marketIds'];
        this.gameIds = queryParams['marketIds'];
    }

    ngOnInit(): void {
        this.tennisCdsService.GetTennisCdsContent(this.fixtureId, '', this.gameIds);
        this.tennisCdsService.tennisCdsContent$
            .pipe(
                tap((result) => {
                    if (result && result?.games?.length > 0) {
                        this.tennisCDSContent = result;

                        this.topics = this.cdsClientService.getSubscriptionRequestForFixtures(this.tennisCdsService.fixtures);
                        this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
                            if (isConnection) {
                                this.cdsPushProvider.subscribe(this.topics);
                            }
                        });
                    } else {
                        this.errorService.setError(location.href);
                    }
                }),
                catchError((err) => {
                    this.errorService.logError(err);
                    return EMPTY;
                }),
            )
            .subscribe();

        this.cdsPushProvider.messageReceived$.subscribe((result) => {
            this.tennisCDSContent = this.tennisCdsService.GetUpdatedTennisCdsContent(result);
        });
    }

    ngOnDestroy(): void {
        this.cdsPushProvider.cancelSubscription(this.topics);
    }
}
