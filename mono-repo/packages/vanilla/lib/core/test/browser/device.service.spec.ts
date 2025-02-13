import { TestBed } from '@angular/core/testing';

import { DeviceService, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { DeviceConfigMock } from './device-config.mock';

describe('DeviceService', () => {
    let service: DeviceService;
    let windowMock: WindowMock;
    let deviceConfigMock: DeviceConfigMock;

    beforeEach(() => {
        deviceConfigMock = MockContext.useMock(DeviceConfigMock);
        windowMock = new WindowMock();

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                DeviceService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(DeviceService);
    });

    describe('IsAndroid', () => {
        it('should return value from config', () => {
            deviceConfigMock.isAndroid = true;

            expect(service.isAndroid).toBeTrue();
        });
    });

    describe('DeviceType', () => {
        it('should return device type desktop', () => {
            deviceConfigMock.isMobile = false;

            expect(service.deviceType).toBe('desktop');
        });
        it('should return device type tablet', () => {
            deviceConfigMock.isMobile = true;
            deviceConfigMock.isTablet = true;

            expect(service.deviceType).toBe('tablet');
        });
        it('should return device type phone', () => {
            deviceConfigMock.isMobile = true;

            expect(service.deviceType).toBe('phone');
        });
    });

    describe('isiOS()', () => {
        it('should be false when server returns false', () => {
            deviceConfigMock.isIOS = false;

            expect(service.isiOS).toBeFalse();
        });

        it('should be true when server returns true', () => {
            deviceConfigMock.isIOS = true;

            expect(service.isiOS).toBeTrue();
        });
    });

    describe('isChrome()', () => {
        it('should be false when user agent is not Chrome', () => {
            windowMock.navigator.userAgent =
                'Mozilla/5.0 (iPod; CPU iPod OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';

            expect(service.isChrome).toBeFalse();
        });

        it('should true when user agent is Chrome', () => {
            windowMock.navigator.userAgent =
                'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36';

            expect(service.isChrome).toBeTrue();
        });
    });

    describe('isNexus()', () => {
        it('should be false when user agent is not Chrome', () => {
            windowMock.navigator.userAgent =
                'Mozilla/5.0 (iPod; CPU iPod OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';

            expect(service.isNexus).toBeFalse();
        });

        it('should true when user agent is Chrome', () => {
            windowMock.navigator.userAgent =
                'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36';

            expect(service.isNexus).toBeTrue();
        });
    });

    describe('isMobile', () => {
        it('should return value from config', () => {
            deviceConfigMock.isMobile = true;

            expect(service.isMobile).toBeTrue();
        });
    });

    describe('isMobilePhone', () => {
        it('should return value from config', () => {
            deviceConfigMock.isMobilePhone = true;

            expect(service.isMobilePhone).toBeTrue();
        });
    });

    describe('oSName', () => {
        it('should return value from config', () => {
            deviceConfigMock.osName = 'space';

            expect(service.osName).toBe('space');
        });
    });

    describe('oSVersion', () => {
        it('should return value from config', () => {
            deviceConfigMock.osVersion = 'last';

            expect(service.osVersion).toBe('last');
        });
    });

    describe('getCapability', () => {
        it('should return value from config', () => {
            deviceConfigMock.properties = {
                name: 'test',
                system: 'kupus',
            };

            expect(service.getCapability('system')).toBe('kupus');
        });
    });

    describe('vendor', () => {
        it('should return value from config', () => {
            deviceConfigMock.vendor = 'least';

            expect(service.vendor).toBe('least');
        });
    });

    for (const value of [true, false]) {
        it(`isTablet should return ${value} value from config`, () => {
            deviceConfigMock.isTablet = value;

            expect(service.isTablet).toBe(value);
        });

        it(`isTouch should return ${value} value from config`, () => {
            deviceConfigMock.isTouch = value;

            expect(service.isTouch).toBe(value);
        });

        it(`isRobot should return ${value} value from config`, () => {
            deviceConfigMock.isRobot = value;

            expect(service.isRobot).toBe(value);
        });
    }

    describe('orientation', () => {
        let observableSpy: jasmine.Spy;

        beforeEach(() => {
            observableSpy = jasmine.createSpy('observableSpy');

            service.orientation.subscribe(observableSpy);
        });

        it("should return portrait if query doesn't match landscape", () => {
            expect(service.currentOrientation).toBe('portrait');
            expect(observableSpy).toHaveBeenCalledWith('portrait');
        });

        it('should emit an event if media query changes', () => {
            windowMock.matchMedia('(orientation: landscape)').matches = true;
            windowMock.matchMedia('(orientation: landscape)').listener();

            expect(service.currentOrientation).toBe('landscape');
            expect(observableSpy).toHaveBeenCalledWith('landscape');
        });

        it("should should not emit an event if orientation doesn't change", () => {
            observableSpy.calls.reset();

            windowMock.matchMedia('(orientation: landscape)').listener();

            expect(observableSpy).not.toHaveBeenCalled();
        });
    });

    describe('cpuMaxFrequency', () => {
        it('should return value from config', () => {
            deviceConfigMock.cpuMaxFrequency = '2GHz';

            expect(service.cpuMaxFrequency).toBe('2GHz');
        });
    });

    describe('cpuCores', () => {
        it('should return value from config', () => {
            deviceConfigMock.cpuCores = '4';

            expect(service.cpuCores).toBe('4');
        });
    });

    describe('totalRam', () => {
        it('should return value from config', () => {
            deviceConfigMock.totalRam = '12MB';

            expect(service.totalRam).toBe('12MB');
        });
    });

    describe('model', () => {
        it('should return value from config', () => {
            deviceConfigMock.model = 'Pixel 66';

            expect(service.model).toBe('Pixel 66');
        });
    });

    describe('displayWidth', () => {
        it('should return value from config', () => {
            deviceConfigMock.displayWidth = '66';

            expect(service.displayWidth).toBe('66');
        });
    });

    describe('displayHeight', () => {
        it('should return value from config', () => {
            deviceConfigMock.displayHeight = '66';

            expect(service.displayHeight).toBe('66');
        });
    });
});
