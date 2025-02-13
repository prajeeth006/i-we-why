import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SwipeDirection, SwipeDirective } from '../../src/core';

@Component({
    template: ` <div vnSwipe (onSwipe)="swipeDirection = $event"></div> `,
})
class TestComponent {
    swipeDirection: SwipeDirection;
}

describe('SwipeDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let element: DebugElement;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            imports: [SwipeDirective],
            declarations: [TestComponent],
        }).createComponent(TestComponent);

        component = fixture.componentInstance;
        element = fixture.debugElement.query(By.directive(SwipeDirective));
    });

    it('should handle swipe left', fakeAsync(() => {
        swipe(-1000);

        expect(component.swipeDirection).toBe(SwipeDirection.Left);
    }));

    it('should handle swipe right', fakeAsync(() => {
        swipe(1000);

        expect(component.swipeDirection).toBe(SwipeDirection.Right);
    }));

    it('should handle swipe up', fakeAsync(() => {
        swipe(0, -1000);

        expect(component.swipeDirection).toBe(SwipeDirection.Up);
    }));

    it('should handle swipe down', fakeAsync(() => {
        swipe(0, 1000);

        expect(component.swipeDirection).toBe(SwipeDirection.Down);
    }));

    function swipe(clientX = 0, clientY = 0) {
        const touchInit: TouchInit = { clientX: 0, clientY: 0, identifier: Date.now(), target: element.nativeElement };

        const touchstart = new TouchEvent('touchstart', {
            changedTouches: [new Touch(touchInit)],
        });

        const touchend = new TouchEvent('touchend', {
            changedTouches: [new Touch({ ...touchInit, clientX, clientY })],
        });

        element.nativeElement.dispatchEvent(touchstart);
        tick(500);
        element.nativeElement.dispatchEvent(touchend);
    }
});
