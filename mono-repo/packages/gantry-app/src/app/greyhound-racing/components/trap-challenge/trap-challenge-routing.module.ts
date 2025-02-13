import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeTrapChallengeComponent } from '../../dark-theme/components/dark-theme-trap-challenge/dark-theme-trap-challenge.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeTrapChallengeComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TrapChallengeRoutingModule {}
