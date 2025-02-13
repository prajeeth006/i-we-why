import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FootBallTemplateComponent } from "./components/foot-ball-template/foot-ball-template.component";

const routes: Routes = [
  {
    path: '',
    component: FootBallTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootBallRoutingModule { }
