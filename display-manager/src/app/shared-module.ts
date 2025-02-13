
import { DroppableDirective } from './common/drag-and-drop/droppable/droppable.directive';
import { DraggableDirective } from './common//drag-and-drop/draggable/draggable.directive';
import { NgModule } from '@angular/core';
import { AssetnamePipe } from './display-manager/display-manager-right-panel/filters/assetname/assetname.pipe';

import { AuthGuard } from './common/auth-guard/auth.guard';
import { ErrorModule } from './common/error-module/error.module';
import { IndividualDraggableDirective } from './common/drag-and-drop/individualdraggable/draggable.directive';
import { IndividualDroppableDirective } from './common/drag-and-drop/individualdroppable/droppable.directive';

@NgModule({
  declarations: [DroppableDirective, DraggableDirective, IndividualDroppableDirective, IndividualDraggableDirective, AssetnamePipe],
  imports: [],
  providers: [AuthGuard],
  exports: [DroppableDirective, DraggableDirective, IndividualDroppableDirective, IndividualDraggableDirective, AssetnamePipe, ErrorModule]
})

export class SharedModule { }