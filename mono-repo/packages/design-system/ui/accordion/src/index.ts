import { NgModule } from '@angular/core';

import { DsAccordionContent } from './accordion-content.component';
import { DsAccordionHeader, DsAccordionTrigger } from './accordion-header.component';
import { DS_ACCORDION_SIZE_ARRAY, DS_ACCORDION_VARIANT_ARRAY, DsAccordion, DsAccordionSize, DsAccordionVariant } from './accordion.component';
import { DsAccordionToggle } from './ds-accordion-toggle.directive';

export {
    DsAccordion,
    DS_ACCORDION_SIZE_ARRAY,
    DsAccordionSize,
    DS_ACCORDION_VARIANT_ARRAY,
    DsAccordionVariant,
    DsAccordionContent,
    DsAccordionHeader,
    DsAccordionTrigger,
    DsAccordionToggle,
};

@NgModule({
    imports: [DsAccordion, DsAccordionHeader, DsAccordionTrigger, DsAccordionContent, DsAccordionToggle],
    exports: [DsAccordion, DsAccordionHeader, DsAccordionTrigger, DsAccordionContent, DsAccordionToggle],
})
export class DsAccordionModule {}
