import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HotShowComponent } from '../../components/hot-show/hot-show.component';

const routes: Routes = [
    {
        path: '',
        component: HotShowComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HotShowRoutingModule {}
