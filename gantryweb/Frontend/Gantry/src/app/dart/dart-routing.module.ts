import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DartTemplateComponent } from './components/dart-template/dart-template.component';

const routes: Routes = [
  {
    path: '',
    component: DartTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DartRoutingModule { }
