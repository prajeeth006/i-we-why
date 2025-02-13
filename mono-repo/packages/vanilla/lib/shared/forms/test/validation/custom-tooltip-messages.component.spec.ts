import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl } from '@angular/forms';

import { WindowEvent } from '@frontend/vanilla/core';
import { CustomTooltipMessagesComponent } from '@frontend/vanilla/shared/forms';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../../core/src/client-config/test/common-messages.mock';
import { HtmlElementMock } from '../../../../core/test/element-ref.mock';
import { ValidationConfigMock } from '../../src/validation/test/validation-config.mock';

describe('CustomTooltipMessagesComponent', () => {
    let fixture: ComponentFixture<CustomTooltipMessagesComponent>;
    let component: CustomTooltipMessagesComponent;
    let commonContentMock: CommonMessagesMock;
    let validationConfigMock: ValidationConfigMock;

    beforeEach(() => {
        commonContentMock = MockContext.useMock(CommonMessagesMock);
        validationConfigMock = MockContext.useMock(ValidationConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        commonContentMock.MinReq = 'min req message';
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomTooltipMessagesComponent);
        component = fixture.componentInstance;
        component.formElement = new UntypedFormControl();
        component.formElementRef = new HtmlElementMock();
    });

    describe('isVisible', () => {
        it('should return false when no tooltips', () => {
            expect(component.isVisible).toBeFalse();
        });

        it('should return false when all tooltips are valid', () => {
            component.tooltips = [
                {
                    isValid: true,
                    text: 'text',
                    order: 0,
                },
            ];

            expect(component.isVisible).toBeFalse();
        });

        it('should return true when any tooltip is not valid', () => {
            component.tooltips = [
                {
                    isValid: true,
                    text: 'text',
                    order: 0,
                },
                {
                    isValid: false,
                    text: 'text 1',
                    order: 1,
                },
            ];

            expect(component.isVisible).toBeTrue();
        });
    });

    describe('event', () => {
        let onBlur: Function;
        let onFocus: Function;

        beforeEach(() => {
            spyOn((<any>component).renderer, 'listen').and.callFake((_renderElement: any, name: string, cb: Function) => {
                if (name === WindowEvent.Focus) {
                    onFocus = cb;
                }
                if (name === WindowEvent.Blur) {
                    onBlur = cb;
                }
            });
            fixture.detectChanges();

            const changes = { formElementRef: { currentValue: component.formElementRef } };
            component.ngOnChanges(changes as any);

            const formElement = component.formElement as UntypedFormControl;
            formElement.setValue('hello');
            fixture.detectChanges();
            formElement.setErrors({ hello: true });
        });

        it('focus should set tooltip', () => {
            const expectedText = 'hello error tooltip';
            const changes = { messages: { currentValue: { Hello_tooltip: expectedText } } };
            component.ngOnChanges(changes as any);

            onFocus();

            expect(component.tooltips?.length).toBe(1);
            expect(component.tooltips && component.tooltips[0]?.text).toBe(expectedText);
        });

        it('focus should set tooltip mapped from validationConfig', () => {
            validationConfigMock.errorMapping.hello = 'Mapped';
            const expectedText = 'mapped error tooltip';
            const changes = {
                messages: {
                    currentValue: {
                        Mapped_tooltip: expectedText,
                    },
                },
            };
            component.ngOnChanges(changes as any);

            onFocus();

            expect(component.tooltips?.length).toBe(1);
            expect(component.tooltips && component.tooltips[0]?.text).toBe(expectedText);
        });

        it('focus should set infoTooltips', () => {
            const changes = {
                messages: {
                    currentValue: {
                        Hello_infotooltip: 'hello info',
                        Additional_infotooltip: 'additional info',
                    },
                },
            };
            component.ngOnChanges(changes as any);

            component.addInfoTooltips.push('Additional_infotooltip');

            onFocus();

            expect(component.infoTooltips!.length).toBe(2);
        });

        it('blur should reset component', () => {
            component.tooltips = [
                {
                    isValid: false,
                    text: 'error',
                    order: 0,
                },
            ];
            component.infoTooltips = [
                {
                    isValid: true,
                    text: 'info',
                    order: 0,
                },
            ];

            onBlur();

            expect(component.tooltips).withContext('unexpected tooltips');
            expect(component.infoTooltips).withContext('unexpected infoTooltips');
        });
    });
});
