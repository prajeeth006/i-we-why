import { Injectable } from '@angular/core';
import { AbstractControl, UntypedFormArray, FormControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FieldError } from './validation.model';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  constructor() { }

  getFormErrors(
    control: AbstractControl, 
    formGroupName: string, 
    fieldName: string, 
    errors: FieldError[]) {

      if (control instanceof UntypedFormGroup) {
          Object.keys(control.controls).forEach(controlName => {
              let formControl = control.get(controlName);
              if (formControl) {
                  let fGroupName = formGroupName + "-" + controlName;
                  this.getFormErrors(formControl, fGroupName, controlName, errors);
              }
          })
      }

      if (control instanceof UntypedFormArray) {
          control.controls.forEach((fControl: AbstractControl, index) => {
              let fGroupName = formGroupName + "-" + index;
              this.getFormErrors(fControl, fGroupName, "Array", errors);
          })
          const controlErrors: ValidationErrors | null = control.errors;
      }

      const controlErrors: ValidationErrors | null = control.errors;
      if (controlErrors) {
          Object.keys(controlErrors).forEach(errorCode => {
              errors.push({
                  formGroupName: formGroupName,
                  fieldName: fieldName,
                  errorCode: errorCode
              })
          });
      }
  }

  static dateMinimum(date: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return null;
      }
      const controlDate = control.value ? new Date(control.value) : null;
      const validationDate = date ? new Date(date) : null;
      return controlDate == null || validationDate == null || controlDate < validationDate ? {
        'date-minimum': {
          'date-minimum': validationDate,
          'actual': controlDate
        }
      } : null;
    };
  }

  static dateMaximum(date: string | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return null;
      }
      const controlDate = control.value ? new Date(control.value) : null;
      const validationDate = date ? new Date(date) : null;
      return controlDate == null || validationDate == null || controlDate > validationDate ? {
        'date-maximum': {
          'date-maximum': validationDate,
          'actual': controlDate
        }
      } : null;
    };
  }
}
