import { Injectable } from '@angular/core';

import { Page } from '../client-config/page.client-config';
import { LogLevel, LogType } from './logging.models';
import { defaultRemoteLogger } from './remote-logger';

/**
 * @whatItDoes Allows unit testing of logging to console. Similar to `$log` from AngularJS.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class Logger {
    constructor(private page: Page) {}

    debug(value: any, ...rest: any[]) {
        if (this.isEnabled(LogLevel.Debug)) {
            const santizedMessage = this.sanitizeMessage(value);
            // eslint-disable-next-line no-console
            console.debug(santizedMessage, ...rest);
        }
    }

    info(value: any, ...rest: any[]) {
        if (this.isEnabled(LogLevel.Info)) {
            const santizedMessage = this.sanitizeMessage(value);
            // eslint-disable-next-line no-console
            console.info(santizedMessage, ...rest);
        }
    }

    warn(value: any, ...rest: any[]) {
        if (this.isEnabled(LogLevel.Warn)) {
            const santizedMessage = this.sanitizeMessage(value);
            // eslint-disable-next-line no-console
            console.warn(santizedMessage, ...rest);
        }
    }

    error(value: any, ...rest: any[]) {
        if (this.isEnabled(LogLevel.Error)) {
            const santizedMessage = this.sanitizeMessage(value);
            // eslint-disable-next-line no-console
            console.error(santizedMessage, ...rest);
        }
    }

    errorRemote(message: string, error: any) {
        if (this.isEnabled(LogLevel.Error)) {
            const santizedMessage = this.sanitizeMessage(message);
            this.error(santizedMessage, error);
            defaultRemoteLogger.logError(error, santizedMessage);
        }
    }

    warnRemote(message: string) {
        if (this.isEnabled(LogLevel.Warn)) {
            const santizedMessage = this.sanitizeMessage(message);
            defaultRemoteLogger.log(santizedMessage, LogType.Warning);
        }
    }

    infoRemote(message: string) {
        if (this.isEnabled(LogLevel.Info)) {
            const santizedMessage = this.sanitizeMessage(message);
            defaultRemoteLogger.log(santizedMessage, LogType.Info);
        }
    }

    sanitizeMessage(message: string): string {
        if (message) {
            const regex = new RegExp(/password:[^,}\n]*([,}]?)/gi);
            return message.replace(regex, (_match, p1) => {
                return p1 === ',' ? '' : p1;
            });
        }

        return message;
    }

    private isEnabled(level: LogLevel): boolean {
        return level === LogLevel.Error || level === LogLevel.Warn || level === LogLevel.Info || !this.page.isProduction || this.page.isInternal;
    }
}
