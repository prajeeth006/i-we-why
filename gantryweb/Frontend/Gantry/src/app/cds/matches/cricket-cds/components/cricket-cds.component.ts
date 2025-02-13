import { Component, OnInit } from '@angular/core';
import { CricketCdsTemplateResult } from '../models/cricket-cds-template.model';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { CricketCdsService } from '../services/cricket-cds.service';
import { CdsPushProvider } from 'src/app/common/cds-client/cds-client-push.provider';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';

@Component({
  selector: 'gn-cricket-cds',
  templateUrl: './cricket-cds.component.html',
  styleUrls: ['./cricket-cds.component.scss']
})
export class CricketCdsComponent implements OnInit {
  errorMessage$ = this.cricketCdsService.errorMessage$;

  cricketCDSContent: CricketCdsTemplateResult = new CricketCdsTemplateResult();
  updatedFixture: FixtureView;
  fixtureId: any; marketIds: any; gameIds: any;
  constructor(routeDataService: RouteDataService, private cricketCdsService: CricketCdsService, private cdsPushProvider: CdsPushProvider, private cdsClientService: CdsClientService) {
    let queryParams = routeDataService.getQueryParams();
    this.fixtureId = queryParams['eventId'];
    this.marketIds = queryParams['marketIds'];
    this.gameIds = queryParams['marketIds'];
  }

  ngOnInit(): void {
    this.cricketCdsService.GetCricketCdsContent(this.fixtureId, '', this.gameIds);
    this.cricketCdsService.cricketCdsContent$.subscribe(
      (result) => {
        this.cricketCDSContent = result;
        const topics = this.cdsClientService.getSubscriptionRequestForFixtureView(this.cricketCdsService.fixtureData);
        this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
          if (isConnection) {
            this.cdsPushProvider.subscribe(topics);
          }
        });
      }
    );

    this.cdsPushProvider.messageReceived$.subscribe(
      (result) => {
        this.cricketCDSContent = { ...this.cricketCdsService.GetUpdatedCricketCdsContent(result) };
      })
  }
}
