import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MenuItemCounter } from '@frontend/vanilla/core';
import { MenuItemBadgeDirective } from '@frontend/vanilla/features/menus';
import { MockContext } from 'moxxi';

import { ElementRefMock } from '../../../core/test/element-ref.mock';
import { BadgeConfigMock } from '../../../shared/badge/test/badge-config.mock';
import { MenuItemsServiceMock } from '../../account-menu/test/menu-items.mock';

@Component({
    template: `<span vnMenuItemBadge [section]="section" [item]="item" [badgeClass]="badgeClass" [badgeType]="undefined"></span>`,
})
class TestHostComponent {
    section: string = 'sec';
    item: string = 'it';
    badgeClass: string;
}

describe('MenuItemBadgeDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let menuItemsServiceMock: MenuItemsServiceMock;
    let component: DebugElement;
    let counter: MenuItemCounter;

    beforeEach(() => {
        menuItemsServiceMock = MockContext.useMock(MenuItemsServiceMock);
        MockContext.useMock(ElementRefMock);
        MockContext.useMock(BadgeConfigMock);

        TestBed.configureTestingModule({
            imports: [MenuItemBadgeDirective],
            providers: [MockContext.providers],
            declarations: [TestHostComponent],
            schemas: [NO_ERRORS_SCHEMA],
        });

        counter = {} as MenuItemCounter;

        menuItemsServiceMock.getCounter.withArgs('sec', 'it').and.returnValue(counter);

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.debugElement.query(By.directive(MenuItemBadgeDirective));
    });

    describe('init', () => {
        it('should setup counter', () => {
            counter.count = 5;
            counter.cssClass = 'cls';

            fixture.detectChanges();

            expect(component.nativeElement).not.toBeHidden();
            expect(component.nativeElement).toHaveText('5');
            expect(component.nativeElement).toHaveClass(['badge', 'badge-circle', 'badge-t-r', 'cls']);
        });

        it('should add badge class', () => {
            counter.count = 5;
            counter.cssClass = 'cls';
            fixture.componentInstance.badgeClass = 'bcls';

            fixture.detectChanges();

            expect(component.nativeElement).not.toBeHidden();
            expect(component.nativeElement).toHaveText('5');
            expect(component.nativeElement).toHaveClass(['badge', 'badge-circle', 'badge-t-r', 'bcls', 'cls']);
        });

        it('should use default class if not specified', () => {
            counter.count = 5;

            fixture.detectChanges();

            expect(component.nativeElement).not.toBeHidden();
            expect(component.nativeElement).toHaveText('5');
            expect(component.nativeElement).toHaveClass(['badge', 'badge-circle', 'badge-t-r', 'badge-default']);
        });

        it('should not show counter if its empty', () => {
            fixture.detectChanges();

            expect(component.nativeElement).toBeHidden();
        });
    });
});
