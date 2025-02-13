import { Component, OnInit } from '@angular/core';
import { SnookerCdsTemplateResult } from '../models/snooker-cds-template.model';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { SnookerCdsService } from '../services/snooker-cds.service';
import { CdsPushProvider } from 'src/app/common/cds-client/cds-client-push.provider';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';

@Component({
  selector: 'gn-snooker-cds',
  templateUrl: './snooker-cds.component.html',
  styleUrls: ['./snooker-cds.component.scss']
})
export class SnookerCdsComponent implements OnInit{
  errorMessage$ = this.snookerCdsService.errorMessage$;
  snookerCDSContent: SnookerCdsTemplateResult = new SnookerCdsTemplateResult();
  updatedFixture: FixtureView;
  fixtureId: any; marketIds: any; gameIds: any;

  constructor(routeDataService: RouteDataService, private snookerCdsService: SnookerCdsService, private cdsPushProvider: CdsPushProvider, private cdsClientService: CdsClientService) {
    let queryParams = routeDataService.getQueryParams();
    this.fixtureId = queryParams['eventId'];
    this.marketIds = queryParams['marketIds'];
    this.gameIds = queryParams['marketIds'];
  }

  ngOnInit(): void {
    this.snookerCdsService.GetSnookerContent(this.fixtureId, '', this.gameIds);
    this.snookerCdsService.snookerCdsContent$.subscribe(
      (result) => {
        this.snookerCDSContent = result;
        const topics = this.cdsClientService.getSubscriptionRequestForFixtureView(this.snookerCdsService.fixtureData);
        this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
          if (isConnection) {
            this.cdsPushProvider.subscribe(topics);
          }
        });
      }
    );

    this.cdsPushProvider.messageReceived$.subscribe(
      (result) => {
        this.snookerCDSContent = {...this.snookerCdsService.GetUpdatedSnookerCdsContent(result)};
      })
  }
}
