import { NgModule } from '@angular/core';

import { DsRadioButton, DsRadioGroup } from './radio-button.component';

export { FormsModule } from '@angular/forms';
export { DS_RADIO_SIZE_ARRAY, DsRadioButton, DsRadioGroup } from './radio-button.component';

@NgModule({
    imports: [DsRadioButton, DsRadioGroup],
    exports: [DsRadioButton, DsRadioGroup],
})
export class DsRadioModule {}
