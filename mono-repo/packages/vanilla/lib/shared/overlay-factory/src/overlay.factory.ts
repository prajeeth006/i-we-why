import { Overlay, OverlayConfig, OverlayPositionBuilder, OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Injectable, Injector } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { AnimateOverlayFrom, AnimatedOverlayStates } from './overlay-factory.models';

/**
 * @stable
 */
export type InjectorFactory = (ref: OverlayRef) => Injector;

/**
 * @whatItDoes Provides a wrapper around Angular Overlay service.
 *
 * @howToUse
 *
 * ```
 * const overlay = this.overlayFactory.create(overlayConfig?);
 * ```
 *
 * If no config provided a default one will be used:
 * ```
 *  {
 *      hasBackdrop: true,
 *      backdropClass: 'vn-backdrop',
 *      panelClass: ['generic-modal-popup, popup-actions'],
 *      scrollStrategy: this.overlay.scrollStrategies.block(),
 *      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
 *      type: 'generic-modal-overlay'
 *  }
 * ```
 *
 * Available properties:
 * ```
 *  overlayHandler.overlayRefs;
 *  overlayHandler.overlayRefsSubject;
 *  overlayHandler.scrollStrategies;
 *  overlayHandler.position;
 * ```
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class OverlayFactory {
    get overlayRefs(): Map<string, OverlayRef> {
        return this.overlayReferences;
    }

    get overlayRefsSubject(): Observable<Map<string, OverlayRef> | null> {
        return this.overlayReferencesSubject;
    }

    get scrollStrategies(): ScrollStrategyOptions {
        return this.overlay.scrollStrategies;
    }

    get position(): OverlayPositionBuilder {
        return this.overlay.position();
    }

    private overlayReferences: Map<string, OverlayRef> = new Map();
    private overlayReferencesSubject = new BehaviorSubject<Map<string, OverlayRef> | null>(null);

    constructor(private overlay: Overlay) {}

    create(overlayConfig?: OverlayConfig): OverlayRef {
        const backdropClass = overlayConfig?.hasBackdrop === false ? undefined : 'vn-backdrop';
        const config: OverlayConfig = {
            hasBackdrop: true,
            ...(backdropClass ? { backdropClass } : {}),
            scrollStrategy: this.scrollStrategies.block(),
            positionStrategy: this.position.global().centerHorizontally().centerVertically(),
            panelClass: ['vn-overlay'],
            ...overlayConfig,
        };

        const overlayRef = this.overlay.create(config);
        const overlayClass = Array.isArray(overlayConfig?.panelClass) ? overlayConfig?.panelClass[0] : overlayConfig?.panelClass;

        this.overlayReferences.set(overlayClass || '', overlayRef);
        this.overlayReferencesSubject.next(this.overlayReferences);

        return overlayRef;
    }

    createAnimatedOverlayStates(animateFrom?: AnimateOverlayFrom): AnimatedOverlayStates | null {
        switch (animateFrom) {
            case AnimateOverlayFrom.Bottom:
                return { initial: 'bottom', on: 'top', off: 'bottom' };
            case AnimateOverlayFrom.Left:
                return { initial: 'left', on: 'right', off: 'left' };
            default:
                return null;
        }
    }

    dispose(overlay: OverlayRef | null) {
        overlay?.dispose();

        for (const [key, value] of this.overlayReferences.entries()) {
            if (value === overlay) {
                this.overlayReferences.delete(key);
                this.overlayReferencesSubject.next(this.overlayReferences);
            }
        }
    }
}
