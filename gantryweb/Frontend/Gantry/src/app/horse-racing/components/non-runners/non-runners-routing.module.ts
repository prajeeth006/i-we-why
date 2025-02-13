import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NonRunnersComponent } from "./non-runners.component";

const routes: Routes = [
    {
      path: '',
      component: NonRunnersComponent
    },
    {
      path: ':isUk',
      component: NonRunnersComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class NonRunnersRoutingModule{}