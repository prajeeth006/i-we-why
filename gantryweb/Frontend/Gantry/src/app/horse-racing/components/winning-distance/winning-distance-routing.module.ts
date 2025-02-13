import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WinningDistanceComponent } from "./winning-distance.component";

const routes: Routes = [
    {
      path: '',
      component: WinningDistanceComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class WinningDistanceRoutingModule{}