import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event, RacingEvents } from '../../tree-view/models/event.model';
import { ApiService } from 'src/app/common/api.service';
import { Filters, PrepareGantryPreviewAssetNewUrl, PrepareGantryUrl } from '../model/filters.model';
import { FilterRacingSportsTabNodesService } from './filter-racing-sports-tabnodes.service';

@Injectable({
  providedIn: 'root'
})
export class BaseTreeViewService {

  constructor(private apiService: ApiService, private filterTabNodes: FilterRacingSportsTabNodesService) { }


  getRacingTabNodes(currentLabel: string, event?: Event, filters?: Filters, includeRacingCategories: boolean = true): Observable<RacingEvents> {
    var filter = this.filterTabNodes.getFilterBasedOnSelection(event, filters);
    let tabFilter = {
      racingEvent: event,
      filter: filter
    }
    let params = new HttpParams().append('label', currentLabel).append('include', includeRacingCategories);

    return this.apiService.post<RacingEvents>('/sitecore/api/displayManager/getRacingTabNodes', tabFilter, params)

  }

  getUrl(url: string, ruleId: string | undefined): Observable<string> {
    return this.apiService.get(url + ruleId);
  }

  getGantryUrl(url: string, targetUrl: PrepareGantryUrl): Observable<string> {
    return this.apiService.post<string>(url, targetUrl)

  }
  getPreviewAssetGantryUrlNewModel(url: string, targetUrl: PrepareGantryPreviewAssetNewUrl): Observable<string> {
    return this.apiService.post<string>(url, targetUrl)

  }
}
