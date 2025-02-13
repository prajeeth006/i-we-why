import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Formula1CdsComponent } from "./components/formula1-cds.component";

const routes: Routes = [
  {
    path: '',
    component: Formula1CdsComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class Formula1CdsRoutingModule { }