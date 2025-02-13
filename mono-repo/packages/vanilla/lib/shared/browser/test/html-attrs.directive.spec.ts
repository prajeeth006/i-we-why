import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HtmlAttrsDirective } from '@frontend/vanilla/shared/browser';

@Component({
    template: '<div class="abc" [vnHtmlAttrs]="attrs" id="old_id"></div>',
})
class TestHostComponent {
    attrs: any;
}

describe('HtmlAttrsDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HtmlAttrsDirective],
            declarations: [TestHostComponent],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.componentInstance.attrs = { class: 'foo', title: 'Hello', id: 'new_id' };

        fixture.detectChanges();
    });

    function getElement(): HTMLElement {
        return fixture.debugElement.query(By.css('div')).nativeElement;
    }

    it('should apply HTML attributes to element', () => {
        const element = getElement();

        expect(element.getAttribute('class')).toBe('abc foo');
        expect(element.getAttribute('title')).toBe('Hello');
        expect(element.getAttribute('id')).toBe('new_id');
    });

    it('should update HTML attributes on element', () => {
        const element = getElement();

        expect(element.getAttribute('class')).toBe('abc foo');
        expect(element.getAttribute('title')).toBe('Hello');
        expect(element.getAttribute('id')).toBe('new_id');

        fixture.componentInstance.attrs = { class: 'bar', title: 'LUL', id: 'new_id' };

        fixture.detectChanges();

        expect(element.getAttribute('class')).toBe('abc bar');
        expect(element.getAttribute('title')).toBe('LUL');
        expect(element.getAttribute('id')).toBe('new_id');
    });

    it('should revert attributes to base value when removed', () => {
        const element = getElement();

        fixture.componentInstance.attrs = {};

        fixture.detectChanges();

        expect(element.getAttribute('class')).toBe('abc');
        expect(element.getAttribute('title')).toBeNull();
        expect(element.getAttribute('id')).toBe('old_id');
    });

    it('should not revert attributes that have been change by extenrnal means', () => {
        const element = getElement();

        element.setAttribute('id', 'changed_id');

        fixture.componentInstance.attrs = {};

        fixture.detectChanges();

        expect(element.getAttribute('id')).toBe('changed_id');
    });
});
