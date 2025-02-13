import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RunningOnTotalsComponent } from '../../components/running-on-totals/running-on-totals.component';


const routes: Routes = [
  {
    path: '',
    component: RunningOnTotalsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RunningOnTotalsRoutingModule { }
