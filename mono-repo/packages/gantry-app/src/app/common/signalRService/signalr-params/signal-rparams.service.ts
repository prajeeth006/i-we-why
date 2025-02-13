import { Injectable } from '@angular/core';

import { Log, LogType, LoggerService } from '../../services/logger.service';

@Injectable({
    providedIn: 'root',
})
export class SignalRParamsService {
    constructor(private loggerService: LoggerService) {}
    addParams(signalRUrl: string, params: { [key: string]: any } = {}): string {
        try {
            const updatedUrl = new URL(signalRUrl);
            if (Object.keys(params).length > 0) {
                for (const key in params) {
                    updatedUrl.searchParams.set(key, params[key]);
                }
            }

            return updatedUrl.toString();
        } catch (e) {
            const errorLog: Log = {
                level: LogType.Error,
                message: 'Could not able to add params for SignalR URL because: ' + e.message,
                status: 'NA',
                fatal: false,
            };
            this.loggerService.log(errorLog);
            return signalRUrl;
        }
    }
}
