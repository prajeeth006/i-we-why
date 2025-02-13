import { DOCUMENT } from '@angular/common';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MenuContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { DropdownComponent } from '../src/dropdown/dropdown.component';

describe('DropdownComponent', () => {
    let fixture: ComponentFixture<DropdownComponent>;
    let item: MenuContentItem;
    let doc: Document;

    beforeEach(() => {
        MockContext.useMock(MenuActionsServiceMock);

        TestBed.overrideComponent(DropdownComponent, {
            set: {
                imports: [],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        item = { name: 'x', parameters: {} } as any;

        fixture = TestBed.createComponent(DropdownComponent);
        doc = TestBed.inject(DOCUMENT);
        fixture.componentInstance.item = item;
    });

    describe('toggle', () => {
        it('should show/hide items', () => {
            fixture.detectChanges();
            expect(fixture.componentInstance.showChildren).toBeFalse();
            fixture.componentInstance.toggle();
            expect(fixture.componentInstance.showChildren).toBeTrue();
        });
    });

    describe('click listener', () => {
        let toggleSpy: any;
        let ownElement: DebugElement;
        let mouseEvent: MouseEvent;
        beforeEach(() => {
            toggleSpy = spyOn(fixture.componentInstance, 'toggle').and.callThrough();
            ownElement = fixture.debugElement.query(By.css('.tab-nav-list'));
            mouseEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                relatedTarget: doc,
            });
        });

        it('should hide items', () => {
            fixture.detectChanges();
            fixture.componentInstance.showChildren = true;

            doc.dispatchEvent(mouseEvent);

            expect(fixture.componentInstance.showChildren).toBeFalse();
            expect(toggleSpy).toHaveBeenCalled();
        });

        it('should do nothing if click inside', () => {
            fixture.detectChanges();
            fixture.componentInstance.showChildren = true;

            ownElement.nativeElement.dispatchEvent(mouseEvent);

            expect(toggleSpy).not.toHaveBeenCalled();
        });

        it('should do nothing if items already hidden.', () => {
            fixture.detectChanges();

            ownElement.nativeElement.dispatchEvent(mouseEvent);

            expect(toggleSpy).not.toHaveBeenCalled();
        });
    });

    describe('touch listener', () => {
        let toggleSpy: any;
        let ownElement: DebugElement;
        let touchEvent: TouchEvent;
        beforeEach(() => {
            toggleSpy = spyOn(fixture.componentInstance, 'toggle').and.callThrough();
            ownElement = fixture.debugElement.query(By.css('.tab-nav-list'));
            touchEvent = new TouchEvent('touchstart', {
                view: window,
                bubbles: true,
                cancelable: true,
            });
        });

        it('should hide items', () => {
            fixture.detectChanges();
            fixture.componentInstance.showChildren = true;

            doc.dispatchEvent(touchEvent);

            expect(fixture.componentInstance.showChildren).toBeFalse();
            expect(toggleSpy).toHaveBeenCalled();
        });

        it('should do nothing if click inside', () => {
            fixture.detectChanges();
            fixture.componentInstance.showChildren = true;

            ownElement.nativeElement.dispatchEvent(touchEvent);

            expect(toggleSpy).not.toHaveBeenCalled();
        });

        it('should do nothing if items already hidden.', () => {
            fixture.detectChanges();

            ownElement.nativeElement.dispatchEvent(touchEvent);

            expect(toggleSpy).not.toHaveBeenCalled();
        });
    });
});
