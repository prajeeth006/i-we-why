import { TestBed } from '@angular/core/testing';
import { FormValidationService } from './form-validation.service';
import { UntypedFormGroup, UntypedFormControl, UntypedFormArray } from '@angular/forms';
import { FieldError } from './validation.model';

describe('FormValidationService', () => {
  let service: FormValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFormErrors', () => {
    it('should collect errors for a form group', () => {
      const formGroup = new UntypedFormGroup({
        name: new UntypedFormControl('', [FormValidationService.dateMinimum('2023-01-01')]),
        email: new UntypedFormControl('', [FormValidationService.dateMaximum('2023-12-31')])
      });

      const errors: FieldError[] = [];
      service.getFormErrors(formGroup, 'root', 'name', errors);
      expect(errors[0].errorCode).toBe('date-minimum');
    });

    it('should handle nested form groups and collect errors', () => {
      const nestedFormGroup = new UntypedFormGroup({
        name: new UntypedFormControl('', [FormValidationService.dateMinimum('2023-01-01')]),
        address: new UntypedFormGroup({
          street: new UntypedFormControl('', [FormValidationService.dateMaximum('2023-12-31')])
        })
      });

      const errors: FieldError[] = [];
      service.getFormErrors(nestedFormGroup, 'root', 'name', errors);

      expect(errors.length).toBe(2);
      expect(errors[0].errorCode).toBe('date-minimum');
      expect(errors[1].errorCode).toBe('date-maximum');
    });

    it('should handle form arrays and collect errors', () => {
      const formArray = new UntypedFormArray([
        new UntypedFormControl('', [FormValidationService.dateMinimum('2023-01-01')]),
        new UntypedFormControl('', [FormValidationService.dateMaximum('2023-12-31')])
      ]);

      const errors: FieldError[] = [];
      service.getFormErrors(formArray, 'root', 'Array', errors);

      expect(errors.length).toBe(2);
      expect(errors[0].errorCode).toBe('date-minimum');
      expect(errors[1].errorCode).toBe('date-maximum');
    });
  });

  describe('static dateMinimum and dateMaximum validators', () => {
    it('should validate the minimum date correctly', () => {
      const control = new UntypedFormControl('2022-01-01');
      const validator = FormValidationService.dateMinimum('2023-01-01');
      const validationResult = validator(control);

      expect(validationResult).toEqual({
        'date-minimum': {
          'date-minimum': new Date('2023-01-01'),
          'actual': new Date('2022-01-01')
        }
      });
    });

    it('should pass when the date is greater than the minimum', () => {
      const control = new UntypedFormControl('2024-01-01');
      const validator = FormValidationService.dateMinimum('2023-01-01');
      const validationResult = validator(control);

      expect(validationResult).toBeNull();
    });

    it('should validate the maximum date correctly', () => {
      const control = new UntypedFormControl('2024-01-01');
      const validator = FormValidationService.dateMaximum('2023-12-31');
      const validationResult = validator(control);

      expect(validationResult).toEqual({
        'date-maximum': {
          'date-maximum': new Date('2023-12-31'),
          'actual': new Date('2024-01-01')
        }
      });
    });

    it('should pass when the date is less than the maximum', () => {
      const control = new UntypedFormControl('2023-01-01');
      const validator = FormValidationService.dateMaximum('2023-12-31');
      const validationResult = validator(control);

      expect(validationResult).toBeNull();
    });
  });
});
