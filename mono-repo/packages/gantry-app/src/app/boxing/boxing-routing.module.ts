import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoxingTemplateComponent } from './components/boxing-template/boxing-template.component';

const routes: Routes = [
    {
        path: '',
        component: BoxingTemplateComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BoxingRoutingModule {}
