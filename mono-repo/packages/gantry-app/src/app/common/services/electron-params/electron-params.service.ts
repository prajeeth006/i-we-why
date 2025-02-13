import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';

import { Log, LogType, LoggerService } from '../logger.service';
import { RouteDataService } from '../route-data.service';

@Injectable({
    providedIn: 'root',
})
export class ElectronParamsService {
    constructor(
        private routeDataService: RouteDataService,
        private loggerService: LoggerService,
        private cookieService: CookieService,
    ) {}

    addParams(url: string, authenticationKey: string): string {
        const updatedElectronUrl = this.addParamAddedByElectron(url);
        if (authenticationKey) {
            const updatedUrl = this.authenticateUrl(updatedElectronUrl, authenticationKey);
            return updatedUrl;
        }
        return updatedElectronUrl;
    }

    authenticateUrl(url: string, authenticationKey: string) {
        const authenticatedUrl = new URL(url);
        authenticatedUrl.searchParams.set('api-key', authenticationKey);
        return authenticatedUrl.toString();
    }

    addParamAddedByElectron(url: string): string {
        try {
            const updatedUrl = new URL(url);
            const queryparams = this.routeDataService.getQueryParams();
            const traceId = this.cookieService.get('X-ENT-1-TraceId');
            const viewId = this.cookieService.get('viewId');
            const viewGroup = this.cookieService.get('viewGroup');
            const sId = queryparams['sId'];
            const dId = queryparams['dId'];
            const bId = queryparams['bId'];

            if (sId) {
                updatedUrl.searchParams.set('sId', sId);
            }
            if (dId) {
                updatedUrl.searchParams.set('dId', dId);
            }
            if (bId) {
                updatedUrl.searchParams.set('bId', bId);
            }
            if (traceId) {
                updatedUrl.searchParams.set('traceId', traceId);
            }
            if (viewId) {
                updatedUrl.searchParams.set('viewId', viewId);
            }
            if (viewGroup) {
                updatedUrl.searchParams.set('viewGroup', viewGroup);
            }

            return updatedUrl.toString();
        } catch (e) {
            const errorLog: Log = {
                level: LogType.Error,
                message: 'Could not able to add params added by electron because: ' + e.message,
                status: 'NA',
                fatal: false,
            };
            this.loggerService.log(errorLog);
            return url;
        }
    }
}
