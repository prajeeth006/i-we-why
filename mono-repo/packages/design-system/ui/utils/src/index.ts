import { DsScrollerItem } from './scroller/scroller-item.directive';
import { DsScroller } from './scroller/scroller.component';
import { DsComplexityRatingComponent } from './total-variants-counter/complexity-level.component';
import { getVariantInfo } from './total-variants-counter/variant-counter.util';

export const DS_SCROLL = [DsScroller, DsScrollerItem];

export { DsComplexityRatingComponent, getVariantInfo };
