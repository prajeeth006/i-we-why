export const DS_HELP_GROUP_TYPE_ARRAY = ['success', 'error', 'caution', 'info'] as const;
export type DsHelpGroupType = (typeof DS_HELP_GROUP_TYPE_ARRAY)[number];
