import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MoneyBoostComponent } from "./money-boost.component";

const routes: Routes = [
    {
      path: '',
      component: MoneyBoostComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class MoneyBoostRoutingModule{}