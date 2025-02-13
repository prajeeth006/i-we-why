import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrapChallengeComponent } from './trap-challenge.component';

const routes: Routes = [
  {
    path: '',
    component: TrapChallengeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrapChallengeRoutingModule { }
