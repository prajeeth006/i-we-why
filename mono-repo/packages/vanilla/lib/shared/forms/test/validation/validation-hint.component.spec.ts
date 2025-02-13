import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { UntypedFormControl } from '@angular/forms';

import { ValidationHintComponent, Validators } from '@frontend/vanilla/shared/forms';
import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';

import { IconCustomComponent } from '../../../../features/icons/src/icon-fast.component';

describe('ValidationHintComponent', () => {
    let fixture: ComponentFixture<ValidationHintComponent>;
    let component: ValidationHintComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        TestBed.overrideComponent(ValidationHintComponent, {
            remove: {
                imports: [IconCustomComponent],
            },
            add: {
                imports: [MockComponent(IconCustomComponent)],
            },
        });

        fixture = TestBed.createComponent(ValidationHintComponent);
        component = fixture.componentInstance;
        component.control = new UntypedFormControl([Validators.required]);
        component.messages = [
            {
                value: 'Hint.test',
                text: 'test hint',
            },
        ];

        component.control.markAsDirty();
    });

    it('should not be undefined', () => {
        fixture.detectChanges();
        expect(component).toBeDefined();
    });

    it('should init validationHints', () => {
        fixture.detectChanges();
        expect(component.validationsHints).toEqual([
            { className: 'test', message: 'test hint', hintIconClass: 'theme-info-i', hintTextClass: 'text-info' },
        ]);
    });

    it('should update validationHints when control status changes', fakeAsync(() => {
        fixture.detectChanges();

        component.control.setErrors({
            test: true,
        });

        expect(component.validationsHints).toEqual([
            { className: 'test', message: 'test hint', hintIconClass: 'theme-error-i', hintTextClass: 'text-danger' },
        ]);
    }));

    it('should return info class when control has not been touched yet', () => {
        fixture.detectChanges();
        component.control.markAsPristine();
        component.control.setValue(undefined);
        expect(component.validationsHints).toEqual([
            { className: 'test', message: 'test hint', hintIconClass: 'theme-info-i', hintTextClass: 'text-info' },
        ]);
    });

    it('should return error class when control has no value', () => {
        fixture.detectChanges();
        component.control.setValue(undefined);
        expect(component.validationsHints).toEqual([
            { className: 'test', message: 'test hint', hintIconClass: 'theme-error-i', hintTextClass: 'text-danger' },
        ]);
    });

    it('should return error class when control has corresponding error', () => {
        fixture.detectChanges();
        component.control.setValue('some value');
        component.control.setErrors({
            test: true,
        });
        expect(component.validationsHints).toEqual([
            { className: 'test', message: 'test hint', hintIconClass: 'theme-error-i', hintTextClass: 'text-danger' },
        ]);
    });

    it('should return success class when control has no corresponding error', () => {
        fixture.detectChanges();
        component.control.setValue('some value');
        expect(component.validationsHints).toEqual([
            { className: 'test', message: 'test hint', hintIconClass: 'theme-check', hintTextClass: 'text-success' },
        ]);
    });
});
