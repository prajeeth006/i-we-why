import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RubyCdsComponent } from './components/rugby-cds.component';

const routes: Routes = [{
  path: '',
  component: RubyCdsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RugbyCdsRoutingModule { }
