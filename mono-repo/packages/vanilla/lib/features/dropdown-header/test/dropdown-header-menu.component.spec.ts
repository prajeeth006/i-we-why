import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { DropDownHeaderMenuComponent } from '../src/sub-components/dropdown-header-menu.component';
import { DropDownHeaderContentMock, DropDownHeaderServiceMock } from './dropdown-header.mocks';

describe('DropdownHeaderMenuComponent', () => {
    let fixture: ComponentFixture<DropDownHeaderMenuComponent>;
    let component: DropDownHeaderMenuComponent;

    let dropDownHeaderServiceMock: DropDownHeaderServiceMock;

    beforeEach(() => {
        MockContext.useMock(DropDownHeaderContentMock);
        dropDownHeaderServiceMock = MockContext.useMock(DropDownHeaderServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(DropDownHeaderMenuComponent);
        component = fixture.componentInstance;
    });

    describe('init', () => {
        it('should setup properties', () => {
            fixture.detectChanges();

            expect(component.expanded).toBeFalse();
        });
    });

    describe('menuClick', () => {
        it('should set expanded property and emit event', () => {
            fixture.detectChanges();

            component.menuClick(true);

            expect(component.expanded).toBeTrue();
            expect(dropDownHeaderServiceMock.toggleMenu).toHaveBeenCalledWith(true);
        });
    });
});
