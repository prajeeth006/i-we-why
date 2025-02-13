export const TABSGROUP_SIZES = ['small', 'large'] as const;
export type TabsGroupSizesType = (typeof TABSGROUP_SIZES)[number];

export const TABSGROUP_VARIANTS = ['vertical', 'horizontal'] as const;
export type TabsGroupVariantsType = (typeof TABSGROUP_VARIANTS)[number];

export const TABSGROUP_INDICATOR = ['underline', 'fill'] as const;
export type TabsGroupIndicatorType = (typeof TABSGROUP_INDICATOR)[number];
