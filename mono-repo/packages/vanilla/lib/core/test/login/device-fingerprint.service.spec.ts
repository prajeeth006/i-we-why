import { TestBed } from '@angular/core/testing';

import { DeviceFingerprintService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../browser/cookie.mock';
import { NativeAppServiceMock } from '../native-app/native-app.mock';

describe('DeviceFingerprintService', () => {
    let service: DeviceFingerprintService;
    let cookieServiceMock: CookieServiceMock;

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        MockContext.useMock(NativeAppServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DeviceFingerprintService],
        });

        service = TestBed.inject(DeviceFingerprintService);
    });

    describe('get', () => {
        it('should work', () => {
            const fingerprint = service.get();

            expect(fingerprint).toBeDefined();
            expect(fingerprint.deviceDetails?.['os']).not.toBeDefined();
        });

        it('should enrich with details from cookie', () => {
            cookieServiceMock.get.withArgs('superCookie').and.returnValue('superCookieValue');
            cookieServiceMock.get
                .withArgs('deviceDetails')
                .and.returnValue('{"os":"iOS","dm":"iPhone11","slno":"4A3D263C-A1B6-4671-9589-5D5C10581E09","osv":"13.5"}');

            const fingerprint = service.get();

            expect(fingerprint.deviceDetails?.['os']).toBe('iOS');
        });
    });

    describe('storeDeviceDetails', () => {
        it('should store device details', () => {
            service.storeDeviceDetails({ test: 'opa' });

            expect(cookieServiceMock.put).toHaveBeenCalledWith('deviceDetails', '{"test":"opa"}', { expires: jasmine.anything() });
        });
    });
});
