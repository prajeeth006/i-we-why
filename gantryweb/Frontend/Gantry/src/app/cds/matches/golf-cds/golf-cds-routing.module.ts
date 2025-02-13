import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GolfCdsComponent } from './components/golf-cds.component';

const routes: Routes = [ {
  path: '',
  component: GolfCdsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GolfCdsRoutingModule { }
