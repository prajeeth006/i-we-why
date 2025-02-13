import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../../error-handler.service';
import { DarkThemeEpsRoutingModule } from './dark-theme-eps-routing.module';
import { DarkThemeEpsTemplateComponent } from './dark-theme-eps-template.component';

@NgModule({
    declarations: [DarkThemeEpsTemplateComponent],
    imports: [CommonModule, GantryCommonModule, DarkThemeEpsRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class EpsModule {}
