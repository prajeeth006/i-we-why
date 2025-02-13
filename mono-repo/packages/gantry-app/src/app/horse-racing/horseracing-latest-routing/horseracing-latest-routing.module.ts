import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { DarkThemeHorseRacingComponent } from '../dark-theme/components/dark-theme-horse-racing/dark-theme-horse-racing.component';
import { DarkThemeRunnerCountComponent } from '../dark-theme/components/dark-theme-horse-racing/dark-theme-runner-count/dark-theme-runner-count.component';

// TODO : Need to update the routes incase of fallback
const routes: Routes = [
    {
        path: '',
        component: DarkThemeRunnerCountComponent,
    },
    // {
    //     path: 'rc',
    //     loadChildren: () =>
    //         import('../dark-theme/components/dark-theme-horse-racing/dark-theme-runner-count/dark-theme-runner-count-routing.module').then(
    //             (m) => m.DarkThemeRunnerCountRoutingModule,
    //         ),
    // },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HorseracingLatestRoutingModule {}
