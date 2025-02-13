import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteDataService {

  constructor(private activatedRoute: ActivatedRoute) { }

  getQueryParams(){
    return this.activatedRoute.snapshot.queryParams;
  }
}