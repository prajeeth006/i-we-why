import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { NotFoundComponent } from '@frontend/vanilla/features/not-found';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { ActivatedRouteMock } from '../../../core/test/activated-route.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { PageViewDataServiceMock } from '../../../core/test/tracking/page-view-data.mock';
import { MetaTagsServiceMock } from '../../meta-tags/test/meta-tags.mock';

describe('NotFoundComponent', () => {
    let fixture: ComponentFixture<NotFoundComponent>;
    let pageMock: PageMock;
    let metaTagServiceMock: MetaTagsServiceMock;
    let windowMock: WindowMock;
    let navigationServiceMock: NavigationServiceMock;
    let pageViewDataServiceMock: PageViewDataServiceMock;
    let activatedRouteMock: ActivatedRouteMock;

    beforeEach(() => {
        pageMock = MockContext.useMock(PageMock);
        metaTagServiceMock = MockContext.useMock(MetaTagsServiceMock);
        windowMock = new WindowMock();
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        pageViewDataServiceMock = MockContext.useMock(PageViewDataServiceMock);
        activatedRouteMock = MockContext.useMock(ActivatedRouteMock);

        TestBed.overrideComponent(NotFoundComponent, {
            set: {
                imports: [],
                providers: [
                    MockContext.providers,
                    {
                        provide: WINDOW,
                        useValue: windowMock,
                    },
                ],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        pageMock.homePage = 'http://bwin.com/home';
    });

    function initComponent() {
        fixture = TestBed.createComponent(NotFoundComponent);

        fixture.detectChanges();
        metaTagServiceMock.whenReady.next();
    }

    it('should show not found page for logged in user', () => {
        initComponent();

        expect(fixture.componentInstance.showNotFoundPage()).toBeTrue();
        expect(navigationServiceMock.goTo).not.toHaveBeenCalled();
        expect(metaTagServiceMock.setPageTags).toHaveBeenCalledWith(undefined, { 'prerender-status-code': '404' });
        expect(pageViewDataServiceMock.setDataForNavigation).toHaveBeenCalledWith(activatedRouteMock.snapshot, {
            'page.name': 'Errorpage - Not Found',
        });
    });

    it("should reload page if culture in url doesn't match page culture and is supported", () => {
        pageMock.lang = 'de';
        navigationServiceMock.location.culture = 'en';

        initComponent();

        expect(pageViewDataServiceMock.setDataForNavigation).toHaveBeenCalledWith(activatedRouteMock.snapshot, {});
        expect(windowMock.location.reload).toHaveBeenCalledWith();
    });

    it("should not reload page if culture in url doesn't match page culture and is not supported", () => {
        pageMock.lang = 'de';
        navigationServiceMock.location.culture = 'xx';

        initComponent();

        expect(windowMock.location.reload).not.toHaveBeenCalled();
        expect(fixture.componentInstance.showNotFoundPage()).toBeTrue();
    });
});
