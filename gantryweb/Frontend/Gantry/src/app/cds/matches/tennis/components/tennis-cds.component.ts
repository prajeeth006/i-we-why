import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { TennisCdsContent } from '../models/tennis-cds-content.model';
import { TennisCdsService } from '../services/tennis-cds.service';
import { CdsPushProvider } from 'src/app/common/cds-client/cds-client-push.provider';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { SubscriptionRequest } from '@cds/push';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { ErrorService } from 'src/app/common/services/error.service';
import { EMPTY, catchError, tap } from 'rxjs';

@Component({
  selector: 'gn-tennis-cds',
  templateUrl: './tennis-cds.component.html',
  styleUrls: ['./tennis-cds.component.scss']
})
export class TennisCdsComponent implements OnInit, OnDestroy {
  nameLength = SelectionNameLength.Seventeen;
  errorMessage$ = this.tennisCdsService.errorMessage$;
  tennisCDSContent: TennisCdsContent = new TennisCdsContent();
  updatedFixture: FixtureView;
  fixtureId: any; marketIds: any; gameIds: any;
  topics: SubscriptionRequest;
  constructor(routeDataService: RouteDataService, private tennisCdsService: TennisCdsService, private cdsPushProvider: CdsPushProvider, private cdsClientService: CdsClientService, private errorService: ErrorService) {
    let queryParams = routeDataService.getQueryParams();
    this.fixtureId = queryParams['eventId'];
    this.marketIds = queryParams['marketIds'];
    this.gameIds = queryParams['marketIds'];
  }

  ngOnInit(): void {

    this.tennisCdsService.GetTennisCdsContent(this.fixtureId, '', this.gameIds);
    this.tennisCdsService.tennisCdsContent$.pipe(
      tap((result) => {
        if (!!result && result?.games?.length > 0) {
          this.tennisCDSContent = result;
          this.topics = this.cdsClientService.getSubscriptionRequestForFixtureView(this.tennisCdsService.fixtureData);
          this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
            if (isConnection) {
              this.cdsPushProvider.subscribe(this.topics);
            }
          });
        }
        else {
          this.errorService.setError(location.href);
        }
      }),
      catchError((err) => {
        this.errorService.logError(err);
        return EMPTY;
      })
    ).subscribe();

    this.cdsPushProvider.messageReceived$.subscribe(
      (result) => {
        this.tennisCDSContent = this.tennisCdsService.GetUpdatedTennisCdsContent(result);
      })
  }
  ngOnDestroy(): void {
    this.cdsPushProvider.cancelSubscription(this.topics);
  }

}
