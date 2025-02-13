import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeRunnerCountComponent } from './dark-theme-runner-count.component';

const routes: Routes = [
    {
        path: '',
        component: DarkThemeRunnerCountComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DarkThemeRunnerCountRoutingModule {}
