import { TestBed } from '@angular/core/testing';

import { MENU_COUNTERS_PROVIDER, NativeEventType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { MenuCounterProviderMock, MenuCountersServiceMock } from '../../../core/test/menus/menu-counters.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { AccountMenuDataServiceMock } from '../../account-menu/test/account-menu-data.mock';
import { InboxBootstrapService } from '../src/inbox-bootstrap.service';
import { InboxCoreServiceMock, InboxServiceMock } from './inbox.mock';

describe('InboxBootstrapService', () => {
    let service: InboxBootstrapService;
    let nativeAppServiceMock: NativeAppServiceMock;
    let inboxCoreServiceMock: InboxCoreServiceMock;
    let inboxServiceMock: InboxServiceMock;
    let menuCountersServiceMock: MenuCountersServiceMock;
    let accountMenuServiceMock: AccountMenuDataServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let hookMock: MenuCounterProviderMock;

    beforeEach(() => {
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        menuCountersServiceMock = MockContext.useMock(MenuCountersServiceMock);
        accountMenuServiceMock = MockContext.useMock(AccountMenuDataServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        inboxServiceMock = MockContext.useMock(InboxServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        inboxCoreServiceMock = MockContext.useMock(InboxCoreServiceMock);
        hookMock = MockContext.createMock(MenuCounterProviderMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, InboxBootstrapService, { provide: MENU_COUNTERS_PROVIDER, useValue: hookMock, multi: true }],
        });

        service = TestBed.inject(InboxBootstrapService);

        inboxServiceMock.isEnabled = true;
    });

    describe('NotificationCount event', () => {
        beforeEach(() => {
            service.onFeatureInit();
        });

        it('should send inbox count', () => {
            inboxServiceMock.count.next(1);
            expect(menuCountersServiceMock.update).toHaveBeenCalled();
            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                eventName: NativeEventType.NotificationCount,
                parameters: { inbox: 1 },
            });
        });

        it('should init', () => {
            expect(inboxCoreServiceMock.set).toHaveBeenCalled();
            expect(menuCountersServiceMock.registerProviders).toHaveBeenCalledWith([hookMock]);
        });
    });

    it('should navigate back to account menu router url when inbox is closed', () => {
        service.onFeatureInit();

        accountMenuServiceMock.routerModeReturnUrl = 'rurl';

        inboxServiceMock.state.next({ isOpen: true });
        inboxServiceMock.state.next({ isOpen: false });

        expect(navigationServiceMock.goTo).toHaveBeenCalledWith('rurl');
    });

    it('should not navigate back to account menu router url when inbox is closed via back', () => {
        service.onFeatureInit();

        accountMenuServiceMock.routerModeReturnUrl = 'rurl';

        inboxServiceMock.state.next({ isOpen: true });
        inboxServiceMock.state.next({ isOpen: false, changeSource: 'back' });

        expect(navigationServiceMock.goTo).not.toHaveBeenCalled();
    });

    it('should not navigate back to account menu router url when inbox is closed and return url is not defined', () => {
        service.onFeatureInit();

        inboxServiceMock.state.next({ isOpen: true });
        inboxServiceMock.state.next({ isOpen: false });

        expect(navigationServiceMock.goTo).not.toHaveBeenCalled();
    });
});
