import { NgModule } from '@angular/core';

import { DsTooltipOnFocus } from './tooltip-events.directives';
import { DS_TOOLTIP_VARIANT_ARRAY, DsTooltipContent, DsTooltipVariant } from './tooltip.component';
import { DS_ARROW_POSITION_ARRAY, DS_TOOLTIP_POSITION_ARRAY, DsTooltipTrigger } from './tooltip.directives';

export {
    DS_ARROW_POSITION_ARRAY,
    DS_TOOLTIP_POSITION_ARRAY,
    DsTooltipContent,
    DsTooltipOnFocus,
    DsTooltipTrigger,
    DS_TOOLTIP_VARIANT_ARRAY,
    DsTooltipVariant,
};

@NgModule({
    imports: [DsTooltipContent, DsTooltipTrigger, DsTooltipOnFocus],
    exports: [DsTooltipContent, DsTooltipTrigger, DsTooltipOnFocus],
})
export class DsTooltipModule {}
