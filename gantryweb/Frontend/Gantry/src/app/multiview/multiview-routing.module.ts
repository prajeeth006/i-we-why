import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultiviewComponent } from './component/multiview/multiview.component';

const routes: Routes = [
  {
    path: '',
    component: MultiviewComponent
  }
];

@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule]
})


export class MultiviewRoutingModule { }
