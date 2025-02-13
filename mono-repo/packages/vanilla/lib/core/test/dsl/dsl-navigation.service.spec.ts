import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DslNavigationService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { NavigationServiceMock, ParsedUrlMock } from '../navigation/navigation.mock';

describe('DslNavigationService', () => {
    let service: DslNavigationService;
    let navigationServiceMock: NavigationServiceMock;

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslNavigationService],
        });

        service = TestBed.inject(DslNavigationService);
    });

    it('should set current url', () => {
        expect(service.location).toBe(<any>navigationServiceMock.location);
    });

    it('should be updated when location changes', () => {
        const newUrl = new ParsedUrlMock();
        navigationServiceMock.location = newUrl;

        expect(service.location).not.toBe(<any>navigationServiceMock.location);

        navigationServiceMock.locationChange.next({ id: 1, previousUrl: 'a', nextUrl: 'b' });

        expect(service.location).toBe(<any>newUrl);
    });

    it('should set location when redirect is enqueued', () => {
        const redirectUrl = new ParsedUrlMock();
        redirectUrl.hostname = 'mark';
        service.enqueueRedirect(<any>redirectUrl);

        expect(service.location.hostname).toBe('mark');
    });

    it('should not be updated when location changes if there is a pending redirect', () => {
        const redirectUrl = new ParsedUrlMock();
        redirectUrl.hostname = 'mark';
        service.enqueueRedirect(<any>redirectUrl);

        navigationServiceMock.location = new ParsedUrlMock();

        navigationServiceMock.locationChange.next({ id: 1, previousUrl: 'a', nextUrl: 'b' });

        expect(service.location.hostname).toBe('mark');
    });

    it('should redirect to last enqueued url after debounce', fakeAsync(() => {
        service.enqueueRedirect(<any>new ParsedUrlMock());

        const redirectUrl = new ParsedUrlMock();
        redirectUrl.hostname = 'mark';
        service.enqueueRedirect(<any>redirectUrl);

        expect(navigationServiceMock.goTo).not.toHaveBeenCalled();

        tick();

        expect(navigationServiceMock.goTo).toHaveBeenCalledWith(redirectUrl, { replace: true });
    }));
});
