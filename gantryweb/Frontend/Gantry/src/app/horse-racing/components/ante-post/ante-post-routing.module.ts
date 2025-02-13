import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HorseRacingAntePostComponent } from "./ante-post.component";

const routes: Routes = [
    {
      path: '',
      component: HorseRacingAntePostComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class HorseRacingAntePostRoutingModule{}