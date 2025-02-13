import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoxingCdsComponent } from './components/boxing-cds/boxing-cds.component';

const routes: Routes = [ {
  path: '',
  component: BoxingCdsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoxingCdsRoutingModule { }
