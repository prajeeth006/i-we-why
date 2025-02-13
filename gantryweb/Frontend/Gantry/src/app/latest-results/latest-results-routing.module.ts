import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LatestSixResultsTemplateComponent } from './components/latest-six-results-template/latest-six-results-template.component';

const routes: Routes = [
  {
    path: '',
    component: LatestSixResultsTemplateComponent
  },
  {
    path: ':latestsix',
    component:LatestSixResultsTemplateComponent
  },
  

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LatestResultsRoutingModule { }
