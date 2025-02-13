import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GantryCommonModule } from '../common/gantry-common.module';
import { DarkThemeLatestFourResultsTemplateComponent } from './dark-theme/components/dark-theme-latest-four-results-template/dark-theme-latest-four-results-template.component';
import { LatestResultsRoutingModule } from './latest-results-routing.module';

@NgModule({
    declarations: [DarkThemeLatestFourResultsTemplateComponent],
    imports: [CommonModule, LatestResultsRoutingModule, GantryCommonModule],
})
export class LatestResultsModule {}
