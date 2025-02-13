import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Formula1templateComponent } from './components/formula1template/formula1template.component';

const routes: Routes = [
  {
    path: '',
    component: Formula1templateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Formula1RoutingModule { }
