import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { AntePostDrawService } from './services/ante-post-draw.service';


@Component({
  selector: 'gn-ante-post-draw',
  templateUrl: './ante-post-draw.component.html',
  styleUrls: ['./ante-post-draw.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized)
  encapsulation: ViewEncapsulation.ShadowDom
})
export class GreyHoundRacingAntePostDrawComponent {
  private eventId: string;
  private marketId: string;

  errorMessage$ = this.antePostDrawService.errorMessage$;

  vm$ = this.antePostDrawService.data$;

  constructor(
    private routeDataService: RouteDataService,
    private antePostDrawService: AntePostDrawService) {
    let queryParams = this.routeDataService.getQueryParams();
    this.eventId = queryParams['eventId'];
    this.marketId = queryParams['marketId'];
    antePostDrawService.setEventMarketsList(this.eventId, this.marketId);
  }

}
