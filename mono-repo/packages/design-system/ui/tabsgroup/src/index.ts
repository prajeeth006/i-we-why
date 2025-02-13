import { NgModule } from '@angular/core';

import { DsTab } from './tab.component';
import { DsTabsScrollArrow } from './tabs-arrow.component';
import { DsTabContent, DsTabHeader } from './tabs.directives';
import { DsTabsGroup } from './tabsgroup.component';

export { DsTabsGroup } from './tabsgroup.component';
export { DsTab } from './tab.component';

export { DsTabsScrollArrow } from './tabs-arrow.component';

export { DsTabContent, DsTabHeader } from './tabs.directives';
export { DS_TAB_OPTIONS, TabsOptions, provideTabOptions } from './tabs.token';

export * from './tabsgroup.types';

@NgModule({
    imports: [DsTab, DsTabsGroup, DsTabContent, DsTabHeader, DsTabsScrollArrow],
    exports: [DsTab, DsTabsGroup, DsTabContent, DsTabHeader, DsTabsScrollArrow],
})
export class DsTabsModule {}
