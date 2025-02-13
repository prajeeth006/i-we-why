import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { DarkThemeTrapChallengeComponent } from '../../dark-theme/components/dark-theme-trap-challenge/dark-theme-trap-challenge.component';
import { TrapChallengeRoutingModule } from './trap-challenge-routing.module';

@NgModule({
    declarations: [DarkThemeTrapChallengeComponent],
    imports: [CommonModule, GantryCommonModule, TrapChallengeRoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class TrapChallengeModule {}
