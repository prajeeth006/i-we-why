import { Injectable, NgZone } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Log, LogType, LoggerService } from './logger.service';
import { RouteDataService } from './route-data.service';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    isStaleDataAvailable: boolean = false;
    isSnapshotDataAvailable: Map<string, boolean> = new Map<string, boolean>();
    private errorMessageSubject = new BehaviorSubject<string | null>(null);
    errorMessage$ = this.errorMessageSubject.asObservable();

    constructor(
        private _zone: NgZone,
        private loggerService: LoggerService,
        private routeDataService: RouteDataService,
    ) {}

    setError(err: string) {
        this.logErrorForBrandPage(err);
        this.errorMessageSubject.next(err);
    }

    unSetError() {
        this._zone.run(() => {
            if (!Array.from(this.isSnapshotDataAvailable.values()).includes(false)) {
                this.errorMessageSubject.next(null);
            }
        });
    }

    unSetErrorOnStaleDataAvailable() {
        if (this.isStaleDataAvailable) {
            this.unSetError();
        }
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

    logErrorForBrandPage(message: string, status: string = 'ShowingBrandImage', fatal: boolean = false, logType: LogType = LogType.Error) {
        const queryparams = this.routeDataService.getQueryParams();
        const sId = queryparams['sId'] ?? '';
        const dId = queryparams['dId'] ?? '';

        const logWarning: Log = {
            level: logType,
            message: 'ShowingBrandImage: ShopId : ' + sId + ' ScreenId : ' + dId + ' TemplateURL: ' + window.location.href + ' Reason: ' + message,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(logWarning);
    }
}
