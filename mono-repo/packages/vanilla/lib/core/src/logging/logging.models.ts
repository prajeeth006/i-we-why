/**
 * @whatItDoes Identifies log type for simple remote log messages. See {@link RemoteLogger}.
 *
 * @stable
 */
export enum LogType {
    Error = 'Error',
    Warning = 'Warn',
    Info = 'Info',
    Trace = 'Trace',
}

export enum LogLevel {
    Debug = 'Debug',
    Info = 'Info',
    Warn = 'Warn',
    Error = 'Error',
}

export class RemoteLogData {
    time: number;
    message: string;
    name: string;
    description: string;
    stack: string;
    stacktrace: string;
    sourceURL: string;
    line: number;
    number: number;
    lineNumber: number;
    columnNumber: string;
    fileName: string;
    arguments: string;
    source: string;
    type: string;
    occurrences: number = 1;

    static fromArgs(message: string, type: any): RemoteLogData {
        const data = new RemoteLogData();

        data.time = Date.now();
        data.message = message;
        data.type = type;

        return data;
    }

    static fromError(error: any): RemoteLogData {
        const data = new RemoteLogData();

        data.time = Date.now();
        data.message = error.message;
        data.name = error.name;
        data.description = error.description;
        data.stack = error.stack;
        data.stacktrace = error.stacktrace;
        data.sourceURL = error.sourceURL;
        data.line = error.line;
        data.number = error.number;
        data.lineNumber = error.lineNumber;
        data.columnNumber = error.columnNumber;
        data.fileName = error.fileName;

        if (error.arguments instanceof Array) {
            data.arguments = error.arguments.toString();
        } else {
            data.arguments = error.arguments;
        }

        if (typeof error.toSource === 'function') {
            data.source = error.toSource();
        }

        return data;
    }
}

export interface RemoteLoggerOptions {
    debounceInterval?: number | undefined; // Optional undefined
    maxErrorsPerBatch?: number | undefined; // Optional undefined
    isEnabled: boolean;
    url: string;
    disableLogLevels?: { [key: string]: RegExp | null };
}
