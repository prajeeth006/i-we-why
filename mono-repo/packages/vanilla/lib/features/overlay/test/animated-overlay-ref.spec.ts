import { AnimationEvent } from '@angular/animations';

import { AnimatedOverlayRef } from '@frontend/vanilla/features/overlay';
import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';

describe('AnimatedOverlayRef', () => {
    let ref: AnimatedOverlayRef;
    let overlayRefMock: OverlayRefMock;
    let spy: jasmine.Spy;

    beforeEach(() => {
        overlayRefMock = MockContext.createMock(OverlayRefMock);

        spy = jasmine.createSpy();
    });

    describe('with animations', () => {
        beforeEach(() => {
            ref = new AnimatedOverlayRef(<any>overlayRefMock, { initial: 'init s', off: 'off s', on: 'on s' });
        });

        describe('init', () => {
            it('should expose animation data', () => {
                expect(ref.shouldAnimate).toBeTrue();
                expect(ref.states.initial).toBe('init s');
                expect(ref.states.off).toBe('off s');
                expect(ref.states.on).toBe('on s');
            });
        });

        describe('close()', () => {
            it('should notify subscribers before close', () => {
                ref.beforeClose().subscribe(spy);

                ref.close();

                expect(spy).toHaveBeenCalled();
            });

            it('should detach backdrop on animation start', () => {
                ref.close();

                ref.onAnimationEvent({ phaseName: 'start', toState: 'off s' } as AnimationEvent);

                expect(overlayRefMock.detachBackdrop).toHaveBeenCalled();
            });

            it('should close overlay on animation done', () => {
                ref.close();

                ref.onAnimationEvent({ phaseName: 'done', toState: 'off s' } as AnimationEvent);

                expect(overlayRefMock.dispose).toHaveBeenCalled();
            });

            it('should notify subscribers after closed', () => {
                ref.afterClosed().subscribe(spy);
                ref.close();

                ref.onAnimationEvent({ phaseName: 'done', toState: 'off s' } as AnimationEvent);

                expect(spy).toHaveBeenCalled();
            });
        });
    });

    describe('without animations', () => {
        beforeEach(() => {
            ref = new AnimatedOverlayRef(<any>overlayRefMock, null);
        });

        describe('init', () => {
            it('should expose animation data', () => {
                expect(ref.shouldAnimate).toBeFalse();
                expect(ref.states.initial).toBeUndefined();
                expect(ref.states.off).toBeUndefined();
                expect(ref.states.on).toBeUndefined();
            });
        });

        describe('close()', () => {
            it('should notify subscribers before close', () => {
                ref.beforeClose().subscribe(spy);

                ref.close();

                expect(spy).toHaveBeenCalled();
            });

            it('should close immediately', () => {
                ref.afterClosed().subscribe(spy);

                ref.close();

                expect(overlayRefMock.dispose).toHaveBeenCalled();
                expect(spy).toHaveBeenCalled();
            });
        });

        describe('onAnimationEvent', () => {
            it('should do nothing', () => {
                ref.onAnimationEvent({} as AnimationEvent);
            });
        });
    });
});
