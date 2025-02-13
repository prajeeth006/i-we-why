import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Log, LogType, LoggerService } from "./logger.service";
import { RouteDataService } from "./route-data.service";

@Injectable({
    providedIn: 'root'
})

export class ErrorService {
    isStaleDataAvailable: boolean = false;
    isSnapshotDataAvailable: Map<string, boolean> = new Map<string, boolean>();
    private errorMessageSubject = new BehaviorSubject<string>(null);
    errorMessage$ = this.errorMessageSubject.asObservable();

    constructor(
        private _zone: NgZone,
        private loggerService: LoggerService,
        private routeDataService: RouteDataService) {
    }

    setError(err: string) {
        this.logErrorForBrandPage(err);
        this.errorMessageSubject.next(err);
    }

    unSetError() {
        this._zone.run(() => {
            if(!Array.from(this.isSnapshotDataAvailable.values()).includes(false)){
                this.errorMessageSubject.next(null);
            }
        });
    }

    logError(err: string) {
        console.error(err);
        this.loggerService.logError(err);
        if (this.isStaleDataAvailable) {
            this.unSetError();
        } else {
            this.setError(err);
        }
    }


    logErrorForBrandPage( message: string, status: string = "ShowingBrandImage", fatal: boolean = false, logType: LogType = LogType.Error) {

        let queryparams = this.routeDataService.getQueryParams();
        let sId = queryparams['sId'] ?? '';
        let dId = queryparams['dId'] ?? '';

        let logWarning: Log = {
            level: logType,
            message: 'ShowingBrandImage: ShopId : ' + sId + ' ScreenId : ' + dId + ' TemplateURL: ' + window.location.href + ' Reason: ' + message,
            status: status,
            fatal: fatal
        };
        this.loggerService.log(logWarning);
    }
    
}