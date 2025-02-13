import { FlexibleConnectedPositionStrategy, GlobalPositionStrategy, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { DeviceService, DomChangeService, ElementRepositoryService, HtmlNode, MediaQueryService, VanillaElements } from '@frontend/vanilla/core';
import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { QuickDepositResponsiveComponent } from './quick-deposit-responsive.component';
import { QuickDepositOptions } from './quick-deposit.models';
import { QUICK_DEPOSIT_OPTIONS } from './quick-deposit.service';

@Injectable({ providedIn: 'root' })
export class QuickDepositOverlayService {
    private currentRef: OverlayRef | null;
    private unsubscribe: Subject<void> | null;
    private removeScrollBlockOnClose = false;

    constructor(
        private overlay: OverlayFactory,
        private elementRepositoryService: ElementRepositoryService,
        private injector: Injector,
        private media: MediaQueryService,
        private domChangeService: DomChangeService,
        private htmlNode: HtmlNode,
        private deviceService: DeviceService,
    ) {}

    private get isDesktop(): boolean {
        return this.media.isActive('gt-sm');
    }

    private static getInjector(overlayRef: OverlayRef, options: QuickDepositOptions, parentInjector: Injector): Injector {
        return Injector.create({
            providers: [
                { provide: OverlayRef, useValue: overlayRef },
                { provide: QUICK_DEPOSIT_OPTIONS, useValue: options },
            ],
            parent: parentInjector,
        });
    }

    show(options: QuickDepositOptions) {
        if (!this.currentRef) {
            // check if 'cdk-global-scrollblock'-class was added by some other component e.g. menu
            this.removeScrollBlockOnClose = !this.htmlNode.hasBlockScrolling();
            const panelclass = this.deviceService.isMobilePhone
                ? ['lh-quick-deposit-container', 'generic-modal-drawer']
                : ['lh-quick-deposit-container'];
            const overlayRef = this.overlay.create({
                backdropClass: 'lh-backdrop',
                panelClass: panelclass,
                scrollStrategy: this.overlay.scrollStrategies.noop(),
                positionStrategy: this.createPositionStrategy(),
            });
            overlayRef.backdropClick().subscribe(() => overlayRef.detach());
            overlayRef.detachments().subscribe(() => {
                this.stopReactingToMediaChanges();
                this.overlay.dispose(this.currentRef);
                this.currentRef = null;

                if (this.removeScrollBlockOnClose) {
                    this.htmlNode.blockScrolling(false);
                }
            });

            const injector = QuickDepositOverlayService.getInjector(overlayRef, options, this.injector);

            const portal = new ComponentPortal(QuickDepositResponsiveComponent, null, injector);
            overlayRef.attach(portal);

            this.currentRef = overlayRef;

            this.reactToMediaChanges();

            this.htmlNode.blockScrolling(true);
        }
    }

    private createPositionStrategy(): FlexibleConnectedPositionStrategy | GlobalPositionStrategy {
        if (this.isDesktop) {
            const anchor = this.elementRepositoryService.get(VanillaElements.DEPOSIT_BUTTON_ANCHOR)!;

            return this.overlay.position
                .flexibleConnectedTo(anchor)
                .withPositions([{ originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' }])
                .withPush(false)
                .withFlexibleDimensions(false);
        }

        return this.overlay.position.global().top();
    }

    private reactToMediaChanges() {
        this.unsubscribe = new Subject();
        this.media
            .observe()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(() => {
                this.currentRef!.updatePositionStrategy(this.createPositionStrategy());
            });

        this.domChangeService
            .observe(this.elementRepositoryService.get(VanillaElements.AUTH_HEADER_SECTION)!)
            .pipe(
                takeUntil(this.unsubscribe),
                filter(
                    (m: MutationRecord) =>
                        this.isDesktop &&
                        Array.from(m.addedNodes).some((n: Node) => n.nodeType == 1 && (<HTMLElement>n).innerHTML.includes('deposit-button-anchor')),
                ),
            )
            .subscribe(() => {
                this.currentRef!.updatePositionStrategy(this.createPositionStrategy());
            });
    }

    private stopReactingToMediaChanges() {
        this.unsubscribe?.next();
        this.unsubscribe?.complete();
        this.unsubscribe = null;
    }
}
