import { TestBed } from '@angular/core/testing';

import { DslRecorderService, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../src/browser/window/test/window-ref.mock';
import { RequestHeadersDslValuesProvider } from '../../../src/dsl/value-providers/request-headers-dsl-values-provider';

describe('RequestHeadersDslValuesProvider', () => {
    let provider: RequestHeadersDslValuesProvider;
    let windowMock: WindowMock;

    beforeEach(() => {
        windowMock = new WindowMock();

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                DslRecorderService,
                RequestHeadersDslValuesProvider,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        windowMock.navigator.userAgent = 'new user agent';
        provider = TestBed.inject(RequestHeadersDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
    });

    describe('UserAgent', () => {
        it('should return result of the list resolver', () => {
            const value = provider.getProviders()['RequestHeaders']!['UserAgent'];

            expect(value).toBe('new user agent');
        });
    });
});
