import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/common/api.service';
import { NodeHideShow } from '../../models/node-hide-show';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IncludeExcludeNodeService {

  constructor(private apiService: ApiService) { }

  setIncludeExcludeNodeData(nodeHideShow: NodeHideShow): Observable<string> {
    return this.apiService.post('/sitecore/api/displayManager/nodeDataHideShow/setNodeDatahHideShow', nodeHideShow);
  }

  getIncludeExcludeNodeData(currentLabel: string): Observable<string> {
    let params = new HttpParams().append('currentLabel', currentLabel ?? '');
    return this.apiService.get('/sitecore/api/displayManager/nodeDataHideShow/getNodeDatahHideShow', params);
  }
}
