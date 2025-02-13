import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScContextService {

  context$ = new ReplaySubject(1);
  contextUrl = '/sitecore/api/ssc/sci/context/-/getcontext?sc_site=shell';

  constructor(private httpClient:HttpClient) {
    this.load();
  }

  load() {
    this.httpClient.get(this.contextUrl)
      .subscribe((response)=>{
        this.context$.next(response)
      },
      (error)=>{
        this.context$.next({})
      })
  }
}
