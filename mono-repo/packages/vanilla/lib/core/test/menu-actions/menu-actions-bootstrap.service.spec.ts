import { TestBed } from '@angular/core/testing';

import { QuerySearchParams, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../src/browser/window/test/window-ref.mock';
import { MenuActionsBootstrapService } from '../../src/menu-actions/menu-actions-bootstrap.service';
import { PageMock } from '../browsercommon/page.mock';
import { LoggerMock } from '../languages/logger.mock';
import { HomeServiceMock } from '../login/home-service.mock';
import { NativeAppServiceMock } from '../native-app/native-app.mock';
import { NavigationServiceMock, ParsedUrlMock } from '../navigation/navigation.mock';
import { UrlServiceMock } from '../navigation/url.mock';
import { UserServiceMock } from '../user/user.mock';
import { MenuActionsServiceMock } from './menu-actions.mock';

describe('MenuActionsBootstrapService', () => {
    let service: MenuActionsBootstrapService;
    let windowMock: WindowMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let urlServiceMock: UrlServiceMock;

    beforeEach(() => {
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        windowMock = new WindowMock();
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);
        MockContext.useMock(UserServiceMock);
        MockContext.useMock(HomeServiceMock);
        MockContext.useMock(PageMock);
        MockContext.useMock(LoggerMock);
        MockContext.useMock(NativeAppServiceMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                MenuActionsBootstrapService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(MenuActionsBootstrapService);
    });

    describe('run()', () => {
        beforeEach(() => {
            service.onAppInit();
        });

        describe('registered openInNewWindow action', () => {
            it('should open url in new window', () => {
                const openInNewWindow = getRegisteredCallback('openInNewWindow');

                openInNewWindow(undefined, 'url', 'target', { 'new-window-params': 'params' });

                expect(windowMock.open).toHaveBeenCalledWith('url', 'target', 'params');
            });

            it('should open url in new window with default target', () => {
                const openInNewWindow = getRegisteredCallback('openInNewWindow');

                openInNewWindow(undefined, 'url', undefined, {});

                expect(windowMock.open).toHaveBeenCalledWith('url', '_blank', undefined);
            });
        });

        describe('registered setQueryString action', () => {
            it('should set query string for the current URI', () => {
                const setQueryString = getRegisteredCallback('setQueryString');

                const activeUrlMock = new ParsedUrlMock();
                activeUrlMock.search = new QuerySearchParams('');
                urlServiceMock.current.and.returnValue(activeUrlMock);

                setQueryString(undefined, 'https://product/?show=overlay');

                expect(activeUrlMock.search.get('show')).toBe('overlay');
                expect(navigationServiceMock.goTo).toHaveBeenCalledWith(activeUrlMock);
            });

            it('should not set query string if not defined in the action', () => {
                const setQueryString = getRegisteredCallback('setQueryString');
                setQueryString(undefined, 'https://product/');

                expect(urlServiceMock.current).not.toHaveBeenCalled();
                expect(navigationServiceMock.goTo).not.toHaveBeenCalled();
            });
        });

        function getRegisteredCallback(name: string) {
            return menuActionsServiceMock.register.calls.all().find((c) => c.args[0] === name)!.args[1];
        }
    });
});
