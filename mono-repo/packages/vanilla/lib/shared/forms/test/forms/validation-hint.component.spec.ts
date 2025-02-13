import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ValidationHintComponent } from '@frontend/vanilla/shared/forms';

@Component({
    template: `
        <form [formGroup]="group">
            <input type="text" formControlName="input1" />
            <lh-validation-hint [title]="title" [messages]="messages" [control]="group.get('input1')" [highlight]="highlight" />
        </form>
    `,
})
class TestComponent {
    group: UntypedFormGroup;
    title: string;
    messages = [];
    highlight = true;

    constructor() {
        this.group = new UntypedFormGroup({
            input1: new UntypedFormControl(''),
        });
    }
}

describe('ValidationHintComponent', () => {
    let fixture: ComponentFixture<TestComponent>;
    const getByCss = (css: string): HTMLElement => {
        const e = fixture.debugElement.query(By.css(css));
        return e && e.nativeElement;
    };
    const getHintsElement = (): HTMLElement => getByCss('.validation-hints');
    const getTitleElement = (): HTMLElement => getHintsElement().getElementsByTagName('span')[0]!;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, ValidationHintComponent],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [TestComponent],
        }).createComponent(TestComponent);
    });

    it('should display the text set by the title attribute', () => {
        const component = fixture.componentInstance;
        component.title = '<div>hello</div>';
        fixture.detectChanges();
        const titleElement = getTitleElement();
        expect(titleElement).not.toBeNull();
        expect(titleElement.innerHTML).toBe(component.title);
    });
});
