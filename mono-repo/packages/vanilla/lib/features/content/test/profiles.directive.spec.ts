import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlService, WINDOW } from '@frontend/vanilla/core';
import { ProfilesDirective } from '@frontend/vanilla/features/content';
import { forOwn } from 'lodash-es';
import { MockContext } from 'moxxi';

import { MediaQueryListMockCache, WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';

@Component({
    template: '<img [vnProfilesSrc]=src [vnProfilesWidth]=width [vnProfilesSet]=profiles />',
})
class TestHostComponent {
    src: string;
    width: number | undefined;
    profiles: string | undefined;
}

describe('ProfilesDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let windowMock: WindowMock;
    let pageMock: PageMock;
    let loggerMock: LoggerMock;

    let src: string;
    let width: number | undefined;
    let profiles: string | undefined;

    function verifyImageSrc(expectedSrc: string, width?: number) {
        const imgElm: HTMLImageElement = fixture.nativeElement.querySelector('img');
        expect(imgElm.src).toEqual(`http://imageshare.com/${expectedSrc}`);
        if (width != null) {
            expect(imgElm.width).toBe(width);
        }
    }

    function initComponent() {
        fixture = TestBed.createComponent(TestHostComponent);

        fixture.componentInstance.src = src;
        fixture.componentInstance.width = width;
        fixture.componentInstance.profiles = profiles;

        fixture.detectChanges();
    }

    beforeEach(() => {
        windowMock = new WindowMock();
        pageMock = MockContext.useMock(PageMock);
        loggerMock = MockContext.useMock(LoggerMock);

        TestBed.configureTestingModule({
            imports: [ProfilesDirective],
            providers: [
                MockContext.providers,
                UrlService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
            declarations: [TestHostComponent],
        });

        pageMock.imageProfiles = {
            default: {
                prefix: 'width',
                widthBreakpoints: [320, 480, 640, 800, 1024, 1280],
            },
            teaser: {
                prefix: 'pc-teaser-width-',
                widthBreakpoints: [600, 960, 1280, 1920],
            },
        };

        src = 'http://imageshare.com/images/default.png';
        width = undefined;
        profiles = undefined;
        windowMock.location.href = 'http://imageshare.com';
    });

    it('should show lowest profile that matches screen size', () => {
        windowMock.matchMedia('(max-width: 800px)').matches = true;
        windowMock.matchMedia('(max-width: 640px)').matches = true;

        initComponent();

        verifyImageSrc('images/default.png?p=width640');
    });

    it('should fallback to default src if no media query matches', () => {
        initComponent();

        verifyImageSrc('images/default.png');
    });

    it('should respond to media query changes (e.g. window resizing)', () => {
        windowMock.matchMedia('(max-width: 800px)').matches = true;
        windowMock.matchMedia('(max-width: 640px)').matches = true;

        initComponent();

        windowMock.matchMedia('(max-width: 640px)').matches = false;
        windowMock.matchMedia('(max-width: 640px)').listener();

        fixture.detectChanges();

        verifyImageSrc('images/default.png?p=width800');
    });

    it('should respond to changes on src', () => {
        windowMock.matchMedia('(max-width: 640px)').matches = true;

        initComponent();

        fixture.componentInstance.src = 'http://imageshare.com/images/changed.png?qd=345';
        fixture.detectChanges();

        verifyImageSrc('images/changed.png?qd=345&p=width640');
    });

    it('should unsubscribe media query listeners when destroyed', () => {
        initComponent();

        fixture.destroy();

        forOwn(MediaQueryListMockCache.cache, (q, k) => {
            if (k.includes('max-width')) {
                expect(q.listener).toBeNull();
            }
        });
    });

    it('should render specified with on the element', () => {
        width = 500;

        initComponent();

        verifyImageSrc('images/default.png', 500);
    });

    it('should not switch to profiles that are larger than original width', () => {
        width = 500;
        windowMock.matchMedia('(max-width: 800px)').matches = true;

        initComponent();

        verifyImageSrc('images/default.png', 500);
    });

    it('should use specified breakpoints', () => {
        profiles = 'teaser';

        windowMock.matchMedia('(max-width: 600px)').matches = false;
        windowMock.matchMedia('(max-width: 960px)').matches = true;

        initComponent();

        verifyImageSrc('images/default.png?p=pc-teaser-width-960');
    });

    it('should log warning and use default profiles if the specified set is not defined', () => {
        profiles = 'x';

        windowMock.matchMedia('(max-width: 640px)').matches = true;

        initComponent();

        expect(loggerMock.warn).toHaveBeenCalled();

        verifyImageSrc('images/default.png?p=width640');
    });
});
