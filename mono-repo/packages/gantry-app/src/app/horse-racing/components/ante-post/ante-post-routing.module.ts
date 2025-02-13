import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DarkThemeHorseAntePostComponent } from '../../dark-theme/components/dark-theme-horse-ante-post/dark-theme-horse-ante-post/dark-theme-horse-ante-post.component';

const routes: Routes = [
    {
        path: 'latestdesign',
        component: DarkThemeHorseAntePostComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HorseRacingAntePostRoutingModule {}
