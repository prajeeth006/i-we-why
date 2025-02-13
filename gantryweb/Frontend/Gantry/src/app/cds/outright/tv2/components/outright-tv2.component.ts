import { Component, OnInit } from '@angular/core';
import { CdsPushProvider } from 'src/app/common/cds-client/cds-client-push.provider';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { OutRightCdsContent } from '../../models/outright-cds.model';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { OutrightCdsTv2Service } from '../../service/outright-cds-tv2.service';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-outright-tv2',
  templateUrl: './outright-tv2.component.html',
  styleUrls: ['./outright-tv2.component.scss']
})
export class OutrightTv2Component implements OnInit {

  outRightCDSTv2Content: OutRightCdsContent = new OutRightCdsContent();
  updatedFixture: FixtureView
  fixtureId: any; marketIds: any; gameIds: any;
  errorMessage$ = this.outrightCdsTv2Service.errorMessage$;
  nameLength = SelectionNameLength.Seventeen;

  constructor(routeDataService: RouteDataService, private cdsPushProvider: CdsPushProvider, private cdsClientService: CdsClientService, private outrightCdsTv2Service: OutrightCdsTv2Service,) {
    let queryParams = routeDataService.getQueryParams();
    this.fixtureId = "2:" + queryParams['eventId'];
    this.marketIds = queryParams['marketIds'];
    this.gameIds = queryParams['marketIds'];
  }

  ngOnInit(): void {
    this.outrightCdsTv2Service.getOutRightCdsTv2Content(this.fixtureId, this.marketIds, "");
    this.outrightCdsTv2Service.outRightCDSTv2Content$.subscribe(
      (result) => {
        this.outRightCDSTv2Content = result;
        const topics = this.cdsClientService.getSubscriptionRequestForFixtureView(this.outrightCdsTv2Service.fixtureData);
        this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
          if (isConnection) {
            this.cdsPushProvider.subscribe(topics);
          }
        });
      }
    );

    this.cdsPushProvider.messageReceived$.subscribe(
      (result) => {
        this.outRightCDSTv2Content = { ...this.outrightCdsTv2Service.getUpdatedOutRightCdsTv2Content(result) };
      })
  }

}
