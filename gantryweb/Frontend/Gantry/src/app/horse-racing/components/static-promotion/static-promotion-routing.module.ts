import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StaticPromotionComponent } from "./static-promotion.component";

const routes: Routes = [
    {
      path: '',
      component: StaticPromotionComponent
    }
  ];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class StaticPromotionRoutingModule{}