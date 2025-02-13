import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TennisComponent } from "./components/tennis.component";

const routes: Routes = [
    {
      path: '',
      component: TennisComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class TennisRoutingModule{}