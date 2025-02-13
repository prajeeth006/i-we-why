import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../common/gantry-common.module';
import { ErrorHandlerService } from '../error-handler.service';
import { AvrRoutingModule } from './avr-routing.module';
import { DarkThemeAvrBannerComponent } from './dark-theme/components/dark-theme-avr-banner/dark-theme-avr-banner.component';
import { DarkThemeAvrFooterComponent } from './dark-theme/components/dark-theme-avr-footer/dark-theme-avr-footer.component';
import { DarkThemeAvrPreambleDogComponent } from './dark-theme/components/dark-theme-avr-preamble-dog/dark-theme-avr-preamble-dog.component';
import { DarkThemeAvrPreambleHorseComponent } from './dark-theme/components/dark-theme-avr-preamble-horse/dark-theme-avr-preamble-horse.component';
import { DarkThemeAvrPreambleMotorComponent } from './dark-theme/components/dark-theme-avr-preamble-motor/dark-theme-avr-preamble-motor.component';
import { DarkThemeAvrPreambleComponent } from './dark-theme/components/dark-theme-avr-preamble/dark-theme-avr-preamble.component';
import { DarkThemeAvrResultComponent } from './dark-theme/components/dark-theme-avr-result/dark-theme-avr-result.component';
import { DarkThemeAvrComponent } from './dark-theme/components/dark-theme-avr/dark-theme-avr.component';
import { DarkThemeAvrVideoComponent } from './dark-theme/components/darl-theme-avr-video/dark-theme-avr-video.component';

@NgModule({
    declarations: [
        DarkThemeAvrComponent,
        DarkThemeAvrPreambleComponent,
        DarkThemeAvrBannerComponent,
        DarkThemeAvrPreambleDogComponent,
        DarkThemeAvrVideoComponent,
        DarkThemeAvrResultComponent,
        DarkThemeAvrFooterComponent,
        DarkThemeAvrPreambleHorseComponent,
        DarkThemeAvrPreambleMotorComponent,
    ],
    imports: [CommonModule, GantryCommonModule, AvrRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class AvrModule {}
