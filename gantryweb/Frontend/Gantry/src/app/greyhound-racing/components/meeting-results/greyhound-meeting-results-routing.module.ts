import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GreyhoundMeetingResultsComponent } from "./greyhound-meeting-results.component";

const routes: Routes = [
    {
      path: '',
      component: GreyhoundMeetingResultsComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class GreyhoundMeetingResultsRoutingModule{}