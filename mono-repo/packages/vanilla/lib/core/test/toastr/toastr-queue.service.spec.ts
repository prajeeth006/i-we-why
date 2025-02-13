import { TestBed } from '@angular/core/testing';

import {
    ClientConfigProductName,
    ContentItem,
    ToastrDynamicComponentsRegistry,
    ToastrQueueService,
    ToastrSchedule,
    UserLoginEvent,
    WINDOW,
} from '@frontend/vanilla/core';
import { Mock, MockContext, Stub } from 'moxxi';
import { IndividualConfig, Toast } from 'ngx-toastr';

import { CookieDBServiceMock } from '../../../features/hint/test/cookie-db.mock';
import { WindowMock } from '../../src/browser/window/test/window-ref.mock';
import { ToastrOptionsBuilder } from '../../src/toastr/toastr-options-builder';
import { TrackingServiceMock } from '../../src/tracking/test/tracking.mock';
import { PageMock } from '../browsercommon/page.mock';
import { ContentServiceMock } from '../content/content.mock';
import { DslServiceMock } from '../dsl/dsl.mock';
import { LoggerMock } from '../languages/logger.mock';
import { UserServiceMock } from '../user/user.mock';
import { ActiveToastMock, ToastrServiceMock } from './toastr.mock';

@Mock({ of: ToastrOptionsBuilder })
class ToastrOptionsBuilderMock {
    @Stub() build: jasmine.Spy;
}

@Mock({ of: ToastrDynamicComponentsRegistry })
class ToastrDynamicComponentsRegistryMock {
    @Stub() get: jasmine.Spy;
}

class RedToastrComponent extends Toast {}

