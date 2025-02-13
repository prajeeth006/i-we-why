import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../../../common/gantry-common.module';
import { HorseRacingMeetingResultsComponent } from './horse-racing-meeting-results.component';
import { NonRunnerListPipe } from '../../pipes/non-runner-list.pipe';
import { HorseRacingMeetingResultsRoutingModule } from './horse-racing-meeting-results-routing.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';


@NgModule({
  declarations: [
    HorseRacingMeetingResultsComponent,
    NonRunnerListPipe
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    HorseRacingMeetingResultsRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class HorseRacingMeetingResultsModule { }
