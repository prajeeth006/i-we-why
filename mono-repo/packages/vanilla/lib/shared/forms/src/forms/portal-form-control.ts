import { UntypedFormControl } from '@angular/forms';

/**
 * @beta
 */
export class PortalFormControl extends UntypedFormControl {
    errorMapping: { [key: string]: string };
}
