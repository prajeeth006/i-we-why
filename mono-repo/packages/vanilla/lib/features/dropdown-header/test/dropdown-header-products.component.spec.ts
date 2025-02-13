import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PageMatrixService } from '@frontend/vanilla/features/content';
import { MockContext } from 'moxxi';

import { MockDslPipe } from '../../../core/test/browser/dsl.pipe.mock';
import { DropDownHeaderProductsComponent } from '../src/sub-components/dropdown-header-products.component';
import { DropDownHeaderContentMock, DropDownHeaderServiceMock } from './dropdown-header.mocks';

describe('DropdownHeaderProductsComponent', () => {
    let fixture: ComponentFixture<DropDownHeaderProductsComponent>;

    beforeEach(() => {
        MockContext.useMock(DropDownHeaderContentMock);
        MockContext.useMock(DropDownHeaderServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, PageMatrixService],
            declarations: [MockDslPipe],
            imports: [BrowserAnimationsModule],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(DropDownHeaderProductsComponent);
    });

    describe('init', () => {
        it('should setup properties', () => {
            fixture.detectChanges();

            expect(fixture.componentInstance.expanded).toBeFalse();
        });
    });
});
