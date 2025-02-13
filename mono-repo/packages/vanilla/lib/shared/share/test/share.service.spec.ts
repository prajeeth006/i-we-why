import { TestBed } from '@angular/core/testing';

import { NativeEventType, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { ShareService } from '../src/share.service';

describe('ShareService', () => {
    let service: ShareService;
    let windowMock: WindowMock;
    let deviceServiceMock: DeviceServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;

    beforeEach(() => {
        windowMock = new WindowMock();
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                ShareService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(ShareService);
    });

    describe('share', () => {
        it('should send event to native app when android wrapper', async () => {
            deviceServiceMock.isAndroid = true;
            nativeAppServiceMock.isNativeWrapper = true;
            const data: ShareData = { title: 'test', text: 'test' };

            const result = await service.share(data);

            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledOnceWith({ eventName: NativeEventType.SHARE, parameters: data });
            expect(result).toBeTrue();
        });

        it('should return true if sharing was successful', async () => {
            const data: ShareData = { title: 'test', text: 'test' };

            const result = await service.share(data);

            expect(windowMock.navigator.share).toHaveBeenCalledOnceWith(data);
            expect(result).toBeTrue();
        });

        it('should return false if sharing was not successful', async () => {
            windowMock.navigator.share.and.throwError('error');

            const result = await service.share({ title: 'test', text: 'test' });

            expect(result).toBeFalse();
        });
    });
});
