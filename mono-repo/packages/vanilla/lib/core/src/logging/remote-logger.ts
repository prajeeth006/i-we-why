import { levenshtein } from './levenshtein';
import { LogType, RemoteLogData, RemoteLoggerOptions } from './logging.models';

/**
 * @whatItDoes Logs errors or messages to the server via api.
 *
 * @stable
 */
export class RemoteLogger {
    private static DebounceInterval: number = 2000;
    private static MaxErrorsPerBatch: number = 10;
    private static IsEnabled: boolean = true;
    private static url: string = '';
    private static disableLogLevels: { [key: string]: RegExp | null } = {};

    private queue: RemoteLogData[] = [];
    private timeoutId: NodeJS.Timeout | null;

    /**
     * @internal
     */
    static configure(options: RemoteLoggerOptions) {
        this.DebounceInterval = options.debounceInterval ?? this.DebounceInterval;
        this.MaxErrorsPerBatch = options.maxErrorsPerBatch ?? this.MaxErrorsPerBatch;
        this.IsEnabled = options.isEnabled;
        this.url = options.url;
        this.disableLogLevels = options.disableLogLevels ?? this.disableLogLevels;
    }

    /**
     * Logs an `Error` like object to the server. This is used by global error handlers.
     */
    logError(error: any, additionalMessage?: string) {
        if (!RemoteLogger.IsEnabled || this.shouldDisableLog(error, LogType.Error)) {
            return;
        }

        const errorData = error != null && typeof error === 'object' ? RemoteLogData.fromError(error) : RemoteLogData.fromArgs(error, LogType.Error);

        if (additionalMessage) {
            errorData.message = `${additionalMessage} - ${errorData.message}`;
        }

        const existingError = this.queue.find((e: RemoteLogData) => {
            if (e.message !== errorData.message) {
                return false;
            }

            if (errorData.stack) {
                return e.stack ? (levenshtein(e.stack, errorData.stack) / Math.max(e.stack.length, errorData.stack.length)) * 100 < 20 : false;
            }

            return !e.stack;
        });

        if (existingError) {
            existingError.occurrences += 1;
        } else {
            this.queue.push(errorData);
            this.sendLogs();
        }
    }

    /**
     * Logs a message to the server. Supported types are {@link LogType}.
     */
    log(message: string, type: string) {
        if (RemoteLogger.IsEnabled && !this.shouldDisableLog(message, type)) {
            this.queue.push(RemoteLogData.fromArgs(message, type));
            this.sendLogs();
        }
    }

    /* @internal */
    sendLogsWithBeacon() {
        if (this.queue.length) {
            const blob = new Blob([JSON.stringify(this.queue.slice(0, RemoteLogger.MaxErrorsPerBatch))], {
                type: 'application/json',
            });

            navigator.sendBeacon(RemoteLogger.url, blob);

            this.queue = [];
        }
    }

    private sendLogs() {
        if (this.timeoutId != null) {
            return;
        }

        this.timeoutId = setTimeout(() => {
            const errors = JSON.stringify(this.queue.slice(0, RemoteLogger.MaxErrorsPerBatch));

            fetch(RemoteLogger.url, {
                method: 'POST',
                body: errors,
                headers: {
                    'content-type': 'application/json',
                },
                credentials: 'include',
                keepalive: true,
            })
                .catch(() => {})
                .then(() => {
                    this.timeoutId = null;
                });

            this.queue = [];
        }, RemoteLogger.DebounceInterval);
    }

    private shouldDisableLog(message: string, type: string): boolean {
        const typeLowercase = type.toLowerCase();
        if (typeLowercase in RemoteLogger.disableLogLevels) {
            const regex = RemoteLogger.disableLogLevels[typeLowercase];
            return regex === null || (regex instanceof RegExp && regex.test(message));
        }
        return false;
    }
}

/**
 * {@link RemoteLogger} usable outside of angular.
 *
 * @stable
 */
export const defaultRemoteLogger = new RemoteLogger();
