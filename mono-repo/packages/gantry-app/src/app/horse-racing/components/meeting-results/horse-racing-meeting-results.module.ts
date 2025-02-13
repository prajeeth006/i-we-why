import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { HorseRacingMeetingResultsRoutingModule } from './horse-racing-meeting-results-routing.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, GantryCommonModule, HorseRacingMeetingResultsRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class HorseRacingMeetingResultsModule {}
