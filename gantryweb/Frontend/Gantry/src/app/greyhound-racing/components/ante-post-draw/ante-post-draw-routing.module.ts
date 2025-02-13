import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GreyHoundRacingAntePostDrawComponent } from "./ante-post-draw.component";

const routes: Routes = [
    {
      path: '',
      component: GreyHoundRacingAntePostDrawComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class GreyHoundRacingAntePostDrawRoutingModule{}