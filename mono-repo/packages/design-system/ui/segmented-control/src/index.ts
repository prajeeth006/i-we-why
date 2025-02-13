import { NgModule } from '@angular/core';

import { DsSegmentedControl, DsSegmentedOption } from './segmented-control.component';

export { DsSegmentedControl, DsSegmentedOption } from './segmented-control.component';

@NgModule({
    imports: [DsSegmentedControl, DsSegmentedOption],
    exports: [DsSegmentedControl, DsSegmentedOption],
})
export class DsSegmentedControlModule {}
