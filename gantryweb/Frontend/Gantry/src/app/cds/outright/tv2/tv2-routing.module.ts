import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutrightTv2Component } from './components/outright-tv2.component';

const routes: Routes = [
  {
    path: 'outright',
    component: OutrightTv2Component
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tv2RoutingModule { }
