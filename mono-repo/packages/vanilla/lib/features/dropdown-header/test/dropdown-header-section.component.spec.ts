import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { MockDslPipe2 } from '../../../core/test/browser/dsl.pipe.mock';
import { DropDownHeaderSectionComponent } from '../src/sub-components/dropdown-header-section.component';
import { DropDownHeaderServiceMock } from './dropdown-header.mocks';

class Cmp {}

describe('DropDownHeaderSectionComponent', () => {
    let fixture: ComponentFixture<DropDownHeaderSectionComponent>;
    let component: DropDownHeaderSectionComponent;

    let dropDownHeaderServiceMock: DropDownHeaderServiceMock;

    beforeEach(() => {
        dropDownHeaderServiceMock = MockContext.useMock(DropDownHeaderServiceMock);

        TestBed.overrideComponent(DropDownHeaderSectionComponent, {
            set: {
                providers: [MockContext.providers],
                imports: [MockDslPipe2, CommonModule],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(DropDownHeaderSectionComponent);
        component = fixture.componentInstance;
    });

    describe('getItemComponent()', () => {
        it('should get template for item type', () => {
            dropDownHeaderServiceMock.getDropDownHeaderComponent.withArgs('type').and.returnValue(Cmp);
            expect(component.getItemComponent('type')).toBe(Cmp);
        });
    });
});
