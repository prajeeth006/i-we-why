import { Component, OnInit } from '@angular/core';
import { DartCdsTemplateResult } from '../models/dart-cds-template.model';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { DartCdsService } from '../services/dart-cds.service';
import { CdsPushProvider } from 'src/app/common/cds-client/cds-client-push.provider';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';

@Component({
  selector: 'gn-dart-cds',
  templateUrl: './dart-cds.component.html',
  styleUrls: ['./dart-cds.component.scss']
})
export class DartCdsComponent implements OnInit{
  errorMessage$ = this.dartCdsService.errorMessage$;
  dartCDSContent: DartCdsTemplateResult = new DartCdsTemplateResult();
  updatedFixture: FixtureView;
  fixtureId: any; marketIds: any; gameIds: any;

  constructor(routeDataService: RouteDataService, private dartCdsService: DartCdsService, private cdsPushProvider: CdsPushProvider, private cdsClientService: CdsClientService) {
    let queryParams = routeDataService.getQueryParams();
    this.fixtureId = queryParams['eventId'];
    this.marketIds = queryParams['marketIds'];
    this.gameIds = queryParams['marketIds'];
  }

  ngOnInit(): void {
    this.dartCdsService.GetDartContent(this.fixtureId, '', this.gameIds);
    this.dartCdsService.dartCdsContent$.subscribe(
      (result) => {
        this.dartCDSContent = result;
        const topics = this.cdsClientService.getSubscriptionRequestForFixtureView(this.dartCdsService.fixtureData);
        this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
          if (isConnection) {
            this.cdsPushProvider.subscribe(topics);
          }
        });
      }
    );

    this.cdsPushProvider.messageReceived$.subscribe(
      (result) => {
        this.dartCDSContent = {...this.dartCdsService.GetUpdatedDartCdsContent(result)};
      })
  }
}
