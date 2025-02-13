import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvrComponent } from './components/avr/avr.component';

const routes: Routes = [
  {
    path: '',
    component: AvrComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvrRoutingModule { }
