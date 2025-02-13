import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MoneyboxComponent } from "./moneybox.component";

const routes: Routes = [
    {
      path: '',
      component: MoneyboxComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class MoneyboxRoutingModule{}