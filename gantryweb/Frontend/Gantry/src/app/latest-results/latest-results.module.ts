import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LatestResultsRoutingModule } from './latest-results-routing.module';

import { LatestSixResultsTemplateComponent } from './components/latest-six-results-template/latest-six-results-template.component';
import { GantryCommonModule } from "../common/gantry-common.module";

@NgModule({
    declarations: [
        LatestSixResultsTemplateComponent,
    ],
    imports: [
        CommonModule,
        LatestResultsRoutingModule,
        GantryCommonModule
    ]
})
export class LatestResultsModule { }
