import { Component, OnInit } from '@angular/core';
import { RugbyCdsTemplateResult } from '../models/rugby-cds-template.model';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { RugbyCdsService } from '../services/rugby-cds.service';
import { CdsPushProvider } from 'src/app/common/cds-client/cds-client-push.provider';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';

@Component({
  selector: 'gn-rugby-cds',
  templateUrl: './rugby-cds.component.html',
  styleUrls: ['./rugby-cds.component.scss']
})
export class RubyCdsComponent implements OnInit{

  errorMessage$ = this.rugbyCdsService.errorMessage$;
  rugbyCDSContent: RugbyCdsTemplateResult = new RugbyCdsTemplateResult();
  updatedFixture: FixtureView;
  fixtureId: any; marketIds: any; gameIds: any;

  constructor(routeDataService: RouteDataService, private rugbyCdsService: RugbyCdsService, private cdsPushProvider: CdsPushProvider, private cdsClientService: CdsClientService) {
    let queryParams = routeDataService.getQueryParams();
    this.fixtureId = queryParams['eventId'];
    this.marketIds = queryParams['marketIds'];
    this.gameIds = queryParams['marketIds'];
  }
  ngOnInit(): void {
    this.rugbyCdsService.GetRugbyContent(this.fixtureId, '', this.gameIds);
    this.rugbyCdsService.rugbyCdsContent$.subscribe(
      (result) => {
        this.rugbyCDSContent = result;
        const topics = this.cdsClientService.getSubscriptionRequestForFixtureView(this.rugbyCdsService.fixtureData);
        this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
          if (isConnection) {
            this.cdsPushProvider.subscribe(topics);
          }
        });
      }
    );

    this.cdsPushProvider.messageReceived$.subscribe(
      (result) => {
        this.rugbyCDSContent = {...this.rugbyCdsService.GetUpdatedRugbyCdsContent(result)};
      })
  }

}
