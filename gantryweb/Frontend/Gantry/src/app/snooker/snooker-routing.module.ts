import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SnookerTemplateComponent } from "./components/snooker-template/snooker-template.component";

const routes: Routes = [
    {
        path: '',
        component: SnookerTemplateComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SnookerRoutingModule { }