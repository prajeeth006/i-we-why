import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GreyhoundRacingTemplateComponent } from "./components/greyhound-racing-template/greyhound-racing-template.component";
import { ManualGreyhoundRacingTemplateComponent } from "./components/manual-greyhound-racing-template/manual-greyhound-racing-template.component";

const routes: Routes = [
    {
      path: '',
      component: GreyhoundRacingTemplateComponent
    },
    {
      path :'manual',
      component : ManualGreyhoundRacingTemplateComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class GreyhoundRacingRoutingModule{}