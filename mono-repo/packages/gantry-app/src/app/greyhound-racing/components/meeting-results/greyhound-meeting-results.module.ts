import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { GreyhoundMeetingResultsRoutingModule } from './greyhound-meeting-results-routing.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, GantryCommonModule, GreyhoundMeetingResultsRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class GreyhoundMeetingResultsModule {}
