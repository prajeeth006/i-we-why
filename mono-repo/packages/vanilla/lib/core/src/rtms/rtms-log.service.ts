import { Injectable } from '@angular/core';

import { LogService } from '@rtms/client';
import { capitalize } from 'lodash-es';

import { Logger } from '../logging/logger';
import { LogType } from '../logging/logging.models';
import { RemoteLogger } from '../logging/remote-logger';
import { RtmsConfig } from './rtms.client-config';

@Injectable({
    providedIn: 'root',
})
export class RtmsLogService implements LogService {
    constructor(
        private log: Logger,
        private remoteLogger: RemoteLogger,
        private rtmsConfig: RtmsConfig,
    ) {}

    debug(message: string, ...rest: any[]) {
        this.logWithTrace('debug', message, ...rest);
    }

    info(message: string, ...rest: any[]) {
        this.logWithTrace('info', message, ...rest);
    }

    warn(message: string, ...rest: any[]) {
        this.logWithTrace('warn', message, ...rest);
    }

    error(message: string, ...rest: any[]) {
        this.logWithTrace('error', message, ...rest);
    }

    private logWithTrace(level: 'debug' | 'info' | 'warn' | 'error', message: any, ...rest: any[]) {
        this.log[level](message, ...rest);

        if (!new RegExp(this.rtmsConfig.tracingBlacklistPattern).test(message)) {
            if (this.rtmsConfig.remoteLogLevels.some((o) => o.toLowerCase() === level)) {
                const logType = capitalize(level);
                this.remoteLogger.log(message, logType);
            } else {
                if (this.rtmsConfig.tracingEnabled) {
                    this.remoteLogger.log(message, LogType.Trace);
                }
            }
        }
    }
}
