import { NativeAppService, NativeEvent } from '@frontend/vanilla/core';
import { MockService } from 'ng-mocks';
import { Observable, Subject } from 'rxjs';

export const NativeAppServiceMock = MockService(NativeAppService, {
    isNative: false,
    isNativeApp: false,
    isNativeWrapper: false,
    isNativeWrapperODR: false,
    isDownloadClient: false,
    isDownloadClientApp: false,
    isDownloadClientWrapper: false,
    product: 'UNKNOWN',
    context: 'default',
    applicationName: 'unknown',
    nativeScheme: 'bwin://',
    nativeMode: '',
    onReceivedEventFromNative: jest.fn(),
    sendToNative: jest.fn(),
    eventsFromNative: new Subject() as Observable<NativeEvent>,
    get isTerminal(): boolean {
        return false;
    },
});
