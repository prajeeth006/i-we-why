import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RouteDataService } from "./route-data.service";
import { CookieService } from 'ngx-cookie-service';

export enum LogType {
    Trace = 0,
    Debug = 1,
    Information = 2,
    Warning = 3,
    Error = 4,
    Critical = 5,
    None = 6
}

export class Log {
    message: string | any;
    level: LogType;
    status: string;
    fatal: boolean;
    screenId?: string;
    shopId?: string;
    stack?: string;
    traceId?: string;
    timeStampFromFrontendInBtc?: string;
}

@Injectable({
    providedIn: 'root'
})
export class LoggerService {

    constructor(private httpClient: HttpClient, private routeDataService: RouteDataService, private cookieService: CookieService) {
    }

    log(log: Log) {
        let queryparams = this.routeDataService.getQueryParams();
        let traceId = this.cookieService.get('X-ENT-1-TraceId');
        let sId = queryparams['sId'];
        let dId = queryparams['dId'];

        if (!!sId) {
            log.shopId = sId;
        }
        if (!!dId) {
            log.screenId = dId;
        }
        if (!!traceId) {
            log.traceId = traceId;
        }

        log.timeStampFromFrontendInBtc = new Date(new Date().toLocaleString('en-US', { timeZone: "Europe/London" })).toLocaleString();
        this.httpClient.post('/api/gantry/log', log).subscribe();
    }

    logError(e: any) {
        console.error(e);
        let error = "";
        if (typeof e === "string") {
            error = e;
        } else if (e instanceof Error) {
            try {
                error = JSON.stringify(e);
            } catch { }
        }

        let log: Log = {
            level: LogType.Error,
            message: `${error}`,
            status: 'NA',
            fatal: true
        };
        this.log(log);
    }
}

