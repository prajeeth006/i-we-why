import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayManagerLeftPanelComponent } from './display-manager-left-panel.component';
import { ProductTabsComponent } from './product-tabs/product-tabs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeViewComponent } from './tree-view/components/tree-view/tree-view.component';
import { TreeBreadCrumbComponent } from './tree-view/components/tree-bread-crumb/tree-bread-crumb.component';
import { CarouselComponent } from './carousel/carousel.component';
import { SharedModule } from 'src/app/shared-module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TreeControlsComponent } from './tree-view/components/tree-controls/tree-controls.component';
import { CarouselItemNamePipe } from './carousel/filters/carousel-item-name.pipe';
import {DebounceClickDirective} from './debounce-click.directive';
import { MaterialModule } from 'src/app/material-module';

@NgModule({
  declarations: [
    ProductTabsComponent,
    DisplayManagerLeftPanelComponent,    
    TreeViewComponent,
    TreeBreadCrumbComponent,
    CarouselComponent,
    TreeControlsComponent,
    CarouselItemNamePipe,
    DebounceClickDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DragDropModule,
    MaterialModule
  ],
  exports: [
    DisplayManagerLeftPanelComponent
  ],
  providers: [
    CarouselItemNamePipe
  ]
})
export class DisplayManagerLeftPanelModule { }
