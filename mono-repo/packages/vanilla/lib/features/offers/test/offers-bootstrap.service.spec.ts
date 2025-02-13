import { TestBed } from '@angular/core/testing';

import { MENU_COUNTERS_PROVIDER, UserLoginEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MenuCounterProviderMock, MenuCountersServiceMock } from '../../../core/test/menus/menu-counters.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { OffersConfigMock, OffersServiceMock } from '../../../shared/offers/test/offers.mocks';
import { OffersBootstrapService } from '../src/offers-bootstrap.service';

describe('OffersBootstrapService', () => {
    let service: OffersBootstrapService;
    let userServiceMock: UserServiceMock;
    let offersServiceMock: OffersServiceMock;
    let offersConfigMock: OffersConfigMock;
    let menuCountersServiceMock: MenuCountersServiceMock;
    let hookMock: MenuCounterProviderMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        offersServiceMock = MockContext.useMock(OffersServiceMock);
        offersConfigMock = MockContext.useMock(OffersConfigMock);
        menuCountersServiceMock = MockContext.useMock(MenuCountersServiceMock);
        hookMock = MockContext.createMock(MenuCounterProviderMock);

        TestBed.configureTestingModule({
            providers: [OffersBootstrapService, MockContext.providers, { provide: MENU_COUNTERS_PROVIDER, useValue: hookMock, multi: true }],
        });
    });

    beforeEach(() => {
        userServiceMock.isAuthenticated = true;
        offersConfigMock.updateInterval = 60000;
        service = TestBed.inject(OffersBootstrapService);
        service.onFeatureInit();
        offersConfigMock.whenReady.next();
    });

    describe('on UserLoginEvent', () => {
        it('should init', () => {
            userServiceMock.triggerEvent(UserLoginEvent);
            expect(menuCountersServiceMock.registerProviders).toHaveBeenCalledWith([hookMock]);
            expect(offersServiceMock.initPolling).toHaveBeenCalledWith(60000);
        });
    });
});
