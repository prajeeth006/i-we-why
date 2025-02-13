import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FixtureView } from 'src/app/common/cds-client/models/fixture-view.model';
import { Observable } from 'rxjs';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { CdsPushProvider } from 'src/app/common/cds-client/cds-client-push.provider';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { OutRightCdsContent } from '../../models/outright-cds.model';
import { OutrightCdsService } from '../../service/outright-cds.service';

@Component({
  selector: 'gn-outright-tv1',
  templateUrl: './outright-tv1.component.html',
  styleUrls: ['./outright-tv1.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OutrightTv1Component implements OnInit {
  outRightCDSContent: OutRightCdsContent = new OutRightCdsContent();
  updatedFixture: FixtureView
  fixtureId: any; marketIds: any; gameIds: any;
  outRightCDSContent$: Observable<OutRightCdsContent>;
  errorMessage$ = this.outRightCdsService.errorMessage$;
  nameLength = SelectionNameLength.Seventeen;
  constructor(
    routeDataService: RouteDataService,
    private outRightCdsService: OutrightCdsService,
    private cdsPushProvider: CdsPushProvider,
    private cdsClientService: CdsClientService
  ) {
    let queryParams = routeDataService.getQueryParams();
    this.fixtureId = queryParams['eventId'];
    this.marketIds = queryParams['marketIds'];
    this.gameIds = queryParams['marketIds'];

  }

  ngOnInit(): void {
    this.outRightCdsService.GetOutRightCdsContent(this.fixtureId, '', this.gameIds);
    this.outRightCDSContent$ = this.outRightCdsService.outRightCDSContent$;
    this.outRightCdsService.outRightCDSContent$.subscribe(
      (result) => {
        this.outRightCDSContent = result;
        const topics = this.cdsClientService.getSubscriptionRequestForFixtureView(this.outRightCdsService.fixtureData);
        this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
          if (isConnection) {
            this.cdsPushProvider.subscribe(topics);
          }
        });
      }
    );

    this.cdsPushProvider.messageReceived$.subscribe(
      (result) => {
        this.outRightCDSContent = this.outRightCdsService.GetUpdatedOutRightCdsContent(result) ? { ...this.outRightCdsService.GetUpdatedOutRightCdsContent(result) } : null;
      })
  }
}
