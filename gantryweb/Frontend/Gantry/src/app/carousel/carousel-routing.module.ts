import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarouselComponent } from './component/carousel/carousel.component';


const routes: Routes = [
  {
    path: '',
    component: CarouselComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarouselRoutingModule { }
