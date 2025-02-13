import { Stub, StubPromise } from 'moxxi';

import { HtmlElementMock } from '../../../../test/element-ref.mock';
import { NativeEvent } from '../../../native-app/native-app.models';
import { WindowEvent } from '../window-ref.service';

export class MediaQueryListMockCache {
    public static cache: { [pattern: string]: MediaQueryListMock } = {};

    static reset() {
        this.cache = {};
    }
}

afterEach(() => {
    MediaQueryListMockCache.reset();
});

export class WindowMock {
    [key: string]: any;

    parent: WindowMock;
    location: WindowLocationMock = new WindowLocationMock();
    @Stub() matchMedia: jasmine.Spy;
    @Stub() open: jasmine.Spy;
    @Stub() addEventListener: jasmine.Spy;
    @Stub() removeEventListener: jasmine.Spy;
    @Stub() scrollTo: jasmine.Spy;
    @Stub() scrollBy: jasmine.Spy;
    @Stub() postMessage: jasmine.Spy;
    @Stub() decibelInsight: jasmine.Spy;
    @StubPromise() fetch: jasmine.PromiseSpy;
    outerWidth: number;
    innerWidth: number;
    outerHeight: number;
    innerHeight: number;
    scrollY: number;
    navigator: NavigatorMock = new NavigatorMock();
    sessionStorage: StorageMock = new StorageMock();
    localStorage: StorageMock = new StorageMock();
    document: DocumentMock = new DocumentMock();
    history: HistoryMock = new HistoryMock();
    screen: ScreenMock = new ScreenMock();
    visualViewport = new VisualViewportMock();
    performance: PerformanceMock = new PerformanceMock();
    messageToNative: (e: NativeEvent) => void;
    messageToWeb: (e: NativeEvent) => void;
    vanillaApp = { native: { messageToWeb: jasmine.createSpy() } };
    getSelection = () => ({ removeAllRanges: jasmine.createSpy() });
    ga: any;

    constructor() {
        this.matchMedia.and.callFake((pattern: string) => {
            let mq = MediaQueryListMockCache.cache[pattern];
            if (!mq) {
                mq = new MediaQueryListMock();
                MediaQueryListMockCache.cache[pattern] = mq;
            }

            return mq;
        });

        this.decibelInsight.and.callFake((method: string, handler: () => void) => {
            if (method === 'ready') handler();
            if (method === 'getSessionId') return 'di-81649-BAA44AC48A01AE892D22AA13555869752A';

            return '';
        });
    }
}

export class IndexableWindowMock extends WindowMock {
    [key: string]: any;

    OneTrust: OneTrustMock | null;
}

export class OneTrustMock {
    OnConsentChanged(callback: () => void) {
        callback();
    }
}

export class PerformanceMock {
    timing: PerformanceTimingMock = new PerformanceTimingMock();
    @Stub() measure: jasmine.Spy;
    @Stub() mark: jasmine.Spy;
    @Stub() clearMarks: jasmine.Spy;
    @Stub() clearMeasures: jasmine.Spy;
    @Stub() getEntriesByName: jasmine.Spy;
    @Stub() getEntriesByType: jasmine.Spy;
    @Stub() getEntries: jasmine.Spy;
}

export class PerformanceTimingMock {
    navigationStart: number;
    domComplete: number;
    domInteractive: number;
}

export class WindowLocationMock {
    protocol: string;
    href: string;
    host: string;
    pathname: string;
    @Stub() replace: jasmine.Spy;
    @Stub() reload: jasmine.Spy;
}

export class NavigatorMock {
    userAgent: string;
    onLine: boolean;
    standalone: boolean;
    language: string;
    geolocation = new GeolocationMock();
    @Stub() share: jasmine.Spy;
    @Stub() sendBeacon: jasmine.Spy;
}

export class GeolocationMock {
    @Stub() getCurrentPosition: jasmine.Spy;
    @Stub() watchPosition: jasmine.Spy;
    @Stub() clearWatch: jasmine.Spy;
}

export class StorageMock {
    @Stub() setItem: jasmine.Spy;
    @Stub() getItem: jasmine.Spy;
    @Stub() removeItem: jasmine.Spy;
}

export class MediaQueryListMock {
    listener: (() => void) | null;
    matches: boolean = false;

    addEventListener(_: WindowEvent, listener: () => void) {
        this.listener = listener;
    }

    removeEventListener(_: WindowEvent, listener: () => void) {
        if (this.listener === listener) {
            this.listener = null;
        }
    }
}

export class DocumentMock {
    cookieSetHistory: string[] = [];
    currentCookie: string;
    hidden: boolean;
    visibilityState: DocumentVisibilityState;
    @Stub() addEventListener: jasmine.Spy;
    @Stub() removeEventListener: jasmine.Spy;
    @Stub() querySelector: jasmine.Spy;
    @Stub() querySelectorAll: jasmine.Spy;
    @Stub() createElement: jasmine.Spy;
    @Stub() getElementsByTagName: jasmine.Spy;
    @Stub() getElementById: jasmine.Spy;
    @Stub() execCommand: jasmine.Spy;
    referrer: string;
    body: BodyMock = new BodyMock();
    head: HeadMock = new HeadMock();
    documentElement: HtmlMock = new HtmlMock();
    readyState: string;

    get cookie(): string {
        return this.currentCookie;
    }

    set cookie(value: string) {
        this.cookieSetHistory.push(value);
    }
}

export class BodyMock extends HtmlElementMock {
    scrollHeight: number = 0;
    override offsetHeight: number = 0;
    @Stub() appendChild: jasmine.Spy;
    @Stub() removeChild: jasmine.Spy;
}

export class HeadMock extends HtmlElementMock {
    @Stub() appendChild: jasmine.Spy;
}

export class HtmlMock extends HtmlElementMock {
    @Stub() getAttribute: jasmine.Spy;
    scrollHeight: number = 0;
    override offsetHeight: number = 0;
    clientHeight: number = 0;
    clientWidth: number = 0;
}

export class HistoryMock {
    length: number = 0;
    scrollRestoration: ScrollRestoration = 'auto';
    @Stub() back: jasmine.Spy;
}

export class ScreenMock {
    width: number;
    height: number;
}

class VisualViewportMock {
    width: number;
    height: number;

    @Stub() addEventListener: jasmine.Spy;
    @Stub() removeEventListener: jasmine.Spy;
}
