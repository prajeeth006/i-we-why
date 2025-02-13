import { TestBed } from '@angular/core/testing';

import { capitalize } from 'lodash-es';
import { MockContext } from 'moxxi';

import { RtmsLogService } from '../../src/rtms/rtms-log.service';
import { LoggerMock } from '../languages/logger.mock';
import { RemoteLoggerMock } from '../utils/remote-logger.mock';
import { RtmsConfigMock } from './rtms-config.mock';

describe('RtmsLogService', () => {
    let service: RtmsLogService;
    let loggerMock: LoggerMock;
    let remoteLoggerMock: RemoteLoggerMock;
    let rtmsConfigMock: RtmsConfigMock;

    beforeEach(() => {
        loggerMock = MockContext.useMock(LoggerMock);
        remoteLoggerMock = MockContext.useMock(RemoteLoggerMock);
        rtmsConfigMock = MockContext.useMock(RtmsConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, RtmsLogService],
        });

        service = TestBed.inject(RtmsLogService);

        rtmsConfigMock.tracingBlacklistPattern = 'ping';
    });

    testLevel('debug', false, true);
    testLevel('info', false, true);
    testLevel('warn', false, true);
    testLevel('error', false, true);
    testLevel('warn', true, false, ['error', 'warn']);
    testLevel('error', true, false, ['error', 'warn']);
    testLevel('warn', false, true, ['error']);
    testLevel('error', false, true, ['warn']);

    function testLevel(level: string, remoteLog: boolean, remoteTrace: boolean, remoteLogLevels: string[] = []) {
        describe(level, () => {
            it('should call logger', () => {
                rtmsConfigMock.remoteLogLevels = remoteLogLevels;
                (service as any)[level]('a', 'b');

                expect((loggerMock as any)[level]).toHaveBeenCalledWith('a', 'b');
                if (remoteLog) {
                    expect(remoteLoggerMock.log).toHaveBeenCalledWith('a', capitalize(level));
                } else {
                    expect(remoteLoggerMock.log).not.toHaveBeenCalled();
                }
            });

            it(`should${remoteTrace ? '' : ' not'} call remote logger to trace if tracing is enabled`, () => {
                rtmsConfigMock.tracingEnabled = true;
                rtmsConfigMock.remoteLogLevels = remoteLogLevels;

                (service as any)[level]('a');

                if (remoteTrace) {
                    expect(remoteLoggerMock.log).toHaveBeenCalledWith('a', 'Trace');
                } else {
                    expect(remoteLoggerMock.log).not.toHaveBeenCalledWith(jasmine.anything(), 'Trace');
                }
            });

            if (remoteTrace) {
                it('should not trace blacklisted messages', () => {
                    rtmsConfigMock.tracingEnabled = true;

                    (service as any)[level]('ping');

                    expect(remoteLoggerMock.log).not.toHaveBeenCalled();
                });
            }
        });
    }
});
