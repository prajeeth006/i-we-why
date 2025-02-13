import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrapChallengeRoutingModule } from './trap-challenge-routing.module';
import { GantryCommonModule } from 'src/app/common/gantry-common.module';
import { ErrorHandlerService } from 'src/app/error-handler.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GantryCommonModule,
    TrapChallengeRoutingModule
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }]
})
export class TrapChallengeModule { }
