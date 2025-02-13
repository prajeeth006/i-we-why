import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'manual',
        loadChildren: () => import('../outright/outright-manual-routing/outright-manual-routing.module').then((m) => m.OutrightManualRoutingModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OutrightRoutingModule {}
