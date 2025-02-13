import { NgModule } from '@angular/core';

import { DS_INPUT_FIELDS_SIZE_ARRAY, DsInputField, DsInputFieldsSize } from './input-field.component';
import { DS_INPUT_TYPES_ARRAY, DsInputDirective, DsInputType } from './input.directive';

export { DS_INPUT_FIELDS_SIZE_ARRAY, DS_INPUT_TYPES_ARRAY, DsInputDirective, DsInputField, DsInputFieldsSize, DsInputType };
@NgModule({
    imports: [DsInputDirective, DsInputField],
    exports: [DsInputDirective, DsInputField],
})
export class DsInputModule {}
