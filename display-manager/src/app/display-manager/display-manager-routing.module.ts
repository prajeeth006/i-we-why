import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent } from '../base-layout/base-layout.component';
import { AuthGuard } from '../common/auth-guard/auth.guard';

const routes: Routes = [
  { path: '', component: BaseLayoutComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisplayManagerRoutingModule { }