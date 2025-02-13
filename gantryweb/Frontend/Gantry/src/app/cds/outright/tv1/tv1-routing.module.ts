import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutrightTv1Component } from './components/outright-tv1.component';

const routes: Routes = [
  {
    path: 'outright',
    component: OutrightTv1Component
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tv1RoutingModule { }
