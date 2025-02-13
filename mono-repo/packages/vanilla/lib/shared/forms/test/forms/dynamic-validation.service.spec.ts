import { TestBed } from '@angular/core/testing';
import { UntypedFormControl } from '@angular/forms';

import { DynamicValidationService, DynamicValidationUpdateEvent } from '@frontend/vanilla/shared/forms';
import { MockContext } from 'moxxi';

import { ValidationHelperServiceMock } from '../../../../shared/forms/test/forms/validation-helper.mock';

describe('DynamicValidationService', () => {
    let service: DynamicValidationService;
    let validationHelperMock: ValidationHelperServiceMock;
    let depControl: UntypedFormControl;
    let rules: any;
    let event: DynamicValidationUpdateEvent;

    beforeEach(() => {
        validationHelperMock = MockContext.useMock(ValidationHelperServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DynamicValidationService],
        });

        service = TestBed.inject(DynamicValidationService);
        depControl = new UntypedFormControl();
        rules = {
            required: '[DEFAULT]=val(true);[IT]=val(false)',
            minLength: '[DEFAULT]=val(3);[IT,ES]=val(5)',
            minLengthErrorMapping: '[DEFAULT]=val(minlength);[IT,ES]=val(minln)',
            maxLength: '[DEFAULT]=val(9);[IT,ES]=val(5)',
            maxLengthErrorMapping: '[DEFAULT]=val(maxlength);[IT,ES]=val(maxln)',
            regex: '[DEFAULT]=val(\\w+);[IT,ES]=val(\\d+)',
            regexErrorMapping: '[DEFAULT]=val(pattern);[IT,ES]=val(pn)',
        };

        validationHelperMock.getRawRules.withArgs('test').and.returnValue(rules);
    });

    it('should return observable that provides base validation rules as dep property value changes', () => {
        service.register('test', depControl.valueChanges).subscribe((e) => (event = e));

        depControl.setValue('GB');

        expect(event.rules).toEqual(
            jasmine.objectContaining({
                required: 'true',
                minLength: '3',
                maxLength: '9',
                regex: '\\w+',
            }),
        );

        expect(event.mappings).toEqual({
            required: null,
            minlength: 'minlength',
            maxlength: 'maxlength',
            pattern: 'pattern',
        });

        depControl.setValue('IT');

        expect(event.rules).toEqual(
            jasmine.objectContaining({
                required: 'false',
                minLength: '5',
                maxLength: '5',
                regex: '\\d+',
            }),
        );

        expect(event.mappings).toEqual({
            required: null,
            minlength: 'minln',
            maxlength: 'maxln',
            pattern: 'pn',
        });
    });

    it('should allow static values', () => {
        rules.required = 'true';
        rules.minLength = '10';

        service.register('test', depControl.valueChanges).subscribe((e) => (event = e));

        depControl.setValue('IT');

        expect(event.rules).toEqual(
            jasmine.objectContaining({
                required: 'true',
                minLength: '10',
                maxLength: '5',
                regex: '\\d+',
            }),
        );
    });
});
