import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MenuItemActionDirective } from '@frontend/vanilla/features/menus';
import { MockContext } from 'moxxi';

import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';

@Component({
    template: `<span vnMenuItemAction [item]="item" [origin]="origin"></span>`,
})
class TestHostComponent {
    item: string = 'it';
    origin: string = 'section';
}

describe('MenuItemActionDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let inputEl: DebugElement;

    beforeEach(() => {
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);

        TestBed.configureTestingModule({
            imports: [MenuItemActionDirective],
            providers: [MockContext.providers],
            declarations: [TestHostComponent],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        inputEl = fixture.debugElement.query(By.css('span'));
    });

    describe('click', () => {
        it('should process specified menu action', () => {
            fixture.componentInstance.origin = 'section';
            fixture.componentInstance.item = 'test';

            fixture.detectChanges();
            inputEl.triggerEventHandler('click');

            expect(menuActionsServiceMock.processClick).toHaveBeenCalledWith(undefined, 'test', 'section', false);
        });
    });
});
