import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { AccountMenuOverlayComponent } from '../src/account-menu-overlay.component';
import { INITIAL_ROUTE } from '../src/account-menu-tokens';
import { AccountMenuScrollServiceMock } from './account-menu-scroll.mock';
import { AccountMenuTrackingServiceMock } from './account-menu-tracking.mock';
import { AccountMenuConfigMock } from './menu-content.mock';

describe('AccountMenuOverlayComponent', () => {
    let fixture: ComponentFixture<AccountMenuOverlayComponent>;
    let navigationServiceMock: NavigationServiceMock;
    let overlayRefMock: OverlayRefMock;
    let accountMenuScrollServiceMock: AccountMenuScrollServiceMock;

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        accountMenuScrollServiceMock = MockContext.useMock(AccountMenuScrollServiceMock);
        MockContext.useMock(AccountMenuConfigMock);
        MockContext.useMock(AccountMenuTrackingServiceMock);

        TestBed.overrideComponent(AccountMenuOverlayComponent, {
            set: {
                imports: [],
                providers: [MockContext.providers, { provide: INITIAL_ROUTE, useValue: 'route' }],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(AccountMenuOverlayComponent);
        fixture.detectChanges();
    });

    it('should close overlay on location change', () => {
        navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });

        expect(overlayRefMock.detach).toHaveBeenCalled();
    });

    it('should set route', () => {
        expect(fixture.componentInstance.route).toBe('route');
    });

    describe('onScroll', () => {
        it('should notify service about scroll events', () => {
            const event = new Event('scroll');
            fixture.nativeElement.dispatchEvent(event);

            expect(accountMenuScrollServiceMock.onScroll).toHaveBeenCalledWith(event);
        });
    });
});
