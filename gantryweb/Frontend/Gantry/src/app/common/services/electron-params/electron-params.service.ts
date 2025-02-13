import { Injectable } from '@angular/core';
import { Log, LoggerService, LogType } from '../logger.service';
import { RouteDataService } from '../route-data.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ElectronParamsService {

  constructor(private routeDataService: RouteDataService, private loggerService: LoggerService, private cookieService: CookieService) { }

  addParams(url: string, authenticationKey : string): string {
    let updatedElectronUrl = this.addParamAddedByElectron(url);
    if(!!authenticationKey){
      let updatedUrl = this.authenticateUrl(updatedElectronUrl, authenticationKey);
      return updatedUrl;
    }
    return updatedElectronUrl;
  }

  authenticateUrl(url: string, authenticationKey: string) {
    let authenticatedUrl = new URL(url);
    authenticatedUrl.searchParams.set('api-key', authenticationKey);
    return authenticatedUrl.toString();
  }

  addParamAddedByElectron(url: string): string {

    try {
      let updatedUrl = new URL(url);
      let queryparams = this.routeDataService.getQueryParams();
      let traceId = this.cookieService.get('X-ENT-1-TraceId');
      let viewId = this.cookieService.get('viewId');
      let viewGroup = this.cookieService.get('viewGroup');
      let sId = queryparams['sId'];
      let dId = queryparams['dId'];
      let bId = queryparams['bId'];

      if (!!sId) {
        updatedUrl.searchParams.set('sId', sId);
      }
      if (!!dId) {
        updatedUrl.searchParams.set('dId', dId);
      }
      if (!!bId) {
        updatedUrl.searchParams.set('bId', bId);
      }
      if (!!traceId) {
        updatedUrl.searchParams.set('traceId', traceId);
      }
      if (!!viewId) {
        updatedUrl.searchParams.set('viewId', viewId);
      }
      if (!!viewGroup) {
        updatedUrl.searchParams.set('viewGroup', viewGroup);
      }

      return updatedUrl.toString();

    } catch (e) {
      let errorLog: Log = {
        level: LogType.Error,
        message: 'Could not able to add params added by electron because: ' + e.message,
        status: 'NA',
        fatal: false
      }
      this.loggerService.log(errorLog)
      return url;
    }
  }
}
