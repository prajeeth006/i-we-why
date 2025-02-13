import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GantryCommonModule } from '../../../common/gantry-common.module';
import { GreyhoundMeetingResultsComponent } from './greyhound-meeting-results.component';
import { GreyhoundMeetingResultsRoutingModule } from './greyhound-meeting-results-routing.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';


@NgModule({
  declarations: [
    GreyhoundMeetingResultsComponent
  ],
  imports: [
    CommonModule,
    GantryCommonModule,
    GreyhoundMeetingResultsRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class GreyhoundMeetingResultsModule { }
