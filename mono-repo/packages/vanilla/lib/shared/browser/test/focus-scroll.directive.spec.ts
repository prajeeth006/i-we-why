import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { FocusScrollDirective } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { ElementRefMock } from '../../../core/test/element-ref.mock';

@Component({
    template: '<div #c [vnFocusScroll]="enabled"></div>',
})
class TestHostComponent {
    enabled: boolean;

    @ViewChild('c', { read: FocusScrollDirective, static: true }) directive: FocusScrollDirective;
}

describe('FocusScrollDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let windowMock: WindowMock;
    let elementRefMock: ElementRefMock;
    let event: any;

    beforeEach(() => {
        windowMock = new WindowMock();
        elementRefMock = MockContext.useMock(ElementRefMock);

        TestBed.configureTestingModule({
            imports: [FocusScrollDirective],
            providers: [
                MockContext.providers,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
            declarations: [TestHostComponent],
        });

        fixture = TestBed.createComponent(TestHostComponent);

        // HACK: can't inject ElementRef from DI
        (<any>fixture.componentInstance.directive).element = elementRefMock.nativeElement;
        fixture.detectChanges();

        event = {
            preventDefault: jasmine.createSpy('preventDefault'),
        };

        windowMock.document.removeEventListener.calls.reset();
    });

    it('should disable native scrolling when toggled on', () => {
        fixture.componentInstance.enabled = true;
        fixture.detectChanges();

        expect(windowMock.document.addEventListener).toHaveBeenCalledWith('touchmove', jasmine.any(Function), false);

        const handler = windowMock.document.addEventListener.calls.mostRecent().args[1];
        handler(event);

        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should enable native scrolling and scroll element to top when toggled off', () => {
        fixture.componentInstance.enabled = true;
        fixture.detectChanges();

        elementRefMock.nativeElement.scrollTop = 10;

        const handler = windowMock.document.addEventListener.calls.mostRecent().args[1];

        fixture.componentInstance.enabled = false;
        fixture.detectChanges();

        expect(windowMock.document.removeEventListener).toHaveBeenCalledWith('touchmove', handler, false);
        expect(elementRefMock.nativeElement.scrollTop).toBe(0);
    });

    it('should enable element scrolling when toggled on', () => {
        fixture.componentInstance.enabled = true;
        fixture.detectChanges();

        expect(elementRefMock.nativeElement.addEventListener).toHaveBeenCalledWith('touchstart', jasmine.any(Function), false);
        expect(elementRefMock.nativeElement.addEventListener).toHaveBeenCalledWith('touchmove', jasmine.any(Function), false);
    });

    it('should disable menu scrolling when toggled off', () => {
        fixture.componentInstance.enabled = true;
        fixture.detectChanges();

        const startHandler = elementRefMock.nativeElement.addEventListener.calls.argsFor(0)[1];
        const moveHandler = elementRefMock.nativeElement.addEventListener.calls.argsFor(1)[1];

        fixture.componentInstance.enabled = false;
        fixture.detectChanges();

        expect(elementRefMock.nativeElement.removeEventListener).toHaveBeenCalledWith('touchstart', startHandler, false);
        expect(elementRefMock.nativeElement.removeEventListener).toHaveBeenCalledWith('touchmove', moveHandler, false);
    });

    it('should scroll menu when toggled on', () => {
        fixture.componentInstance.enabled = true;
        fixture.detectChanges();

        const scroller = new ElementScroller();

        scroller.start(450);
        scroller.move(400, 50);
        scroller.move(420, 30);
        scroller.move(250, 200);

        scroller.start(0);
        scroller.move(90, 110);
        scroller.move(50, 150);
    });

    class ElementScroller {
        private startHandler: Function;
        private moveHandler: Function;

        constructor() {
            elementRefMock.nativeElement.scrollTop = 0;
            this.startHandler = elementRefMock.nativeElement.addEventListener.calls.argsFor(0)[1];
            this.moveHandler = elementRefMock.nativeElement.addEventListener.calls.argsFor(1)[1];
        }

        start(pos: number) {
            this.startHandler(this.createEvent(pos));
        }

        move(pos: number, expectedPos: number) {
            const event = this.createEvent(pos);

            this.moveHandler(event);

            expect(elementRefMock.nativeElement.scrollTop).toBe(expectedPos);
            expect(event.preventDefault).toHaveBeenCalled();
        }

        private createEvent(pos: number) {
            return {
                preventDefault: jasmine.createSpy('preventDefault'),
                touches: [
                    {
                        clientY: pos,
                    },
                ],
            };
        }
    }
});
