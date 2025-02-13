import { AnimationEvent } from '@angular/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MockContext } from 'moxxi';

import { ProductMenuOverlayComponent } from '../src/product-menu-overlay.component';
import { AnimatedOverlayRefMock } from './animated-overlay-ref.mock';

describe('ProductMenuOverlayComponent', () => {
    let fixture: ComponentFixture<ProductMenuOverlayComponent>;
    let animatedOverlayRefMock: AnimatedOverlayRefMock;

    beforeEach(() => {
        animatedOverlayRefMock = MockContext.useMock(AnimatedOverlayRefMock);

        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        animatedOverlayRefMock.shouldAnimate = true;
        animatedOverlayRefMock.states = {
            initial: 'init s',
            off: 'off s',
            on: 'on s',
        };
        TestBed.overrideComponent(ProductMenuOverlayComponent, { set: { imports: [], schemas: [NO_ERRORS_SCHEMA] } });
        fixture = TestBed.createComponent(ProductMenuOverlayComponent);
    });

    describe('init', () => {
        it('should not set state if animation is disabled', () => {
            animatedOverlayRefMock.shouldAnimate = false;
            fixture.detectChanges();

            expect(fixture.componentInstance.state).toBeUndefined();
        });

        it('should animate from initial to on state, and to off state when closing', fakeAsync(() => {
            fixture.detectChanges();

            expect(fixture.componentInstance.state).toBe('init s');

            tick();

            expect(fixture.componentInstance.state).toBe('on s');

            animatedOverlayRefMock.beforeClose.completeWith();

            expect(fixture.componentInstance.state).toBe('off s');
        }));
    });

    describe('onAnimationEvent()', () => {
        it('should notify ref', () => {
            const event = {} as AnimationEvent;
            fixture.componentInstance.onAnimationEvent(event);

            expect(animatedOverlayRefMock.onAnimationEvent).toHaveBeenCalledWith(event);
        });
    });
});
