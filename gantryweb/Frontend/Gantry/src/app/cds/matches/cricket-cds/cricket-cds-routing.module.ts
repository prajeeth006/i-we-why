import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CricketCdsComponent } from './components/cricket-cds.component';

const routes: Routes = [ {
  path: '',
  component: CricketCdsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CricketCdsRoutingModule { }
