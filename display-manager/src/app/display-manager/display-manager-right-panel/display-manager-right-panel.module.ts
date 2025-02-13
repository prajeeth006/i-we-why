import { DisplayManagerRightPanelComponent } from './../display-manager-right-panel/display-manager-right-panel.component';
import { MasterLayoutComponent } from './../display-manager-right-panel/master-layout/master-layout.component';
import { MasterConfigurationComponent } from './../display-manager-right-panel/master-layout/master-configuration/master-configuration.component';
import { TertiaryScreenComponent } from './../display-manager-right-panel/dynamic-screens/master-gantry-screens/tertiary-screen/tertiary-screen.component';
import { MasterGantryConfigurationComponent } from './../display-manager-right-panel/master-layout/master-gantry-configuration/master-gantry-configuration.component';
import { HalfViewComponent } from './../display-manager-right-panel/dynamic-screens/master-gantry-screens/half-view/half-view.component';
import { MultiviewScreenComponent } from './../display-manager-right-panel/dynamic-screens/master-gantry-screens/multiview-screen/multiview-screen.component';
import { MasterConfigFooterComponent } from './../display-manager-right-panel/master-config-footer/master-config-footer.component';
import { SingleScreenComponent } from './../display-manager-right-panel/dynamic-screens/master-config-screens/single-screen/single-screen.component';
import { GantrySingleScreenComponent } from './../display-manager-right-panel/dynamic-screens/master-gantry-screens/gantry-single-screen/gantry-single-screen.component';
import { HorsePricesComponent } from './../display-manager-right-panel/horse-prices/horse-prices.component';
import { ManualHeaderComponent } from './../display-manager-right-panel/manual-header/manual-header.component';
import { ManualFooterComponent } from './../display-manager-right-panel/manual-footer/manual-footer.component';
import { SportsHeaderComponent } from './../display-manager-right-panel/sports-header/sports-header.component';
import { RacingHeaderComponent } from './../display-manager-right-panel/racing-header/racing-header.component';
import { OnlyNumber } from './../display-manager-right-panel/only-number.directive';
import { ManualSportsTemplateHeaderComponent } from './../display-manager-right-panel/manual-sports-template-header/manual-sports-template-header.component';
import { ManualSportsTemplateComponent } from './../display-manager-right-panel/manual-sports-template/manual-sports-template.component';
import { ManualGreyhoundPricesComponent } from './../display-manager-right-panel/manual-greyhound-prices/manual-greyhound-prices.component';
import { ManualGreyhoundFooterComponent } from './../display-manager-right-panel/manual-greyhound-footer/manual-greyhound-footer.component';
import { AssettypePipe } from './../display-manager-right-panel/filters/assettype/assettype.pipe';
import { AssetnamePreviewPipe } from './../display-manager-right-panel/filters/assetnamepreview/assetnamepreview.pipe';
import { DisplayManagerTabsComponent } from './../display-manager-right-panel/display-manager-tabs/display-manager-tabs.component';
import { MultiEventComponent } from './../display-manager-right-panel/multi-event/multi-event.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-module';
import { SharedModule } from 'src/app/shared-module';
import { IndividualLayoutComponent } from './individual-layout/individual-layout.component';
import { SettingsLayoutComponent } from './settings-layout/settings-layout.component';

@NgModule({
  declarations: [
    DisplayManagerRightPanelComponent,    
    MasterLayoutComponent,
    MasterConfigurationComponent,
    TertiaryScreenComponent,
    SingleScreenComponent,
    MasterGantryConfigurationComponent,
    HalfViewComponent,
    MultiviewScreenComponent,
    MasterConfigFooterComponent,
    GantrySingleScreenComponent,
    HorsePricesComponent,
    ManualHeaderComponent,
    ManualFooterComponent,
    SportsHeaderComponent,
    RacingHeaderComponent,
    OnlyNumber,    
    ManualSportsTemplateHeaderComponent,
    ManualSportsTemplateComponent,
    ManualGreyhoundPricesComponent,
    ManualGreyhoundFooterComponent,
    AssettypePipe,
    AssetnamePreviewPipe,
    DisplayManagerTabsComponent,
    MultiEventComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    DragDropModule,
    IndividualLayoutComponent,
    SettingsLayoutComponent,
  ],
  exports: [DisplayManagerRightPanelComponent],
})
export class DisplayManagerRightPanelModule {}
