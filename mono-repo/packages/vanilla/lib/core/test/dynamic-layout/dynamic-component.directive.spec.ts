import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DynamicComponentDirective } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { setupComponentFactoryResolver } from '../../../test/test-utils';
import { Test2Component, TestComponent, TestDynamicModule } from './dynamic-components';

@Component({
    template: '<ng-container *vnDynamicComponent="component; attr: attr" />',
})
class TestHostComponent {
    component: Type<any> | undefined;
    attr: any;
}

describe('DynamicComponentDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            imports: [TestDynamicModule.forRoot(), DynamicComponentDirective],
            providers: [MockContext.providers],
        });
        setupComponentFactoryResolver();
    });

    function initComponent() {
        fixture = TestBed.createComponent(TestHostComponent);

        fixture.componentInstance.component = TestComponent;
        fixture.componentInstance.attr = { name: 'Mike' };

        fixture.detectChanges();
    }

    describe('init', () => {
        it('should compile and render the specified component', () => {
            initComponent();

            expect(fixture.debugElement.query(By.css('span')).nativeElement).toHaveText('hello Mike');
        });

        it('should update if component changes and destroy old component', () => {
            initComponent();

            fixture.componentInstance.component = Test2Component;
            fixture.componentInstance.attr = undefined;
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('span')).nativeElement).toHaveText('hi');
            expect(fixture.debugElement.query(By.directive(TestComponent))).toBeNull();
        });

        it('should render nothing if no component is specified', () => {
            initComponent();

            fixture.componentInstance.component = undefined;
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.directive(TestComponent))).toBeNull();
        });
    });

    describe('changes', () => {
        it('should rerender component when attr changes', () => {
            testAttrChange({ name: 'Peter' }, 'hello Peter');
        });

        function testAttrChange(attr: any, expectedText: string) {
            initComponent();

            const span = fixture.debugElement.query(By.css('span')).nativeElement;

            fixture.componentInstance.attr = attr;
            fixture.detectChanges();

            // Note: expect the same HtmlElement instance as before the change, only text content was updated.
            expect(fixture.debugElement.query(By.css('span')).nativeElement).toBe(span);
            expect(fixture.debugElement.query(By.css('span')).nativeElement).toHaveText(expectedText);
        }
    });
});
