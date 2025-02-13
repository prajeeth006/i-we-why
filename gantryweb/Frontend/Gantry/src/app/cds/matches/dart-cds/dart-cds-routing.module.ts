import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DartCdsComponent } from './components/dart-cds.component';

const routes: Routes = [ {
  path: '',
  component: DartCdsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DartCdsRoutingModule { }
