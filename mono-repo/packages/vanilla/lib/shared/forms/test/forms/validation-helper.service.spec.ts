import { TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import {
    PortalFormControl,
    PortalFormGroup,
    ServerFieldValidationViolation,
    ValidationHelperService,
    Validators,
} from '@frontend/vanilla/shared/forms';
import { MockContext } from 'moxxi';

import { ValidationConfigMock } from '../../../../shared/forms/src/validation/test/validation-config.mock';

describe('ValidationHelperService', () => {
    let service: ValidationHelperService;
    let validationConfigMock: ValidationConfigMock;
    let control: UntypedFormControl;
    const expectedRules = {
        required: true,
        max: 5,
        min: 3,
        maxLength: 10,
        minLength: 3,
        regex: 'd+',
    };

    beforeEach(() => {
        validationConfigMock = MockContext.useMock(ValidationConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ValidationHelperService],
        });

        service = TestBed.inject(ValidationHelperService);
        validationConfigMock.rules = {
            test: {
                required: true,
                max: '5',
                min: '3',
                maxLength: '10',
                minLength: '3',
                regex: 'd+',
            } as any,
            dynamic: {
                required: '[DEFAULT]=val(true)',
                max: '[DEFAULT]=val(5)',
                min: '[DEFAULT]=val(3)',
                maxLength: '[DEFAULT]=val(10)',
                minLength: '[DEFAULT]=val(3)',
                regex: '[DEFAULT]=val(d+)',
            } as any,
            test1: {
                required: true,
                minLength: '3',
                maxLength: '5',
                regex: '[la]*',
            } as any,
            test2: {
                required: false,
                min: '1',
                max: '10',
            } as any,
        };
    });

    describe('ValidationHelperService.getRules', () => {
        it('should return typed rules', () => {
            const rules = service.getRules('test');

            expect(rules).toEqual(expectedRules);
        });

        it('should return default value for dynamic rules', () => {
            const rules = service.getRules('dynamic');

            expect(rules).toEqual(expectedRules);
        });

        it('should return null if ruleset is not found', () => {
            const rules = service.getRules('xaxa');

            expect(rules).toBeNull();
        });
    });

    describe('ValidationHelperService.getRawRules', () => {
        it('should return rules from config', () => {
            const rules = service.getRawRules('test');

            expect(rules).toEqual(validationConfigMock.rules['test']);
        });

        it('should ignore case', () => {
            const rules = service.getRawRules('TeSt');

            expect(rules).toEqual(validationConfigMock.rules['test']);
        });

        it('should return null if ruleset is not found', () => {
            const rules = service.getRawRules('xaxa');

            expect(rules).toBeNull();
        });
    });

    describe('ValidationHelperService.createValidators', () => {
        it('should create a validators from rules', () => {
            validationConfigMock.rules['test1'] = {
                required: true,
                minLength: '3',
                maxLength: '5',
                regex: '[la]*',
            } as any;

            control = new UntypedFormControl('', service.createValidators('test1'));

            expect(control.errors).toEqual({ required: true });
            control.setValue('la');
            expect(control.errors).toEqual({ minlength: { requiredLength: 3, actualLength: 2 } });
            control.setValue('lalala');
            expect(control.errors).toEqual({ maxlength: { requiredLength: 5, actualLength: 6 } });
            control.setValue('xxxx');
            expect(control.errors).toEqual({ pattern: { requiredPattern: '^[la]*$', actualValue: 'xxxx' } });
            control.setValue('lala');
            expect(control.errors).toEqual(null);

            control = new UntypedFormControl('', service.createValidators('test2'));

            expect(control.errors).toEqual(null);
            control.setValue('0');
            expect(control.errors).toEqual({ min: { min: 1, actual: '0' } });
            control.setValue('12');
            expect(control.errors).toEqual({ max: { max: 10, actual: '12' } });
            control.setValue('5');
            expect(control.errors).toEqual(null);
        });

        it('should use overrides', () => {
            control = new UntypedFormControl('', service.createValidators('test1', { overrides: { maxLength: 10 } }));

            expect(control.errors).toEqual({ required: true });
            control.setValue('lalalalalala');
            expect(control.errors).toEqual({ maxlength: { requiredLength: 10, actualLength: 12 } });
        });

        it('should use baseOverrides', () => {
            control = new UntypedFormControl('', service.createValidators('test1', { baseOverrides: { minLength: '4' } as any }));

            expect(control.errors).toEqual(null);
            control.setValue('la');
            expect(control.errors).toEqual({ minlength: { requiredLength: 4, actualLength: 2 } });
            control.setValue('lalala');
            expect(control.errors).toEqual(null);
            control.setValue('xxxx');
            expect(control.errors).toEqual(null);
            control.setValue('lala');
            expect(control.errors).toEqual(null);
        });

        it('should use factory overrides', () => {
            control = new UntypedFormControl(
                '',
                service.createValidators('test1', {
                    validationFactoryOverrides: { regex: (pattern: string | RegExp) => Validators.customPattern(pattern, 'custom') },
                }),
            );

            control.setValue('xxxx');
            expect(control.errors).toEqual({ custom: { requiredPattern: '^[la]*$', actualValue: 'xxxx' } });
        });
    });

    describe('ValidationHelperService.applyViolations', () => {
        it('should apply violations to form', () => {
            const form = new UntypedFormGroup({
                test: new UntypedFormControl(),
                test2: new UntypedFormControl(),
            });

            const violations: ServerFieldValidationViolation[] = [{ fieldName: 'test' } as any, { fieldName: 'xxx' } as any];

            const fields = service.applyViolations(form, violations);

            expect(fields).toEqual(['test']);
            expect(form.get('test')!.errors).toEqual({ 'server-violation': true });
            expect(form.get('test2')!.errors).toBeNull();
        });

        it('should set error type', () => {
            const form = new UntypedFormGroup({
                test: new UntypedFormControl(),
            });

            const violations: ServerFieldValidationViolation[] = [{ fieldName: 'test', validationError: 'custom-error' } as any];

            service.applyViolations(form, violations);

            expect(form.get('test')!.errors).toEqual({ 'custom-error': true });
        });

        it('handle no violations', () => {
            const form = new UntypedFormGroup({
                test: new UntypedFormControl(),
            });

            service.applyViolations(form, <any>null);

            expect(form.get('test')!.errors).toBeNull();
        });

        it('should support nested PortalFormGroup', () => {
            const form = new PortalFormGroup({
                group: new PortalFormGroup({
                    test: new PortalFormControl(),
                }),
            });

            const violations: ServerFieldValidationViolation[] = [{ fieldName: 'test' } as any];

            const fields = service.applyViolations(form, violations);

            expect(fields).toEqual(['test']);
            expect(form.getFlat('test')!.errors).toEqual({ 'server-violation': true });
        });
    });
});
