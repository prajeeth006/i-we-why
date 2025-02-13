import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeDrawAwayComponent } from '././home-draw-away/components/home-draw-away.component'
import { FootBallCdsTemplateComponent } from '././././././././foot-ball-cds-template/foot-ball-cds-template.component';


const routes: Routes = [
  {
    path: '',
    component: FootBallCdsTemplateComponent
  },
  {
    path: 'home-draw-away',
    component: HomeDrawAwayComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeDrawAwayRoutingModule { }
