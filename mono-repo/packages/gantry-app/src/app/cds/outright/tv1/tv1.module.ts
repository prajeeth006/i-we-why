import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';

import { GantryCommonModule } from '../../../common/gantry-common.module';
import { ErrorHandlerService } from '../../../error-handler.service';
import { DarkThemeOutrightTv1Component } from '../../dark-theme-outright/dark-theme-outright-tv1/dark-theme-outright-tv1.component';
import { Tv1RoutingModule } from './tv1-routing.module';

@NgModule({
    declarations: [DarkThemeOutrightTv1Component],
    imports: [CommonModule, Tv1RoutingModule, GantryCommonModule],
    providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
})
export class Tv1Module {}
