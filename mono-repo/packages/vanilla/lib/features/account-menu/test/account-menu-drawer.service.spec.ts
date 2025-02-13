import { TestBed } from '@angular/core/testing';

import { BOTTOM_DRAWER_HEIGHT, DrawerPosition, DrawerPositionSettings } from '@frontend/vanilla/shared/account-menu';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { AccountMenuDrawerService } from '../src/account-menu-drawer.service';
import { AccountMenuTrackingServiceMock } from './account-menu-tracking.mock';

describe('AccountMenuDrawerService', () => {
    let service: AccountMenuDrawerService;
    let cookieServiceMock: CookieServiceMock;
    let accountMenuTrackingServiceMock: AccountMenuTrackingServiceMock;

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        accountMenuTrackingServiceMock = MockContext.useMock(AccountMenuTrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        service = TestBed.inject(AccountMenuDrawerService);
    });

    describe('setDrawerPosition', () => {
        it('should track, broadcast and store drawer position in the cookies', () => {
            const drawerPositionSpy = spyOn(service.drawerPosition, 'set');

            const positionSettings: DrawerPositionSettings = {
                position: DrawerPosition.Bottom,
                height: BOTTOM_DRAWER_HEIGHT,
                isAutomaticallyOpened: false,
            };

            service.setDrawerPosition(positionSettings);

            expect(drawerPositionSpy).toHaveBeenCalledOnceWith(positionSettings);
            expect(cookieServiceMock.putObject).toHaveBeenCalledOnceWith('vn-am-drawer', positionSettings);
            expect(accountMenuTrackingServiceMock.trackDrawer).toHaveBeenCalledOnceWith(positionSettings);
        });
    });

    describe('minimizeDrawer', () => {
        it('should minimize drawer', () => {
            const drawerPositionSpy = spyOn(service.drawerPosition, 'set');

            const positionSettings: DrawerPositionSettings = {
                position: DrawerPosition.Bottom,
                height: BOTTOM_DRAWER_HEIGHT,
                isAutomaticallyOpened: true,
            };

            service.minimizeDrawer();

            expect(drawerPositionSpy).toHaveBeenCalledOnceWith(positionSettings);
            expect(cookieServiceMock.putObject).toHaveBeenCalledOnceWith('vn-am-drawer', positionSettings);
            expect(accountMenuTrackingServiceMock.trackDrawer).toHaveBeenCalledOnceWith(positionSettings);
        });
    });

    describe('resetDrawer', () => {
        it('should broadcast reset drawer event', () => {
            const spy = jasmine.createSpy();
            service.resetDrawerPosition.subscribe(spy);

            service.resetDrawer();

            expect(spy).toHaveBeenCalled();
        });
    });
});
