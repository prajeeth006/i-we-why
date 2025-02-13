import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SnookerCdsComponent } from './components/snooker-cds.component';

const routes: Routes = [ {
  path: '',
  component: SnookerCdsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SnookerCdsRoutingModule { }
