import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseLayoutComponent } from '../base-layout/base-layout.component';
import { DisplayManagerComponent } from './display-manager.component';
import { DialogueComponent } from '../common/dialogue/dialogue.component';
import { DisplayManagerHeaderModule } from './display-manager-header/display-manager-header.module';
import { DisplayManagerLeftPanelModule } from './display-manager-left-panel/display-manager-left-panel.module';
import { DisplayManagerRightPanelModule } from './display-manager-right-panel/display-manager-right-panel.module';
import { FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material-module';
import { SharedModule } from '../shared-module';
import { DisplayManagerRoutingModule } from './display-manager-routing.module';

@NgModule({
  declarations: [
    DisplayManagerComponent,
    BaseLayoutComponent, 
    DialogueComponent
  ],
  imports: [
    CommonModule,    
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    SharedModule,
    DisplayManagerHeaderModule,
    DisplayManagerLeftPanelModule, 
    DisplayManagerRightPanelModule,   
    DisplayManagerRoutingModule
  ],
  exports: [
    DisplayManagerComponent,    
  ],
  providers:[FormGroupDirective]
})
export class DisplayManagerModule {}