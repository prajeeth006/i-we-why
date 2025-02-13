import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { DisplayManagerHeaderComponent } from './../display-manager-header/display-manager-header.component';
import { PlusNewComponent } from './../display-manager-header/plus-new/plus-new.component';
import { LabelSelectorComponent } from './../display-manager-header/label-selector/label-selector.component';
import { ScAccountInformationComponent } from './../../sitecore/sc-account-information/sc-account-information.component';
import { MaterialModule } from "src/app/material-module";
import { FormsModule } from '@angular/forms';
import { MasterToggleComponent } from './master-toggle/master-toggle.component';

@NgModule({
    declarations: [
        DisplayManagerHeaderComponent,
        PlusNewComponent,
        LabelSelectorComponent,
        ScAccountInformationComponent,
        MasterToggleComponent,
    ],
    imports: [
        FormsModule,
        MaterialModule,
        CommonModule
    ],
    exports: [
        DisplayManagerHeaderComponent,
        PlusNewComponent,
        LabelSelectorComponent,
        ScAccountInformationComponent,
    ]
})
export class DisplayManagerHeaderModule { }