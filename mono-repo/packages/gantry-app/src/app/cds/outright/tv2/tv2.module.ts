import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { DarkThemeOutrightTv2Component } from '../../dark-theme-outright/dark-theme-outright-tv2/dark-theme-outright-tv2.component';
import { Tv2RoutingModule } from './tv2-routing.module';

@NgModule({
    declarations: [DarkThemeOutrightTv2Component],
    imports: [CommonModule, GantryCommonModule, Tv2RoutingModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class Tv2Module {}
