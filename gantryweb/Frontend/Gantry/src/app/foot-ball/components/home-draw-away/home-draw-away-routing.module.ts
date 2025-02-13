import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeDrawAwayComponent } from "./home-draw-away.component";

const routes: Routes = [
    {
      path: '',
      component: HomeDrawAwayComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class HomeDrawAwayRoutingModule{}