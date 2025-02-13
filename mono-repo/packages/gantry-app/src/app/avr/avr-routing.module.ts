import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeAvrComponent } from './dark-theme/components/dark-theme-avr/dark-theme-avr.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeAvrComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AvrRoutingModule {}
