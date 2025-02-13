import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../common/gantry-common.module';
import { DarkThemeManualOutrightTemplateComponent } from '../dark-theme-outright/components/dark-theme-manual-outright-template/dark-theme-manual-outright-template.component';
import { ErrorHandlerService } from '../error-handler.service';
import { OutrightRoutingModule } from './outright-routing.module';

@NgModule({
    declarations: [DarkThemeManualOutrightTemplateComponent],
    imports: [CommonModule, GantryCommonModule, OutrightRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class OutrightModule {}
