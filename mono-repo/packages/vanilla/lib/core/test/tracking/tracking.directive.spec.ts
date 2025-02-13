import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TrackingDirective } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../src/tracking/test/tracking.mock';

@Component({
    template: '<button [vnTrackingEvent]="event" [vnTrackingData]="data" [vnTrackingTrigger]="trigger">CTA</button>',
})
class TestHostComponent {
    event: string | undefined;
    data: any;
    trigger: any;
}

describe('TrackingDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let element: HTMLElement;
    let trackingServiceMock: TrackingServiceMock;
    let triggers: any;
    let eventName: string | undefined;

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        triggers = undefined;
        eventName = 'Some_Event';

        TestBed.configureTestingModule({
            imports: [TrackingDirective],
            declarations: [TestHostComponent],
            providers: [MockContext.providers],
        });
    });

    it('should track on click by default', () => {
        initDirective();

        element.dispatchEvent(new Event('click'));

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Some_Event', null);
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledTimes(1);
    });

    it('should not track when event name is empty', () => {
        eventName = undefined;

        initDirective();

        element.dispatchEvent(new Event('click'));

        expect(trackingServiceMock.triggerEvent).not.toHaveBeenCalled();
    });

    it('should track on specified event', () => {
        triggers = 'focus';

        initDirective();

        element.dispatchEvent(new Event('focus'));

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Some_Event', null);
    });

    it('should track on specified events', () => {
        triggers = ['focus', 'click', 'blur'];

        initDirective();

        element.dispatchEvent(new Event('focus'));
        element.dispatchEvent(new Event('click'));
        element.dispatchEvent(new Event('blur'));

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledTimes(3);
    });

    it('should track additional data', () => {
        initDirective();

        fixture.componentInstance.data = {
            param: 'a',
        };
        fixture.detectChanges();

        element.dispatchEvent(new Event('click'));

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Some_Event', { param: 'a' });
    });

    it('should replace placeholders in data', () => {
        initDirective();

        fixture.componentInstance.data = {
            '${event.type}': '${event.target.innerText}',
        };
        fixture.detectChanges();

        element.dispatchEvent(new Event('click'));

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Some_Event', { click: 'CTA' });
    });

    it('should support function that returns data', () => {
        initDirective();

        fixture.componentInstance.data = (e: Event) => {
            return {
                param: e.type,
            };
        };
        fixture.detectChanges();

        element.dispatchEvent(new Event('click'));

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Some_Event', { param: 'click' });
    });

    it('should replace placeholders in event name', () => {
        initDirective();

        fixture.componentInstance.event = 'Event_${event.type}';
        fixture.detectChanges();

        element.dispatchEvent(new Event('click'));

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event_click', null);
    });

    function initDirective() {
        fixture = TestBed.createComponent(TestHostComponent);

        fixture.componentInstance.trigger = triggers;
        fixture.componentInstance.event = eventName;

        fixture.detectChanges();

        element = getDirectiveElement();
    }

    function getDirectiveElement() {
        const debugEl = fixture.debugElement.query(By.css('button'));
        return debugEl ? debugEl.nativeElement : undefined;
    }
});
