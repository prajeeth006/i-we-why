import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeMoneyboxComponent } from '../../dark-theme/components/dark-theme-moneybox/dark-theme-moneybox.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeMoneyboxComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MoneyboxRoutingModule {}
