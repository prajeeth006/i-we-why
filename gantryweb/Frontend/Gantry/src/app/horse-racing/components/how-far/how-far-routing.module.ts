import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HowFarComponent } from "./how-far.component";

const routes: Routes = [
    {
      path: '',
      component: HowFarComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class HowFarRoutingModule{}