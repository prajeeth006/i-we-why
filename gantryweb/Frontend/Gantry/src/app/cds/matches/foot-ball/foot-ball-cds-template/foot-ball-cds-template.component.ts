import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FootBallCdsTemplateResult } from './models/foot-ball-cds-template.model';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { FootBallCdsTemplateService } from './services/foot-ball-cds-template.service';
import { CdsPushProvider } from 'src/app/common/cds-client/cds-client-push.provider';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';

@Component({
  selector: 'gn-foot-ball-cds-template',
  templateUrl: './foot-ball-cds-template.component.html',
  styleUrls: ['./foot-ball-cds-template.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FootBallCdsTemplateComponent implements OnInit {
  errorMessage$ = this.footBallCdsTemplateService.errorMessage$;

  footBallCDSContent: FootBallCdsTemplateResult = new FootBallCdsTemplateResult();
  updatedFixture: FixtureView;
  fixtureId: any; marketIds: any; gameIds: any;
  constructor(routeDataService: RouteDataService, private footBallCdsTemplateService: FootBallCdsTemplateService, private cdsPushProvider: CdsPushProvider, private cdsClientService: CdsClientService) {
    let queryParams = routeDataService.getQueryParams();
    this.fixtureId = "2:" + queryParams['eventId'];
    this.marketIds = queryParams['marketIds'];
    this.gameIds = queryParams['marketIds'];
  }

  ngOnInit(): void {
    this.footBallCdsTemplateService.GetFootBallCdsContent(this.fixtureId, this.marketIds, "");
    this.footBallCdsTemplateService.footBallCdsContent$.subscribe(
      (result) => {
        this.footBallCDSContent = result;
        const topics = this.cdsClientService.getSubscriptionRequestForFixtureView(this.footBallCdsTemplateService.fixtureData);
        this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
          if (isConnection) {
            this.cdsPushProvider.subscribe(topics);
          }
        });
      }
    );

    this.cdsPushProvider.messageReceived$.subscribe(
      (result) => {
        this.footBallCDSContent = { ...this.footBallCdsTemplateService.GetUpdatedFootBallCdsContent(result) };
      })
  }

}
