import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashStreamComponent } from './components/dash-stream.component';

const routes: Routes = [
    {
        path: '',
        component: DashStreamComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashStreamRoutingModule {}
