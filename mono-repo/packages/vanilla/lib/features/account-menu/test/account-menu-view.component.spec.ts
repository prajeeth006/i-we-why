import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSegment } from '@angular/router';

import { AccountMenuRouter, DrawerPosition } from '@frontend/vanilla/shared/account-menu';
import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../core/test/activated-route.mock';
import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { ElementRefMock } from '../../../core/test/element-ref.mock';
import { AccountMenuViewComponent } from '../src/account-menu-view.component';
import { AccountMenuDrawerServiceMock } from './account-menu-drawer.service.mock';
import { AccountMenuScrollServiceMock } from './account-menu-scroll.mock';

describe('AccountMenuViewComponent', () => {
    let fixture: ComponentFixture<AccountMenuViewComponent>;
    let component: AccountMenuViewComponent;
    let activatedRouteMock: ActivatedRouteMock;
    let htmlNodeMock: HtmlNodeMock;
    let accountMenuScrollServiceMock: AccountMenuScrollServiceMock;
    let accountMenuDrawerServiceMock: AccountMenuDrawerServiceMock;
    let elementRefMock: ElementRefMock;

    beforeEach(() => {
        accountMenuDrawerServiceMock = MockContext.useMock(AccountMenuDrawerServiceMock);
        activatedRouteMock = MockContext.useMock(ActivatedRouteMock);
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        accountMenuScrollServiceMock = MockContext.useMock(AccountMenuScrollServiceMock);
        elementRefMock = MockContext.useMock(ElementRefMock);

        TestBed.overrideComponent(AccountMenuViewComponent, {
            set: {
                imports: [CommonModule],
                providers: [MockContext.providers, AccountMenuRouter],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(AccountMenuViewComponent);
        component = fixture.componentInstance;
        (component as any).elementRef = elementRefMock;

        fixture.detectChanges();
    });

    describe('init', () => {
        it('should set menu route when route changes', () => {
            activatedRouteMock.url.next([new UrlSegment('path', {})]);

            expect(component.route).toBe('path');
            expect(htmlNodeMock.blockScrolling).toHaveBeenCalledWith(true);
        });

        it('should open root route when path is empty', () => {
            activatedRouteMock.url.next([]);

            expect(component.route).toBe('menu');
            expect(htmlNodeMock.blockScrolling).toHaveBeenCalledWith(true);
        });

        it('should scroll and reset drawer on ScrollTo received', () => {
            accountMenuScrollServiceMock.onScrollTo.next({ x: 0, y: 0 });
            expect(elementRefMock.nativeElement.scrollTo).toHaveBeenCalled();
        });

        it('should set class according to the drawer position', () => {
            accountMenuDrawerServiceMock.drawerPosition.set({ position: DrawerPosition.Middle, height: 100 });

            expect(component.drawerClass).toBeTrue();
        });
    });

    describe('destroy', () => {
        it('should remove no-scrolling class', () => {
            fixture.destroy();

            expect(htmlNodeMock.blockScrolling).toHaveBeenCalledWith(false);
        });

        it('should unsubscribe from route events', () => {
            fixture.destroy();

            activatedRouteMock.url.next([new UrlSegment('path', {})]);

            expect(component.route).toBeUndefined();
        });
    });

    describe('onScroll', () => {
        it('should notify service about scroll events', () => {
            const event = new Event('scroll');
            fixture.nativeElement.dispatchEvent(event);

            expect(accountMenuScrollServiceMock.onScroll).toHaveBeenCalledWith(event);
        });
    });
});
