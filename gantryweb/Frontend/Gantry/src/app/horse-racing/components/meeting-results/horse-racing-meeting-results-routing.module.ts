import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HorseRacingMeetingResultsComponent } from "./horse-racing-meeting-results.component";

const routes: Routes = [
    {
      path: '',
      component: HorseRacingMeetingResultsComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class HorseRacingMeetingResultsRoutingModule{}