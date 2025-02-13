import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { MockDslPipe2 } from '../../../core/test/browser/dsl.pipe.mock';
import { HeaderSectionComponent } from '../src/header-section/header-section.component';
import { HeaderServiceMock } from './header.mock';

class Cmp {}

describe('HeaderSectionComponent', () => {
    let fixture: ComponentFixture<HeaderSectionComponent>;
    let headerServiceMock: HeaderServiceMock;

    beforeEach(() => {
        headerServiceMock = MockContext.useMock(HeaderServiceMock);

        TestBed.overrideComponent(HeaderSectionComponent, {
            set: {
                providers: [MockContext.providers],
                imports: [CommonModule, MockDslPipe2],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(HeaderSectionComponent);

        fixture.detectChanges();
    });

    describe('getLazyComponent()', () => {
        it('should get the lazy component import for item type', () => {
            const cmpImport = Promise.resolve(Cmp);
            headerServiceMock.getLazyComponent.withArgs('typeTest').and.returnValue(cmpImport);

            fixture.componentRef.setInput('items', [{ type: 'typeTest', text: 'test' }]);

            fixture.detectChanges();

            expect(fixture.componentInstance.data[0]!.component$).toBe(cmpImport);
            expect(fixture.componentInstance.data[0]!.attr.item.text).toBe('test');
        });
    });
});
