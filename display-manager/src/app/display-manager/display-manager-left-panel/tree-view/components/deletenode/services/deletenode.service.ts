import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/common/api.service';
import { MainTreeNode } from '../../../models/main-tree-node.model';

@Injectable({
  providedIn: 'root'
})
export class DeletenodeService {

  constructor(private apiService: ApiService) { }




  deleteAsset(node: MainTreeNode, currentLabel: string){
    let params = new HttpParams().append('Id', node?.nodeProperties?.id ?? '').append('label', currentLabel);
    return this.apiService.post<any>('/sitecore/api/displayManager/deleteAsset', params)
  }
}
