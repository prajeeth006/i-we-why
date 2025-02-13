import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { ContentItemPaths, SportName } from 'src/app/common/models/sport-content/sport-content-parameters.constants';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';

@Injectable({
  providedIn: 'root'
})
export class FootballContentService {

  data$ = this.sportContentService.getContent(this.getContentItemPath());

  public content = new BehaviorSubject<any>(null);
  //data$ = this.content.asObservable();

  constructor(
    private routeDataService: RouteDataService,
    private sportContentService: SportContentService
  ) { }

  private getContentItemPath() {
    let contentItemPath: string;
    const differentialPath = this.routeDataService.getDifferentialPath();
    switch (differentialPath) {
      case SportName.FOOTBALL:
        contentItemPath = ContentItemPaths.footBall;
        break;
      case SportName.NFL:
        contentItemPath = ContentItemPaths.nfl;
        break;
      default:
        contentItemPath = ContentItemPaths.rugby;
    }

    return contentItemPath;
  }
}
