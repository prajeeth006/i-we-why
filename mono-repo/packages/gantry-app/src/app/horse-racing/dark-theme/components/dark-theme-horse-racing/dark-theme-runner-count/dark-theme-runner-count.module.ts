import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from 'packages/gantry-app/src/app/common/gantry-common.module';
import { ErrorHandlerService } from 'packages/gantry-app/src/app/error-handler.service';

import { HorseRacingCommonModule } from '../../../../horse-racing-common.module';
import { DarkThemeRCRunnersComponent } from './dark-theme-rc-runners/dark-theme-rc-runners.component';
// import { DarkThemeRunnerCountRoutingModule } from './dark-theme-runner-count-routing.module';
import { DarkThemeRunnerCountComponent } from './dark-theme-runner-count.component';

// TODO : Need to uncomment the DarkThemeRunnerCountRoutingModule incase of fallback
@NgModule({
    declarations: [DarkThemeRunnerCountComponent, DarkThemeRCRunnersComponent],
    imports: [
        CommonModule,
        GantryCommonModule,
        HorseRacingCommonModule,
        // DarkThemeRunnerCountRoutingModule
    ],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class DarkThemeRunnerCountModule {}
