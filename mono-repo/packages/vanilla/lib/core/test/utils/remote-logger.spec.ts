import { fakeAsync, tick } from '@angular/core/testing';

import { LogType, RemoteLogger } from '@frontend/vanilla/core';
import { clone } from 'lodash-es';

import { capturedExceptions } from '../../../test/test-utils';

describe('RemoteLogger', () => {
    let logger: RemoteLogger;
    let windowFetchSpy: jasmine.PromiseSpy;
    let originalFetch: any;

    beforeEach(() => {
        logger = new RemoteLogger();
        windowFetchSpy = jasmine.promise();
        originalFetch = window.fetch;
        window.fetch = windowFetchSpy;

        spyOn(window, 'alert');
        configure({});
    });

    afterEach(() => {
        window.fetch = originalFetch;
    });

    describe('logError()', () => {
        it('should log error to server after timeout', fakeAsync(() => {
            logger.logError(capturedExceptions['chrome_27']);
            expect(windowFetchSpy).not.toHaveBeenCalled();

            tick(2000);

            verifyExceptionsLogged([capturedExceptions['chrome_27']]);
        }));

        it('should handle string error', fakeAsync(() => {
            logger.logError('err');

            tick(2000);

            verifyExceptionsLogged([{ message: 'err', type: 'Error' }]);
        }));

        it('should handle empty null', fakeAsync(() => {
            logger.logError(null);

            tick(2000);

            verifyExceptionsLogged([{ message: null, type: 'Error' }]);
        }));

        it('should add additional message', fakeAsync(() => {
            logger.logError(capturedExceptions['chrome_27'], 'custom msg');
            expect(windowFetchSpy).not.toHaveBeenCalled();

            tick(2000);

            const errors: any[] = JSON.parse(windowFetchSpy.calls.mostRecent().args[1].body);

            expect(errors[0].message).toContain('custom msg');
        }));

        it('should batch exceptions within one interval', fakeAsync(() => {
            logger.logError(capturedExceptions['chrome_27']);
            tick(1000);

            expect(windowFetchSpy).not.toHaveBeenCalled();

            logger.logError(capturedExceptions['chrome_31_multiline_message']);
            tick(1000);

            verifyExceptionsLogged([capturedExceptions['chrome_27'], capturedExceptions['chrome_31_multiline_message']]);
            windowFetchSpy.resolve();
            tick();

            logger.logError(capturedExceptions['chrome_27']);

            tick(2000);
            verifyExceptionsLogged([capturedExceptions['chrome_27']]);

            windowFetchSpy.resolve();
        }));

        it('should swallow exceptions on fetch', fakeAsync(() => {
            logger.logError(capturedExceptions['chrome_27']);
            expect(windowFetchSpy).not.toHaveBeenCalled();

            tick(2000);

            windowFetchSpy.reject();
            tick();
        }));

        it('should map error properties from various exceptions', fakeAsync(() => {
            Object.keys(capturedExceptions).forEach((k) => {
                logger.logError(capturedExceptions[k]);
                tick(2000);
                verifyExceptionsLogged([capturedExceptions[k]]);
                windowFetchSpy.resolve();
                tick();
            });
        }));

        it('should not log if logging is not enabled', fakeAsync(() => {
            configure({ isEnabled: false });

            logger.logError(capturedExceptions['chrome_27']);

            tick(2000);

            expect(windowFetchSpy).not.toHaveBeenCalled();
        }));

        it('should only log configured amount of errors per call', fakeAsync(() => {
            configure({ maxErrorsPerBatch: 20 });

            const expected = [];

            for (let i = 0; i < 100; i++) {
                const err = clone(capturedExceptions['chrome_27']);
                err.message += i;
                logger.logError(err);
                if (i < 20) {
                    expected.push(err);
                }
            }

            tick(2000);

            verifyExceptionsLogged(expected);
        }));

        it('should group same errors', fakeAsync(() => {
            for (let i = 0; i < 100; i++) {
                logger.logError(capturedExceptions['chrome_27']);
            }

            tick(2000);

            const errors = verifyExceptionsLogged([capturedExceptions['chrome_27']]);
            expect(errors[0].occurrences).toBe(100);
        }));

        it('should group errors with same message and similar stack trace', fakeAsync(() => {
            const expected = [];

            for (let i = 0; i < 100; i++) {
                const err = clone(capturedExceptions['chrome_27']);
                err.stack += 'blablablablacasldl;askd;l' + i * i;
                logger.logError(err);
                if (i === 0) {
                    expected.push(err);
                }
            }

            tick(2000);

            const errors = verifyExceptionsLogged(expected);
            expect(errors[0].occurrences).toBe(100);
        }));

        it('should not group errors with same message and different stack trace', fakeAsync(() => {
            const err = clone(capturedExceptions['chrome_27']);
            err.stack = capturedExceptions['chrome_31_multiline_message'].stack;

            logger.logError(capturedExceptions['chrome_27']);
            logger.logError(err);

            tick(2000);

            const errors = verifyExceptionsLogged([capturedExceptions['chrome_27'], err]);
            expect(errors[0].occurrences).toBe(1);
            expect(errors[1].occurrences).toBe(1);
        }));

        it('should not group errors with same message and one having stack trace and the other does not', fakeAsync(() => {
            const err = clone(capturedExceptions['chrome_27']);
            err.stack = undefined;

            logger.logError(capturedExceptions['chrome_27']);
            logger.logError(err);

            tick(2000);

            const errors = verifyExceptionsLogged([capturedExceptions['chrome_27'], err]);
            expect(errors[0].occurrences).toBe(1);
            expect(errors[1].occurrences).toBe(1);
        }));

        it('should not group errors with same message and one not having stack trace and the other does', fakeAsync(() => {
            const err = clone(capturedExceptions['chrome_27']);
            err.stack = undefined;

            logger.logError(err);
            logger.logError(capturedExceptions['chrome_27']);

            tick(2000);

            const errors = verifyExceptionsLogged([err, capturedExceptions['chrome_27']]);
            expect(errors[0].occurrences).toBe(1);
            expect(errors[1].occurrences).toBe(1);
        }));

        it('should group errors with same message and no stacktrace', fakeAsync(() => {
            const err = clone(capturedExceptions['chrome_27']);
            err.stack = undefined;

            logger.logError(err);
            logger.logError(err);

            tick(2000);

            const errors = verifyExceptionsLogged([err]);
            expect(errors[0].occurrences).toBe(2);
        }));

        it('should not log when regex is null', fakeAsync(() => {
            configure({ disableLogLevels: { error: null } });

            logger.logError('error message');

            tick(2000);

            expect(windowFetchSpy).not.toHaveBeenCalled();
        }));

        it('should not log when regex match', fakeAsync(() => {
            configure({ disableLogLevels: { error: new RegExp('test') } });

            logger.logError('error test message');

            tick(2000);

            expect(windowFetchSpy).not.toHaveBeenCalled();
        }));

        it('should log when regex that does not match string test', fakeAsync(() => {
            configure({ disableLogLevels: { error: new RegExp('test') } });

            logger.logError('error message');

            tick(2000);

            verifyExceptionsLogged([{ message: 'error message', type: 'Error' }]);
        }));
    });

    describe('log()', () => {
        it('should log error message to server', fakeAsync(() => {
            logger.log('error message', LogType.Error);
            expect(windowFetchSpy).not.toHaveBeenCalled();

            tick(2000);

            verifyExceptionsLogged([{ message: 'error message', type: 'Error' }]);
        }));

        it('should log warning message to server', fakeAsync(() => {
            logger.log('warning message', LogType.Warning);
            expect(windowFetchSpy).not.toHaveBeenCalled();

            tick(2000);

            verifyExceptionsLogged([{ message: 'warning message', type: 'Warn' }]);
        }));

        it('should log info message to server', fakeAsync(() => {
            logger.log('info message', LogType.Info);
            expect(windowFetchSpy).not.toHaveBeenCalled();

            tick(2000);

            verifyExceptionsLogged([{ message: 'info message', type: 'Info' }]);
        }));

        it('should not log if logging is not enabled', fakeAsync(() => {
            configure({ isEnabled: false });

            logger.log('error message', LogType.Error);

            tick(2000);

            expect(windowFetchSpy).not.toHaveBeenCalled();
        }));

        it('should not log for lever error and regex that match any string', fakeAsync(() => {
            configure({ disableLogLevels: { error: null } });

            logger.log('error message', LogType.Error);

            tick(2000);

            expect(windowFetchSpy).not.toHaveBeenCalled();
        }));

        it('should not log for lever error and regex that match string test', fakeAsync(() => {
            configure({ disableLogLevels: { error: new RegExp('test') } });

            logger.log('error test message', LogType.Error);

            tick(2000);

            expect(windowFetchSpy).not.toHaveBeenCalled();
        }));

        it('should log for lever error and regex that does not match string test', fakeAsync(() => {
            configure({ disableLogLevels: { error: new RegExp('test') } });

            logger.log('error message', LogType.Error);

            tick(2000);

            verifyExceptionsLogged([{ message: 'error message', type: 'Error' }]);
        }));
    });

    describe('sendLogsWithBeacon', () => {
        it('should log error message to server', () => {
            const spy = spyOn(navigator, 'sendBeacon');

            logger.log('error message', LogType.Error);
            logger.sendLogsWithBeacon();

            expect(spy).toHaveBeenCalledWith('/log', jasmine.anything());
        });

        it('should not log error message to server is queue is empty', () => {
            const spy = spyOn(navigator, 'sendBeacon');

            logger.sendLogsWithBeacon();

            expect(spy).not.toHaveBeenCalled();
        });
    });

    function configure(options: {
        isEnabled?: boolean;
        debounceInterval?: number;
        maxErrorsPerBatch?: number;
        disableLogLevels?: { [key: string]: RegExp | null };
    }) {
        RemoteLogger.configure({
            isEnabled: options.isEnabled == null ? true : options.isEnabled,
            debounceInterval: options.debounceInterval == null ? 2000 : options.debounceInterval,
            maxErrorsPerBatch: options.maxErrorsPerBatch == null ? 10 : options.maxErrorsPerBatch,
            url: '/log',
            disableLogLevels: options.disableLogLevels == null ? {} : options.disableLogLevels,
        });
    }

    function verifyExceptionsLogged(expectedErrors: any[]) {
        expect(windowFetchSpy).toHaveBeenCalledWith(
            '/log',
            jasmine.objectContaining({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
            }),
        );

        const errors: any[] = JSON.parse(windowFetchSpy.calls.mostRecent().args[1].body);

        expect(errors.length).toBe(expectedErrors.length);

        for (let i = 0; i < errors.length; i++) {
            const error = errors[i];
            const expectedError = expectedErrors[i];

            Object.keys(error)
                .filter((k) => ['opera#sourceloc'].indexOf(k) === -1)
                .forEach((k) => {
                    if (k === 'time' || k === 'occurrences') {
                        expect(error[k]).toBeDefined();
                    } else if (k === 'arguments') {
                        expect(error[k]).toBe(expectedError[k].toString());
                    } else {
                        expect(error[k]).toBe(expectedError[k]);
                    }
                });
        }

        windowFetchSpy.calls.reset();

        return errors;
    }
});