describe('ToastrQueueService', () => {
    let service: ToastrQueueService;
    let toastrServiceMock: ToastrServiceMock;
    let toastrOptionsBuilderMock: ToastrOptionsBuilderMock;
    let contentServiceMock: ContentServiceMock;
    let loggerMock: LoggerMock;
    let pageMock: PageMock;
    let userMock: UserServiceMock;
    let trackingServiceMock: TrackingServiceMock;
    let dslServiceMock: DslServiceMock;
    let windowMock: WindowMock;
    let toastrDynamicComponentsRegistryMock: ToastrDynamicComponentsRegistryMock;
    const rawContent = { items: [{ raw: 1 }] };

    let content: ContentItem[];

    beforeEach(() => {
        MockContext.useMock(CookieDBServiceMock);
        toastrServiceMock = MockContext.useMock(ToastrServiceMock);
        toastrOptionsBuilderMock = MockContext.useMock(ToastrOptionsBuilderMock);
        contentServiceMock = MockContext.useMock(ContentServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);
        pageMock = MockContext.useMock(PageMock);
        userMock = MockContext.useMock(UserServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        windowMock = new WindowMock();
        toastrDynamicComponentsRegistryMock = MockContext.useMock(ToastrDynamicComponentsRegistryMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                ToastrQueueService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(ToastrQueueService);

        content = [
            {
                name: 'toast1',
                templateName: 'pctext',
                text: 'txt',
                title: 'title',
                parameters: {
                    'type': 'success',
                    'tracking.ClosedEvent': 'ClosedEvt',
                    'tracking.ClosedEvent.page.referringAction': 'Some_Action',
                    'tracking.LoadedEvent': 'LoadedEvt',
                    'tracking.LoadedEvent.page.referringAction': 'Some_Action',
                },
            },
            {
                name: 'toast2',
                templateName: 'pctext',
                text: 'txt2',
                title: 'title2',
                parameters: {
                    type: 'info',
                },
            },
            {
                name: 'toast3',
                templateName: 'pctext',
                text: 'txt3',
                title: 'title3',
                parameters: {
                    type: 'success',
                },
            },
            {
                name: 'toast4',
                templateName: 'pctext',
                text: 'txt __placeholder__ __placeholder2__ __placeholder3__',
                title: 'title __placeholder__',
                class: '__placeholder__',
                parameters: {
                    'param': '__placeholder__',
                    'tracking.ClosedEvent': '__placeholder__',
                    'tracking.LoadedEvent': '__placeholder2__',
                },
            },
        ];
    });

    describe('add()', () => {
        it('should add toasts to queue and display it', () => {
            service.add('toast1');

            verifyToastDisplayed(1, 'txt', 'title', 'badge-success');
            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                {
                    'type': 'success',
                    'tracking.ClosedEvent': 'ClosedEvt',
                    'tracking.ClosedEvent.page.referringAction': 'Some_Action',
                    'tracking.LoadedEvent': 'LoadedEvt',
                    'tracking.LoadedEvent.page.referringAction': 'Some_Action',
                },
                'tracking.LoadedEvent',
            );
        });

        it('should show toasts one by one', () => {
            service.add('toast1');

            const t1 = verifyToastDisplayed(1, 'txt', 'title', 'badge-success');

            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                {
                    'type': 'success',
                    'tracking.ClosedEvent': 'ClosedEvt',
                    'tracking.ClosedEvent.page.referringAction': 'Some_Action',
                    'tracking.LoadedEvent': 'LoadedEvt',
                    'tracking.LoadedEvent.page.referringAction': 'Some_Action',
                },
                'tracking.LoadedEvent',
            );

            service.add('toast2');

            t1.onHidden.next(null);

            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                {
                    'type': 'success',
                    'tracking.ClosedEvent': 'ClosedEvt',
                    'tracking.ClosedEvent.page.referringAction': 'Some_Action',
                    'tracking.LoadedEvent': 'LoadedEvt',
                    'tracking.LoadedEvent.page.referringAction': 'Some_Action',
                },
                'tracking.ClosedEvent',
            );

            verifyToastDisplayed(2, 'txt2', 'title2', 'badge-info');

            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                {
                    type: 'info',
                },
                'tracking.LoadedEvent',
            );
        });

        it('should log a warning if toast is not found', () => {
            service.add('xxx');

            contentServiceMock.getJson.next(rawContent);
            dslServiceMock.evaluateContent.next(content);

            expect(loggerMock.warn).toHaveBeenCalledWith('No content found for toast: xxx.');
            expect(toastrServiceMock.show).not.toHaveBeenCalled();
        });

        it('should not do anything after last toast is hidden', () => {
            service.add('toast1');

            const t1 = verifyToastDisplayed(1, 'txt', 'title', 'badge-success');

            t1.onHidden.next(null);

            expect(toastrServiceMock.show).toHaveBeenCalledTimes(1);
        });

        it('should not load toasts when anonymous access is restricted and user is not authenticated', () => {
            pageMock.isAnonymousAccessRestricted = true;
            userMock.isAuthenticated = false;

            service.add('toast1');

            expect(contentServiceMock.getJson).not.toHaveBeenCalled();
            expect(toastrServiceMock.show).not.toHaveBeenCalled();
        });

        it('should load toasts when anonymous access is restricted and user is logged in', () => {
            pageMock.isAnonymousAccessRestricted = true;
            userMock.isAuthenticated = true;

            service.add('toast1');

            verifyToastDisplayed(1, 'txt', 'title', 'badge-success');
        });

        it('not load toasts when anonymous access is restricted when user logs in', () => {
            pageMock.isAnonymousAccessRestricted = true;
            userMock.isAuthenticated = false;

            service.add('toast1');

            userMock.triggerEvent(new UserLoginEvent());

            verifyToastDisplayed(1, 'txt', 'title', 'badge-success');
        });

        it('should close toast on scroll if hideOnScroll is set', () => {
            content[0]!.parameters!['hideOnScroll'] = 'true';
            service.add('toast1');

            const ref = verifyToastDisplayed(1, 'txt', 'title', 'badge-success');

            const callback = windowMock.addEventListener.calls.all().filter((c) => c.args[0] === 'scroll')[0]!.args[1];
            callback();

            expect(ref.toastRef.manualClose).toHaveBeenCalled();
            ref.toastRef.manualClose.calls.reset();

            callback();
            expect(ref.toastRef.manualClose).not.toHaveBeenCalled();
        });

        it('should unsubscribe from scroll events if toast is closed', () => {
            content[0]!.parameters!['hideOnScroll'] = 'true';
            service.add('toast1');

            const ref = verifyToastDisplayed(1, 'txt', 'title', 'badge-success');

            ref.onHidden.next(null);

            windowMock.addEventListener.calls
                .all()
                .filter((c) => c.args[0] === 'scroll')[0]!
                .args[1]();

            expect(ref.toastRef.manualClose).not.toHaveBeenCalled();
        });

        it('should not close toast on scroll if hideOnScroll is not set', () => {
            service.add('toast1');

            verifyToastDisplayed(1, 'txt', 'title', 'badge-success');

            expect(windowMock.addEventListener).not.toHaveBeenCalled();
        });

        it('should close toast on click if hideOnClick is set', () => {
            content[0]!.parameters!['hideOnClick'] = 'true';
            service.add('toast1');

            const ref = verifyToastDisplayed(1, 'txt', 'title', 'badge-success');

            const callback = windowMock.addEventListener.calls.all().filter((c) => c.args[0] === 'click')[0]!.args[1];
            callback();

            expect(ref.toastRef.manualClose).toHaveBeenCalled();
            ref.toastRef.manualClose.calls.reset();

            callback();
            expect(ref.toastRef.manualClose).not.toHaveBeenCalled();
        });

        it('should not close toast on click if hideOnClick is not set', () => {
            service.add('toast1');

            verifyToastDisplayed(1, 'txt', 'title', 'badge-success');

            expect(windowMock.addEventListener).not.toHaveBeenCalled();
        });

        it('should replace placeholders', () => {
            service.add('toast4', { placeholders: { placeholder: 'xx', placeholder2: 'yy' } });

            const t = verifyToastDisplayed(1, 'txt xx yy __placeholder3__', 'title xx', undefined);

            expect(toastrOptionsBuilderMock.build).toHaveBeenCalledWith({
                name: 'toast4',
                templateName: 'pctext',
                text: 'txt xx yy __placeholder3__',
                title: 'title xx',
                class: 'xx',
                parameters: {
                    'param': 'xx',
                    'tracking.ClosedEvent': 'xx',
                    'tracking.LoadedEvent': 'yy',
                },
            });

            expect(service.currentToast!.content.class).toBe('xx');

            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                {
                    'param': 'xx',
                    'tracking.ClosedEvent': 'xx',
                    'tracking.LoadedEvent': 'yy',
                },
                'tracking.LoadedEvent',
            );

            t.onHidden.next(null);

            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                {
                    'param': 'xx',
                    'tracking.ClosedEvent': 'xx',
                    'tracking.LoadedEvent': 'yy',
                },
                'tracking.ClosedEvent',
            );
        });

        it('should update placeholders for current toast', () => {
            service.add('toast4', { placeholders: { placeholder: 'xx', placeholder2: 'yy' } });

            const t = verifyToastDisplayed(1, 'txt xx yy __placeholder3__', 'title xx', undefined);

            service.currentToast!.updatePlaceholders({ placeholder: 'aa', placeholder2: 'bb' });

            t.onHidden.next(null);

            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                {
                    'param': 'aa',
                    'tracking.ClosedEvent': 'aa',
                    'tracking.LoadedEvent': 'bb',
                },
                'tracking.ClosedEvent',
            );
        });

        it('should show custom toastr', () => {
            toastrDynamicComponentsRegistryMock.get.withArgs('redToastr').and.returnValue(RedToastrComponent);
            service.add('toast4', {
                customToastr: {
                    customComponent: 'redToastr',
                    title: 'my title',
                    message: 'mess',
                    type: 'info',
                    parameters: { toastClass: 'toastr', tapToDismiss: false },
                },
            });

            verifyToastDisplayed(1, 'mess', 'my title', 'badge-info', {
                toastComponent: RedToastrComponent,
                toastClass: 'toastr',
                tapToDismiss: false,
            });
        });

        it('should not show custom toastr if custom component is not registered', () => {
            service.add('toast4', {
                customToastr: {
                    customComponent: 'redToastr',
                    title: 'my title',
                    message: 'mess',
                    type: 'info',
                    parameters: { toastClass: 'toastr', tapToDismiss: false },
                },
            });

            contentServiceMock.getJson.next(rawContent);
            dslServiceMock.evaluateContent.next(content);

            expect(loggerMock.warn).toHaveBeenCalledWith('No custom component found for toast template name redToastr.');
            expect(toastrServiceMock.show).not.toHaveBeenCalled();
        });
    });

    describe('onNavigation()', () => {
        it('should change afterNavigation toasts to immediate and show first one', () => {
            service.add('toast1', { schedule: ToastrSchedule.AfterNextNavigation });

            service.onNavigation();

            contentServiceMock.getJson.next(rawContent);
            dslServiceMock.evaluateContent.next(content);

            verifyToastDisplayed(1, 'txt', 'title', 'badge-success');
        });

        it('should close toast on navigation if hideOnNavigation is set', () => {
            content[0]!.parameters!['hideOnNavigation'] = 'true';
            service.add('toast1');

            const ref = verifyToastDisplayed(1, 'txt', 'title', 'badge-success');

            service.onNavigation();

            expect(ref.toastRef.manualClose).toHaveBeenCalled();
        });

        it('should not close toast on navigation if hideOnNavigation is not set', () => {
            service.add('toast1');

            const ref = verifyToastDisplayed(1, 'txt', 'title', 'badge-success');

            service.onNavigation();

            expect(ref.toastRef.manualClose).not.toHaveBeenCalled();
        });
    });

    describe('remove()', () => {
        it('should remove specified item from the queue', () => {
            service.add('toast1');
            service.add('toast2');
            service.add('toast3');

            const t1 = verifyToastDisplayed(1, 'txt', 'title', 'badge-success');

            service.remove('toast2');

            t1.onHidden.next(null);

            verifyToastDisplayed(2, 'txt3', 'title3', 'badge-success');
        });
    });

    describe('clear()', () => {
        it('should remove all items from the queue', () => {
            service.add('toast1');
            service.add('toast2');
            service.add('toast3');

            const t1 = verifyToastDisplayed(1, 'txt', 'title', 'badge-success');

            service.clear();

            t1.onHidden.next(null);

            expect(toastrServiceMock.show).toHaveBeenCalledTimes(1);
        });
    });

    function verifyToastDisplayed(no: number, text: string, title: string, type?: string, options?: Partial<IndividualConfig>): ActiveToastMock {
        if (no === 1) {
            expect(contentServiceMock.getJson).toHaveBeenCalledWith('App-v1.0/Toasts', { product: ClientConfigProductName.SF, filterOnClient: true });
            contentServiceMock.getJson.next(rawContent);
            contentServiceMock.getJson.calls.reset();
        } else {
            expect(contentServiceMock.getJson).not.toHaveBeenCalled();
        }

        expect(dslServiceMock.evaluateContent).toHaveBeenCalledWith(rawContent.items);
        dslServiceMock.evaluateContent.completeWith(content);

        expect(toastrServiceMock.show).toHaveBeenCalledWith(text, title, options || {}, type);
        expect(toastrServiceMock.show).toHaveBeenCalledTimes(no);
        return toastrServiceMock.show.calls.mostRecent().returnValue;
    }
});
