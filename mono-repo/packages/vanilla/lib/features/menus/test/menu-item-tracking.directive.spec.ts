import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { WebAnalyticsEventType } from '../../../core/src/tracking/tracking-provider';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { MenuItemTrackingDirective } from '../src/menu-item-tracking.directive';

@Component({
    template: `<span vnMenuItemTracking [item]="item"></span>`,
})
class TestHostComponent {
    item: string = 'it';
}

describe('MenuItemTrackingDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let trackingServiceMock: TrackingServiceMock;
    let inputEl: DebugElement;
    let directive: MenuItemTrackingDirective;

    beforeEach(() => {
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            imports: [MenuItemTrackingDirective],
            providers: [MockContext.providers, MenuItemTrackingDirective],
            declarations: [TestHostComponent],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        inputEl = fixture.debugElement.query(By.css('span'));
        directive = TestBed.inject(MenuItemTrackingDirective);
    });

    describe('onInit', () => {
        it('should track load', () => {
            fixture.componentInstance.item = 'test';
            fixture.detectChanges();
            directive.ngOnInit();
            expect(trackingServiceMock.trackEvents).toHaveBeenCalledWith('test', WebAnalyticsEventType.load);
        });
    });

    describe('click', () => {
        it('should track click', () => {
            fixture.componentInstance.item = 'test';
            fixture.detectChanges();

            inputEl.triggerEventHandler('click');

            expect(menuActionsServiceMock.trackClick).toHaveBeenCalledWith('test', true);
        });
    });
});
