import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { EventsService, LocalStoreKey, NavigationService, SessionStoreService, SimpleEvent, VanillaEventNames } from '@frontend/vanilla/core';
import { AnimatedOverlayRef } from '@frontend/vanilla/features/overlay';
import { AnimateOverlayFrom, AnimatedOverlayStates, OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';
import { ProductMenuConfig, ProductMenuService as SharedProductMenuService } from '@frontend/vanilla/shared/product-menu';
import { filter } from 'rxjs/operators';

import { ProductMenuOverlayComponent } from './product-menu-overlay.component';
import { ProductMenuTrackingService } from './product-menu-tracking.service';
import { ProductMenuToggleEvent } from './product-menu.models';

@Injectable()
export class ProductMenuService {
    private currentRef: AnimatedOverlayRef | null;

    constructor(
        private overlay: OverlayFactory,
        private injector: Injector,
        private productMenuConfig: ProductMenuConfig,
        private navigationService: NavigationService,
        private sessionStoreService: SessionStoreService,
        private sharedProductMenuService: SharedProductMenuService,
        private eventsService: EventsService,
        private productMenuTrackingService: ProductMenuTrackingService,
    ) {
        this.eventsService.events
            .pipe(filter((e: SimpleEvent) => e?.eventName === VanillaEventNames.ProductMenuToggle))
            .subscribe((event: SimpleEvent) => {
                this.toggle(event.data);
            });
    }

    toggle(event?: ProductMenuToggleEvent) {
        const options = event?.options || {};
        const isOpen = event?.open == null ? !this.currentRef : event?.open;

        if (this.productMenuConfig.routerMode) {
            if (isOpen) {
                this.sessionStoreService.set(LocalStoreKey.VnProductMenuReturnUrl, this.navigationService.location.absUrl());
                this.navigationService.goTo('/product-menu');
                this.sharedProductMenuService.openTab(options.initialTab || null);
            } else {
                this.productMenuTrackingService.trackProductMenuClose();
                this.goToReturnUrl();
            }
        } else {
            if (isOpen && !this.currentRef) {
                const overlayRef = this.overlay.create({
                    panelClass: 'vn-product-menu-container',
                    positionStrategy: this.overlay.position.global(),
                });
                overlayRef.backdropClick().subscribe(() => this.currentRef?.close());

                const productMenuOverlayRef = new AnimatedOverlayRef(overlayRef, this.createAnimationConfig(options.animateFrom));
                productMenuOverlayRef.afterClosed().subscribe(() => {
                    this.overlay.dispose(overlayRef);
                    this.currentRef = null;
                });

                this.sharedProductMenuService.openTab(options.initialTab || null);

                const portal = new ComponentPortal(
                    ProductMenuOverlayComponent,
                    null,
                    Injector.create({
                        providers: [{ provide: AnimatedOverlayRef, useValue: productMenuOverlayRef }],
                        parent: this.injector,
                    }),
                );
                overlayRef.attach(portal);

                this.currentRef = productMenuOverlayRef;
            } else if (!event?.open && this.currentRef) {
                this.productMenuTrackingService.trackProductMenuClose();

                if (options.disableCloseAnimation) {
                    this.currentRef.states.off = '';
                }

                this.currentRef.close();
            }
        }
    }

    private goToReturnUrl() {
        const returnUrl = this.sharedProductMenuService.routerModeReturnUrl;

        if (returnUrl) {
            this.sessionStoreService.remove(LocalStoreKey.VnProductMenuReturnUrl);
            this.navigationService.goTo(returnUrl);
        } else {
            this.navigationService.goToLastKnownProduct();
        }
    }

    private createAnimationConfig(animateFrom?: AnimateOverlayFrom): AnimatedOverlayStates | null {
        if (!this.productMenuConfig.animateV1 && !this.sharedProductMenuService.v2) {
            return null;
        }

        switch (animateFrom) {
            case AnimateOverlayFrom.Bottom:
                return { initial: 'bottom', on: 'top', off: 'bottom' };
            case AnimateOverlayFrom.Left:
                return { initial: 'left', on: 'right', off: 'left' };
            default:
                return null;
        }
    }
}
