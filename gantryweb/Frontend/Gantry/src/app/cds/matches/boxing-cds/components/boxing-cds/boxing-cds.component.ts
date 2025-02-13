import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BoxingCdsContent } from '../../models/boxing-cds-content.model';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { BoxingCdsService } from '../../services/boxing-cds.service';
import { CdsPushProvider } from 'src/app/common/cds-client/cds-client-push.provider';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'gn-boxing-cds',
  templateUrl: './boxing-cds.component.html',
  styleUrls: ['./boxing-cds.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BoxingCdsComponent implements OnInit {
  boxingCDSContent: BoxingCdsContent = new BoxingCdsContent();
  updatedFixture: FixtureView
  fixtureId: any; marketIds: any; gameIds: any;
  boxingCDSContent$: Observable<BoxingCdsContent>;
  errorMessage$ = this.boxingCdsService.errorMessage$;
  constructor(routeDataService: RouteDataService, private boxingCdsService: BoxingCdsService, private cdsPushProvider: CdsPushProvider, private cdsClientService: CdsClientService) {
    let queryParams = routeDataService.getQueryParams();
    this.fixtureId = queryParams['eventId'];
    this.marketIds = queryParams['marketIds'];
    this.gameIds = queryParams['marketIds'];

  }

  ngOnInit(): void {
    this.boxingCdsService.GetBoxingCdsContent(this.fixtureId, '', this.gameIds);
    this.boxingCDSContent$ = this.boxingCdsService.boxingCdsContent$;
    this.boxingCdsService.boxingCdsContent$.subscribe(
      (result) => {
        this.boxingCDSContent = result;
        const topics = this.cdsClientService.getSubscriptionRequestForFixtureView(this.boxingCdsService.fixtureData);
        this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
          if (isConnection) {
            this.cdsPushProvider.subscribe(topics);
          }
        });
      }
    );

    this.cdsPushProvider.messageReceived$.subscribe(
      (result) => {
        this.boxingCDSContent = {...this.boxingCdsService.GetUpdatedBoxingCdsContent(result)};
      })
  }

}
