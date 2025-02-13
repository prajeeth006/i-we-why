import { Injectable } from "@angular/core";
import { CommonService } from "../../tree-view/services/common-service/common.service";
import { FilterEvents } from "../model/filter-events.enum";
import { FilterRacingCategories } from "../model/filter-racingcategories.enum";

@Injectable({
  providedIn: 'root'
})
export class FilterRacingSportsTabNodesService {
  constructor(private commonService: CommonService) { }

  public getFilterBasedOnSelection(event:any,filters: any) {
    this.commonService.filterRacingEventVal && filters ? filters.dateFrom = this.commonService.filterRacingEventVal : FilterEvents.Next15;
    this.commonService.filterRacingCategoryValue && filters ? filters.racingCategoryFilter = this.commonService.filterRacingCategoryValue : FilterRacingCategories.Horses;

    filters.isHorses =(event?.categoryCode) ? ((event?.categoryCode?.toLowerCase() == FilterRacingCategories.Horses.toLowerCase()) ? true:false):
      (filters.racingCategoryFilter.toLowerCase() == FilterRacingCategories.Horses.toLowerCase()) ? true:false;
    filters.isGreyHounds = (event?.categoryCode) ?((event?.categoryCode?.toLowerCase() == FilterRacingCategories.GreyHounds.toLowerCase()) ? true:false)
      :(filters.racingCategoryFilter.toLowerCase() == FilterRacingCategories.GreyHounds.toLowerCase()) ? true:false;
    filters.isVirtual = (filters.racingCategoryFilter.toLowerCase() == FilterRacingCategories.Virtuals.toLowerCase()) ? true:false;
    filters.isOutRight = this.commonService.filterIsOutRightVal;

    if (filters?.dateFrom.toLowerCase() == FilterEvents.AntePost.toLowerCase()) {
      filters.antePost = true;
    }
    else
    {
      filters.antePost = false;
    }
    return filters;
  }
}
