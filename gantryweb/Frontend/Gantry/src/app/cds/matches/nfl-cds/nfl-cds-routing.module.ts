import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NflCdsComponent } from './components/nfl-cds.component';

const routes: Routes = [
  {
    path: '',
    component: NflCdsComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NflCdsRoutingModule { }
