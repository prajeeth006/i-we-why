import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeMoneyBoostComponent } from '../../dark-theme/components/dark-theme-money-boost/dark-theme-money-boost.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeMoneyBoostComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MoneyBoostRoutingModule {}
