import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EpsTemplateComponent } from "./eps-template.component";

const routes: Routes = [
    {
      path: '',
      component: EpsTemplateComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class EpsRoutingModule{}