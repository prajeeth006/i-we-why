import { AnimationEvent } from '@angular/animations';
import { OverlayRef } from '@angular/cdk/overlay';

import { AnimatedOverlayStates } from '@frontend/vanilla/shared/overlay-factory';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

enum AnimationStage {
    StartOpen,
    EndOpen,
    StartClose,
    EndClose,
}

/**
 * @whatItDoes Represents a reference to a cdk overlay and provides functionality to handle closing it with an animation.
 *
 * @stable
 */
export class AnimatedOverlayRef {
    private beforeClosedStream = new Subject<void>();
    private afterClosedStream = new Subject<void>();
    private animationStream = new Subject<AnimationStage | undefined>();

    get states(): Partial<AnimatedOverlayStates> {
        return this.animationStates || {};
    }

    get shouldAnimate(): boolean {
        return !!this.animationStates;
    }

    constructor(
        private overlayRef: OverlayRef,
        private animationStates: AnimatedOverlayStates | null,
    ) {}

    close() {
        this.beforeClosedStream.next();
        this.beforeClosedStream.complete();

        if (this.shouldAnimate) {
            this.animationStream.pipe(first((s) => s === AnimationStage.StartClose)).subscribe(() => this.overlayRef.detachBackdrop());

            this.animationStream.pipe(first((s) => s === AnimationStage.EndClose)).subscribe(() => this.closeOverlay());
        } else {
            this.closeOverlay();
        }
    }

    onAnimationEvent(event: AnimationEvent) {
        if (!this.shouldAnimate) {
            return;
        }

        this.animationStream.next(this.resolveAnimationStage(event.phaseName, event.toState));
    }

    afterClosed(): Observable<void> {
        return this.afterClosedStream.asObservable();
    }

    beforeClose(): Observable<void> {
        return this.beforeClosedStream.asObservable();
    }

    private closeOverlay() {
        this.overlayRef.dispose();
        this.afterClosedStream.next();
        this.afterClosedStream.complete();
    }

    private resolveAnimationStage(phase: string, toState: string): AnimationStage | undefined {
        switch (phase) {
            case 'start':
                switch (toState) {
                    case this.states.off:
                        return AnimationStage.StartClose;
                    case this.states.on:
                        return AnimationStage.StartOpen;
                }
                break;
            case 'done':
                switch (toState) {
                    case this.states.off:
                        return AnimationStage.EndClose;
                    case this.states.on:
                        return AnimationStage.EndOpen;
                }
                break;
        }

        return;
    }
}
