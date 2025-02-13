import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeGreyhoundAntePostComponent } from '../../dark-theme/components/dark-theme-greyhound-ante-post/dark-theme-greyhound-ante-post/dark-theme-greyhound-ante-post.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeGreyhoundAntePostComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GreyHoundRacingAntePostRoutingModule {}
