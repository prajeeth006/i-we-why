import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { ContentItemPaths, SportName } from '../../common/models/sport-content/sport-content-parameters.constants';
import { RouteDataService } from '../../common/services/route-data.service';
import { SportContentService } from '../../common/services/sport-content/sport-content.service';

@Injectable({
    providedIn: 'root',
})
export class FootballContentService {
    data$ = this.sportContentService.getContent(this.getContentItemPath());

    public content = new BehaviorSubject<any>(null);
    //data$ = this.content.asObservable();

    constructor(
        private routeDataService: RouteDataService,
        private sportContentService: SportContentService,
    ) {}

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
