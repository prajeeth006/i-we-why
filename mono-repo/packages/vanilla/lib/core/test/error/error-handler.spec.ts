import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { defaultRemoteLogger } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { capturedExceptions } from '../../../test/test-utils';
import { VanillaErrorHandler, installErrorHandler } from '../../src/error/error-handler';
import { RemoteLoggerMock } from '../utils/remote-logger.mock';

describe('ErrorHandler', () => {
    let errorHandler: ErrorHandler;
    let remoteLoggerMock: RemoteLoggerMock;
    let consoleSpy: jasmine.Spy;

    beforeEach(() => {
        remoteLoggerMock = MockContext.useMock(RemoteLoggerMock);
        consoleSpy = spyOn(console, 'error');

        TestBed.configureTestingModule({
            providers: [MockContext.providers, { provide: ErrorHandler, useClass: VanillaErrorHandler }],
        });

        errorHandler = TestBed.inject(ErrorHandler);
    });

    it('should log errors to console and to the server', () => {
        errorHandler.handleError(capturedExceptions['chrome_27']);

        expect(remoteLoggerMock.logError).toHaveBeenCalledWith(capturedExceptions['chrome_27']);
        expect(consoleSpy).toHaveBeenCalled();
    });
});

describe('window.onerror handler', () => {
    let defaultRemoteLoggerSpy: jasmine.Spy;

    beforeEach(() => {
        installErrorHandler();
        defaultRemoteLoggerSpy = spyOn(defaultRemoteLogger, 'logError');
    });

    it('should log error to the server', () => {
        const cb = window.onerror!;
        cb('msg', 'fn', 1, 2, capturedExceptions['chrome_27']);

        expect(defaultRemoteLoggerSpy).toHaveBeenCalledWith({
            message: 'msg',
            sourceURL: 'fn',
            lineNumber: 1,
            columnNumber: 2,
            stack: capturedExceptions['chrome_27'].stack,
        });
    });

    it('should not include stack if error is not specified', () => {
        window.onerror!('msg', 'fn', 1, 2, undefined);

        expect(defaultRemoteLoggerSpy).toHaveBeenCalledWith({
            message: 'msg',
            sourceURL: 'fn',
            lineNumber: 1,
            columnNumber: 2,
        });
    });
});
