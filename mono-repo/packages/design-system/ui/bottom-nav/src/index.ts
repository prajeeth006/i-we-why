import { NgModule } from '@angular/core';

import { DsBottomNav, DsBottomNavTab } from './bottom-nav.component';

export * from './bottom-nav.component';

@NgModule({
    imports: [DsBottomNavTab, DsBottomNav],
    exports: [DsBottomNavTab, DsBottomNav],
})
export class DsBottomNavModule {}
