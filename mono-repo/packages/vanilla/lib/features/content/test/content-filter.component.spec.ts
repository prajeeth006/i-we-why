import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicHtmlDirective, EmbeddableComponentsService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { setupComponentFactoryResolver } from '../../../test/test-utils';
import { ContentFilterComponent } from '../src/content-filter.component';

@Component({
    template: '<div [vnDynamicHtml]="content"></div>',
})
class TestHostComponent {
    content: any;
}

describe('ContentFilterComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let dslServiceMock: DslServiceMock;

    let dsl1: BehaviorSubject<boolean>;
    let dsl2: BehaviorSubject<boolean>;
    let dsl3: BehaviorSubject<boolean>;

    let content: string;

    beforeEach(() => {
        dslServiceMock = MockContext.useMock(DslServiceMock);

        TestBed.configureTestingModule({
            imports: [ContentFilterComponent, DynamicHtmlDirective],
            providers: [MockContext.providers, EmbeddableComponentsService],
            declarations: [TestHostComponent],
        });
        setupComponentFactoryResolver();

        const embeddableComponentsService: EmbeddableComponentsService = TestBed.inject(EmbeddableComponentsService);
        embeddableComponentsService.registerEmbeddableComponent(ContentFilterComponent);

        content = `
        <div data-content-filter="dsl1">
            <span>DSL1</span>
            <div data-content-filter="dsl2">
                <span>DSL2</span>
            </div>
        </div>
        <div data-content-filter="dsl3"><span>DSL3</span></div>
        `;

        dsl1 = new BehaviorSubject(false);
        dsl2 = new BehaviorSubject(false);
        dsl3 = new BehaviorSubject(false);

        dslServiceMock.evaluateExpression.withArgs('dsl1').and.returnValue(dsl1);
        dslServiceMock.evaluateExpression.withArgs('dsl2').and.returnValue(dsl2);
        dslServiceMock.evaluateExpression.withArgs('dsl3').and.returnValue(dsl3);
    });

    function initComponent() {
        fixture = TestBed.createComponent(TestHostComponent);

        fixture.componentInstance.content = content;

        fixture.detectChanges();
    }

    it('should filter content based on conditions', () => {
        initComponent();

        dsl1.next(true);
        dsl2.next(true);
        dsl3.next(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.innerText).toBe(`DSL1
DSL2
DSL3`);

        dsl2.next(false);
        fixture.detectChanges();

        expect(fixture.nativeElement.innerText).toBe(`DSL1
DSL3`);

        dsl2.next(true);
        dsl1.next(false);
        dsl3.next(false);
        fixture.detectChanges();

        expect(fixture.nativeElement.innerText).toBe('');
    });

    it('should set style to display none if hidden, then restore it when shown again', () => {
        content = '<div style="color:red" data-content-filter="dsl1">DSL</div>';

        initComponent();

        expect(fixture.nativeElement.querySelector('[data-content-filter]').getAttribute('style')).toBe('display: none');

        dsl1.next(true);
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('[data-content-filter]').getAttribute('style')).toBe('color:red');
    });
});
