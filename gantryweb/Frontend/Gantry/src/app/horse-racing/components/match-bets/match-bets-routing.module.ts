import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MatchBetsComponent } from "./match-bets.component";

const routes: Routes = [
    {
      path: '',
      component: MatchBetsComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class MatchBetsRoutingModule{}