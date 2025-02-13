import { Component, OnInit } from '@angular/core';
import { RouteDataService } from '../../../common/services/route-data.service';
import { StaticPromotionService } from '../../services/static-promotion.service';
import { WindowHelper } from '../../../common/helpers/window-helper/window-helper';
import { ErrorService } from 'src/app/common/services/error.service';

@Component({
  selector: 'gn-static-promotion',
  templateUrl: './static-promotion.component.html',
  styleUrls: ['./static-promotion.component.scss']
})
export class StaticPromotionComponent implements OnInit {

  data: any;

  errorMessage$ = this.staticPromotionService.errorMessage$;

  constructor(private routeDataService: RouteDataService,
    private staticPromotionService: StaticPromotionService,
    private _windowHelper: WindowHelper, private errorService: ErrorService) {
    this.getHorseRacingContent();
  }


  getHorseRacingContent() {
    let queryParams = this.routeDataService.getQueryParams();

    if (queryParams && !!queryParams['itemIdOrPath']) {
      this.staticPromotionService.getHorseRacingContent(queryParams).subscribe((data: any) => {
        this._windowHelper.raiseEventToElectron()
        if (!!data) {
          this.data = data;
          this.errorService.isStaleDataAvailable = true;
          this.errorService.unSetError();
        }

      })
    }
    else {
      this.errorService.logError(`Couldn't find itemIdOrPath in url, Please check itemId passed in URL present in sitecore or not.`);
    }
  }

  ngOnInit(): void {
    console.log("ngOnInit");
  }

  ngOnChanges() {
    console.log("ngOnChanges");
  }

  ngDoCheck() {
    console.log("ngDoCheck");
  }

  ngAfterContentInit() {
    console.log("ngAfterContentInit");
  }

  ngAfterContentChecked() {
    console.log("ngAfterContentChecked");
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
  }

  ngAfterViewChecked() {
    console.log("ngAfterViewChecked");
  }

  ngOnDestroy() {
    console.log("ngOnDestroy");
  }

}
