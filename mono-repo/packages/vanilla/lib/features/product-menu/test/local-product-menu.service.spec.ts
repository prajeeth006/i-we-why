import { ComponentPortal } from '@angular/cdk/portal';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MenuContentItem } from '@frontend/vanilla/core';
import { AnimatedOverlayRef } from '@frontend/vanilla/features/overlay';
import { AnimateOverlayFrom } from '@frontend/vanilla/shared/overlay-factory';
import { MockContext } from 'moxxi';
import { ReplaySubject } from 'rxjs';

import { SessionStoreServiceMock } from '../../../core/src/browser/store/test/session-store.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { MockPositionStrategies, OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { ProductMenuOverlayComponent } from '../src/product-menu-overlay.component';
import { ProductMenuService } from '../src/product-menu.service';
import { ProductMenuConfigMock, ProductMenuServiceMock } from './product-menu.mock';

describe('LocalProductMenuService', () => {
    let service: ProductMenuService;
    let overlayMock: OverlayFactoryMock;
    let overlayRef: OverlayRefMock;
    let productAccountMenuConfigMock: ProductMenuConfigMock;
    let navigationServiceMock: NavigationServiceMock;
    let sessionStoreServiceMock: SessionStoreServiceMock;
    let dslServiceMock: DslServiceMock;
    let productMenuServiceMock: ProductMenuServiceMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        productAccountMenuConfigMock = MockContext.useMock(ProductMenuConfigMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        sessionStoreServiceMock = MockContext.useMock(SessionStoreServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        productMenuServiceMock = MockContext.useMock(ProductMenuServiceMock);

        TestBed.configureTestingModule({
            providers: [...MockContext.providers, ProductMenuService],
        });

        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);
    });

    describe('v1', () => {
        beforeEach(() => {
            service = TestBed.inject(ProductMenuService);
        });

        describe('toggle', () => {
            it('should create an overlay', () => {
                service.toggle();

                const expectedConfig = {
                    panelClass: 'vn-product-menu-container',
                    positionStrategy: new MockPositionStrategies(),
                };
                expectedConfig.positionStrategy.position = 'g';

                expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
                expect(overlayRef.attach).toHaveBeenCalled();

                const portal: ComponentPortal<ProductMenuOverlayComponent> = overlayRef.attach.calls.mostRecent().args[0];

                expect(portal.component).toBe(ProductMenuOverlayComponent);
                expect(portal.injector!.get<AnimatedOverlayRef>(AnimatedOverlayRef as Type<AnimatedOverlayRef>)).toBeDefined();
            });

            it('should not create an overlay if one is already open', () => {
                service.toggle({ open: true });
                service.toggle({ open: true });

                expect(overlayMock.create).toHaveBeenCalledTimes(1);
            });

            it('should allow to open an overlay after first one is closed', () => {
                service.toggle();
                service.toggle({ open: false });
                service.toggle();

                expect(overlayMock.create).toHaveBeenCalledTimes(2);
            });

            it('should close overlay on backdrop click', () => {
                service.toggle();

                overlayRef.backdropClick.next();

                expect(overlayMock.dispose).toHaveBeenCalledWith(overlayRef);
            });

            it('should dispose overlay when closed', () => {
                service.toggle();
                service.toggle();

                expect(overlayMock.dispose).toHaveBeenCalledWith(overlayRef);
            });

            it('should navigate to route and set returnUrl when router mode enabled', () => {
                productAccountMenuConfigMock.routerMode = true;
                service.toggle({ open: true, options: { initialTab: 'test' } });

                expect(navigationServiceMock.goTo).toHaveBeenCalledWith('/product-menu');
                expect(sessionStoreServiceMock.set).toHaveBeenCalled();
            });

            it('should navigate to return url when router mode enabled', () => {
                productAccountMenuConfigMock.routerMode = true;
                productMenuServiceMock.routerModeReturnUrl = 'returnUrl';
                service.toggle({ open: false });

                expect(sessionStoreServiceMock.remove).toHaveBeenCalled();
                expect(navigationServiceMock.goTo).toHaveBeenCalledWith('returnUrl');
            });

            it('should navigate to lastKnowProduct url on close when returnUrl not found and router mode enabled', () => {
                productAccountMenuConfigMock.routerMode = true;
                service.toggle({ open: false });

                expect(navigationServiceMock.goToLastKnownProduct).toHaveBeenCalled();
            });

            it('should navigate to route', () => {
                productAccountMenuConfigMock.routerMode = true;
                service.toggle({ open: true });

                expect(navigationServiceMock.goTo).toHaveBeenCalledWith('/product-menu');
            });

            it('should not animate', () => {
                service.toggle({ open: true, options: { animateFrom: AnimateOverlayFrom.Bottom } });

                const portal: ComponentPortal<ProductMenuOverlayComponent> = overlayRef.attach.calls.mostRecent().args[0];

                expect(portal.injector!.get<AnimatedOverlayRef>(AnimatedOverlayRef as Type<AnimatedOverlayRef>).shouldAnimate).toBeFalse();
            });
        });
    });

    describe('v2', () => {
        let menu: MenuContentItem;
        const contentEvents = new ReplaySubject<MenuContentItem>(1);

        beforeEach(() => {
            productAccountMenuConfigMock.v2 = true;
            productMenuServiceMock.v2 = true;
            productAccountMenuConfigMock.tabs = <any>{};
            productAccountMenuConfigMock.apps = <any>{};
            menu = {
                name: 'menu',
                children: [
                    {
                        name: 'tabs',
                        children: [
                            { name: 'sports', url: 'http://sports', text: 'Sportsbook', children: [] },
                            { name: 'testweb', url: 'http://testweb', text: 'Vanilla Testweb' },
                        ] as any,
                    } as MenuContentItem,
                    {
                        name: 'body',
                        children: [{ name: 'headerbar' }, { name: 'productcontent' }] as any,
                    } as MenuContentItem,
                ],
            } as MenuContentItem;

            productAccountMenuConfigMock.menu = <any>{ menu: 'undsled' };
            dslServiceMock.evaluateContent.withArgs(productAccountMenuConfigMock.menu).and.returnValue(contentEvents);
            contentEvents.next(menu);

            service = TestBed.inject(ProductMenuService);
        });

        describe('toggle()', () => {
            it('should animate from bottom to top', () => {
                service.toggle({ open: true, options: { animateFrom: AnimateOverlayFrom.Bottom } });

                const portal: ComponentPortal<ProductMenuOverlayComponent> = overlayRef.attach.calls.mostRecent().args[0];
                const ref = portal.injector!.get<AnimatedOverlayRef>(AnimatedOverlayRef as Type<AnimatedOverlayRef>);

                expect(ref.shouldAnimate).toBeTrue();
                expect(ref.states.initial).toBe('bottom');
                expect(ref.states.on).toBe('top');
                expect(ref.states.off).toBe('bottom');
            });

            it('should animate from left to right', () => {
                service.toggle({ open: true, options: { animateFrom: AnimateOverlayFrom.Left } });

                const portal: ComponentPortal<ProductMenuOverlayComponent> = overlayRef.attach.calls.mostRecent().args[0];
                const ref = portal.injector!.get<AnimatedOverlayRef>(AnimatedOverlayRef as Type<AnimatedOverlayRef>);

                expect(ref.shouldAnimate).toBeTrue();
                expect(ref.states.initial).toBe('left');
                expect(ref.states.on).toBe('right');
                expect(ref.states.off).toBe('left');
            });

            it('should not animate if not specified', () => {
                service.toggle();

                const portal: ComponentPortal<ProductMenuOverlayComponent> = overlayRef.attach.calls.mostRecent().args[0];
                const ref = portal.injector!.get<AnimatedOverlayRef>(AnimatedOverlayRef as Type<AnimatedOverlayRef>);

                expect(ref.shouldAnimate).toBeFalse();
            });
        });
    });
});
