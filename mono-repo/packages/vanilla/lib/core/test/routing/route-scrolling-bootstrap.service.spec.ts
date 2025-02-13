import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NavigationEnd } from '@angular/router';

import { WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { PublicHeaderServiceMock } from '../../../features/header/test/header.mock';
import { SessionStoreServiceMock } from '../../src/browser/store/test/session-store.mock';
import { WindowMock } from '../../src/browser/window/test/window-ref.mock';
import { RouteScrollingBootstrapService } from '../../src/routing/route-scrolling-bootstrap.service';
import { WorkerType } from '../../src/web-worker/web-worker.models';
import { PageMock } from '../browsercommon/page.mock';
import { DslServiceMock } from '../dsl/dsl.mock';
import { HtmlElementMock } from '../element-ref.mock';
import { LocationMock } from '../navigation/location.mock';
import { NavigationServiceMock } from '../navigation/navigation.mock';
import { RouterMock } from '../router.mock';
import { WebWorkerServiceMock } from '../web-worker/web-worker.service.mock';

describe('RouteScrollingBootstrapService', () => {
    let service: RouteScrollingBootstrapService;
    let locationMock: LocationMock;
    let routerMock: RouterMock;
    let windowMock: WindowMock;
    let sessionStoreServiceMock: SessionStoreServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let headerServiceMock: PublicHeaderServiceMock;
    let dslServiceMock: DslServiceMock;
    let pageMock: PageMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let time: number;

    beforeEach(() => {
        locationMock = MockContext.useMock(LocationMock);
        routerMock = MockContext.useMock(RouterMock);
        windowMock = new WindowMock();
        sessionStoreServiceMock = MockContext.useMock(SessionStoreServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        headerServiceMock = MockContext.useMock(PublicHeaderServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        pageMock = MockContext.useMock(PageMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                RouteScrollingBootstrapService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        windowMock.innerHeight = 680;
        windowMock.document.body.scrollHeight = 1080;
        pageMock.scrollBehaviorEnabledCondition = 'FALSE';
        time = 0;

        service = TestBed.inject(RouteScrollingBootstrapService);
    });

    function init(scrollBehaviorEnabled: boolean = true) {
        service.onAppInit();
        dslServiceMock.evaluateExpression.completeWith(scrollBehaviorEnabled);
    }

    describe('onAppInit', () => {
        it('should scroll to top if scroll behavior condition is disabled', fakeAsync(() => {
            init(false);
            navigate('/path');

            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledOnceWith('FALSE');
            expect(windowMock.scrollTo).toHaveBeenCalledOnceWith(0, 0);
        }));

        it('should set scroll restoration to manual', () => {
            init();

            expect(windowMock.history.scrollRestoration).toBe('manual');
        });

        it('should store state beforeunload', fakeAsync(() => {
            init();

            navigate('/path');
            scroll(5);

            windowMock.addEventListener.calls
                .all()
                .filter((c) => c.args[0] === 'beforeunload')[0]
                .args[1]();

            expect(Object.assign({}, sessionStoreServiceMock.get('route-scroll-info'))).toEqual({
                routeScrollPositions: { '/path': 5 },
                activeUrl: '/path',
            });
        }));
    });

    describe('first navigation', () => {
        it('should set scroll position from sessionStorage to stored when reloading to the same url', fakeAsync(() => {
            setScrollState('/path', { '/path': 5 });
            init();

            navigate('/path');

            expectScrollTo(5);
        }));

        it('should not restore scroll position when full loading previously stored url', fakeAsync(() => {
            setScrollState('/path2', { '/path': 5 });
            init();

            navigate('/path');

            expectScrollTo(false);
        }));
    });

    describe('SPA navigation', () => {
        beforeEach(fakeAsync(() => {
            windowMock.scrollY = 0;

            init();

            navigate('/en');
        }));

        it('should set scroll position to 0 when navigating to new page', fakeAsync(() => {
            navigate('/path');

            expectScrollTo(0);
        }));

        it('should set scroll position to 0 when navigating to new page when scrolled down', fakeAsync(() => {
            navigate('/path');

            scroll(50);

            navigate('/path1');

            expectScrollTo(0);
        }));

        it('should restore scroll position when history navigating', fakeAsync(() => {
            scroll(50);

            navigate('/path');

            expectScrollTo(0);

            navigate('/en', true);
            expectScrollTo(50);
        }));

        it('should wait until the page is loaded before scrolling', fakeAsync(() => {
            scroll(50);
            windowMock.document.body.scrollHeight = 680;

            navigate('/path');

            expectScrollTo(0);

            navigate('/en', true);
            expectScrollTo(false);

            windowMock.document.body.scrollHeight = 1080;
            webWorkerServiceMock.createWorker.calls.mostRecent().args[2]();
            expectScrollTo(50);
        }));

        it('should scroll the page anyway if its not expanded enough after timeout', fakeAsync(() => {
            scroll(50);
            windowMock.document.body.scrollHeight = 680;

            navigate('/path');

            expectScrollTo(0);

            navigate('/en', true);
            expectScrollTo(false);

            while (time < 3000) {
                tick(50);
                time += 50;
                expectScrollTo(false);
            }

            tick(50);
            webWorkerServiceMock.createWorker.calls.mostRecent().args[2]();
            expectScrollTo(50);
        }));
    });

    describe('anchor', () => {
        let anchorElementMock: HtmlElementMock;

        beforeEach(() => {
            anchorElementMock = new HtmlElementMock();
            navigationServiceMock.location.hash = 'anchor';
            windowMock.document.querySelector.withArgs('#anchor').and.returnValue(anchorElementMock);
            headerServiceMock.getHeaderHeight.and.returnValue(20);
            windowMock.scrollY = 50;

            init();
        });

        it('should scroll the page to anchor', fakeAsync(() => {
            navigate('/page#anchor');
            headerServiceMock.whenReady.next();
            tick();

            expect(anchorElementMock.scrollIntoView).toHaveBeenCalled();
            expectScrollTo(30);
        }));
    });

    function navigate(url: string, history: boolean = false) {
        if (history) {
            locationMock.subscribe.calls.mostRecent().args[0]();
        }

        navigationServiceMock.location.url.and.returnValue(url);
        routerMock.events.next(new NavigationEnd(1, 'x', 'y'));
        tick();
    }

    function scroll(offset: number) {
        windowMock.scrollY = offset;
        windowMock.addEventListener.calls
            .all()
            .filter((c) => c.args[0] === 'scroll')[0]
            .args[1]();
    }

    function expectScrollTo(offset: number | false) {
        if (offset === false) {
            expect(windowMock.scrollTo).not.toHaveBeenCalled();
        } else {
            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledWith(WorkerType.RouteScrollingTimeout, { timeout: 0 }, jasmine.any(Function));
            expect(windowMock.scrollTo).toHaveBeenCalledWith(0, offset);
            windowMock.scrollTo.calls.reset();
        }
    }

    function setScrollState(activeUrl: string, routeScrollPositions: { [url: string]: number }) {
        sessionStoreServiceMock.set('route-scroll-info', { activeUrl, routeScrollPositions });
    }
});
