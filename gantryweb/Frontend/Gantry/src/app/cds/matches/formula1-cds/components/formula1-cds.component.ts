import { Component, OnInit } from '@angular/core';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { Formula1CdsContent } from '../models/formula1-cds-content.model';
import { Formula1CdsService } from '../services/formula1-cds.service';
import { CdsPushProvider } from 'src/app/common/cds-client/cds-client-push.provider';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { ErrorService } from 'src/app/common/services/error.service';
import { EMPTY, catchError, tap } from 'rxjs';
import { SubscriptionRequest } from '@cds/push';

@Component({
  selector: 'gn-formula1-cds',
  templateUrl: './formula1-cds.component.html',
  styleUrls: ['./formula1-cds.component.scss']
})
export class Formula1CdsComponent implements OnInit {
  errorMessage$ = this.formula1CdsService.errorMessage$;
  nameLength = SelectionNameLength.Seventeen;
  formula1CDSContent: Formula1CdsContent = new Formula1CdsContent();
  updatedFixture: FixtureView;
  fixtureId: any; marketIds: any; gameIds: any;
  topics: SubscriptionRequest;


  constructor(routeDataService: RouteDataService, private formula1CdsService: Formula1CdsService, private cdsPushProvider: CdsPushProvider, private cdsClientService: CdsClientService, private errorService: ErrorService) {
    let queryParams = routeDataService.getQueryParams();
    this.fixtureId = queryParams['eventId'];
    this.marketIds = queryParams['marketIds'];
    this.gameIds = queryParams['marketIds'];

  }

  ngOnInit(): void {
    this.formula1CdsService.getFormula1CdsContent(this.fixtureId, '', this.gameIds);

    this.formula1CdsService.formula1CdsContent$.pipe(
      tap((result) => {
        if (!!result && result?.racerList?.length > 0) {
          this.formula1CDSContent = result;
          this.topics = this.cdsClientService.getSubscriptionRequestForFixtureView(this.formula1CdsService.fixtureData);
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
        this.formula1CDSContent = this.formula1CdsService.getUpdatedFormula1CdsContent(result);
      })
  }

}
