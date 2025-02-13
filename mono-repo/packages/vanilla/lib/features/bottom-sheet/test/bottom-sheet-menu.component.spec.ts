import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicComponentDirective } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MockDslPipe2 } from '../../../core/test/browser/dsl.pipe.mock';
import { BottomSheetMenuComponent } from '../src/bottom-sheet-menu.component';
import { BottomSheetConfigMock, BottomSheetServiceMock } from './bottom-sheet.mock';

class Cmp {}

describe('BottomSheetMenuComponent', () => {
    let fixture: ComponentFixture<BottomSheetMenuComponent>;
    let bottomSheetContentMock: BottomSheetConfigMock;
    let bottomSheetServiceMock: BottomSheetServiceMock;

    beforeEach(() => {
        bottomSheetContentMock = MockContext.useMock(BottomSheetConfigMock);
        bottomSheetServiceMock = MockContext.useMock(BottomSheetServiceMock);

        TestBed.overrideComponent(BottomSheetMenuComponent, {
            set: {
                providers: [MockContext.providers],
                imports: [DynamicComponentDirective, MockDslPipe2, CommonModule],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(BottomSheetMenuComponent);

        fixture.detectChanges();
    });

    describe('init', () => {
        it('should have content', () => {
            expect(fixture.componentInstance.content).toBe(bottomSheetContentMock);
        });
    });

    describe('getItemComponent', () => {
        it('should get template for item type', () => {
            bottomSheetServiceMock.getBottomSheetComponent.withArgs('type').and.returnValue(Cmp);

            expect(fixture.componentInstance.getItemComponent('type')).toBe(Cmp);
        });
    });
});
