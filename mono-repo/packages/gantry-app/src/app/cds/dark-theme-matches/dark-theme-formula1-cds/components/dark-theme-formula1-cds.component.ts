import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { SubscriptionRequest } from '@cds/push';
import { EMPTY, catchError, tap } from 'rxjs';

import { CdsPushProvider } from '../../../../common/cds-client/cds-client-push.provider';
import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { SelectionNameLength } from '../../../../common/models/general-codes-model';
import { ErrorService } from '../../../../common/services/error.service';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { Formula1CdsContent } from '../../../matches/formula1-cds/models/formula1-cds-content.model';
import { Formula1CdsService } from '../../../matches/formula1-cds/services/formula1-cds.service';

@Component({
    selector: 'gn-dark-theme-formula1-cds',
    templateUrl: './dark-theme-formula1-cds.component.html',
    styleUrl: './dark-theme-formula1-cds.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class DarkThemeFormula1CdsComponent implements OnInit {
    errorMessage$ = this.formula1CdsService.errorMessage$;
    nameLength = SelectionNameLength.Seventeen;
    formula1CDSContent: Formula1CdsContent = new Formula1CdsContent();
    fixtureId: any;
    marketIds: any;
    gameIds: any;
    topics: SubscriptionRequest;

    constructor(
        routeDataService: RouteDataService,
        private formula1CdsService: Formula1CdsService,
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
        this.formula1CdsService.getFormula1CdsContent(this.fixtureId, '', this.gameIds);
        this.formula1CdsService.formula1CdsContent$
            .pipe(
                tap((result) => {
                    if (result?.racerList && result?.racerList?.length > 0) {
                        this.formula1CDSContent = result;
                        this.topics = this.cdsClientService.getSubscriptionRequestForFixtures(this.formula1CdsService.fixtures);
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
            this.formula1CDSContent = this.formula1CdsService.getUpdatedFormula1CdsContent(result);
        });
    }
}
