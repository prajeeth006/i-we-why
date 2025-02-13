import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicHtmlDirective, EmbeddableComponentsService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { setupComponentFactoryResolver } from '../../../test/test-utils';

@Component({
    selector: 'vn-test',
    template: '<div [vnDynamicHtml]="html"></div>',
})
export class TestHostComponent {
    html: string = '<p>hello</p>';
}

describe('DynamicHtmlDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DynamicHtmlDirective],
            declarations: [TestHostComponent],
            providers: [MockContext.providers, EmbeddableComponentsService],
        });
        setupComponentFactoryResolver();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it('should render html', () => {
        expect(fixture.nativeElement).toHaveText('hello');
    });

    it('should update on changes', () => {
        fixture.componentInstance.html = '<span>update</span>';

        fixture.detectChanges();

        expect(fixture.nativeElement).toHaveText('update');
    });

    it('should render nothing if content is undefined', () => {
        fixture.componentInstance.html = <any>undefined;

        fixture.detectChanges();

        expect(fixture.nativeElement).toHaveText('');
    });

    // embedded components functionality is tested as part of other features
});
