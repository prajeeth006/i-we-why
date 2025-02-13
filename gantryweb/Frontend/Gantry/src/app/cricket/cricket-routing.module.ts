import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CricketTemplateComponent } from "./components/cricket-template.component";

const routes: Routes = [
    {
      path: '',
      component: CricketTemplateComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class CricketRoutingModule{}