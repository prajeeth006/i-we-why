import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { RouteDataService } from "src/app/common/services/route-data.service";
import { FootballContent } from '../../models/football.model';
import { FootballService } from "../../services/football.service";
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { catchError, EMPTY, tap } from "rxjs";

@Component({
  selector: 'gn-foot-ball-template',
  templateUrl: './foot-ball-template.component.html',
  styleUrls: ['./foot-ball-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class FootBallTemplateComponent {

  isNFLPage: boolean = false;
  isRugbyPage: boolean = false;

  constructor(private routeDataService: RouteDataService,
    private footballService: FootballService) {
    let queryParams = this.routeDataService.getQueryParams();
    let eventId = queryParams['eventId'];
    let marketIds = queryParams['marketIds'];
    this.footballService.setEvenKeyAndMarketKeys(eventId, marketIds);

    switch (this.routeDataService.getDifferentialPath()) {
      case "NFL":
        this.isNFLPage = true;
        break;
      case "RUGBY":
        this.isRugbyPage = true;
        break;
      default:
        this.isNFLPage = false;
        this.isRugbyPage = false;
    }
  }

  errorMessage$ = this.footballService.errorMessage$;

  vm$ = this.footballService.data$
    .pipe(
      tap((footballContent: FootballContent) => {
        JSON.stringify(footballContent, JsonStringifyHelper.replacer);
      }),
      catchError(err => {
        return EMPTY;
      })
    );




}
