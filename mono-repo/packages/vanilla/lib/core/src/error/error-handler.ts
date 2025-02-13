import { ErrorHandler, Injectable } from '@angular/core';

import { RemoteLogger, defaultRemoteLogger } from '../logging/remote-logger';

@Injectable()
export class VanillaErrorHandler extends ErrorHandler {
    constructor(private remoteLogger: RemoteLogger) {
        super();
    }

    override handleError(error: any): void {
        this.remoteLogger.logError(error);
        super.handleError(error);
    }
}

export function installErrorHandler() {
    window.onerror = (message: string | Event, filename?: string, lineno?: number, colno?: number, error?: Error): void => {
        const errorData =
            message instanceof ErrorEvent
                ? {
                      message: message.message,
                      sourceURL: message.filename,
                      lineNumber: message.lineno,
                      columnNumber: message.colno,
                      ...(error?.stack ? { stack: error.stack } : {}),
                  }
                : {
                      message,
                      sourceURL: filename,
                      lineNumber: lineno,
                      columnNumber: colno,
                      ...(error?.stack ? { stack: error.stack } : {}),
                  };

        defaultRemoteLogger.logError(errorData);
    };
}

installErrorHandler();
