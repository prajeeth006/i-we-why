import { TestBed } from '@angular/core/testing';

import { MenuAction, QuerySearchParams, ToastrQueueCurrentToastContext, VanillaEventNames } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ToastrQueueBootstrapService } from '../../src/toastr/toastr-queue-bootstrap.service';
import { EventsServiceMock } from '../../src/utils/test/utils.mock';
import { MenuActionsServiceMock } from '../menu-actions/menu-actions.mock';
import { NavigationServiceMock, ParsedUrlMock } from '../navigation/navigation.mock';
import { ToastrQueueServiceMock } from './toastr-queue.mock';
import { ActiveToastMock } from './toastr.mock';

describe('ToastrQueueBootstrapService', () => {
    let service: ToastrQueueBootstrapService;
    let navigationServiceMock: NavigationServiceMock;
    let toastrQueueServiceMock: ToastrQueueServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let eventsServiceMock: EventsServiceMock;

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        toastrQueueServiceMock = MockContext.useMock(ToastrQueueServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        eventsServiceMock = MockContext.useMock(EventsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ToastrQueueBootstrapService],
        });

        service = TestBed.inject(ToastrQueueBootstrapService);
        navigationServiceMock.location.search = new QuerySearchParams('');
    });

    describe('onAppInit()', () => {
        it('should call onNavigate on each navigation', () => {
            const toastContent = {
                templateName: 'logoutwarning',
                name: 'changeLabel',
                parameters: { b: '2' },
            };
            toastrQueueServiceMock.currentToast = new ToastrQueueCurrentToastContext(toastContent, {});
            const toast: any = new ActiveToastMock();
            toastrQueueServiceMock.currentToast.setToast(toast);
            service.onAppInit();

            const menuAction = menuActionsServiceMock.register.calls.all().find((c) => c.args[0] === MenuAction.CLOSE_TOASTR)?.args[1];
            menuAction(undefined, undefined, undefined, {});

            expect(eventsServiceMock.raise).toHaveBeenCalledWith({
                eventName: VanillaEventNames.ToastrClosed,
                data: {
                    toastrContent: {
                        templateName: 'logoutwarning',
                        name: 'changeLabel',
                        parameters: Object({ b: '2' }),
                        title: '',
                        text: '',
                        class: '',
                    },
                },
            });
            expect(toastrQueueServiceMock.onNavigation).toHaveBeenCalledTimes(0);

            navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });

            expect(toastrQueueServiceMock.onNavigation).toHaveBeenCalledTimes(1);

            navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });

            expect(toastrQueueServiceMock.onNavigation).toHaveBeenCalledTimes(2);
        });

        describe('toasts', () => {
            it('should add toasts from query string and redirect to url without it', () => {
                navigationServiceMock.location.search = new QuerySearchParams('_showToast=toast1');
                const newUrl = new ParsedUrlMock();
                newUrl.search = navigationServiceMock.location.search;
                navigationServiceMock.location.clone.and.returnValue(newUrl);

                service.onAppInit();

                expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('toast1', { placeholders: {} });
                expect(navigationServiceMock.goTo).toHaveBeenCalledWith(newUrl, { replace: true });
                expect(newUrl.search.has('_showToast')).toBeFalse();
            });

            it('should add toasts and placeholders from query string', () => {
                navigationServiceMock.location.search = new QuerySearchParams('_showToast=toast1&_placeholders={"placeholder":"OMEGALUL"}');
                const newUrl = new ParsedUrlMock();
                newUrl.search = navigationServiceMock.location.search;
                navigationServiceMock.location.clone.and.returnValue(newUrl);

                service.onAppInit();

                expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('toast1', { placeholders: { placeholder: 'OMEGALUL' } });
                expect(navigationServiceMock.goTo).toHaveBeenCalledWith(newUrl, { replace: true });
                expect(newUrl.search.has('_showToast')).toBeFalse();
                expect(newUrl.search.has('_placeholders')).toBeFalse();
            });

            it('should add toasts from query string when placeholders query string param is not valid json', () => {
                navigationServiceMock.location.search = new QuerySearchParams('_showToast=toast1&_placeholders={"placeholder":dfssdadf}');
                const newUrl = new ParsedUrlMock();
                newUrl.search = navigationServiceMock.location.search;
                navigationServiceMock.location.clone.and.returnValue(newUrl);

                service.onAppInit();

                expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('toast1', { placeholders: {} });
                expect(navigationServiceMock.goTo).toHaveBeenCalledWith(newUrl, { replace: true });
                expect(newUrl.search.has('_showToast')).toBeFalse();
            });
        });
    });
});
