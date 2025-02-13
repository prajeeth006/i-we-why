import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GreyHoundRacingAntePostComponent } from "./ante-post.component";

const routes: Routes = [
    {
      path: '',
      component: GreyHoundRacingAntePostComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class GreyHoundRacingAntePostRoutingModule{}