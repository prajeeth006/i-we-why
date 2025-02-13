import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManualHorseRacingTemplateComponent } from "./components/manual-horse-racing-template/manual-horse-racing-template.component";
import { HorseRacingNavigatorComponent } from "./components/horse-racing-navigator/horse-racing-navigator.component";

const routes: Routes = [
  {
    path: '',
    component: HorseRacingNavigatorComponent
  },
  {
    path: 'manual',
    component: ManualHorseRacingTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HorseRacingRoutingModule {

}