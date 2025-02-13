import { NativeAppService } from '@frontend/vanilla/core';
import { MockProvider, MockService } from 'ng-mocks';
import { of } from 'rxjs';

export const NativeAppServiceMock = () =>
    MockService(NativeAppService, {
        isNative: false,
        isNativeApp: false,
        isNativeWrapper: false,
        isNativeWrapperODR: false,
        isDownloadClient: false,
        isDownloadClientApp: false,
        isDownloadClientWrapper: false,
        isTerminal: false,
        product: 'UNKNOWN',
        context: 'default',
        applicationName: 'unknown',
        nativeScheme: 'bwin://',
        nativeMode: '',
        onReceivedEventFromNative: jest.fn(),
        sendToNative: jest.fn(),
        eventsFromNative: of(),
    });

export const NativeAppServiceProviderMock = () => MockProvider(NativeAppService, NativeAppServiceMock());
