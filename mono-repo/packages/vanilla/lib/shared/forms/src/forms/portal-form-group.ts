import { AbstractControl, UntypedFormGroup } from '@angular/forms';

/**
 * @beta
 */
export class PortalFormGroup extends UntypedFormGroup {
    getFlat(name: string): AbstractControl | null {
        return searchGroup(this);

        function searchGroup(formGroup: UntypedFormGroup): AbstractControl | null {
            // check direct children first
            let foundControl = formGroup.get(name);
            if (foundControl) return foundControl;

            // no, so recursivly check child groups
            for (const i in formGroup.controls) {
                const control = formGroup.controls[i];

                if (control instanceof UntypedFormGroup) {
                    foundControl = searchGroup(control);
                    if (foundControl) return foundControl;
                }
            }

            return null;
        }
    }

    patchValueFlat(
        value: { [key: string]: any },
        {
            emitEvent,
            setTouchedOnPatchedValues,
            ignore,
        }: { onlySelf?: boolean; emitEvent?: boolean; setTouchedOnPatchedValues?: boolean; ignore?: string[] } = {},
    ): void {
        const ignoreValues = ignore || [];

        Object.keys(value)
            .filter((k) => ignoreValues.indexOf(k) === -1)
            .forEach((name) => {
                const foundControl = this.getFlat(name);
                if (foundControl) {
                    foundControl.patchValue(value[name] == null ? null : value[name], { onlySelf: true, emitEvent });

                    if (setTouchedOnPatchedValues && value[name]) {
                        foundControl.markAsTouched();
                    }
                }
            });
    }

    getValueFlat() {
        return collectValuesFromGroup(this);

        function collectValuesFromGroup(formGroup: UntypedFormGroup, allValues: { [key: string]: any } = {}) {
            for (const controlName in formGroup.controls) {
                const control = formGroup.controls[controlName]!;
                if (control instanceof UntypedFormGroup) {
                    collectValuesFromGroup(control, allValues);
                } else {
                    allValues[controlName] = control.value;
                }
            }
            return allValues;
        }
    }
}
