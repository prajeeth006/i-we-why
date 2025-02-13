import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl } from '@angular/forms';

import { ValidationMessagesComponent } from '@frontend/vanilla/shared/forms';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../../core/src/client-config/test/common-messages.mock';
import { HtmlElementMock } from '../../../../core/test/element-ref.mock';
import { ValidationConfigMock } from '../../../../shared/forms/src/validation/test/validation-config.mock';

describe('ValidationMessagesComponent', () => {
    let fixture: ComponentFixture<ValidationMessagesComponent>;
    let component: ValidationMessagesComponent;
    let commonContentMock: CommonMessagesMock;
    let validationConfigMock: ValidationConfigMock;

    beforeEach(() => {
        commonContentMock = MockContext.useMock(CommonMessagesMock);
        validationConfigMock = MockContext.useMock(ValidationConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        commonContentMock['GeneralValidationError'] = 'general error';
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ValidationMessagesComponent);
        component = fixture.componentInstance;
    });

    it('should not be undefined', () => {
        fixture.detectChanges();
        expect(component).toBeDefined();
    });

    describe('getMessage()', () => {
        beforeEach(() => {
            component.formElement = new UntypedFormControl();
            fixture.detectChanges();
        });

        it('should return undefined when formElement not present', () => {
            component.formElement = <any>null;
            expect(component.getMessage()).toBeNull();
        });

        it('should return undefined when formElement is valid', () => {
            component.formElement.setErrors(null);
            expect(component.getMessage()).toBeNull();
        });

        it('should return general error', () => {
            component.formElement.setErrors({ required: true });

            const expected = commonContentMock['GeneralValidationError'];
            expect(component.getMessage()).toBe(expected!);
        });

        it('should override general error from messages', () => {
            component.formElement.setErrors({ required: true });
            const messages: Record<string, string> = {};
            const expected = 'some general error';
            messages[CommonMessagesMock.GeneralValidationErrorKey.toLowerCase()] = expected;

            component.ngOnChanges({ messages: { currentValue: messages } } as any);
            expect(component.getMessage()).toBe(expected);
        });

        describe('should return specific error', () => {
            let messages: any;
            beforeEach(() => {
                messages = {
                    Required: 'Required.',
                    ElementMappingRequired: 'Element Mapping Required.',
                    ValidationMappingRequired: 'Validation Mapping Required.',
                };
                component.ngOnChanges({ messages: { currentValue: messages } } as any);
                component.formElement.setErrors({ required: true });
            });

            it('using error key', () => {
                expect(component.getMessage()).toBe(messages.Required);
            });

            it('using key mapped from validationConfig', () => {
                validationConfigMock.errorMapping = {
                    required: 'validationmappingrequired',
                };
                expect(component.getMessage()).toBe(messages.ValidationMappingRequired);
            });

            it('using key mapped from formElement instead of validationConfig', () => {
                validationConfigMock.errorMapping = {
                    // should be overriden by formElement.errorMapping;
                    required: 'validationmappingrequired',
                };

                (component.formElement as any)['errorMapping'] = {
                    required: 'elementmappingrequired',
                };

                expect(component.getMessage()).toBe(messages.ElementMappingRequired);
            });
        });
    });

    describe('showErrors()', () => {
        beforeEach(() => {
            component.formElement = new UntypedFormControl();
        });

        it('should return false when the formElement has no errors', () => {
            expect(component.showErrors()).toBeFalse();
        });

        it('should return true when it has errors and showOnPristine', () => {
            component.formElement.setErrors({ required: true });
            component.showOnPristine = true;
            expect(component.showErrors()).toBeTrue();
        });

        it('should return true when it has errors and is dirty and showOnEdit', () => {
            component.formElement.setErrors({ required: true });
            component.formElement.markAsDirty();
            component.showOnEdit = true;

            expect(component.showErrors()).toBeTrue();
        });

        it('should return true when it has errors and is not focused and is touched', () => {
            component.formElement.setErrors({ required: true });
            component.formElement.markAsTouched();
            component.setFocused(false);

            expect(component.showErrors()).toBeTrue();
        });
    });

    describe('showSuccess()', () => {
        beforeEach(() => {
            component.formElement = new UntypedFormControl();
            component.showOnSuccess = true;
        });

        it('should return false when the showOnSuccess is false', () => {
            component.showOnSuccess = false;
            expect(component.showSuccess()).toBeFalse;
        });

        it('should return false when the formElement is not valid', () => {
            component.formElement.setErrors({ required: true });
            expect(component.showSuccess()).toBeFalse;
        });

        it('should return false when the formElement is not touched', () => {
            expect(component.showSuccess()).toBeFalse;
        });

        it('should return true when formElement is valid and touched', () => {
            component.formElement.markAsTouched();
            expect(component.showSuccess()).toBeTrue;
        });
    });

    describe('ngOnChanges()', () => {
        it('should attach blur and focus listeners when formElementRef changes', () => {
            const formElementRef = new HtmlElementMock();
            component.formElementRef = formElementRef;

            const changes = {
                formElementRef: {
                    currentValue: formElementRef,
                },
            };
            component.ngOnChanges(changes as any);

            expect(component.blurListener).toBeDefined();
            expect(component.focusListener).toBeDefined();
        });
    });

    describe('ngOnDestroy()', () => {
        it('should unsubscribe focusListener', () => {
            component.focusListener = jasmine.createSpy('focusListener');
            component.ngOnDestroy();
            expect(component.focusListener).toHaveBeenCalledTimes(1);
        });
        it('should unsubscribe blurListener', () => {
            component.blurListener = jasmine.createSpy('blurListener');
            component.ngOnDestroy();
            expect(component.blurListener).toHaveBeenCalledTimes(1);
        });
    });
});
