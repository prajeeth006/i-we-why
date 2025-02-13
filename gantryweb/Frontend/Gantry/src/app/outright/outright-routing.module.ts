import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutrightTemplateComponent } from './components/outright-template/outright-template.component';
import { ManualOutrightTemplateComponent } from './components/manual-outright-template/manual-outright-template.component';

const routes: Routes = [
  {
    path: '',
    component: OutrightTemplateComponent
  },
  {
    path: 'manual',
    component: ManualOutrightTemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutrightRoutingModule { }
